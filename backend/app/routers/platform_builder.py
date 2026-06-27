from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user, super_admin_only
from app.models.models import (
    User, Tenant, SubscriptionPlan, PlatformSettings, ThemeSettings, 
    BrandingSettings, WebsitePage, WebsiteSection, NavigationItem, 
    FeatureFlag, DashboardWidget, EmailTemplate, CustomForm, MediaLibrary, TenantBranding
)
import datetime
import json
from typing import Optional, Dict, Any, List

router = APIRouter(prefix="/platform-builder", tags=["Platform Builder Operations"])

# GET GLOBAL CONFIG (Unauthenticated for landing/home page)
@router.get("/global-config")
def get_global_config(db: Session = Depends(get_db)):
    branding = db.query(BrandingSettings).filter(BrandingSettings.tenant_id == None).first()
    theme = db.query(ThemeSettings).filter(ThemeSettings.tenant_id == None).first()
    platform = db.query(PlatformSettings).filter(PlatformSettings.tenant_id == None).first()
    nav_items = db.query(NavigationItem).filter(NavigationItem.tenant_id == None).order_by(NavigationItem.order.asc()).all()
    features = db.query(FeatureFlag).filter(FeatureFlag.tenant_id == None).all()
    pages = db.query(WebsitePage).filter(WebsitePage.tenant_id == None, WebsitePage.is_active == True).order_by(WebsitePage.order.asc()).all()

    return {
        "branding": {
            "platform_name": branding.platform_name if branding else "MCC AI",
            "tagline": branding.tagline if branding else "Language Platform",
            "logo_url": branding.logo_url if branding else "/logo.png",
            "logo_size": branding.logo_size if branding else "32px",
            "logo_position": branding.logo_position if branding else "left",
            "favicon_url": branding.favicon_url if branding else "",
            "app_icon_url": branding.app_icon_url if branding else "",
            "footer_text": branding.footer_text if branding else "Powering Next-Gen AI",
            "copyright_text": branding.copyright_text if branding else "© 2026 MCC AI"
        } if branding else {},
        "theme": {
            "mode": theme.mode if theme else "dark",
            "primary_color": theme.primary_color if theme else "#2563EB",
            "secondary_color": theme.secondary_color if theme else "#4F46E5",
            "accent_color": theme.accent_color if theme else "#06B6D4",
            "success_color": theme.success_color if theme else "#10B981",
            "warning_color": theme.warning_color if theme else "#F59E0B",
            "error_color": theme.error_color if theme else "#EF4444",
            "font_family": theme.font_family if theme else "Inter",
            "border_radius": theme.border_radius if theme else "16px"
        } if theme else {},
        "platform": {
            "invite_only": platform.invite_only if platform else False,
            "enable_email_login": platform.enable_email_login if platform else True,
            "enable_google_login": platform.enable_google_login if platform else False,
            "enable_otp_login": platform.enable_otp_login if platform else False,
            "enable_magic_link": platform.enable_magic_link if platform else False
        } if platform else {},
        "navigation": [
            {
                "id": item.id,
                "label": item.label,
                "route": item.route,
                "icon": item.icon,
                "order": item.order,
                "is_visible": item.is_visible
            } for item in nav_items
        ],
        "features": {
            f.name: {
                "display_name": f.display_name,
                "is_enabled": f.is_enabled
            } for f in features
        },
        "pages": [
            {
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "subtitle": p.subtitle
            } for p in pages
        ],
        "admin_landing": {
            "title": "Platform Controller",
            "description": "Welcome to the centralized management console. Control infrastructure, oversee tenants, and monitor global usage in real-time.",
            "features": [
                {
                    "icon": "Server",
                    "title": "Infrastructure Control",
                    "description": "Manage global AI model deployments, API keys, and system resources from a central hub."
                },
                {
                    "icon": "Users",
                    "title": "Tenant Management",
                    "description": "Oversee all platform workspaces, monitor usage, and configure tenant-specific limits."
                },
                {
                    "icon": "CreditCard",
                    "title": "Billing & Plans",
                    "description": "Configure subscription tiers, handle payments, and review global platform revenue."
                },
                {
                    "icon": "Activity",
                    "title": "Audit & Compliance",
                    "description": "Track system health, review detailed audit logs, and enforce security policies."
                }
            ]
        }
    }

# UPDATE BRANDING (Super Admin Only)
@router.patch("/branding", dependencies=[super_admin_only])
def update_branding(payload: Dict[str, Any], db: Session = Depends(get_db)):
    branding = db.query(BrandingSettings).filter(BrandingSettings.tenant_id == None).first()
    if not branding:
        branding = BrandingSettings()
        db.add(branding)
    
    for key, value in payload.items():
        if hasattr(branding, key):
            setattr(branding, key, value)
            
    db.commit()
    db.refresh(branding)
    return {"message": "Branding settings updated successfully", "branding": branding}

