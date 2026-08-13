from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Union, Any
from datetime import datetime

import uuid

# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user_id: Union[uuid.UUID, str]
    role: str
    tenant_slug: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None

class TokenRefreshRequest(BaseModel):
    refresh_token: str

# SubscriptionPlan Schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    price: float
    # Legacy limits
    transcription_limit: int
    translation_limit: int
    tts_limit: int
    storage_limit: int
    features: Optional[List[str]] = None
    active: Optional[bool] = True
    # ── Per-Tool Granular Limits ──────────────────
    # 🗣️ Text to Voice
    tts_file_limit: Optional[int] = 10
    tts_char_limit: Optional[int] = 10000
    # 🎵 Audio to Text
    audio_file_limit: Optional[int] = 5
    audio_minutes_limit: Optional[int] = 30
    # 🎤 Voice to Text
    voice_session_limit: Optional[int] = 10
    voice_minutes_limit: Optional[int] = 30
    # 📄 Translation
    translation_text_limit: Optional[int] = 20
    translation_char_limit: Optional[int] = 50000
    # ─────────────────────────────────────────────

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    # Legacy limits
    transcription_limit: Optional[int] = None
    translation_limit: Optional[int] = None
    tts_limit: Optional[int] = None
    storage_limit: Optional[int] = None
    features: Optional[List[str]] = None
    active: Optional[bool] = None
    # ── Per-Tool Granular Limits ──────────────────
    # 🗣️ Text to Voice
    tts_file_limit: Optional[int] = None
    tts_char_limit: Optional[int] = None
    # 🎵 Audio to Text
    audio_file_limit: Optional[int] = None
    audio_minutes_limit: Optional[int] = None
    # 🎤 Voice to Text
    voice_session_limit: Optional[int] = None
    voice_minutes_limit: Optional[int] = None
    # 📄 Translation
    translation_text_limit: Optional[int] = None
    translation_char_limit: Optional[int] = None
    # ─────────────────────────────────────────────

class SubscriptionPlanResponse(SubscriptionPlanBase):
    id: Any
    created_at: datetime
    features: Optional[List[str]] = None

    class Config:
        from_attributes = True


# Tenant Schemas
class TenantBase(BaseModel):
    tenant_name: str
    slug: str

class TenantCreate(TenantBase):
    plan_id: Optional[str] = None

class TenantUpdate(BaseModel):
    tenant_name: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[str] = None  # active, suspended, deleted
    plan_id: Optional[str] = None

class TenantResponse(TenantBase):
    id: uuid.UUID
    status: str
    plan_id: Optional[uuid.UUID] = None
    created_at: datetime
    plan: Optional[SubscriptionPlanResponse] = None

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    tenant_slug: Optional[str] = None  # Slug when signing up for a workspace

class TenantUserCreateByAdmin(UserBase):
    password: str
    role: str = "user"  # tenant_admin, manager, user

class SuperAdminCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    status: Optional[str] = None

class UserResponse(UserBase):
    id: uuid.UUID
    tenant_id: Optional[uuid.UUID] = None
    role: str
    status: str
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Tenant Registration Bundle
class TenantRegistration(BaseModel):
    tenant_name: str
    slug: str
    admin_name: str
    admin_email: EmailStr
    admin_password: str
    plan_id: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    credential: str

class GoogleTenantRegistration(BaseModel):
    tenant_name: str
    slug: str
    credential: str
    plan_id: Optional[str] = None

# Usage Tracking Schemas
class UsageResponse(BaseModel):
    audio_minutes_used: float
    translation_chars_used: int
    tts_chars_used: int
    api_calls_used: int
    storage_bytes_used: int
    billing_period_start: datetime
    billing_period_end: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Provider Config Schemas
class ProviderConfigBase(BaseModel):
    provider_name: str
    is_enabled: bool = True
    priority: int = 1
    config_json: Optional[str] = None

class ProviderConfigCreate(ProviderConfigBase):
    api_key: Optional[str] = None

class ProviderConfigResponse(ProviderConfigBase):
    id: uuid.UUID
    tenant_id: Optional[uuid.UUID]
    credentials_encrypted: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

# Business data history log response
class TranslationResponse(BaseModel):
    id: uuid.UUID
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    provider: str
    created_at: datetime

    class Config:
        from_attributes = True

class TranscriptionResponse(BaseModel):
    id: uuid.UUID
    file_name: str
    file_size: int
    duration_seconds: float
    transcript_text: str
    provider: str
    created_at: datetime

    class Config:
        from_attributes = True

class TtsResponse(BaseModel):
    id: uuid.UUID
    text: str
    voice_name: str
    characters_count: int
    file_path: Optional[str]
    provider: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID]
    action: str
    details: Optional[str]
    ip_address: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

# Feature Provider Mapping Schemas
class FeatureProviderMappingBase(BaseModel):
    feature_name: str
    provider_name: str
    priority: int = 1
    is_enabled: bool = True

class FeatureProviderMappingCreate(FeatureProviderMappingBase):
    pass

class FeatureProviderMappingResponse(FeatureProviderMappingBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FeatureProviderBulkUpdate(BaseModel):
    mappings: List[FeatureProviderMappingBase]

# Document Intelligence Schemas
class DocumentIntelligenceBase(BaseModel):
    filename: str
    filepath: str
    filetype: Optional[str] = None
    filesize: int = 0
    page_count: int = 1
    word_count: int = 0
    character_count: int = 0
    extracted_text: Optional[str] = None
    translated_text: Optional[str] = None
    summary: Optional[str] = None

class DocumentIntelligenceResponse(DocumentIntelligenceBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentTranslateRequest(BaseModel):
    target_language: str

class DocumentSummarizeRequest(BaseModel):
    pass # No params needed right now, generates structured summary.

class EmailLogResponse(BaseModel):
    id: uuid.UUID
    tenant_id: Optional[uuid.UUID]
    recipient: str
    subject: str
    status: str
    error_message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class SMTPSettingsBase(BaseModel):
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = 587
    smtp_username: Optional[str] = None
    from_email: Optional[str] = None
    reply_to_email: Optional[str] = None
    from_name: Optional[str] = None
    encryption_type: Optional[str] = "TLS"
    connection_timeout: Optional[int] = 10
    enable_authentication: Optional[bool] = True
    is_enabled: Optional[bool] = True

class SMTPSettingsResponse(SMTPSettingsBase):
    id: uuid.UUID
    tenant_id: Optional[uuid.UUID] = None
    has_password: bool = False
    
    class Config:
        from_attributes = True

class SMTPSettingsUpdate(SMTPSettingsBase):
    smtp_password: Optional[str] = None

class SMTPTestEmailRequest(BaseModel):
    to_email: str
