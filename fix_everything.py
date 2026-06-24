import re

# --- 1. Fix email_helper.py ---
with open("backend/app/utils/email_helper.py", "r", encoding="utf-8") as f:
    email_content = f.read()

# Add SMTPSettings to imports
if "SMTPSettings" not in email_content:
    email_content = email_content.replace("from app.models.models import AuditLog, Tenant, User, Payment", 
                                          "from app.models.models import AuditLog, Tenant, User, Payment, SMTPSettings")
    email_content = email_content.replace("from app.models.models import User, Tenant, Payment, AuditLog", 
                                          "from app.models.models import User, Tenant, Payment, AuditLog, SMTPSettings")

# Patch log_email_action to load SMTP settings from DB
pattern = re.compile(r"# Load SMTP settings from core configuration settings\n\s*from app\.core\.config import settings\n\s*smtp_host = settings\.SMTP_HOST\n\s*smtp_port = settings\.SMTP_PORT\n\s*smtp_user = settings\.SMTP_USER\n\s*smtp_password = settings\.SMTP_PASSWORD\n\s*sender_email = settings\.SMTP_SENDER or smtp_user or \"noreply@mcc-ai\.com\"")
match = pattern.search(email_content)
if match:
    new_code = """# Load SMTP settings from database first
    db_smtp = db.query(SMTPSettings).first()
    
    if db_smtp and db_smtp.smtp_host:
        smtp_host = db_smtp.smtp_host
        smtp_port = db_smtp.smtp_port
        smtp_user = db_smtp.smtp_username
        smtp_password = db_smtp.smtp_password
        sender_email = db_smtp.from_email or smtp_user or "noreply@mcc-ai.com"
    else:
        # Fallback to environment variables
        from app.core.config import settings
        smtp_host = settings.SMTP_HOST
        smtp_port = settings.SMTP_PORT
        smtp_user = settings.SMTP_USER
        smtp_password = settings.SMTP_PASSWORD
        sender_email = settings.SMTP_SENDER or smtp_user or "noreply@mcc-ai.com"
"""
    email_content = email_content[:match.start()] + new_code + email_content[match.end():]

# Add send_superadmin_new_tenant_notification_email
if "def send_superadmin_new_tenant_notification_email" not in email_content:
    new_func = """
def send_superadmin_new_tenant_notification_email(db: Session, tenant: Tenant, admin_email: str, plan_name: str):
    super_admin = db.query(User).filter(User.role == "super_admin").first()
    recipient_email = super_admin.email if super_admin and super_admin.email else "admin@mcc-ai.com"
    
    subject = f"New Workspace Registered: {tenant.tenant_name}"
    body = (
        f"Hello Super Admin,\\n\\n"
        f"A new tenant workspace has just registered on the MCC AI Platform!\\n\\n"
        f"Details:\\n"
        f"- Workspace Name: {tenant.tenant_name}\\n"
        f"- Workspace Slug: {tenant.slug}\\n"
        f"- Admin Email: {admin_email}\\n"
        f"- Selected Plan: {plan_name}\\n\\n"
        f"You can review this workspace in the Super Admin Dashboard.\\n\\n"
        f"System Notification"
    )
    
    log_email_action(db, tenant.id, subject, body, recipient_email=recipient_email)
"""
    email_content += "\n" + new_func

with open("backend/app/utils/email_helper.py", "w", encoding="utf-8") as f:
    f.write(email_content)

# --- 2. Fix auth.py ---
with open("backend/app/routers/auth.py", "r", encoding="utf-8") as f:
    auth_content = f.read()

# Add missing imports
if "from app.utils.email_helper import send_welcome_subscription_email" not in auth_content:
    import_stmt = "from app.utils.email_helper import send_welcome_subscription_email, send_superadmin_new_tenant_notification_email\n"
    auth_content = auth_content.replace("from app.schemas.schemas import Token, TokenRefreshRequest, TenantRegistration, UserCreate\n", 
                                        "from app.schemas.schemas import Token, TokenRefreshRequest, TenantRegistration, UserCreate\n" + import_stmt)

# Ensure send_superadmin_new_tenant_notification_email is called properly
if "send_superadmin_new_tenant_notification_email(db, new_tenant, new_admin.email, plan_name)" not in auth_content:
    auth_content = auth_content.replace(
        "send_welcome_subscription_email(db, new_tenant, plan_name)",
        "send_welcome_subscription_email(db, new_tenant, plan_name)\n        send_superadmin_new_tenant_notification_email(db, new_tenant, new_admin.email, plan_name)"
    )

with open("backend/app/routers/auth.py", "w", encoding="utf-8") as f:
    f.write(auth_content)

print("All fixes reapplied successfully!")
