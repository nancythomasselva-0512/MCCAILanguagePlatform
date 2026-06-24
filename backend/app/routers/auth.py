from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.models import User, Tenant, SubscriptionPlan, UsageTracking, AuditLog
from app.schemas.schemas import Token, TokenRefreshRequest, TenantRegistration, UserCreate
from app.utils.email_helper import send_welcome_subscription_email, send_superadmin_new_tenant_notification_email
import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register-tenant", response_model=Token)
def register_tenant(data: TenantRegistration, db: Session = Depends(get_db)):
    # Check if tenant slug already exists
    existing_tenant = db.query(Tenant).filter(Tenant.slug == data.slug).first()
    if existing_tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant with this workspace URL slug already exists."
        )

    # Check if admin email already exists
    existing_user = db.query(User).filter(User.email == data.admin_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered."
        )

    # Get subscription plan (default to Free if not specified)
    plan_id = data.plan_id
    if not plan_id:
        free_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name.ilike("free")).first()
        if not free_plan:
            # Create a default free plan on the fly if it doesn't exist
            free_plan = SubscriptionPlan(
                name="Free",
                price=0.0,
                transcription_limit=15,
                translation_limit=10000,
                tts_limit=5000,
                storage_limit=50,
                active=True
            )
            db.add(free_plan)
            db.commit()
            db.refresh(free_plan)
        plan_id = free_plan.id

    # 1. Create Tenant
    new_tenant = Tenant(
        tenant_name=data.tenant_name,
        slug=data.slug,
        status="active",
        plan_id=plan_id
    )
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)

    # 2. Create Tenant Usage Row
    new_usage = UsageTracking(tenant_id=new_tenant.id)
    db.add(new_usage)

    # 3. Create Admin User
    new_admin = User(
        tenant_id=new_tenant.id,
        name=data.admin_name,
        email=data.admin_email,
        password_hash=get_password_hash(data.admin_password),
        role="tenant_admin",
        status="active"
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    # Log action
    log = AuditLog(
        tenant_id=new_tenant.id,
        user_id=new_admin.id,
        action="tenant_registration",
        details=f"Tenant '{new_tenant.tenant_name}' registered with admin '{new_admin.email}'."
    )
    db.add(log)
    db.commit()

    # Generate Tokens
    access = create_access_token(new_admin.id)
    refresh = create_refresh_token(new_admin.id)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "user_id": new_admin.id,
        "role": new_admin.role,
        "tenant_slug": new_tenant.slug,
        "name": new_admin.name
    }

@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    # Standard oauth2 requires form data or standard JSON. We support form style or direct lookup.
    email = None
    password = None
    try:
        body = await request.json()
        email = body.get("username") or body.get("email")
        password = body.get("password")
    except Exception:
        pass

    if not email or not password:
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username/email and password are required."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your user account is {user.status}."
        )

    tenant_slug = None
    if user.tenant_id:
        tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
        if tenant:
            if tenant.status == "suspended":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This workspace has been suspended. Please contact the administrator."
                )
            tenant_slug = tenant.slug

    # Update last login
    user.last_login = datetime.datetime.utcnow()
    db.add(user)
    
    log = AuditLog(
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="login",
        details="User logged in successfully."
    )
    db.add(log)
    db.commit()

    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "tenant_slug": tenant_slug,
        "name": user.name
    }

@router.post("/refresh", response_model=Token)
def refresh_token(data: TokenRefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    user_id = payload.get("sub")
    if not user_id or payload.get("refresh") is not True:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is suspended or deleted."
        )

    tenant_slug = None
    if user.tenant_id:
        tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first()
        if tenant:
            tenant_slug = tenant.slug

    access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)

    return {
        "access_token": access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
        "tenant_slug": tenant_slug,
        "name": user.name
    }
