import logging
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from sqlalchemy.orm import Session
from app.models.models import AuditLog, Tenant, User, Payment, SMTPSettings, EmailTemplate, EmailLog

logger = logging.getLogger("mcc-ai-saas-emails")

def log_email_action(db: Session, tenant_id: str, subject: str, body_text: str, attachment_path: str = None, recipient_email: str = None, from_email: str = None, reply_to: str = None, is_html: bool = False):
    """
    Sends a real email using SMTP configuration if environment variables are set,
    otherwise logs the action and appends to system Audit Logs.
    """
    logger.info(f"===> AUTOMATED EMAIL SENT <===")
    logger.info(f"Tenant ID: {tenant_id}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body:\n{body_text}")
    if attachment_path:
        logger.info(f"Attachment: {attachment_path}")
    logger.info(f"==============================")
    
    # 1. Save a record in audit logs
    log = AuditLog(
        tenant_id=tenant_id,
        action="automated_email",
        details=f"Email sent with subject: '{subject}'."
    )
    db.add(log)
    db.commit()

    # 2. Try sending the real email via SMTP
    if not recipient_email:
        # Look up the tenant admin user's email
        admin_user = db.query(User).filter(User.tenant_id == tenant_id, User.role == "tenant_admin").first()
        if not admin_user or not admin_user.email:
            logger.warning(f"No tenant admin user or email found for tenant {tenant_id}. Cannot send SMTP mail.")
            return
        recipient_email = admin_user.email

    logger.info(f"Attempting to send real SMTP email to: {recipient_email}")

    # Load SMTP settings from database
    db_smtp = db.query(SMTPSettings).filter(SMTPSettings.tenant_id == None).first()
    
    if not db_smtp or not db_smtp.smtp_host or not db_smtp.is_enabled:
        logger.info("SMTP is either not configured or disabled. Email will only be simulated in logs.")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email, subject=subject, status="simulated", error_message=None)
        db.add(email_log)
        db.commit()
        return

    from app.core.security import decrypt_data
    smtp_host = db_smtp.smtp_host
    smtp_port = db_smtp.smtp_port
    smtp_user = db_smtp.smtp_username
    smtp_password = decrypt_data(db_smtp.smtp_password) if db_smtp.smtp_password else None
    
    # Setup from address and name
    if from_email:
        sender_email = from_email
    else:
        sender_email = db_smtp.from_email or smtp_user or "noreply@fluentia.com"
        
    sender_display = f"{db_smtp.from_name} <{sender_email}>" if db_smtp.from_name and not from_email else sender_email

    try:
        # Create MIME message
        msg = MIMEMultipart()
        msg['From'] = sender_display
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        if reply_to:
            msg['Reply-To'] = reply_to
        elif db_smtp.reply_to_email:
            msg['Reply-To'] = db_smtp.reply_to_email

        # Attach text body
        if is_html:
            msg.attach(MIMEText(body_text, 'html'))
        else:
            msg.attach(MIMEText(body_text, 'plain'))

        # Attach PDF if exists
        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename={os.path.basename(attachment_path)}",
            )
            msg.attach(part)
            logger.info(f"Attached receipt PDF to email: {attachment_path}")

        # Connect and send
        if db_smtp.encryption_type == "SSL":
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=db_smtp.connection_timeout or 10)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=db_smtp.connection_timeout or 10)
            if db_smtp.encryption_type == "TLS":
                server.starttls()
                
        if db_smtp.enable_authentication and smtp_user and smtp_password:
            server.login(smtp_user, smtp_password)
            
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        logger.info(f"Real SMTP email successfully sent to {recipient_email}!")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email, subject=subject, status="success", error_message=None)
        db.add(email_log)
        db.commit()
    except Exception as smtp_err:
        logger.error(f"Failed to send SMTP email via {smtp_host}:{smtp_port}: {smtp_err}")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email, subject=subject, status="failed", error_message=str(smtp_err))
        db.add(email_log)
        db.commit()

