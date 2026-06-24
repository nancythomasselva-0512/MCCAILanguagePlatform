import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True, nullable=False)  # Free, Starter, Professional, Enterprise
    price = Column(Float, nullable=False, default=0.0)
    transcription_limit = Column(Integer, nullable=False, default=30)  # minutes per month
    translation_limit = Column(Integer, nullable=False, default=50000)  # characters per month
    tts_limit = Column(Integer, nullable=False, default=10000)  # characters per month
    storage_limit = Column(Integer, nullable=False, default=100)  # MBs
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenants = relationship("Tenant", back_populates="plan")

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    status = Column(String(20), default="active")  # active, suspended, deleted
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    plan = relationship("SubscriptionPlan", back_populates="tenants")
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    usage = relationship("UsageTracking", back_populates="tenant", cascade="all, delete-orphan")
    providers = relationship("ProviderConfiguration", back_populates="tenant", cascade="all, delete-orphan")
    transcriptions = relationship("TranscriptionHistory", back_populates="tenant", cascade="all, delete-orphan")
    translations = relationship("TranslationHistory", back_populates="tenant", cascade="all, delete-orphan")
    tts = relationship("TtsHistory", back_populates="tenant", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="tenant", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="tenant", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="tenant", cascade="all, delete-orphan")
    payment_transactions = relationship("PaymentTransaction", back_populates="tenant", cascade="all, delete-orphan")
    subscription_history = relationship("SubscriptionHistory", back_populates="tenant", cascade="all, delete-orphan")
    invoice_history = relationship("InvoiceHistory", back_populates="tenant", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)  # Null if Super Admin
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="user")  # super_admin, tenant_admin, manager, user
    status = Column(String(20), default="active")  # active, suspended, pending
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="users")

class UsageTracking(Base):
    __tablename__ = "usage_tracking"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    audio_minutes_used = Column(Float, default=0.0)
    translation_chars_used = Column(Integer, default=0)
    tts_chars_used = Column(Integer, default=0)
    api_calls_used = Column(Integer, default=0)
    storage_bytes_used = Column(Integer, default=0)
    billing_period_start = Column(DateTime, default=datetime.datetime.utcnow)
    billing_period_end = Column(DateTime, default=lambda: datetime.datetime.utcnow() + datetime.timedelta(days=30))
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="usage")

class ProviderConfiguration(Base):
    __tablename__ = "provider_configurations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)  # Null for Global Admin settings
    provider_name = Column(String(50), nullable=False)  # openai, deepgram, elevenlabs, local-whisper
    is_enabled = Column(Boolean, default=True)
    credentials_encrypted = Column(Text, nullable=True)  # AES-256 encrypted API key / endpoint
    priority = Column(Integer, default=1)  # lower number means higher priority
    config_json = Column(Text, nullable=True) # Web search configs etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="providers")

class TranscriptionHistory(Base):
    __tablename__ = "transcription_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="NO ACTION"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    duration_seconds = Column(Float, nullable=False)
    transcript_text = Column(Text, nullable=False)
    provider = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="transcriptions")

class TranslationHistory(Base):
    __tablename__ = "translation_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="NO ACTION"), nullable=False)
    source_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    source_lang = Column(String(50), nullable=False)
    target_lang = Column(String(50), nullable=False)
    provider = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="translations")

class TtsHistory(Base):
    __tablename__ = "tts_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="NO ACTION"), nullable=False)
    text = Column(Text, nullable=False)
    voice_name = Column(String(100), nullable=False)
    characters_count = Column(Integer, nullable=False)
    file_path = Column(String(255), nullable=True)
    provider = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="tts")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="NO ACTION"), nullable=True)
    action = Column(String(100), nullable=False)  # login, create_user, delete_tenant, modify_provider
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class FeatureProviderMapping(Base):
    __tablename__ = "feature_provider_mapping"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    feature_name = Column(String(100), nullable=False)
    provider_name = Column(String(50), nullable=False)
    priority = Column(Integer, default=1)
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)



