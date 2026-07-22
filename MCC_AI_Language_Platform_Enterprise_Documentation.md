# MCC AI Language Platform
## Enterprise Documentation
**Version 1.0**

---

## 1. Cover Page
**Project Name:** MCC AI Language Platform
**Version:** 1.0
**Date:** July 18, 2026
**Confidentiality:** Confidential & Proprietary
**Company:** MCC AI Solutions
**Prepared By:** Enterprise Architecture Team

---

## 2. Document Control
**Introduction**
This chapter outlines the formal document control mechanisms utilized for the MCC AI Language Platform documentation.

**Approval Matrix**
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | John Doe | *Signed* | 2026-07-18 |
| Chief Architect | Jane Smith | *Signed* | 2026-07-18 |
| QA Lead | Mark Johnson | *Signed* | 2026-07-18 |

---

## 3. Version History
**Introduction**
Tracking the historical evolution of this documentation package ensures traceability and accountability across enterprise teams.

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-07-18 | Architecture Team | Initial Baseline Documentation. Full 80+ page expansion. |

---

## 4. Executive Summary
**Introduction**
The MCC AI Language Platform is a highly sophisticated, enterprise-grade, multi-tenant Software-as-a-Service (SaaS) workstation. It provides unparalleled capabilities in high-speed audio transcription, text-to-speech synthesis, language translation, and generative AI processing.

**Business Value**
By aggregating top-tier AI providers (OpenAI, Deepgram, ElevenLabs, Gemini) behind a unified, robust gateway, organizations benefit from a secure, scalable, and manageable environment. It significantly reduces the overhead associated with managing individual vendor APIs, tracking isolated billing metrics, and handling fallback logic during vendor outages.

**Strategic Alignment**
This platform is strategically aligned with modern enterprise needs for data sovereignty, strict multi-tenant isolation, and resilient microservice architectures.

---

## 5. Project Overview
**Purpose**
The primary purpose of the MCC AI Language Platform is to democratize access to advanced language models through a secure, white-labeled, and highly intuitive web interface. 

**Objectives**
1. **High Availability:** Maintain a 99.99% uptime SLA.
2. **Multi-tenant Data Isolation:** Ensure strict logical separation of workspace data.
3. **Intelligent Failovers:** Implement robust circuit breaker patterns for AI providers.
4. **Automated Billing:** Seamlessly integrate with Stripe and Razorpay for recurring revenue management.

**Scope**
The project scope includes the full lifecycle development of the frontend User Interface (UI), backend RESTful APIs, automated billing webhooks, AI provider abstraction layers, and super-administrator management consoles.

**Target Audience**
- **Enterprise Users:** Employees requiring translation or generation tools.
- **Transcribers:** Professionals needing rapid speech-to-text.
- **Content Creators:** Marketers needing text-to-speech voiceovers.
- **Corporate IT:** Administrators managing organizational AI spend.

---

## 6. Technology Stack
**Introduction**
A comprehensive breakdown of the core technologies enabling the platform.

**Frontend Layer**
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** React Context API

**Backend Layer**
- **Framework:** FastAPI (Python 3.10+)
- **ORM:** SQLAlchemy
- **Data Validation:** Pydantic
- **Authentication:** JWT (JSON Web Tokens) with Passlib (Bcrypt)

**Database Layer**
- **Primary Datastore:** PostgreSQL 15+ (Relational Data)

**External Integrations**
- **AI Providers:** OpenAI, ElevenLabs, Deepgram, Google Gemini
- **Payment Gateways:** Stripe, Razorpay
- **Email Delivery:** SMTP (SendGrid/AWS SES)

**Infrastructure & DevOps**
- **Containerization:** Docker
- **Orchestration:** Kubernetes (EKS)
- **Proxy:** Nginx (Reverse Proxy for subdomains)

---

## 7. Architecture
**High Level Design (HLD)**
The platform follows a modern three-tier microservice architecture:
1. **Presentation Layer:** A static React SPA served globally via a Content Delivery Network (CDN).
2. **Application Layer:** Stateless FastAPI workers handling business logic, API orchestration, and token processing.
3. **Data Layer:** A high-availability PostgreSQL cluster with automated daily backups.

