import logging
import os
import smtplib
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from sqlalchemy.orm import Session
from app.models.models import AuditLog, Tenant, User, Payment, SMTPSettings, EmailTemplate, EmailLog

logger = logging.getLogger("mcc-ai-saas-emails")

# ─────────────────────────────────────────────
# HTML Email Base Layout
# ─────────────────────────────────────────────
def _html_wrapper(title: str, preheader: str, content_html: str, cta_url: str = None, cta_label: str = None) -> str:
    cta_block = ""
    if cta_url and cta_label:
        cta_block = f"""
        <tr>
          <td align="center" style="padding: 0 32px 32px 32px;">
            <a href="{cta_url}" target="_blank"
               style="display:inline-block;background:linear-gradient(135deg,#0f766e,#10b981);color:#ffffff;font-size:15px;font-weight:700;
                      text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
              {cta_label}
            </a>
          </td>
        </tr>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">{preheader}</span>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;
                      background:#1e293b;border:1px solid rgba(255,255,255,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e 0%,#065f46 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                🌐 MCC AI Language Platform
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">
                Powering intelligent multilingual workspaces
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px 24px 40px;color:#e2e8f0;">
              {content_html}
            </td>
          </tr>

          <!-- CTA -->
          {cta_block}

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0;"/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.7;">
                This email was sent automatically by the <strong style="color:#94a3b8;">MCC AI Platform</strong>.<br/>
                If you did not expect this email, please contact your workspace administrator.<br/>
                &copy; {datetime.datetime.utcnow().year} MCC AI Language Platform. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _info_row(label: str, value: str) -> str:
    return f"""
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">{label}</span><br/>
        <span style="font-size:14px;color:#e2e8f0;font-weight:600;">{value}</span>
      </td>
    </tr>"""


# ─────────────────────────────────────────────
# Core Email Sender
# ─────────────────────────────────────────────
def log_email_action(db: Session, tenant_id: str, subject: str, body_text: str,
                     attachment_path: str = None, recipient_email: str = None,
                     from_email: str = None, reply_to: str = None, is_html: bool = False):
    logger.info(f"===> AUTOMATED EMAIL SENT <===")
    logger.info(f"Tenant ID: {tenant_id} | Subject: {subject}")
    if attachment_path:
        logger.info(f"Attachment: {attachment_path}")

    log = AuditLog(tenant_id=tenant_id, action="automated_email",
                   details=f"Email sent with subject: '{subject}'.")
    db.add(log)
    db.commit()

    if not recipient_email:
        admin_user = db.query(User).filter(User.tenant_id == tenant_id, User.role == "tenant_admin").first()
        if not admin_user or not admin_user.email:
            logger.warning(f"No tenant admin user or email found for tenant {tenant_id}.")
            return
        recipient_email = admin_user.email

    logger.info(f"Attempting to send SMTP email to: {recipient_email}")

    db_smtp = db.query(SMTPSettings).filter(SMTPSettings.tenant_id == None).first()

    if not db_smtp or not db_smtp.smtp_host or not db_smtp.is_enabled:
        logger.info("SMTP not configured or disabled. Email simulated in logs.")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email,
                             subject=subject, status="simulated", error_message=None)
        db.add(email_log)
        db.commit()
        return

    from app.core.security import decrypt_data
    smtp_host = db_smtp.smtp_host
    smtp_port = db_smtp.smtp_port
    smtp_user = db_smtp.smtp_username
    smtp_password = decrypt_data(db_smtp.smtp_password) if db_smtp.smtp_password else None

    if from_email:
        sender_email = from_email
    else:
        sender_email = db_smtp.from_email or smtp_user or "noreply@fluentia.com"

    sender_display = (f"{db_smtp.from_name} <{sender_email}>"
                      if db_smtp.from_name and not from_email else sender_email)

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_display
        msg['To'] = recipient_email
        msg['Subject'] = subject

        if reply_to:
            msg['Reply-To'] = reply_to
        elif db_smtp.reply_to_email:
            msg['Reply-To'] = db_smtp.reply_to_email

        if is_html:
            msg.attach(MIMEText(body_text, 'html'))
        else:
            msg.attach(MIMEText(body_text, 'plain'))

        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition",
                            f"attachment; filename={os.path.basename(attachment_path)}")
            msg.attach(part)
            logger.info(f"Attached PDF: {attachment_path}")

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
        logger.info(f"SMTP email successfully sent to {recipient_email}!")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email,
                             subject=subject, status="success", error_message=None)
        db.add(email_log)
        db.commit()
    except Exception as smtp_err:
        logger.error(f"Failed to send SMTP email via {smtp_host}:{smtp_port}: {smtp_err}")
        email_log = EmailLog(tenant_id=tenant_id, recipient=recipient_email,
                             subject=subject, status="failed", error_message=str(smtp_err))
        db.add(email_log)
        db.commit()


# ─────────────────────────────────────────────
# Email Functions
# ─────────────────────────────────────────────

def send_welcome_subscription_email(db: Session, tenant: Tenant, plan_name: str):
    t = db.query(EmailTemplate).filter(
        EmailTemplate.template_type == "welcome", EmailTemplate.tenant_id == None).first()

    if t and t.is_enabled:
        subject = (t.subject
                   .replace("{{tenant_name}}", tenant.tenant_name)
                   .replace("{{plan_name}}", plan_name))
        body = (t.body_html
                .replace("{{tenant_name}}", tenant.tenant_name)
                .replace("{{plan_name}}", plan_name))
        log_email_action(db, tenant.id, subject, body,
                         from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"Welcome to MCC AI – {plan_name} Plan Activated!"
        content = f"""
        <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;">
          Welcome aboard, {tenant.tenant_name}! 🎉
        </h2>
        <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
          Your workspace is live and your <strong style="color:#10b981;">{plan_name} Plan</strong>
          has been activated. Everything is ready to go.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          {_info_row("Workspace", tenant.tenant_name)}
          {_info_row("Plan Activated", plan_name)}
          {_info_row("Status", "✅ Active")}
        </table>
        <p style="margin:24px 0 0;font-size:14px;color:#94a3b8;line-height:1.7;">
          Sign in to your workspace to start using the platform. If you have any
          questions, our team is always here to help.
        </p>"""
        body = _html_wrapper(
            title="Welcome to MCC AI",
            preheader=f"Your {plan_name} workspace is ready!",
            content_html=content,
            cta_url="#",
            cta_label="Go to My Workspace"
        )
        log_email_action(db, tenant.id, subject, body, is_html=True)


def send_invoice_generated_email(db: Session, tenant: Tenant, invoice_number: str, amount: float):
    t = db.query(EmailTemplate).filter(
        EmailTemplate.template_type == "invoice_generated", EmailTemplate.tenant_id == None).first()

    attachment_path = None
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        pdf_file = os.path.join(base_dir, "invoices_pdf", f"{invoice_number}.pdf")
        if os.path.exists(pdf_file):
            attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate invoice PDF: {e}")

    invoice_date = datetime.datetime.utcnow().strftime("%B %d, %Y")
    currency = "USD"
    from app.core.config import settings
    download_url = f"{settings.BACKEND_URL}/api/billing/invoices/{invoice_number}/download"

    if t and t.is_enabled:
        subject = (t.subject
                   .replace("{{tenant_name}}", tenant.tenant_name)
                   .replace("{{customer_name}}", tenant.tenant_name)
                   .replace("{{invoice_number}}", invoice_number)
                   .replace("{{invoice_total}}", f"{amount:.2f}")
                   .replace("{{invoice_date}}", invoice_date)
                   .replace("{{currency}}", currency)
                   .replace("{{download_invoice_url}}", download_url))
        body = (t.body_html
                .replace("{{tenant_name}}", tenant.tenant_name)
                .replace("{{customer_name}}", tenant.tenant_name)
                .replace("{{invoice_number}}", invoice_number)
                .replace("{{invoice_total}}", f"{amount:.2f}")
                .replace("{{invoice_date}}", invoice_date)
                .replace("{{currency}}", currency)
                .replace("{{download_invoice_url}}", download_url))
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path,
                         from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"Invoice {invoice_number} – MCC AI Platform"
        content = f"""
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
          Invoice Generated 🧾
        </h2>
        <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
          Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, a new invoice has been
          generated for your workspace subscription. Please find the details below.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          {_info_row("Invoice Number", invoice_number)}
          {_info_row("Invoice Date", invoice_date)}
          {_info_row("Total Amount", f"{currency} {amount:.2f}")}
          {_info_row("Status", "📄 Awaiting Payment")}
        </table>
        <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
          Your invoice PDF is attached to this email. You can also review it in your
          Billing &amp; Payments dashboard.
        </p>"""
        body = _html_wrapper(
            title=f"Invoice {invoice_number}",
            preheader=f"Invoice {invoice_number} for {currency} {amount:.2f} is ready.",
            content_html=content,
            cta_url=download_url,
            cta_label="Download Invoice PDF"
        )
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path, is_html=True)


def send_user_subscription_activated_email(
    db: Session, tenant: Tenant, user: User, plan_name: str,
    amount_paid: float, currency: str, payment_id: str,
    invoice_number: str, start_date: str, expiry_date: str, invoice_id: str
):
    from app.core.config import settings
    download_url = f"{settings.BACKEND_URL}/api/billing/invoices/{invoice_id}/download"

    attachment_path = None
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        pdf_file = os.path.join(base_dir, "invoices_pdf", f"{invoice_number}.pdf")
        if os.path.exists(pdf_file):
            attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate invoice PDF: {e}")

    subject = f"Subscription Activated – {plan_name} Plan | MCC AI"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
      Subscription Activated! ✅
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      Hello <strong style="color:#e2e8f0;">{user.name}</strong>, your subscription has been
      activated successfully. Here's a summary of your purchase.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      {_info_row("Plan", plan_name)}
      {_info_row("Amount Paid", f"{currency} {amount_paid:.2f}")}
      {_info_row("Invoice Number", invoice_number)}
      {_info_row("Payment Reference", payment_id)}
      {_info_row("Valid From", start_date)}
      {_info_row("Valid Until", expiry_date)}
    </table>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
      Your invoice PDF is attached. Thank you for choosing <strong style="color:#10b981;">MCC AI</strong>!
    </p>"""
    body = _html_wrapper(
        title="Subscription Activated",
        preheader=f"Your {plan_name} subscription is now active!",
        content_html=content,
        cta_url=download_url,
        cta_label="Download Invoice"
    )
    log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path,
                     recipient_email=user.email, is_html=True)