# UPDATE THEME (Super Admin Only)
@router.patch("/theme", dependencies=[super_admin_only])
def update_theme(payload: Dict[str, Any], db: Session = Depends(get_db)):
    theme = db.query(ThemeSettings).filter(ThemeSettings.tenant_id == None).first()
    if not theme:
        theme = ThemeSettings()
        db.add(theme)
        
    for key, value in payload.items():
        if hasattr(theme, key):
            setattr(theme, key, value)
            
    db.commit()
    db.refresh(theme)
    return {"message": "Theme settings updated successfully", "theme": theme}

# GET & UPDATE PLATFORM BUILDER CONFIG (Super Admin authenticated detailed payload)
@router.get("/config", dependencies=[super_admin_only])
def get_detailed_config(db: Session = Depends(get_db)):
    branding = db.query(BrandingSettings).filter(BrandingSettings.tenant_id == None).first()
    theme = db.query(ThemeSettings).filter(ThemeSettings.tenant_id == None).first()
    platform = db.query(PlatformSettings).filter(PlatformSettings.tenant_id == None).first()
    nav_items = db.query(NavigationItem).filter(NavigationItem.tenant_id == None).order_by(NavigationItem.order.asc()).all()
    features = db.query(FeatureFlag).filter(FeatureFlag.tenant_id == None).all()
    pages = db.query(WebsitePage).filter(WebsitePage.tenant_id == None).order_by(WebsitePage.order.asc()).all()
    email_templates = db.query(EmailTemplate).filter(EmailTemplate.tenant_id == None).all()
    forms = db.query(CustomForm).filter(CustomForm.tenant_id == None).all()
    media = db.query(MediaLibrary).filter(MediaLibrary.tenant_id == None).all()
    tenants = db.query(Tenant).all()
    widgets = db.query(DashboardWidget).filter(DashboardWidget.tenant_id == None).all()

    return {
        "branding": branding,
        "theme": theme,
        "platform": platform,
        "navigation": nav_items,
        "features": features,
        "pages": pages,
        "email_templates": email_templates,
        "forms": forms,
        "media": media,
        "widgets": widgets,
        "tenants": [{"id": t.id, "name": t.tenant_name, "slug": t.slug} for t in tenants]
    }

# POST PAGE (Super Admin)
@router.post("/pages", dependencies=[super_admin_only])
def create_page(payload: Dict[str, Any], db: Session = Depends(get_db)):
    page = WebsitePage(
        slug=payload.get("slug"),
        title=payload.get("title"),
        subtitle=payload.get("subtitle", ""),
        is_active=payload.get("is_active", True)
    )
    db.add(page)
    db.commit()
    db.refresh(page)
    return page

