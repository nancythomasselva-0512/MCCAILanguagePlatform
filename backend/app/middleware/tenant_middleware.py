from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import Tenant

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We try to extract tenant from headers
        tenant_slug = request.headers.get("x-tenant-slug")
        
        # Bypass for CORS preflight options check
        if request.method == "OPTIONS":
            return await call_next(request)
            
        db: Session = SessionLocal()
        tenant = None
        
        if tenant_slug:
            # Query db for active tenant slug
            tenant = db.query(Tenant).filter(Tenant.slug == tenant_slug, Tenant.status == "active").first()
            if not tenant:
                db.close()
                response = JSONResponse(
                    status_code=404,
                    content={"detail": f"Tenant workspace '{tenant_slug}' is not found or suspended."}
                )
                # Manually inject CORS headers to allow browser reading
                origin = request.headers.get("origin")
                if origin:
                    response.headers["Access-Control-Allow-Origin"] = origin
                    response.headers["Access-Control-Allow-Credentials"] = "true"
                    response.headers["Access-Control-Allow-Headers"] = "*"
                    response.headers["Access-Control-Allow-Methods"] = "*"
                return response
        
        # Inject tenant state into request state so endpoint routers can access it
        request.state.tenant = tenant
        db.close()
        
        response = await call_next(request)
        return response