def send_admin_purchase_notification_email(
    db: Session, user: User, tenant: Tenant, plan_name: str,
    amount_paid: float, currency: str, payment_id: str,
    purchase_date: str, expiry_date: str
):
    super_admin = db.query(User).filter(User.role == "super_admin").first()
    if not super_admin or not super_admin.email:
        logger.warning("No super admin email found. Cannot send admin purchase notification.")
        return

    subject = f"New Purchase: {tenant.tenant_name} → {plan_name}"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
      New Subscription Purchase 💳
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      A new subscription has been purchased on the platform. Review the details below.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      {_info_row("Customer Name", user.name)}
      {_info_row("Customer Email", user.email)}
      {_info_row("Workspace", f"{tenant.tenant_name} (/{tenant.slug})")}
      {_info_row("Plan Purchased", plan_name)}
      {_info_row("Amount", f"{currency} {amount_paid:.2f}")}
      {_info_row("Payment ID", payment_id)}
      {_info_row("Purchase Date", purchase_date)}
      {_info_row("Subscription Expiry", expiry_date)}
    </table>"""
    body = _html_wrapper(
        title="New Purchase Notification",
        preheader=f"{tenant.tenant_name} just purchased the {plan_name} plan.",
        content_html=content,
        cta_url="#",
        cta_label="View in Admin Dashboard"
    )
    log_email_action(db, tenant.id, subject, body, recipient_email=super_admin.email, is_html=True)


def send_payment_success_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, transaction_id: str):
    t = db.query(EmailTemplate).filter(
        EmailTemplate.template_type == "payment_success", EmailTemplate.tenant_id == None).first()

    attachment_path = None
    try:
        payment = db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
        if payment:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            pdf_file = os.path.join(base_dir, "receipts_pdf", f"receipt_{payment.id}.pdf")
            if os.path.exists(pdf_file):
                attachment_path = pdf_file
    except Exception as e:
        logger.error(f"Could not locate receipt PDF: {e}")

    plan_name = tenant.plan.name if tenant.plan else "Pro"
    expiry_date = "N/A"
    if tenant.usage and len(tenant.usage) > 0 and tenant.usage[0].billing_period_end:
        expiry_date = tenant.usage[0].billing_period_end.strftime("%B %d, %Y")

    payment_obj = None
    try:
        payment_obj = db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
    except Exception:
        pass
    payment_method = payment_obj.payment_method.title() if payment_obj and payment_obj.payment_method else "Credit Card"
    payment_date = datetime.datetime.utcnow().strftime("%B %d, %Y")

    if t and t.is_enabled:
        subject = (t.subject
                   .replace("{{tenant_name}}", tenant.tenant_name)
                   .replace("{{amount}}", f"{amount:.2f}")
                   .replace("{{invoice_number}}", invoice_number)
                   .replace("{{transaction_id}}", transaction_id)
                   .replace("{{plan_name}}", plan_name)
                   .replace("{{expiry_date}}", expiry_date)
                   .replace("{{payment_method}}", payment_method))
        body = (t.body_html
                .replace("{{tenant_name}}", tenant.tenant_name)
                .replace("{{amount}}", f"{amount:.2f}")
                .replace("{{invoice_number}}", invoice_number)
                .replace("{{transaction_id}}", transaction_id)
                .replace("{{plan_name}}", plan_name)
                .replace("{{expiry_date}}", expiry_date)
                .replace("{{payment_method}}", payment_method))
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path,
                         from_email=t.from_email, reply_to=t.reply_to, is_html=True)
    else:
        subject = f"Payment Confirmed – Invoice {invoice_number} | MCC AI"
        content = f"""
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
          Payment Successful! 🎉
        </h2>
        <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
          Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, your payment has been
          received and processed successfully. Thank you!
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          {_info_row("Invoice Number", invoice_number)}
          {_info_row("Amount Paid", f"USD {amount:.2f}")}
          {_info_row("Payment Method", payment_method)}
          {_info_row("Transaction ID", transaction_id)}
          {_info_row("Payment Date", payment_date)}
          {_info_row("Plan", plan_name)}
          {_info_row("Subscription Valid Until", expiry_date)}
        </table>
        <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
          Your receipt PDF is attached. Your <strong style="color:#10b981;">{plan_name}</strong>
          subscription is now active.
        </p>"""
        body = _html_wrapper(
            title="Payment Confirmed",
            preheader=f"Payment of USD {amount:.2f} confirmed for invoice {invoice_number}.",
            content_html=content,
            cta_url="#",
            cta_label="View Billing Dashboard"
        )
        log_email_action(db, tenant.id, subject, body, attachment_path=attachment_path, is_html=True)


def send_payment_failure_email(db: Session, tenant: Tenant, invoice_number: str, amount: float, reason: str):
    subject = f"Payment Failed – Invoice {invoice_number} | MCC AI"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f87171;">
      Payment Failed ⚠️
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, unfortunately we were
      unable to process your payment. Please review the details and try again.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      {_info_row("Invoice Number", invoice_number)}
      {_info_row("Amount", f"USD {amount:.2f}")}
      {_info_row("Failure Reason", reason)}
    </table>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
      Please log in to your workspace and retry the payment from your Billing dashboard.
      If you continue to face issues, contact our support team.
    </p>"""
    body = _html_wrapper(
        title="Payment Failed",
        preheader=f"Action required: Payment for invoice {invoice_number} failed.",
        content_html=content,
        cta_url="#",
        cta_label="Retry Payment"
    )
    log_email_action(db, tenant.id, subject, body, is_html=True)