# --- NEW WHITE-LABEL SAAS MODELS ---

class PlatformSettings(Base):
    __tablename__ = "platform_settings"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True) # Null for Global
    invite_only = Column(Boolean, default=False)
    registration_approval = Column(Boolean, default=False)
    enable_email_login = Column(Boolean, default=True)
    enable_google_login = Column(Boolean, default=False)
    enable_microsoft_login = Column(Boolean, default=False)
    enable_otp_login = Column(Boolean, default=False)
    enable_magic_link = Column(Boolean, default=False)
    custom_css = Column(Text, nullable=True)
    custom_js = Column(Text, nullable=True)
    tracking_scripts = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ThemeSettings(Base):
    __tablename__ = "theme_settings"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    mode = Column(String(20), default="dark") # light, dark, auto
    primary_color = Column(String(20), default="#2563EB")
    secondary_color = Column(String(20), default="#4F46E5")
    accent_color = Column(String(20), default="#06B6D4")
    success_color = Column(String(20), default="#10B981")
    warning_color = Column(String(20), default="#F59E0B")
    error_color = Column(String(20), default="#EF4444")
    font_family = Column(String(100), default="Inter")
    font_size = Column(String(20), default="14px")
    heading_styles = Column(Text, nullable=True)
    border_radius = Column(String(20), default="16px")
    shadow_style = Column(String(50), default="normal")
    card_style = Column(String(50), default="glassmorphism")
    sidebar_width = Column(String(20), default="256px")
    navbar_height = Column(String(20), default="64px")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class BrandingSettings(Base):
    __tablename__ = "branding_settings"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    logo_url = Column(String(255), nullable=True)
    logo_size = Column(String(20), default="32px")
    logo_position = Column(String(20), default="left")
    favicon_url = Column(String(255), nullable=True)
    app_icon_url = Column(String(255), nullable=True)
    platform_name = Column(String(100), default="MCC AI")
    tagline = Column(String(200), default="Language Platform")
    footer_text = Column(String(200), default="Powering Next-Gen Language AI")
    copyright_text = Column(String(200), default="© 2026 MCC AI. All rights reserved.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class WebsitePage(Base):
    __tablename__ = "website_pages"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    slug = Column(String(100), nullable=False)
    title = Column(String(150), nullable=False)
    subtitle = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class WebsiteSection(Base):
    __tablename__ = "website_sections"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    page_id = Column(String(36), ForeignKey("website_pages.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), nullable=False) # hero, features, stats, testimonials, pricing, faq, contact, footer, custom
    title = Column(String(150), nullable=True)
    subtitle = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    video_url = Column(String(255), nullable=True)
    button_text = Column(String(50), nullable=True)
    button_link = Column(String(255), nullable=True)
    metadata_json = Column(Text, nullable=True) # JSON config string for cards, steps, pricing list etc.
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class NavigationItem(Base):
    __tablename__ = "navigation_items"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    parent_id = Column(String(36), nullable=True) # For nested dropdowns
    label = Column(String(100), nullable=False)
    route = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=True)
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    roles = Column(String(255), default="*") # roles allowed to see: * or comma-separated roles

class FeatureFlag(Base):
    __tablename__ = "feature_flags"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(100), nullable=False) # voice-to-text, text-to-speech, translation, audio-upload
    display_name = Column(String(100), nullable=False)
    is_enabled = Column(Boolean, default=True)
    restricted_plans = Column(String(255), default="") # plan ids or names allowed, empty means all

class DashboardWidget(Base):
    __tablename__ = "dashboard_widgets"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    widget_type = Column(String(50), nullable=False) # chart, metric, table, custom
    title = Column(String(100), nullable=False)
    config_json = Column(Text, nullable=True) # coordinates, size, endpoint etc.
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)

class EmailTemplate(Base):
    __tablename__ = "email_templates"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    template_type = Column(String(50), nullable=False) # welcome, reset_password, subscription, invoice, notification
    subject = Column(String(255), nullable=False)
    body_html = Column(Text, nullable=False)
    body_text = Column(Text, nullable=True)