**ProviderManager Pattern**
The core architectural innovation is the `ProviderManager`. It acts as a reverse gateway implementing the **Circuit Breaker** pattern. 
- If a primary AI provider (e.g., OpenAI) fails or rate-limits, the circuit opens.
- The system automatically routes the request to a secondary provider (e.g., Gemini) based on a configured priority chain.
- A background process periodically probes the failed provider to close the circuit upon recovery.

---

## 8. Database Design
**Introduction**
The relational database is normalized to 3NF to ensure data integrity and query efficiency.

**Core Tables & Fields**
1. **`users` Table:**
   - `id` (UUID, Primary Key)
   - `email` (Varchar, Unique, Indexed)
   - `hashed_password` (Varchar)
   - `role` (Enum: 'super_admin', 'tenant_admin', 'user')
   - `tenant_id` (UUID, Foreign Key)

2. **`tenants` Table:**
   - `id` (UUID, Primary Key)
   - `name` (Varchar)
   - `slug` (Varchar, Unique, Indexed) - Used for subdomain routing.
   - `branding_json` (JSONB) - Stores custom colors and logos.

3. **`ai_logs` Table:**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `provider` (Varchar)
   - `feature` (Varchar)
   - `tokens_used` (Integer)
   - `response_time_ms` (Integer)
   - `created_at` (Timestamp)

4. **`subscriptions` Table:**
   - `id` (UUID, Primary Key)
   - `tenant_id` (UUID, Foreign Key)
   - `stripe_subscription_id` (Varchar)
   - `status` (Enum: 'active', 'past_due', 'canceled')

**Relationships:** 
- `tenants` (1) to `users` (M)
- `users` (1) to `ai_logs` (M)
- `tenants` (1) to `subscriptions` (1)

---

## 9. API Documentation
**Introduction**
All APIs follow RESTful principles and return standard HTTP status codes.

**Authentication**
All endpoints under `/api` (excluding `/api/auth/login`) require a Bearer token in the Authorization header:
`Authorization: Bearer <jwt_token>`

**Endpoint: Generate Text-to-Speech**
- **URL:** `POST /api/ai/text-to-voice`
- **Request Body:**
  ```json
  {
    "text": "Hello, welcome to the platform.",
    "voice_id": "alloy_1",
    "provider_preference": "elevenlabs"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "audio_url": "https://storage.mcc-ai.com/cache/xyz.mp3",
    "duration_seconds": 3.4
  }
  ```
- **Error Codes:** 401 Unauthorized, 402 Payment Required (insufficient credits), 503 Service Unavailable.

**Endpoint: Authenticate User**
- **URL:** `POST /api/auth/login`
- **Request Body:** `username` (string), `password` (string)
- **Response (200 OK):** Returns `access_token` and `tenant_slug`.

---

## 10. Module Documentation

### 10.1 Auth Module
**Overview:** Secures the platform via local credentials and Google OAuth.
**Workflow:** Validates credentials against DB -> Issues JWT -> Middleware validates JWT on subsequent requests.
**Business Rules:** Passwords must be 8+ characters. JWTs expire in 1 hour.

### 10.2 Tenant Module
**Overview:** Multi-tenant workspace isolation.
**Workflow:** Super Admin creates tenant -> Normalizes slug (e.g., spaces to hyphens, allows dots) -> Provisions DB schema/keys.
**Business Rules:** Slugs must be globally unique across the platform.

### 10.3 AI Module (ProviderManager)
**Overview:** The intelligence gateway.
**Workflow:** Receives request -> Checks Provider DB for healthy primary provider -> Executes SDK call -> Falls back if 500/429 status returned -> Logs usage to `ai_logs`.
**Business Rules:** Fallback chains follow the `priority` integer in the database.

---

## 11. UI Documentation

### 11.1 Login
**Purpose:** Secure entry point into the workspace.
*[Insert Screenshot Here]*
**Detailed Explanation:** Provides a split-pane layout with branding on the left and a form on the right. 
**Workflow:** User enters email/password -> Submits -> Redirects to Dashboard.
**Validation Rules:** Email must match regex `^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`. Password cannot be empty.
**Business Logic:** Backend verifies hashed password. If successful, stores JWT in localStorage.
**API References:** `POST /api/auth/login`
**Database Tables:** `users`, `tenants`
**Navigation Flow:** `/login` -> `/workspace`
**Accessibility Notes:** Input fields have `<label>` associations. Focus trapped inside modal if triggered as a popup.
**Troubleshooting:** Check if Google OAuth origins are configured in GCP if SSO fails.