def send_subscription_expiry_warning_email(db: Session, tenant: Tenant, days_left: int):
    if days_left == 0:
        subject = "⚠️ Your MCC AI Subscription Has Expired"
        headline = "Your Subscription Has Expired"
        sub = "Renew now to restore your full workspace resource limits immediately."
        urgency_color = "#f87171"
        days_badge = "Expired Today"
    else:
        subject = f"⏰ Your MCC AI Subscription Expires in {days_left} Day{'s' if days_left != 1 else ''}"
        headline = f"Subscription Expiring in {days_left} Day{'s' if days_left != 1 else ''}"
        sub = "Renew your plan before it expires to avoid any disruption to your workspace."
        urgency_color = "#fbbf24"
        days_badge = f"{days_left} day{'s' if days_left != 1 else ''} remaining"

    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:{urgency_color};">
      {headline} ⚡
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#94a3b8;line-height:1.7;">
      Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, {sub}
    </p>
    <div style="display:inline-block;background:{urgency_color}22;border:1px solid {urgency_color}44;
                border-radius:8px;padding:8px 20px;margin-bottom:24px;">
      <span style="font-size:14px;font-weight:700;color:{urgency_color};">{days_badge}</span>
    </div>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
      Log in to your workspace and visit the Billing section to renew your subscription.
    </p>"""
    body = _html_wrapper(
        title="Subscription Expiry Notice",
        preheader=subject,
        content_html=content,
        cta_url="#",
        cta_label="Renew My Subscription"
    )
    log_email_action(db, tenant.id, subject, body, is_html=True)


def send_subscription_expiry_reminder_email(db: Session, tenant: Tenant, days_left: int):
    send_subscription_expiry_warning_email(db, tenant, days_left)


def send_renewal_confirmation_email(db: Session, tenant: Tenant, plan_name: str):
    subject = f"Subscription Renewed – {plan_name} | MCC AI"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
      Subscription Renewed! 🔄
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, your
      <strong style="color:#10b981;">{plan_name}</strong> subscription has been successfully
      renewed. Your workspace continues uninterrupted.
    </p>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
      Thank you for continuing your journey with MCC AI Language Platform!
    </p>"""
    body = _html_wrapper(
        title="Subscription Renewed",
        preheader=f"Your {plan_name} subscription has been renewed successfully.",
        content_html=content,
        cta_url="#",
        cta_label="Go to My Workspace"
    )
    log_email_action(db, tenant.id, subject, body, is_html=True)


