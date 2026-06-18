from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user, get_current_tenant_context, tenant_admin_only
from app.models.models import User, Tenant, UsageTracking, ProviderConfiguration, AuditLog
from app.schemas.schemas import UserResponse, TenantUserCreateByAdmin, UsageResponse, ProviderConfigCreate, ProviderConfigResponse, UserUpdate
from app.core.security import get_password_hash, encrypt_data
from typing import List

router = APIRouter(prefix="/tenant-admin", tags=["Tenant Admin Operations"], dependencies=[tenant_admin_only])

# --- WORKSPACE METRICS ---
@router.get("/metrics", response_model=UsageResponse)
def get_workspace_metrics(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    if not tenant:
        raise HTTPException(status_code=400, detail="Tenant context headers are missing.")
        
    usage = db.query(UsageTracking).filter(UsageTracking.tenant_id == tenant.id).first()
    if not usage:
        # Initialize if missing
        usage = UsageTracking(tenant_id=tenant.id)
        db.add(usage)
        db.commit()
        db.refresh(usage)
    return usage

# --- TEAM MEMBERS MANAGEMENT ---
@router.post("/users", response_model=UserResponse)
def invite_user(
    data: TenantUserCreateByAdmin,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_user),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    # Check if email is already taken
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already in use by another account.")
        
    new_user = User(
        tenant_id=tenant.id,
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=data.role,
        status="active"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Audit log
    log = AuditLog(
        tenant_id=tenant.id,
        user_id=admin.id,
        action="invite_member",
        details=f"Admin invited '{new_user.email}' as '{new_user.role}'."
    )
    db.add(log)
    db.commit()
    
    return new_user

@router.get("/users", response_model=List[UserResponse])
def get_workspace_users(
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    return db.query(User).filter(User.tenant_id == tenant.id).all()

@router.patch("/users/{user_id}", response_model=UserResponse)
def update_workspace_user(
    user_id: str,
    updates: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_user),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    user = db.query(User).filter(User.id == user_id, User.tenant_id == tenant.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Workspace user not found.")
        
    for key, val in updates.model_dump(exclude_unset=True).items():
        setattr(user, key, val)
        
    db.commit()
    db.refresh(user)
    
    # Audit log
    log = AuditLog(
        tenant_id=tenant.id,
        user_id=admin.id,
        action="update_member",
        details=f"Admin modified user '{user.email}' settings."
    )
    db.add(log)
    db.commit()
    
    return user

# --- WORKSPACE SPECIFIC PROVIDERS CONFIG ---
@router.post("/providers", response_model=ProviderConfigResponse)
def configure_tenant_provider(
    config: ProviderConfigCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_user),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    existing = db.query(ProviderConfiguration).filter(
        ProviderConfiguration.tenant_id == tenant.id,
        ProviderConfiguration.provider_name == config.provider_name
    ).first()
    
    encrypted_key = encrypt_data(config.api_key) if config.api_key else None
    
    if existing:
        existing.is_enabled = config.is_enabled
        existing.priority = config.priority
        if encrypted_key:
            existing.credentials_encrypted = encrypted_key
        db_config = existing
    else:
        db_config = ProviderConfiguration(
            tenant_id=tenant.id,
            provider_name=config.provider_name,
            is_enabled=config.is_enabled,
            priority=config.priority,
            credentials_encrypted=encrypted_key
        )
        db.add(db_config)
        
    db.commit()
    db.refresh(db_config)
    
    # Audit log
    log = AuditLog(
        tenant_id=tenant.id,
        user_id=admin.id,
        action="configure_provider",
        details=f"Admin updated provider config for '{config.provider_name}'."
    )
    db.add(log)
    db.commit()
    
    return db_config

@router.get("/providers", response_model=List[ProviderConfigResponse])
def get_tenant_providers(
    db: Session = Depends(get_db),
    tenant: Tenant = Depends(get_current_tenant_context)
):
    configs = db.query(ProviderConfiguration).filter(ProviderConfiguration.tenant_id == tenant.id).all()
    for c in configs:
        c.credentials_encrypted = "CONFIGURED" if c.credentials_encrypted else "NOT_CONFIGURED"
    return configs