def send_welcome_subscription_email(db: Session, tenant: Tenant, plan_name: str):
    t = db.query(EmailTemplate).filter(EmailTemplate.template_type == "welcome", EmailTemplate.tenant_id == None).first()
    if t and t.is_enabled:
        subject = t.subject.replace("{{tenant_name}}", tenant.tenant_name).replace("{{plan_name}}", plan_name)
        body = t.body_html.replace("{{tenant_name}}", tenant.tenant_name).replace("{{plan_name}}", plan_name)
        log_email_action(db, tenant.id, subject, body, from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"Welcome to MCC {plan_name} Plan!"
        body = f"Hello {tenant.tenant_name},\n\nThank you for subscribing to the {plan_name} plan on Fluentia. Your workspace has been activated with new resource limits.\n\nEnjoy the platform!\nThe Fluentia Team"
        log_email_action(db, tenant.id, subject, body)

def send_invoice_generated_email(db: Session, tenant: Tenant, invoice_number: str, amount: float):
    t = db.query(EmailTemplate).filter(EmailTemplate.template_type == "invoice_generated", EmailTemplate.tenant_id == None).first()
    
    # Locate invoice PDF to attach
    attachment_path = None
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        pdf_file = os.path.join(base_dir, "invoices_pdf", f"{invoice_number}.pdf")
        if os.path.exists(pdf_file):
            attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate invoice PDF to attach: {e}")

    if t and t.is_enabled:
        subject = t.subject.replace("{{tenant_name}}", tenant.tenant_name).replace("{{customer_name}}", tenant.tenant_name).replace("{{invoice_number}}", invoice_number).replace("{{invoice_total}}", str(amount))
        body = t.body_html.replace("{{tenant_name}}", tenant.tenant_name).replace("{{customer_name}}", tenant.tenant_name).replace("{{invoice_number}}", invoice_number).replace("{{invoice_total}}", str(amount))
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path, from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"New Invoice Generated - {invoice_number}"
        body = f"Hello {tenant.tenant_name},\n\nA new invoice {invoice_number} has been generated for your workspace subscription. Total amount: ${amount:.2f}.\n\nPlease review it in your Billing settings.\n\nThanks,\nMCC AI Billing"
        log_email_action(db, tenant.id, subject, body, attachment_path)

def send_user_subscription_activated_email(
    db: Session,
    tenant: Tenant,
    user: User,
    plan_name: str,
    amount_paid: float,
    currency: str,
    payment_id: str,
    invoice_number: str,
    start_date: str,
    expiry_date: str,
    invoice_id: str
):
    subject = "Subscription Activated Successfully"
    from app.core.config import settings
    download_url = f"{settings.BACKEND_URL}/api/billing/invoices/{invoice_id}/download"
    body = (
        f"Hello {user.name},\n\n"
        f"Your subscription has been activated successfully!\n\n"
        f"Subscription Details:\n"
        f"- User Name: {user.name}\n"
        f"- Plan Name: {plan_name}\n"
        f"- Amount Paid: {currency} {amount_paid:.2f}\n"
        f"- Payment ID: {payment_id}\n"
        f"- Invoice Number: {invoice_number}\n"
        f"- Start Date: {start_date}\n"
        f"- Expiry Date: {expiry_date}\n\n"
        f"You can download your invoice by clicking the link below:\n"
        f"{download_url}\n\n"
        f"Thank you for choosing MCC AI!\n"
        f"The MCC AI Team"
    )
    
    # Locate invoice PDF to attach
    attachment_path = None
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        pdf_file = os.path.join(base_dir, "invoices_pdf", f"{invoice_number}.pdf")
        if os.path.exists(pdf_file):
            attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate invoice PDF to attach: {e}")

    log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path, recipient_email=user.email)

def send_admin_purchase_notification_email(
    db: Session,
    user: User,
    tenant: Tenant,
    plan_name: str,
    amount_paid: float,
    currency: str,
    payment_id: str,
    purchase_date: str,
    expiry_date: str
):
    subject = "New Subscription Purchase"
    body = (
        f"Hello Admin,\n\n"
        f"A new subscription has been purchased on the platform!\n\n"
        f"Purchase Details:\n"
        f"- User Name: {user.name}\n"
        f"- User Email: {user.email}\n"
        f"- Workspace Tenant: {tenant.tenant_name} (slug: {tenant.slug})\n"
        f"- Plan Purchased: {plan_name}\n"
        f"- Amount Paid: {currency} {amount_paid:.2f}\n"
        f"- Payment ID: {payment_id}\n"
        f"- Purchase Date: {purchase_date}\n"
        f"- Subscription Expiry Date: {expiry_date}\n\n"
        f"Regards,\n"
        f"MCC AI Billing System"
    )
    
    # Find super admin email dynamically from database
    super_admin = db.query(User).filter(User.role == "super_admin").first()
    if not super_admin or not super_admin.email:
        logger.warning("No super admin email found in database. Cannot send admin purchase notification.")
        return
        
    log_email_action(db, tenant.id, subject, body, recipient_email=super_admin.email)