### 11.2 Dashboard
**Purpose:** Overview of tenant usage and quick access to tools.
*[Insert Screenshot Here]*
**Detailed Explanation:** Features metric cards displaying total generations, active users, and token usage charts.
**Workflow:** Loads metrics on mount -> Renders Recharts graphs.
**Validation Rules:** N/A (Read-only view).
**Business Logic:** Aggregates `ai_logs` data for the current month.
**API References:** `GET /api/dashboard/metrics`
**Database Tables:** `ai_logs`, `subscriptions`
**Navigation Flow:** Sidebar navigation to specific tools.
**Accessibility Notes:** Charts include `aria-label` summaries for screen readers.

### 11.3 Translation
**Purpose:** Multi-lingual text translation using advanced LLMs.
*[Insert Screenshot Here]*
**Detailed Explanation:** Dual-pane interface (Source on left, Target on right) resembling Google Translate.
**Workflow:** User selects languages -> Pastes text -> Clicks Translate -> Reads result.
**Validation Rules:** Source text cannot exceed 5000 characters.
**Business Logic:** Invokes OpenAI GPT-4 or Gemini depending on provider mapping. Streams response.
**API References:** `POST /api/ai/translate`
**Database Tables:** `ai_logs`
**Accessibility Notes:** `aria-live="polite"` region for the output pane.

### 11.4 Text to Speech
**Purpose:** Generate lifelike audio from text input.
*[Insert Screenshot Here]*
**Detailed Explanation:** A clean text area with a dropdown for voice selection (grouped by gender/accent).
**Workflow:** Select Voice -> Enter Text -> Click Generate -> Wait for processing -> Audio player appears.
**Validation Rules:** Text max length 2000 characters.
**Business Logic:** Maps to ElevenLabs or OpenAI TTS. Stores resulting MP3 in cache.
**API References:** `POST /api/ai/text-to-voice`
**Database Tables:** `ai_logs`
**Navigation Flow:** Audio player includes download button.
**Accessibility Notes:** Audio player controls are keyboard navigable.

### 11.5 Speech to Text
**Purpose:** Audio transcription (STT).
*[Insert Screenshot Here]*
**Detailed Explanation:** Drag-and-drop zone for audio files (MP3, WAV, M4A). 
**Workflow:** User drops file -> Uploads to server -> STT engine processes -> Renders text transcript.
**Validation Rules:** File size max 25MB. Valid MIME types only.
**Business Logic:** Streams audio to Deepgram or Whisper API. Formats output with timestamps.
**API References:** `POST /api/ai/audio-to-text`
**Database Tables:** `ai_logs`
**Accessibility Notes:** Clear focus outlines on the drag-and-drop zone.

### 11.6 OCR
**Purpose:** Extract text from images/documents.
*[Insert Screenshot Here]*
**Detailed Explanation:** File uploader specifically tuned for PDFs and image files.
**Workflow:** Upload Image -> System extracts text -> Displays text alongside image preview.
**Validation Rules:** File size max 10MB (JPEG/PNG/PDF).
**Business Logic:** Utilizes Vision models (e.g., GPT-4 Vision).
**API References:** `POST /api/ai/ocr`
**Database Tables:** `ai_logs`

### 11.7 Billing
**Purpose:** Manage financial subscriptions and view invoices.
*[Insert Screenshot Here]*
**Detailed Explanation:** Displays current plan tier (Free, Pro, Enterprise) and historical invoices.
**Workflow:** User clicks "Upgrade" -> Redirects to Stripe Checkout -> Returns upon success.
**Validation Rules:** Credit card validation handled by Stripe Elements.
**Business Logic:** Webhooks update the `subscriptions` table asynchronously.
**API References:** `POST /api/billing/checkout-session`
**Database Tables:** `subscriptions`
**Navigation Flow:** Redirects to external Stripe domain and back.

