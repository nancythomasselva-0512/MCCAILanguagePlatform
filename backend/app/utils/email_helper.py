import logging
from sqlalchemy.orm import Session
from app.models.models import AuditLog, Tenant, User

logger = logging.getLogger("mcc-ai-saas-emails")

def log_email_action(db: Session, tenant_id: str, subject: str, body_text: str):
    """
    Simulates sending email by logging the action and appending to system Audit Logs.
    """
    logger.info(f"===> AUTOMATED EMAIL SENT <===")
    logger.info(f"Tenant ID: {tenant_id}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body:\n{body_text}")
    logger.info(f"==============================")
    
    # Save a record in audit logs
    log = AuditLog(
        tenant_id=tenant_id,
        action="automated_email",
        details=f"Email sent with subject: '{subject}'."
    )
    db.add(log)
    db.commit()

def send_welcome_subscription_email(db: Session, tenant: Tenant, plan_name: str):
    subject = f"Welcome to MCC {plan_name} Plan!"
    body = f"Hello {tenant.tenant_name},\n\nThank you for subscribing to the {plan_name} plan on the MCC AI Language Platform. Your workspace has been activated with new resource limits.\n\nEnjoy the platform!\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)

def send_invoice_generated_email(db: Session, tenant: Tenant, invoice_number: str, amount: float):
    subject = f"New Invoice Generated - {invoice_number}"
    body = f"Hello {tenant.tenant_name},\n\nA new invoice {invoice_number} has been generated for your workspace subscription. Total amount: ${amount:.2f}.\n\nPlease review it in your Billing settings.\n\nThanks,\nMCC AI Billing"
    log_email_action(db, tenant.id, subject, body)

def send_payment_success_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, transaction_id: str):
    subject = f"Payment Successful! Invoice {invoice_number}"
    body = f"Hello {tenant.tenant_name},\n\nYour payment of ${amount:.2f} for Invoice {invoice_number} was successfully processed.\nTransaction ID: {transaction_id}.\n\nYour invoice is now marked as PAID and a PDF has been generated for your records.\n\nThank you for your business!\nMCC AI Billing"
    log_email_action(db, tenant.id, subject, body)

def send_payment_failure_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, reason: str):
    subject = f"Payment Failed: Invoice {invoice_number}"
    body = f"Hello {tenant.tenant_name},\n\nWe were unable to process your payment of ${amount:.2f} for Invoice {invoice_number}.\nReason: {reason}.\n\nPlease try paying again via your Billing Panel.\n\nRegards,\nMCC AI Billing"
    log_email_action(db, tenant.id, subject, body)

def send_subscription_expiry_reminder_email(db: Session, tenant: Tenant, days_left: int):
    subject = f"Action Required: Your MCC AI subscription expires in {days_left} days"
    body = f"Hello {tenant.tenant_name},\n\nThis is a friendly reminder that your active subscription is expiring in {days_left} days. Please renew to avoid any disruptions in service.\n\nBest,\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)

def send_renewal_confirmation_email(db: Session, tenant: Tenant, plan_name: str):
    subject = f"Subscription Renewed Successfully - {plan_name}"
    body = f"Hello {tenant.tenant_name},\n\nYour workspace subscription for the {plan_name} plan has been successfully renewed. Thank you for continuing your journey with us!\n\nBest regards,\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)

def send_upgrade_confirmation_email(db: Session, tenant: Tenant, old_plan_name: str, new_plan_name: str):
    subject = f"Subscription Upgraded to {new_plan_name}!"
    body = f"Hello {tenant.tenant_name},\n\nYour workspace subscription has been upgraded from {old_plan_name} to {new_plan_name}. Your resource limits have been instantly updated. Thank you!\n\nThe MCC AI Team"
    log_email_action(db, tenant.id, subject, body)