class CustomForm(Base):
    __tablename__ = "custom_forms"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    form_name = Column(String(100), nullable=False) # contact_form, admission_form etc.
    fields_json = Column(Text, nullable=False) # drag-and-drop schema
    submit_endpoint = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MediaLibrary(Base):
    __tablename__ = "media_library"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(50), nullable=False) # image, video, document, icon
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class TenantBranding(Base):
    __tablename__ = "tenant_branding"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, unique=True)
    custom_domain = Column(String(255), nullable=True, unique=True)
    branding_id = Column(String(36), ForeignKey("branding_settings.id"), nullable=True)
    theme_id = Column(String(36), ForeignKey("theme_settings.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BillingSettings(Base):
    __tablename__ = "billing_settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True) # Null for global config
    currency = Column(String(10), default="INR") # USD, INR
    gst_percentage = Column(Float, default=18.0)
    invoice_prefix = Column(String(20), default="INV")
    invoice_footer = Column(Text, default="Thank you for choosing MCC AI!")
    company_name = Column(String(100), default="MCC AI Corp")
    company_address = Column(Text, nullable=True)
    company_email = Column(String(100), nullable=True)
    
    stripe_enabled = Column(Boolean, default=True)
    stripe_public_key = Column(String(255), nullable=True)
    stripe_secret_key = Column(String(255), nullable=True)
    
    razorpay_enabled = Column(Boolean, default=True)
    razorpay_key_id = Column(String(255), nullable=True)
    razorpay_key_secret = Column(String(255), nullable=True)
    
    upi_enabled = Column(Boolean, default=True)
    upi_id = Column(String(255), default="mccai@upi")
    
    default_gateway = Column(String(50), default="stripe") # stripe, razorpay, upi
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(String(20), default="active") # active, expired, canceled
    price = Column(Float, nullable=False, default=0.0)
    billing_cycle = Column(String(20), default="monthly") # monthly, yearly
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    current_period_start = Column(DateTime, default=datetime.datetime.utcnow)
    current_period_end = Column(DateTime, nullable=False)
    cancel_at_period_end = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    invoice_number = Column(String(50), unique=True, nullable=False, index=True) # INV-2026-0001
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=False)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(20), default="pending") # pending, paid, failed, canceled
    billing_period_start = Column(DateTime, nullable=False)
    billing_period_end = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    pdf_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="invoices")
    plan = relationship("SubscriptionPlan")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")
    history = relationship("InvoiceHistory", back_populates="invoice", cascade="all, delete-orphan")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="NO ACTION"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payment_method = Column(String(20), nullable=False) # stripe, razorpay, upi
    status = Column(String(20), default="pending") # pending, success, failed
    transaction_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")
    tenant = relationship("Tenant", back_populates="payments")
    transactions = relationship("PaymentTransaction", back_populates="payment", cascade="all, delete-orphan")

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    payment_id = Column(String(36), ForeignKey("payments.id", ondelete="NO ACTION"), nullable=True)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    gateway = Column(String(20), nullable=False) # stripe, razorpay, upi
    event_type = Column(String(50), nullable=True)
    gateway_response = Column(Text, nullable=True) # Full JSON payload
    status = Column(String(20), nullable=False) # success, failed
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    payment = relationship("Payment", back_populates="transactions")
    tenant = relationship("Tenant", back_populates="payment_transactions")

class SubscriptionHistory(Base):
    __tablename__ = "subscription_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=False)
    action = Column(String(50), nullable=False) # subscribe, upgrade, downgrade, renew, cancel
    price = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="subscription_history")
    plan = relationship("SubscriptionPlan")

class InvoiceHistory(Base):
    __tablename__ = "invoice_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    tenant_id = Column(String(36), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="NO ACTION"), nullable=False)
    invoice_number = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)  # create, status_change, refund, fail
    old_status = Column(String(20), nullable=True)
    new_status = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tenant = relationship("Tenant", back_populates="invoice_history")
    invoice = relationship("Invoice", back_populates="history")