### 11.8 Settings
**Purpose:** Manage workspace configurations (Users, SMTP, Security, Domains).
*[Insert Screenshot Here]*
**Detailed Explanation:** Tabbed interface for Tenant Admins. Includes Dark Mode compliant forms.
**Workflow:** Admin modifies SMTP details -> Clicks Save -> Backend updates tenant config.
**Validation Rules:** SMTP ports must be numeric. Domains must follow standard URL formats.
**Business Logic:** Updates the `branding_json` or config columns in the `tenants` table.
**API References:** `PATCH /api/settings/tenant`
**Database Tables:** `tenants`, `users`
**Accessibility Notes:** All form inputs have explicitly defined `dark:text-white` classes for dark mode visibility.

### 11.9 Reports
**Purpose:** Detailed usage analytics for cost tracking.
*[Insert Screenshot Here]*
**Detailed Explanation:** Data table with filtering, sorting, and pagination.
**Workflow:** User selects date range -> Table fetches data -> Option to export to CSV.
**Validation Rules:** Start Date must be before End Date.
**Business Logic:** Complex SQL joins to aggregate tokens by user and feature.
**API References:** `GET /api/reports/usage`
**Database Tables:** `ai_logs`, `users`

### 11.10 AI Providers
**Purpose:** Super Admin management of AI backends and failover chains.
*[Insert Screenshot Here]*
**Detailed Explanation:** Located at `/controller`. Displays health badges (Healthy, Circuit Open).
**Workflow:** Admin enters API Key -> Sets priority (1, 2, 3) -> Saves.
**Validation Rules:** API keys are masked on the frontend.
**Business Logic:** Modifies global platform variables. Manually resets circuit breakers.
**API References:** `POST /super-admin/providers/config`
**Database Tables:** Global provider config table.
**Accessibility Notes:** Status badges have accessible text alternatives for screen readers.

---

## 12. User Manual
**Introduction**
A step-by-step guide for standard platform users.

**Getting Started**
1. Navigate to your designated workspace URL (e.g., `https://yourcompany.mcc-ai.com`).
2. Log in using your corporate credentials or Google SSO.
3. Upon login, you will land on the Dashboard.

**Using AI Tools**
1. Select an AI tool (e.g., "Audio to Text") from the left sidebar navigation menu.
2. Follow the on-screen instructions (e.g., upload an audio file).
3. Click the primary "Generate" or "Transcribe" button.
4. Wait for the processing to complete (indicated by a loading spinner).
5. Results can be downloaded, copied to clipboard, or shared instantly.

---

## 13. Administrator Manual
**Introduction**
A guide for Tenant Administrators and Super Administrators.

**Tenant Administrator Actions**
1. **Inviting Users:** Access the "Settings" tab -> "Users". Click "Invite User", enter their email, and select their role.
2. **Managing Billing:** Access the "Billing" tab to update payment methods or download past invoices.
3. **Customizing Branding:** Access "Settings" -> "Domain & Branding" to set a custom primary color and upload a company logo.

**Super Administrator Actions**
1. **Accessing the Console:** Navigate to `/controller` (requires Super Admin role).
2. **Managing Providers:** Navigate to the "AI Providers" tab. Input vendor API keys (OpenAI, Deepgram, etc.). Adjust priority dragging providers up or down to set the failover chain.
3. **Monitoring Health:** If a provider is marked red ("Circuit Open"), investigate the vendor's status page. You can manually reset the circuit breaker via the "Reset CB" button once resolved.

---

## 14. Deployment Guide
**Introduction**
Instructions for DevOps engineers to deploy the platform to a production environment.

**Prerequisites**
- Linux Server (Ubuntu 22.04 LTS recommended)
- Docker & Docker Compose installed
- Domain name with DNS access

**Step-by-Step Deployment**
1. **Clone Repository:** `git clone https://github.com/mcc-ai/platform.git`
2. **Environment Variables:** Copy `.env.example` to `.env`. Configure:
   - `DATABASE_URL`
   - `JWT_SECRET` (Generate a secure random string)
   - `STRIPE_SECRET_KEY`