def send_payment_success_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, transaction_id: str):
    t = db.query(EmailTemplate).filter(EmailTemplate.template_type == "payment_success", EmailTemplate.tenant_id == None).first()

    # Locate the receipt PDF
    attachment_path = None
    try:
        payment = db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
        if payment:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            pdf_file = os.path.join(base_dir, "receipts_pdf", f"receipt_{payment.id}.pdf")
            if os.path.exists(pdf_file):
                attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate receipt PDF to attach: {e}")

    plan_name = tenant.plan.name if tenant.plan else "Pro"
    expiry_date = "N/A"
    if tenant.usage and len(tenant.usage) > 0 and tenant.usage[0].billing_period_end:
        expiry_date = tenant.usage[0].billing_period_end.strftime("%Y-%m-%d")
    
    payment_method = payment.payment_method.title() if payment and payment.payment_method else "Credit Card"

    if t and t.is_enabled:
        subject = t.subject.replace("{{tenant_name}}", tenant.tenant_name).replace("{{amount}}", str(amount)).replace("{{invoice_number}}", invoice_number).replace("{{transaction_id}}", transaction_id).replace("{{plan_name}}", plan_name).replace("{{expiry_date}}", expiry_date).replace("{{payment_method}}", payment_method)
        body = t.body_html.replace("{{tenant_name}}", tenant.tenant_name).replace("{{amount}}", str(amount)).replace("{{invoice_number}}", invoice_number).replace("{{transaction_id}}", transaction_id).replace("{{plan_name}}", plan_name).replace("{{expiry_date}}", expiry_date).replace("{{payment_method}}", payment_method)
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path, from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"Payment Successful! Invoice {invoice_number}"
        body = f"Hello {tenant.tenant_name},\n\nYour payment of ${amount:.2f} for Invoice {invoice_number} via {payment_method} was successfully processed.\nTransaction ID: {transaction_id}.\n\nYour {plan_name} subscription is now active and expires on {expiry_date}.\nYour invoice is now marked as PAID and a PDF has been generated for your records.\n\nThank you for your business!\nMCC AI Billing"
        log_email_action(db, tenant.id, subject, body, attachment_path)

def send_payment_failure_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, reason: str):
    subject = f"Payment Failed: Invoice {invoice_number}"
    body = f"Hello {tenant.tenant_name},\n\nWe were unable to process your payment of ${amount:.2f} for Invoice {invoice_number}.\nReason: {reason}.\n\nPlease try paying again via your Billing Panel.\n\nRegards,\nMCC AI Billing"
    log_email_action(db, tenant.id, subject, body)

def send_subscription_expiry_warning_email(db: Session, tenant: Tenant, days_left: int):
    if days_left == 0:
        subject = "Action Required: Your MCC AI subscription has expired"
        body = (
            f"Hello {tenant.tenant_name},\n\n"
            f"This is to notify you that your active subscription has expired today. "
            f"Please renew your subscription to avoid any disruption to your workspace resource limits.\n\n"
            f"Best,\n"
            f"The MCC AI Team"
        )
    else:
        subject = f"Action Required: Your MCC AI subscription expires in {days_left} days"
        body = (
            f"Hello {tenant.tenant_name},\n\n"
            f"This is a friendly reminder that your active subscription is expiring in {days_left} days. "
            f"Please renew your plan to avoid any disruptions in service.\n\n"
            f"Best,\n"
            f"The MCC AI Team"
        )
    log_email_action(db, tenant.id, subject, body)

def send_subscription_expiry_reminder_email(db: Session, tenant: Tenant, days_left: int):
    # Keep alias for compatibility
    send_subscription_expiry_warning_email(db, tenant, days_left)

def send_renewal_confirmation_email(db: Session, tenant: Tenant, plan_name: str):
    subject = f"Subscription Renewed Successfully - {plan_name}"
    body = f"Hello {tenant.tenant_name},\n\nYour workspace subscription for the {plan_name} plan has been successfully renewed. Thank you for continuing your journey with us!\n\nBest regards,\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)

def send_upgrade_confirmation_email(db: Session, tenant: Tenant, old_plan_name: str, new_plan_name: str):
    subject = f"Subscription Upgraded to {new_plan_name}!"
    body = f"Hello {tenant.tenant_name},\n\nYour workspace subscription has been upgraded from {old_plan_name} to {new_plan_name}. Your resource limits have been instantly updated. Thank you!\n\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)


def send_superadmin_new_tenant_notification_email(db: Session, tenant: Tenant, admin_email: str, plan_name: str):
    super_admin = db.query(User).filter(User.role == "super_admin").first()
    if not super_admin or not super_admin.email:
        logger.warning("No super admin email found in database. Cannot send super admin new tenant notification.")
        return
        
    
    subject = f"New Workspace Registered: {tenant.tenant_name}"
    body = (
        f"Hello Super Admin,\n\n"
        f"A new tenant workspace has just registered on the MCC AI Platform!\n\n"
        f"Details:\n"
        f"- Workspace Name: {tenant.tenant_name}\n"
        f"- Workspace Slug: {tenant.slug}\n"
        f"- Admin Email: {admin_email}\n"
        f"- Selected Plan: {plan_name}\n\n"
        f"You can review this workspace in the Super Admin Dashboard.\n\n"
        f"System Notification"
    )
    
    log_email_action(db, tenant.id, subject, body, recipient_email=super_admin.email)
