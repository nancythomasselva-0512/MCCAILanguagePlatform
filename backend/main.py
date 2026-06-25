import os
import tempfile
import logging
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Imports for new SaaS structure
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.middleware.tenant_middleware import TenantMiddleware
from app.routers import auth, super_admin, tenant_admin, tools, platform_builder, billing
from app.models.models import SubscriptionPlan, User, BillingSettings
from app.core.security import get_password_hash

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("mcc-ai-saas-backend")

# Initialize database schemas
try:
    logger.info("Initializing database schemas...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schemas initialized.")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")

# Database Seeding: default plans and super admin
def seed_database():
    db = SessionLocal()
    try:
        # 1. Seed plans
        plans_data = [
            {"name": "Free", "price": 0.0, "transcription_limit": 15, "translation_limit": 10000, "tts_limit": 5000, "storage_limit": 50},
            {"name": "Starter", "price": 19.0, "transcription_limit": 60, "translation_limit": 100000, "tts_limit": 50000, "storage_limit": 500},
            {"name": "Professional", "price": 49.0, "transcription_limit": 300, "translation_limit": 500000, "tts_limit": 250000, "storage_limit": 2000},
            {"name": "Enterprise", "price": 149.0, "transcription_limit": 1200, "translation_limit": 2000000, "tts_limit": 1000000, "storage_limit": 10000},
        ]
        
        for p in plans_data:
            existing = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == p["name"]).first()
            if not existing:
                db_plan = SubscriptionPlan(**p)
                db.add(db_plan)
                logger.info(f"Seeded plan: {p['name']}")
        db.commit()

        # Seed global branding settings
        from app.models.models import BrandingSettings, ThemeSettings, PlatformSettings, NavigationItem, FeatureFlag
        
        # 1. Branding Settings
        existing_branding = db.query(BrandingSettings).filter(BrandingSettings.tenant_id == None).first()
        if not existing_branding:
            branding = BrandingSettings(
                platform_name="MCC AI",
                tagline="Language Platform",
                footer_text="Powering Next-Gen Language AI",
                copyright_text="© 2026 MCC AI. All rights reserved.",
                logo_url="/logo.png"
            )
            db.add(branding)
            logger.info("Seeded global branding settings.")
            
        # 2. Theme Settings
        existing_theme = db.query(ThemeSettings).filter(ThemeSettings.tenant_id == None).first()
        if not existing_theme:
            theme = ThemeSettings(
                mode="dark",
                primary_color="#2563EB",
                secondary_color="#4F46E5",
                accent_color="#06B6D4",
                success_color="#10B981",
                warning_color="#F59E0B",
                error_color="#EF4444",
                font_family="Inter",
                border_radius="16px"
            )
            db.add(theme)
            logger.info("Seeded global theme settings.")
            
        # 3. Platform Settings
        existing_platform = db.query(PlatformSettings).filter(PlatformSettings.tenant_id == None).first()
        if not existing_platform:
            platform = PlatformSettings(
                invite_only=False,
                enable_email_login=True
            )
            db.add(platform)
            logger.info("Seeded global platform settings.")

        # 4. Feature Flags
        features_data = [
            {"name": "voice-to-text", "display_name": "Voice To Text"},
            {"name": "text-to-speech", "display_name": "Text To Speech"},
            {"name": "translation", "display_name": "Translation"},
            {"name": "audio-upload", "display_name": "Audio Upload"},
        ]
        for f in features_data:
            existing = db.query(FeatureFlag).filter(FeatureFlag.tenant_id == None, FeatureFlag.name == f["name"]).first()
            if not existing:
                db_feature = FeatureFlag(**f)
                db.add(db_feature)
                logger.info(f"Seeded feature flag: {f['name']}")

        # 5. Default Navigation Items
        default_navs = [
            {"label": "Home", "route": "landing", "order": 1, "is_visible": True},
            {"label": "AI Tools", "route": "ai-language-tools", "order": 2, "is_visible": True},
            {"label": "Pricing", "route": "pricing", "order": 3, "is_visible": True},
            {"label": "Testimonials", "route": "testimonials", "order": 4, "is_visible": True},
            {"label": "Contact", "route": "contact", "order": 5, "is_visible": True},
        ]
        for n in default_navs:
            existing = db.query(NavigationItem).filter(NavigationItem.tenant_id == None, NavigationItem.label == n["label"]).first()
            if not existing:
                db_nav = NavigationItem(**n)
                db.add(db_nav)
                logger.info(f"Seeded default navigation: {n['label']}")

        # Seed default billing settings
        existing_billing = db.query(BillingSettings).filter(BillingSettings.tenant_id == None).first()
        if not existing_billing:
            billing_s = BillingSettings(
                currency="INR",
                gst_percentage=18.0,
                invoice_prefix="INV",
                invoice_footer="For any subscription questions, contact billing@mcc-ai.com.",
                company_name="MCC AI Language Platform",
                company_address="123 Tech Campus, Bangalore, India",
                company_email="billing@mcc-ai.com",
                stripe_enabled=True,
                stripe_public_key="pk_test_51MccAiStripePubKeyFake",
                stripe_secret_key="sk_test_51MccAiStripeSecKeyFake",
                razorpay_enabled=True,
                razorpay_key_id="rzp_test_mccaiFakeKeyId",
                razorpay_key_secret="rzp_secret_mccaiFakeSecret",
                upi_enabled=True,
                upi_id="mccai@upi",
                default_gateway="stripe"
            )
            db.add(billing_s)
            logger.info("Seeded global billing settings.")

        db.commit()

        # 2. Seed default Super Admin
        admin_email = "aachinancy@gmail.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if existing_admin:
            existing_admin.password_hash = get_password_hash("admin123")
            db.add(existing_admin)
            logger.info(f"Updated default Super Admin password for: {admin_email}")
        else:
            # Look up and rename/re-key the old seed admin if present in the database file
            old_admin = db.query(User).filter(User.email.in_(["mrfadmin@gmail.com", "admin@mcc-ai.com"])).first()
            if old_admin:
                old_admin.email = admin_email
                old_admin.password_hash = get_password_hash("admin123")
                db.add(old_admin)
                logger.info(f"Updated default Super Admin to: {admin_email} / admin123")
            else:
                super_admin = User(
                    name="Platform Owner",
                    email=admin_email,
                    password_hash=get_password_hash("admin123"),
                    role="super_admin",
                    status="active"
                )
                db.add(super_admin)
                logger.info(f"Seeded default Super Admin: {admin_email} / admin123")
        db.commit()
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