def send_upgrade_confirmation_email(db: Session, tenant: Tenant, old_plan_name: str, new_plan_name: str):
    subject = f"Plan Upgraded to {new_plan_name}! | MCC AI"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
      Plan Upgraded! 🚀
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      Hello <strong style="color:#e2e8f0;">{tenant.tenant_name}</strong>, your workspace has been
      successfully upgraded to the <strong style="color:#10b981;">{new_plan_name}</strong> plan.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      {_info_row("Previous Plan", old_plan_name)}
      {_info_row("New Plan", new_plan_name)}
      {_info_row("Status", "✅ Active – Resources Updated Instantly")}
    </table>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
      Your new resource limits are effective immediately. Enjoy your upgraded workspace!
    </p>"""
    body = _html_wrapper(
        title=f"Upgraded to {new_plan_name}",
        preheader=f"You've been upgraded from {old_plan_name} to {new_plan_name}!",
        content_html=content,
        cta_url="#",
        cta_label="Explore New Features"
    )
    log_email_action(db, tenant.id, subject, body, is_html=True)


def send_superadmin_new_tenant_notification_email(db: Session, tenant: Tenant, admin_email: str, plan_name: str):
    super_admin = db.query(User).filter(User.role == "super_admin").first()
    if not super_admin or not super_admin.email:
        logger.warning("No super admin email found. Cannot send new tenant notification.")
        return

    subject = f"New Workspace Registered: {tenant.tenant_name}"
    content = f"""
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
      New Tenant Registered 🏢
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.7;">
      A new tenant workspace has just registered on the MCC AI Platform.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      {_info_row("Workspace Name", tenant.tenant_name)}
      {_info_row("Workspace Slug", f"/{tenant.slug}")}
      {_info_row("Admin Email", admin_email)}
      {_info_row("Selected Plan", plan_name)}
      {_info_row("Registration Time", datetime.datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC"))}
    </table>"""
    body = _html_wrapper(
        title="New Tenant Registered",
        preheader=f"New workspace: {tenant.tenant_name} just registered on the platform.",
        content_html=content,
        cta_url="#",
        cta_label="View in Admin Dashboard"
    )
    log_email_action(db, tenant.id, subject, body, recipient_email=super_admin.email, is_html=True)