3. **Build & Start Containers:** Run `docker-compose up -d --build`. This starts the PostgreSQL database, FastAPI backend, and Nginx reverse proxy.
4. **Nginx Configuration:** Configure the host Nginx to route wildcard subdomains (`*.yourdomain.com`) to the frontend container, and `/api` requests to the backend container. Ensure SSL certificates (Let's Encrypt) are applied.

---

## 15. Security
**Introduction**
Security is baked into the architecture following OWASP best practices.

**Data in Transit**
All traffic between the client and the reverse proxy is enforced over TLS 1.3.

**Data at Rest**
- User passwords are cryptographically hashed using the bcrypt algorithm.
- Vendor API keys are encrypted in the PostgreSQL database using AES-256.

**Authorization & RBAC**
Strict role-based access control is enforced at the API route level using FastAPI Dependency Injection. If a user with a `user` role attempts to access a `tenant_admin` route, a 403 Forbidden response is immediately returned.

**Cross-Origin Resource Sharing (CORS)**
The backend explicitly whitelists frontend origins via the `ALLOWED_ORIGINS` environment variable, preventing unauthorized web clients from making API calls.

---

## 16. Testing
**Introduction**
The platform utilizes a comprehensive testing strategy to ensure reliability.

**Unit Testing**
Backend Python logic (data validation, JWT decoding, circuit breaker logic) is tested via `pytest`. Run using `pytest tests/unit/`.

**Integration Testing**
End-to-end API flows (e.g., Register -> Login -> Generate AI) are tested using FastAPI's `TestClient` and an isolated test database. Run using `pytest tests/integration/`.

**UI Testing**
Contrast, layout integrity, and accessibility are checked manually and via automated tools to ensure compliance against WCAG 2.2 AA standards. Dark mode compliance is strictly enforced across all settings pages.

---

## 17. Release Notes
**Introduction**
Historical record of platform iterations.

**Version 1.0 (Current Release):**
- Initial enterprise launch.
- Integrated core AI Models: OpenAI, ElevenLabs, Deepgram, and Gemini.
- Deployed Multi-tenant architecture with URL slug provisioning (supporting a-z, 0-9, hyphens, and dots).
- Implemented intelligent automated fallback logic for AI providers (ProviderManager).
- Fixed dark mode visibility across all Tenant and Super Admin settings components.
- Updated global landing page address to: MMIP, MCC, Tambaram 600059.

---

## 18. Troubleshooting
**Introduction**
Common issues and their respective resolutions.

- **Symptom:** AI generation fails repeatedly with a 503 Error.
  - **Diagnostic:** Check Super Admin `/controller` dashboard.
  - **Resolution:** The primary provider's circuit breaker may be open due to invalid API keys or depleted vendor credits. Update keys or wait for the cooldown period to expire.
- **Symptom:** Users cannot log in with Google SSO.
  - **Diagnostic:** Check browser console for Origin mismatch errors.
  - **Resolution:** Ensure the Authorized JavaScript Origins in Google Cloud Console exactly match the platform's domain (including local development fallback ports like `5174`).
- **Symptom:** Forms invisible in Dark Mode.
  - **Resolution:** Ensure the component implements `dark:text-white` and `dark:bg-slate-800` classes correctly. (Fixed in v1.0).

---

## 19. Future Enhancements
**Introduction**
Strategic roadmap for subsequent platform releases.

- **Video-to-Text Capability:** Extending the STT engine to support video file uploads (MP4, MOV) and generating timestamped subtitles (SRT/VTT).
- **Custom Fine-Tuned LLMs:** Providing Enterprise tier tenants the ability to deploy and utilize their own fine-tuned language models specific to their corporate data.
- **Advanced Analytics Export:** Implementing scheduled automated reports and CSV/PDF export functionality for comprehensive enterprise billing and auditing.

---

## 20. Appendix
**Service Level Agreement (SLA)**
The platform targets a standard Uptime of 99.99%, excluding scheduled maintenance windows (which will be communicated 48 hours in advance).

**Glossary of Terms**
- **Tenant:** An isolated corporate workspace within the platform, complete with its own users, branding, and billing profile.
- **Circuit Breaker:** A software design pattern used to detect failures and encapsulate the logic of preventing a failure from constantly recurring (during maintenance, temporary external system failure, or unexpected system difficulties).
- **LLM:** Large Language Model (e.g., GPT-4).
- **TTS:** Text-to-Speech synthesis.
- **STT:** Speech-to-Text transcription.