seed_database()

app = FastAPI(title="MCC AI Multi-Tenant SaaS Workspace Platform")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inject multi-tenant workspace extraction middleware
app.add_middleware(TenantMiddleware)

# Bind new routers
app.include_router(auth.router, prefix="/api")
app.include_router(super_admin.router, prefix="/api")
app.include_router(tenant_admin.router, prefix="/api")
app.include_router(tools.router, prefix="/api")
app.include_router(platform_builder.router, prefix="/api")
app.include_router(billing.router, prefix="/api")

# --- BACKWARD COMPATIBILITY: LOCAL FASTER-WHISPER RUNNER ---
from app.utils.audio import get_model, transcribe_local_audio

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "faster-whisper"}

@app.post("/api/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    model: str = Form("base"),
    language: str = Form(None),
):
    filename = file.filename or "audio.mp3"
    logger.info(f"Received transcription request for file: {filename}, model: {model}, language: {language}")
    
    ext = filename.split(".")[-1].lower() if "." in filename else "mp3"
    if ext not in ["mp3", "wav", "m4a", "ogg", "flac", "aac", "webm", "opus"]:
        raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")
        
    try:
        audio_bytes = await file.read()
        res = transcribe_local_audio(
            audio_bytes=audio_bytes,
            filename=filename,
            model=model,
            language=language
        )
        return res
    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