# UPDATE PAGE (Super Admin)
@router.patch("/pages/{page_id}", dependencies=[super_admin_only])
def update_page(page_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    page = db.query(WebsitePage).filter(WebsitePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    for k, v in payload.items():
        if hasattr(page, k):
            setattr(page, k, v)
    db.commit()
    return page

# DELETE PAGE (Super Admin)
@router.delete("/pages/{page_id}", dependencies=[super_admin_only])
def delete_page(page_id: str, db: Session = Depends(get_db)):
    page = db.query(WebsitePage).filter(WebsitePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    db.delete(page)
    db.commit()
    return {"message": "Page deleted"}

# NAVIGATION CRUD (Super Admin)
@router.post("/navigation", dependencies=[super_admin_only])
def create_nav_item(payload: Dict[str, Any], db: Session = Depends(get_db)):
    item = NavigationItem(
        label=payload.get("label"),
        route=payload.get("route"),
        icon=payload.get("icon", ""),
        order=payload.get("order", 0),
        is_visible=payload.get("is_visible", True)
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/navigation/{item_id}", dependencies=[super_admin_only])
def delete_nav_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(NavigationItem).filter(NavigationItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    db.delete(item)
    db.commit()
    return {"message": "Navigation item deleted"}

# FEATURE FLAG UPDATE (Super Admin)
@router.patch("/features/{feature_id}", dependencies=[super_admin_only])
def update_feature_flag(feature_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    flag = db.query(FeatureFlag).filter(FeatureFlag.id == feature_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    for k, v in payload.items():
        if hasattr(flag, k):
            setattr(flag, k, v)
    db.commit()
    return flag

# FORMS CRUD
@router.post("/forms", dependencies=[super_admin_only])
def create_form(payload: Dict[str, Any], db: Session = Depends(get_db)):
    form = CustomForm(
        form_name=payload.get("form_name"),
        fields_json=json.dumps(payload.get("fields", []))
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form

@router.delete("/forms/{form_id}", dependencies=[super_admin_only])
def delete_form(form_id: str, db: Session = Depends(get_db)):
    form = db.query(CustomForm).filter(CustomForm.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    db.delete(form)
    db.commit()
    return {"message": "Form deleted"}

# MEDIA CRUD
@router.post("/media", dependencies=[super_admin_only])
async def upload_media(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Standard local file save mock for Media Library
    file_name = file.filename
    file_type = file.content_type.split("/")[0] if file.content_type else "document"
    
    # Save URL prefix
    file_url = f"/uploads/{file_name}"
    
    media = MediaLibrary(
        file_name=file_name,
        file_url=file_url,
        file_size=0, # placeholder
        file_type=file_type
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media

@router.delete("/media/{media_id}", dependencies=[super_admin_only])
def delete_media(media_id: str, db: Session = Depends(get_db)):
    media = db.query(MediaLibrary).filter(MediaLibrary.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    db.delete(media)
    db.commit()
    return {"message": "Media deleted"}

# PLATFORM SETTINGS (Auth, CSS, JS, etc.)
@router.patch("/settings", dependencies=[super_admin_only])
def update_platform_settings(payload: Dict[str, Any], db: Session = Depends(get_db)):
    settings = db.query(PlatformSettings).filter(PlatformSettings.tenant_id == None).first()
    if not settings:
        settings = PlatformSettings()
        db.add(settings)
    for k, v in payload.items():
        if hasattr(settings, k):
            setattr(settings, k, v)
    db.commit()
    db.refresh(settings)
    return {"message": "Platform settings updated", "settings": settings}

# EMAIL TEMPLATES
@router.post("/email-templates", dependencies=[super_admin_only])
def create_email_template(payload: Dict[str, Any], db: Session = Depends(get_db)):
    template = EmailTemplate(
        template_type=payload.get("template_type"),
        subject=payload.get("subject"),
        body_html=payload.get("body_html"),
        body_text=payload.get("body_text", "")
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.patch("/email-templates/{template_id}", dependencies=[super_admin_only])
def update_email_template(template_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    template = db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    for k, v in payload.items():
        if hasattr(template, k):
            setattr(template, k, v)
    db.commit()
    db.refresh(template)
    return template

# WIDGETS
@router.post("/widgets", dependencies=[super_admin_only])
def create_widget(payload: Dict[str, Any], db: Session = Depends(get_db)):
    widget = DashboardWidget(
        widget_type=payload.get("widget_type"),
        title=payload.get("title"),
        config_json=payload.get("config_json", ""),
        order=payload.get("order", 0),
        is_visible=payload.get("is_visible", True)
    )
    db.add(widget)
    db.commit()
    db.refresh(widget)
    return widget

@router.patch("/widgets/{widget_id}", dependencies=[super_admin_only])
def update_widget(widget_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    widget = db.query(DashboardWidget).filter(DashboardWidget.id == widget_id).first()
    if not widget:
        raise HTTPException(status_code=404, detail="Widget not found")
    for k, v in payload.items():
        if hasattr(widget, k):
            setattr(widget, k, v)
    db.commit()
    db.refresh(widget)
    return widget

@router.delete("/widgets/{widget_id}", dependencies=[super_admin_only])
def delete_widget(widget_id: str, db: Session = Depends(get_db)):
    widget = db.query(DashboardWidget).filter(DashboardWidget.id == widget_id).first()
    if not widget:
        raise HTTPException(status_code=404, detail="Widget not found")
    db.delete(widget)
    db.commit()
    return {"message": "Widget deleted"}

# PAGE SECTIONS
@router.post("/sections", dependencies=[super_admin_only])
def create_section(payload: Dict[str, Any], db: Session = Depends(get_db)):
    section = WebsiteSection(
        page_id=payload.get("page_id"),
        section_type=payload.get("section_type"),
        title=payload.get("title", ""),
        subtitle=payload.get("subtitle", ""),
        content=payload.get("content", ""),
        image_url=payload.get("image_url", ""),
        video_url=payload.get("video_url", ""),
        button_text=payload.get("button_text", ""),
        button_link=payload.get("button_link", ""),
        metadata_json=payload.get("metadata_json", ""),
        order=payload.get("order", 0),
        is_active=payload.get("is_active", True)
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section

@router.patch("/sections/{section_id}", dependencies=[super_admin_only])
def update_section(section_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    section = db.query(WebsiteSection).filter(WebsiteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    for k, v in payload.items():
        if hasattr(section, k):
            setattr(section, k, v)
    db.commit()
    db.refresh(section)
    return section

@router.delete("/sections/{section_id}", dependencies=[super_admin_only])
def delete_section(section_id: str, db: Session = Depends(get_db)):
    section = db.query(WebsiteSection).filter(WebsiteSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"message": "Section deleted"}

# TENANT BRANDING
@router.post("/tenant-branding", dependencies=[super_admin_only])
def create_tenant_branding(payload: Dict[str, Any], db: Session = Depends(get_db)):
    branding = TenantBranding(
        tenant_id=payload.get("tenant_id"),
        custom_domain=payload.get("custom_domain"),
        branding_id=payload.get("branding_id"),
        theme_id=payload.get("theme_id")
    )
    db.add(branding)
    db.commit()
    db.refresh(branding)
    return branding

@router.patch("/tenant-branding/{tenant_id}", dependencies=[super_admin_only])
def update_tenant_branding(tenant_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    branding = db.query(TenantBranding).filter(TenantBranding.tenant_id == tenant_id).first()
    if not branding:
        branding = TenantBranding(tenant_id=tenant_id)
        db.add(branding)
    for k, v in payload.items():
        if hasattr(branding, k):
            setattr(branding, k, v)
    db.commit()
    db.refresh(branding)
    return branding

