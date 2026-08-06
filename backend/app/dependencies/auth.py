from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import User, Tenant

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
        
    payload = decode_token(token)
    user_id = payload.get("sub")
    if user_id is None or payload.get("refresh") is True:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your user account is suspended or pending approval."
        )
        
    return user

def get_current_tenant_context(request: Request, db: Session = Depends(get_db)) -> Tenant:
    """Gets tenant injected by Middleware if present"""
    tenant = getattr(request.state, "tenant", None)
    if tenant and db:
        tenant = db.merge(tenant)
    return tenant

def check_tenant_access(user: User = Depends(get_current_user), tenant: Tenant = Depends(get_current_tenant_context)):
    """Validates if user belongs to the active tenant domain"""
    if user.role == "super_admin":
        return
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tenant context slug is required."
        )
    if user.tenant_id != tenant.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this tenant workspace."
        )

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role == "super_admin":
            return  # Super admin bypasses all role constraints
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have sufficient permissions to perform this action."
            )

super_admin_only = Depends(RoleChecker(["super_admin"]))
tenant_admin_only = Depends(RoleChecker(["tenant_admin"]))
manager_only = Depends(RoleChecker(["tenant_admin", "manager"]))
standard_user = Depends(RoleChecker(["tenant_admin", "manager", "user"]))
