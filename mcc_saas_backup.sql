--
-- PostgreSQL database dump
--

\restrict WTb29TlhZIpUaaid0vylYmOEUFuMp2qLgKqIZ2nUDRMRZAbtHvWmVB60UNheKD0

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    user_id uuid,
    action character varying(100) NOT NULL,
    details text,
    ip_address character varying(45),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: billing_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    currency character varying(10) DEFAULT 'INR'::character varying,
    gst_percentage double precision DEFAULT 18.0,
    invoice_prefix character varying(20) DEFAULT 'INV'::character varying,
    invoice_footer text DEFAULT 'Thank you for choosing MCC AI!'::text,
    company_name character varying(100) DEFAULT 'MCC AI Corp'::character varying,
    company_address text,
    company_email character varying(100),
    stripe_enabled boolean DEFAULT true,
    stripe_public_key character varying(255),
    stripe_secret_key character varying(255),
    razorpay_enabled boolean DEFAULT true,
    razorpay_key_id character varying(255),
    razorpay_key_secret character varying(255),
    upi_enabled boolean DEFAULT true,
    upi_id character varying(255) DEFAULT 'mccai@upi'::character varying,
    default_gateway character varying(50) DEFAULT 'stripe'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.billing_settings OWNER TO postgres;

--
-- Name: branding_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branding_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    logo_url character varying(255),
    logo_size character varying(20) DEFAULT '32px'::character varying,
    logo_position character varying(20) DEFAULT 'left'::character varying,
    favicon_url character varying(255),
    app_icon_url character varying(255),
    platform_name character varying(100) DEFAULT 'MCC AI'::character varying,
    tagline character varying(200) DEFAULT 'Language Platform'::character varying,
    footer_text character varying(200) DEFAULT 'Powering Next-Gen Language AI'::character varying,
    copyright_text character varying(200) DEFAULT '© 2026 MCC AI. All rights reserved.'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branding_settings OWNER TO postgres;

--
-- Name: custom_forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_forms (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    form_name character varying(100) NOT NULL,
    fields_json text NOT NULL,
    submit_endpoint character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.custom_forms OWNER TO postgres;

--
-- Name: dashboard_widgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dashboard_widgets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    widget_type character varying(50) NOT NULL,
    title character varying(100) NOT NULL,
    config_json text,
    "order" integer DEFAULT 0,
    is_visible boolean DEFAULT true
);


ALTER TABLE public.dashboard_widgets OWNER TO postgres;

--
-- Name: document_intelligence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_intelligence (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    filename character varying(255) NOT NULL,
    filepath character varying(512) NOT NULL,
    filetype character varying(50),
    filesize integer,
    page_count integer,
    word_count integer,
    character_count integer,
    extracted_text text,
    translated_text text,
    summary text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.document_intelligence OWNER TO postgres;

--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_logs (
    id uuid NOT NULL,
    tenant_id uuid,
    recipient character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    error_message text,
    created_at timestamp without time zone
);


ALTER TABLE public.email_logs OWNER TO postgres;

--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    template_type character varying(50) NOT NULL,
    subject character varying(255) NOT NULL,
    body_html text NOT NULL,
    body_text text,
    from_email character varying(255),
    reply_to character varying(255),
    is_enabled boolean DEFAULT true,
    updated_at timestamp without time zone
);


ALTER TABLE public.email_templates OWNER TO postgres;

--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_flags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    name character varying(100) NOT NULL,
    display_name character varying(100) NOT NULL,
    is_enabled boolean DEFAULT true,
    restricted_plans character varying(255) DEFAULT ''::character varying
);


ALTER TABLE public.feature_flags OWNER TO postgres;

--
-- Name: feature_provider_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_provider_mapping (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    feature_name character varying(100) NOT NULL,
    provider_name character varying(50) NOT NULL,
    priority integer DEFAULT 1,
    is_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feature_provider_mapping OWNER TO postgres;

--
-- Name: invoice_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    invoice_id uuid NOT NULL,
    invoice_number character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    old_status character varying(20),
    new_status character varying(20) NOT NULL,
    amount double precision NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoice_history OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_number character varying(50) NOT NULL,
    tenant_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    amount double precision NOT NULL,
    tax_amount double precision DEFAULT 0.0,
    total_amount double precision NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    billing_period_start timestamp without time zone NOT NULL,
    billing_period_end timestamp without time zone NOT NULL,
    due_date timestamp without time zone NOT NULL,
    paid_at timestamp without time zone,
    pdf_path character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: media_library; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_library (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    file_name character varying(255) NOT NULL,
    file_url character varying(255) NOT NULL,
    file_size integer NOT NULL,
    file_type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_library OWNER TO postgres;

--
-- Name: navigation_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.navigation_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    parent_id uuid,
    label character varying(100) NOT NULL,
    route character varying(100) NOT NULL,
    icon character varying(50),
    "order" integer DEFAULT 0,
    is_visible boolean DEFAULT true,
    roles character varying(255) DEFAULT '*'::character varying
);


ALTER TABLE public.navigation_items OWNER TO postgres;

--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_id uuid,
    tenant_id uuid NOT NULL,
    gateway character varying(20) NOT NULL,
    event_type character varying(50),
    gateway_response text,
    status character varying(20) NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payment_transactions OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    tenant_id uuid NOT NULL,
    amount double precision NOT NULL,
    currency character varying(10) DEFAULT 'INR'::character varying,
    payment_method character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    transaction_id character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    invite_only boolean DEFAULT false,
    registration_approval boolean DEFAULT false,
    enable_email_login boolean DEFAULT true,
    enable_google_login boolean DEFAULT false,
    enable_microsoft_login boolean DEFAULT false,
    enable_otp_login boolean DEFAULT false,
    enable_magic_link boolean DEFAULT false,
    custom_css text,
    custom_js text,
    tracking_scripts text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    allowed_document_types character varying(255) DEFAULT '.doc,.docx,.xls,.xlsx'::character varying,
    allowed_document_extensions character varying(255) DEFAULT '.doc,.docx,.xls,.xlsx'::character varying
);


ALTER TABLE public.platform_settings OWNER TO postgres;

--
-- Name: provider_configurations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_configurations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    provider_name character varying(50) NOT NULL,
    is_enabled boolean DEFAULT true,
    credentials_encrypted text,
    priority integer DEFAULT 1,
    config_json text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    circuit_breaker_failures integer DEFAULT 0,
    circuit_breaker_opened_at timestamp without time zone
);


ALTER TABLE public.provider_configurations OWNER TO postgres;

--
-- Name: provider_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_logs (
    id character varying(36) NOT NULL,
    provider_name character varying(50) NOT NULL,
    feature character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    error_code character varying(10),
    error_message text,
    response_time_ms integer,
    retry_count integer,
    fallback_occurred boolean,
    tenant_id character varying(36),
    created_at timestamp without time zone
);


ALTER TABLE public.provider_logs OWNER TO postgres;

--
-- Name: smtp_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.smtp_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    smtp_host character varying(255),
    smtp_port integer DEFAULT 587,
    smtp_username character varying(255),
    smtp_password character varying(255),
    from_email character varying(255),
    reply_to_email character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    from_name character varying(255),
    encryption_type character varying(20) DEFAULT 'TLS'::character varying,
    connection_timeout integer DEFAULT 10,
    enable_authentication boolean DEFAULT true,
    is_enabled boolean DEFAULT true
);


ALTER TABLE public.smtp_settings OWNER TO postgres;

--
-- Name: subscription_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    action character varying(50) NOT NULL,
    price double precision NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscription_history OWNER TO postgres;

--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    price double precision DEFAULT 0.0 NOT NULL,
    transcription_limit integer DEFAULT 30 NOT NULL,
    translation_limit integer DEFAULT 50000 NOT NULL,
    tts_limit integer DEFAULT 10000 NOT NULL,
    storage_limit integer DEFAULT 100 NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    price double precision DEFAULT 0.0 NOT NULL,
    billing_cycle character varying(20) DEFAULT 'monthly'::character varying,
    start_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp without time zone NOT NULL,
    current_period_start timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    current_period_end timestamp without time zone NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: tenant_branding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_branding (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    custom_domain character varying(255),
    branding_id uuid,
    theme_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tenant_branding OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    plan_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: test_table2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_table2 (
    id character varying(36) NOT NULL
);


ALTER TABLE public.test_table2 OWNER TO postgres;

--
-- Name: theme_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.theme_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    mode character varying(20) DEFAULT 'dark'::character varying,
    primary_color character varying(20) DEFAULT '#2563EB'::character varying,
    secondary_color character varying(20) DEFAULT '#4F46E5'::character varying,
    accent_color character varying(20) DEFAULT '#06B6D4'::character varying,
    success_color character varying(20) DEFAULT '#10B981'::character varying,
    warning_color character varying(20) DEFAULT '#F59E0B'::character varying,
    error_color character varying(20) DEFAULT '#EF4444'::character varying,
    font_family character varying(100) DEFAULT 'Inter'::character varying,
    font_size character varying(20) DEFAULT '14px'::character varying,
    heading_styles text,
    border_radius character varying(20) DEFAULT '16px'::character varying,
    shadow_style character varying(50) DEFAULT 'normal'::character varying,
    card_style character varying(50) DEFAULT 'glassmorphism'::character varying,
    sidebar_width character varying(20) DEFAULT '256px'::character varying,
    navbar_height character varying(20) DEFAULT '64px'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.theme_settings OWNER TO postgres;

--
-- Name: transcription_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcription_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    file_name character varying(255) NOT NULL,
    file_size integer NOT NULL,
    duration_seconds double precision NOT NULL,
    transcript_text text NOT NULL,
    provider character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transcription_history OWNER TO postgres;

--
-- Name: translation_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translation_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    source_text text NOT NULL,
    translated_text text NOT NULL,
    source_lang character varying(50) NOT NULL,
    target_lang character varying(50) NOT NULL,
    provider character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.translation_history OWNER TO postgres;

--
-- Name: tts_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tts_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    text text NOT NULL,
    voice_name character varying(100) NOT NULL,
    characters_count integer NOT NULL,
    file_path character varying(255),
    provider character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tts_history OWNER TO postgres;

--
-- Name: usage_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_tracking (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid NOT NULL,
    audio_minutes_used double precision DEFAULT 0.0,
    translation_chars_used integer DEFAULT 0,
    tts_chars_used integer DEFAULT 0,
    api_calls_used integer DEFAULT 0,
    storage_bytes_used integer DEFAULT 0,
    billing_period_start timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    billing_period_end timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usage_tracking OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(30) DEFAULT 'user'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: website_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.website_pages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tenant_id uuid,
    slug character varying(100) NOT NULL,
    title character varying(150) NOT NULL,
    subtitle character varying(255),
    is_active boolean DEFAULT true,
    "order" integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.website_pages OWNER TO postgres;

--
-- Name: website_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.website_sections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page_id uuid NOT NULL,
    section_type character varying(50) NOT NULL,
    title character varying(150),
    subtitle character varying(255),
    content text,
    image_url character varying(255),
    video_url character varying(255),
    button_text character varying(50),
    button_link character varying(255),
    metadata_json text,
    "order" integer DEFAULT 0,
    is_active boolean DEFAULT true
);


ALTER TABLE public.website_sections OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, tenant_id, user_id, action, details, ip_address, "timestamp") FROM stdin;
0150677f-4db8-4691-b635-ad0d8d509a83	80ce2467-e021-461a-bb93-f60432583032	\N	automated_email	Email sent with subject: 'New Workspace Registered: ppp'.	\N	2026-06-24 18:17:07.097
04ac175f-cdb2-42b0-865d-52f84232e9f3	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 18:04:02.187
05046ade-ef8a-4be1-8b5b-b6588f5ef686	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Renewed Successfully - Professional'.	\N	2026-06-22 05:24:38.78
0708ecfe-ba95-43b6-88aa-4d15f1b800d1	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-25 09:01:39.013
0ab260a4-d593-4876-8240-34c33ec919e3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 04:09:32.04
0bcef876-c2c0-4c07-8b2a-c838e1bc32ba	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Professional activated. Invoice INV-2026-0006 paid via stripe.	\N	2026-06-22 04:55:03.07
10f10b83-f28f-4b34-962e-e1ab3064fbe1	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 05:37:55.073
111dffd1-8426-4ef5-a34a-169092b5f0b6	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 05:34:48.293
11207bd9-31c8-4d2c-903a-766eef95e9fa	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-19 08:34:10.473
118807dd-a699-4874-b8c7-3ec389f37216	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-26 05:01:16.183
11a5fdd8-d76a-49f4-b856-c2dfe4623cdd	771743ea-a1ad-47f3-9467-74f925fc2725	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-24 17:48:56.127
15a34870-c87c-4876-bb6f-f727b52eb42b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-20 07:32:30.037
15e7a435-a517-4045-b3d3-9bcc001d8eed	80ce2467-e021-461a-bb93-f60432583032	\N	automated_email	Email sent with subject: 'Welcome to MCC Free Plan!'.	\N	2026-06-24 18:17:01.073
1670916a-5b56-4289-b32e-eabea958da6d	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-17 10:17:34.627
17f32b8b-3676-4ae8-baf1-32a0f4081aee	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Free activated. Invoice INV-2026-0015 paid via stripe.	\N	2026-06-26 11:09:10.207
19984082-1b40-4bc4-abbe-e88d2d3c8468	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0005 paid via stripe.	\N	2026-06-22 04:46:30.763
1b5ddc0e-1fac-4fc6-b47d-c0811c31e1e6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 04:41:36.72
1bed397a-42a9-4639-b24a-6fb18bbc93ee	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	8bd1e61e-ad97-4531-8115-e7bc702bfe1c	login	User logged in successfully.	\N	2026-06-24 17:33:27.637
1c9814bd-6ae8-47e5-b2ad-b5992ee5ad19	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0001'.	\N	2026-06-19 08:50:50.803
1cea277c-6dff-4987-8ae4-45309c980ce2	771743ea-a1ad-47f3-9467-74f925fc2725	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	login	User logged in successfully.	\N	2026-06-24 17:47:45.617
1f6a48d4-e578-4fe6-bd20-65d3cf9b2d5b	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0011'.	\N	2026-06-22 12:20:17.92
1f6f22d4-ca1c-41e3-ac5a-286149898ba6	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 05:44:37.277
209097c2-c34e-4809-904e-eb39adedb962	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 10:43:48.363
24484b9e-a5c8-4c9e-ba01-6960b2592937	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0010'.	\N	2026-06-22 08:26:27.087
2516487b-7d59-4738-8c87-41c98eba9b8a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 19:27:11.057
267f43c3-3841-4f13-b024-67ce8bc0ef63	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 09:13:45.227
26a21675-b012-4b03-b187-40f63c4dc8f9	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 07:00:24.147
26bbc7c1-9fa8-41de-ae0d-2d166356e0bf	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Renewed Successfully - Starter'.	\N	2026-06-22 08:26:07.567
2d4c4dd9-36cc-4f37-80d5-0ecf5365f74c	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-22 06:16:10.493
2e433a38-836b-4f6a-91f0-6ea784182d4c	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-22 06:19:04.95
306ffaec-f9de-448f-a560-3f08d4dad957	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0011'.	\N	2026-06-22 12:19:41.343
3275dda2-56f0-46bb-95d9-45d417014c3a	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-22 12:19:57.307
32acf880-f8ee-46da-a525-882eb3e879fa	6e54121c-f05c-4e9c-89bb-ff251631d75a	\N	tenant_created	Tenant workspace 'Google' created with admin 'antorajan501@gmail.com'.	\N	2026-06-24 05:36:58.203
33ece009-cbea-4ae7-9868-71fb2c969f42	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0007'.	\N	2026-06-22 05:25:00.253
3552f66b-7ee0-4b51-8277-e1c263a7e598	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-22 10:06:09.367
35afa376-ee6f-438c-99ec-352c50257c3e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 04:31:22.21
35e453a7-d5c6-4c98-aefc-e36d052f9d45	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-18 10:05:12.51
3603772d-945b-461e-96a2-3751922970d3	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Workspace Registered: Tekq'.	\N	2026-06-24 18:06:27.78
36132597-b1c7-4782-9223-e21bcdb41ad8	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-20 07:10:58.73
3aeeac16-be92-46ac-8837-1f3265ecabe1	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0008'.	\N	2026-06-22 05:47:52.143
3aefd1e6-a856-49ef-aef0-c33c552ded67	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 05:16:51.55
3b2dadbe-b6aa-4cbb-b13a-4c6d50c62b29	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-22 08:27:09.16
3ceae7ce-36a5-434b-a75f-f444bd161500	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-23 07:49:51.1
3e9b9832-d52e-4799-9efa-530bf5f9ef6f	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0009'.	\N	2026-06-22 06:18:56.673
3f5dfbad-9b88-4830-ae89-f03f07d5a9ec	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 17:00:31.73
412253f6-c205-4d6b-a802-2ec2980be9df	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 16:36:18.547
427a4577-982b-480e-bc89-505ff750e3ef	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 05:21:48.203
43d3d437-d80b-4df4-b462-772be3f916b5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 10:05:26.6
442e40f0-3d52-4554-aad1-5e24eed9bbc6	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 08:25:18.08
443a79ec-48e6-4e07-8f38-56316dcd3ee9	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-22 04:46:30.34
458e69c4-9c61-49d5-8c7b-cf19c83f04db	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-26 05:05:20.86
497e53bb-9fe7-49c9-b74a-5262ca1132bd	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-22 06:16:10.463
4cc50abc-dedf-4011-b732-4ec8a4564b2b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 05:37:29.697
5002047c-f340-477a-8c6b-71c3a7e39d8b	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 08:34:24.75
5159ca1c-f86d-4b18-80e8-d80e59d54884	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-19 04:57:41.113
5524324e-b886-4a7f-9f51-fa760db2300b	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 09:00:33.983
55f6f1b4-3bcd-49f2-92b4-dfa122dda2e2	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0011 paid via stripe.	\N	2026-06-22 12:20:52.53
5df102c2-1c92-44e4-aeeb-7c5f5fb7f168	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 05:17:29.34
5e00712a-2193-4399-853c-067845ca43eb	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-19 05:08:08.01
5e84a5c5-c48c-4aab-ae10-e1c8b0f5c0af	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Free!'.	\N	2026-06-26 11:09:04.993
601e16f2-87d8-4542-a7fc-2f43faa990d6	771743ea-a1ad-47f3-9467-74f925fc2725	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	tenant_registration	Tenant 'MRF' registered with admin 'praveenrock2609@gmail.com'.	\N	2026-06-24 17:47:00.253
6393b54f-5766-45f5-b2a3-461b7ff57e1f	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 09:11:31.847
63e3c08a-ca03-4d4f-8b97-47baf8066215	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-22 05:25:01.28
64947cf1-928a-4491-9cd6-930b33f45e40	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0014'.	\N	2026-06-26 10:10:07.81
685b1bf5-0a88-463e-9a33-458b72e90c20	6e1bf4cd-639c-4112-8681-57fdf6a2793b	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-24 18:01:55.15
68fb91eb-801d-4bf3-9e5b-3f4a791c1824	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-19 10:10:01.37
6a804aa9-4e3b-4458-afb6-6b48233b7b0a	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Free!'.	\N	2026-06-19 09:35:35.053
6d6586e0-4788-41c8-b085-f7cf5bc9a576	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-26 11:08:18.257
6e3a28c2-6309-4d9f-9df8-426f64e29389	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-20 07:39:01.093
6e583263-5b90-4379-9461-1f1ded5a86b9	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-24 17:25:12.313
7390f1a9-833e-4384-924c-edca90780742	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Professional!'.	\N	2026-06-22 04:55:03.017
75b3e445-ea90-4ca6-b61a-d237cd70d6dc	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	8bd1e61e-ad97-4531-8115-e7bc702bfe1c	tenant_registration	Tenant 'TekQuora' registered with admin 'praveen.natarajan.in@gmail.com'.	\N	2026-06-24 17:32:58.17
7930bb38-b9f1-410e-893a-d15bf6c1f5cf	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0005'.	\N	2026-06-22 04:46:29.583
7c96bc3c-e31c-4250-9ee9-bc2c1c002cad	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0002'.	\N	2026-06-19 09:35:34.937
7ea077c4-d156-4ab2-a210-69ee6148cc7d	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 05:45:19.177
808bea60-660d-4b1f-83eb-e51fc59f2dc5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-23 06:02:03.517
80a1f876-64c0-4814-82b4-089defbfcdfb	771743ea-a1ad-47f3-9467-74f925fc2725	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-24 17:48:28.323
8361bda5-b427-487c-89f7-7f329e3e4213	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0015'.	\N	2026-06-26 11:08:30.45
88886d1f-e24f-476b-a0fb-422febd4c6f9	eefc685a-4359-421b-b5a6-812b976bf372	be3f979a-8521-49ec-8bbe-717da7aba277	tenant_registration	Tenant 'Raghu' registered with admin 'unfortunately2909@gmail.com'.	\N	2026-06-26 05:15:35.513
898447ff-1bed-4c90-b9a6-8915b105155c	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 17:29:23.02
8a72dfd6-887d-4399-8641-9558f53d42ae	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0001'.	\N	2026-06-19 08:33:20.45
8c6f398c-b51d-4a10-a39a-0f4a7b1fd556	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Free!'.	\N	2026-06-22 08:27:30.93
8e139a5f-cc23-4181-8122-918aaa846fb8	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0009'.	\N	2026-06-22 06:19:04.833
8f2eb777-0e5c-4986-be51-28f2a2ec063b	771743ea-a1ad-47f3-9467-74f925fc2725	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0012'.	\N	2026-06-24 17:48:46.587
8fecf791-a1f9-4363-9867-f9268564b991	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Professional!'.	\N	2026-06-22 06:16:10.527
91871af9-8999-4ca4-a9b1-f7d66449d770	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-22 06:19:04.6
9306b622-268c-4578-ad67-794dccec86d4	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-25 07:15:18.113
95e899a0-edc2-4e6f-acae-1896cd974aa5	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0008'.	\N	2026-06-22 05:46:39.463
964531f1-d84d-4091-9bf3-de2dfb43b71e	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0015'.	\N	2026-06-26 11:08:59.137
990951c1-071b-460f-8520-fa13aaaa9f70	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 12:04:52.67
9988797c-c19d-42b7-93c0-9010b313ea2f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_renewed	Subscription for plan Professional renewed.	\N	2026-06-22 05:24:38.697
9cfe92bb-f94b-4391-b9e2-ed83e5faa6a3	6e1bf4cd-639c-4112-8681-57fdf6a2793b	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0013'.	\N	2026-06-24 18:01:30.72
9f1db11e-bece-416f-b18c-169f3cc83c9b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0009 paid via stripe.	\N	2026-06-22 06:19:05.083
9f415afe-3d68-4631-8fce-6eb5e6f81ecb	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0002'.	\N	2026-06-19 09:35:27.827
a17328bb-0a12-424d-9725-fbd16a406011	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-24 05:30:30.58
a23befd0-20e2-44db-adbd-bb0f29d591b1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Free activated. Invoice INV-2026-0010 paid via stripe.	\N	2026-06-22 08:27:38.53
a2699cc7-b631-40d0-9fb7-6470f4a12cae	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-19 08:50:22.423
a5052b9a-a636-498b-8f71-01229dac3339	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-22 04:18:41.467
a6163d36-7bc9-42c6-b085-a53b44e6dc2e	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0007'.	\N	2026-06-22 05:24:49.997
a7755631-4784-4566-b38a-38a8896f593a	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-18 10:19:48.013
a94bc0bf-c5e7-4bed-af99-0fa33f82d324	6d7a4b69-7143-42be-aa65-b6ebe7d11f57	8ea4fd36-2b3c-4bcd-b0b0-a589b802da3a	tenant_registration	Tenant 'Raghul Tech' registered with admin 'prasathragul75@gmail.com'.	\N	2026-06-26 05:02:16.467
aa6c80f7-def3-4f7b-b6a1-3642a793c3d0	eefc685a-4359-421b-b5a6-812b976bf372	\N	automated_email	Email sent with subject: 'Welcome to MCC Free Plan!'.	\N	2026-06-26 05:15:41.603
abf247c9-386b-4c1c-a83a-b9c673048901	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 04:58:27.443
ac8941d5-36d2-436d-83b1-62d0985b78b0	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-26 05:18:41.787
af273f48-073c-4fdf-ac49-6b14c2ecdee6	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-22 12:20:35.753
af9a4f12-9d6e-45d1-a6cb-780e47b77e6d	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 16:43:26.373
af9b0e85-280f-4f5e-bb95-21e4cc43139a	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 16:35:59.257
afc2efe5-a635-40a2-a016-216ff446a391	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 15:51:26.823
b0396a4a-dc62-4eb0-b272-353e040a8b74	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 15:52:07.393
b067e7f1-1907-41d3-8e59-2ee2cab42f9e	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 09:20:41.587
b0ec16bc-2d7a-4882-a18c-fec7c37aa4d1	58afbbe1-aa38-45a0-b546-52981be67c00	21c57def-9578-446d-9ce6-f020c6b4afed	login	User logged in successfully.	\N	2026-06-24 17:42:33.77
b14f0a3a-6e0c-4daa-a17e-fdfb22cd1435	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_renewed	Subscription for plan Starter renewed.	\N	2026-06-22 08:26:07.457
b163df16-ae65-47fe-8d0d-5ee682a4bb34	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0005'.	\N	2026-06-22 04:46:13.13
b4c5a138-4c68-4930-adcd-bd74ba8a3174	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-TEST-999'.	\N	2026-06-22 06:16:10.513
b634e0ba-4549-45cc-956d-6981aeffefff	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-26 12:19:15.187
b96530b4-0cd2-4be5-859e-a65d2a1b8cdd	\N	\N	update_tenant_status	Tenant 'Tekq' status set to 'deleted'.	\N	2026-06-24 16:45:57.353
bad539cd-6593-45c4-84ac-e2a05ac3c7e4	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Subscription Renewed Successfully - Starter'.	\N	2026-06-19 09:35:15.78
bb5146ed-3f30-4f3e-8041-7020ae34bcf5	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-26 11:08:46.627
bc204342-361e-4d21-af56-dcef5d016a0f	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 08:09:17.953
bc957b29-736f-41b7-a53d-a568b97e5962	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-24 16:36:52.04
be7cc3cb-3a84-4d11-b0a6-c7f24de82626	6e1bf4cd-639c-4112-8681-57fdf6a2793b	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0013'.	\N	2026-06-24 18:01:59.863
bed54cb4-647b-4504-847d-7c0029bf0d91	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 10:33:03.723
c33f2c4b-3778-482a-8a9f-18d83478f045	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0001'.	\N	2026-06-19 08:34:09.59
c63d0213-66a9-4903-80e4-8df20f9d7758	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-18 08:38:58.79
c6b180f5-c990-4db5-aff7-5201c1422dca	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0003'.	\N	2026-06-19 10:08:53.167
c6f58d7c-edbf-4f24-a9d4-09e50ce4b2dc	eefc685a-4359-421b-b5a6-812b976bf372	\N	automated_email	Email sent with subject: 'New Workspace Registered: Raghu'.	\N	2026-06-26 05:15:35.677
c7642d55-5db9-4ab0-b7a7-3c34d52e2fb5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 07:12:03.597
c9b720ea-a304-4e62-91f7-55c882afcc92	6e1bf4cd-639c-4112-8681-57fdf6a2793b	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Enterprise!'.	\N	2026-06-24 18:02:07.097
caf2f672-06f3-4572-abf9-ac0f687c7829	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Professional!'.	\N	2026-06-22 05:47:52.183
cb4762f8-6dac-4ca1-a947-8634febed6bc	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Welcome to MCC Free Plan!'.	\N	2026-06-24 18:06:23.46
cd8a79c0-f0af-4574-8e6b-9f5e4c4cae7f	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-22 06:19:04.713
ce539adc-0adc-4305-b808-708db0e20fb2	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-16 06:44:13.003
ce84e467-ec48-45a7-a727-03ea51c2ebe1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-26 10:09:08.16
d21b42a0-3671-4b77-8b80-c2f20bb941ea	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0004'.	\N	2026-06-19 10:09:49.167
d2f3b764-4810-43b4-998e-5795da26353d	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-26 11:08:52.753
d9827e73-61de-4faa-8fed-7bec9f20a4a7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	tenant_registration	Tenant 'MMIP' registered with admin 'nancythomasselva@gmail.com'.	\N	2026-06-20 07:26:29.527
d9894595-1f58-4397-a100-8b6e3c4585c4	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0006'.	\N	2026-06-22 04:55:03.003
dab7c734-e2cf-4f75-9530-ff15568177f5	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0001'.	\N	2026-06-19 08:50:57.293
dada54ef-78c7-49fc-88a0-4cf739a50261	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-001'.	\N	2026-06-26 05:11:10.19
db5d9270-0e2d-4ee1-a3dc-f0118990d554	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-18 09:44:07.533
dbc2e076-4a96-41f0-a233-1e8a6d8e2d26	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-25 05:42:31.347
dcacc1fe-8d08-4344-928b-bcaeaf23bd22	771743ea-a1ad-47f3-9467-74f925fc2725	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	subscription_activated	Plan Starter activated. Invoice INV-2026-0012 paid via stripe.	\N	2026-06-24 17:49:04.483
e336453d-addb-4c9f-b2d2-1cbc879c6377	6e1bf4cd-639c-4112-8681-57fdf6a2793b	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-24 18:01:46.86
e3f0263e-d3af-4679-bafb-801e406f991a	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0006'.	\N	2026-06-22 04:54:16.343
e5ebc48e-fd07-4298-872a-32e303a335e6	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0010'.	\N	2026-06-22 08:27:16.067
e71aaffc-8622-4929-9954-080cebb20322	771743ea-a1ad-47f3-9467-74f925fc2725	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-24 17:48:38.053
e7fb30e1-48a9-4692-94ba-33296c6a8d8f	771743ea-a1ad-47f3-9467-74f925fc2725	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0012'.	\N	2026-06-24 17:47:57.213
e8a5fbdf-fdd3-44a7-b085-c2920f177599	58afbbe1-aa38-45a0-b546-52981be67c00	21c57def-9578-446d-9ce6-f020c6b4afed	tenant_registration	Tenant 'Travels' registered with admin 'nancynarmadha512@gmail.com'.	\N	2026-06-24 17:41:05.18
e98f6a9e-c5bc-4e9d-81ce-1c5687a3995a	6d7a4b69-7143-42be-aa65-b6ebe7d11f57	8ea4fd36-2b3c-4bcd-b0b0-a589b802da3a	login	User logged in successfully.	\N	2026-06-26 05:03:23.34
ea1fbcd3-405e-49d0-8a18-ed228a3704da	eefc685a-4359-421b-b5a6-812b976bf372	be3f979a-8521-49ec-8bbe-717da7aba277	login	User logged in successfully.	\N	2026-06-26 05:16:32.197
eb7bf415-a56e-4386-a13a-ab2d69f5bb54	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 10:35:37.763
f452b05b-69d3-445a-a782-ca83b0880143	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0007 paid via stripe.	\N	2026-06-22 05:25:01.887
f6eb74af-314c-41fa-a279-c54186dd649c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-25 19:04:44.08
f96618f8-9262-4cab-918e-6557b7ef5a32	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-22 08:26:56.937
fba9b75f-dae8-458b-81d1-c53f44ccc16a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Professional activated. Invoice INV-2026-0008 paid via stripe.	\N	2026-06-22 05:47:52.213
fc7d4063-6479-4c7b-b156-1e573559204e	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-22 12:20:08.93
fe017d71-d295-4daa-81d9-a93b186d5785	4580e056-5929-4cd4-bf6e-6ee2e44749ff	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0004'.	\N	2026-06-19 10:10:00.923
bdd750c1-bd79-45bd-a6fe-1acbca710901	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 07:52:07.774795
e9cf5281-1ae9-417f-9ef6-c025c968a67c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 07:54:58.207591
e6dffdbb-a3fd-44df-9361-95c08dea6d9e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 07:58:18.821137
4cc4230a-7def-4167-9310-a7c6ae3b890c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 07:59:07.350204
6a75581b-bd7f-4777-8fb8-2b734ad4681b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 08:27:56.495129
6a1feb31-2b67-4fc3-85a0-319d7b6db170	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 08:30:16.732067
6ec14061-2b5a-498f-abe0-67c326cb9e0c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 08:35:26.090011
fa8b0573-5d0c-4433-aa6c-6ab74d28d523	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 10:31:14.969511
63bd5a35-d06e-4c28-9547-4e7bf7524f8d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 10:31:33.036005
8475bac8-9d91-43ec-a2d7-6e16715ef155	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 10:36:55.075326
dee500b9-7f77-46ef-9eb4-cf2c5d94bba9	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0016'.	\N	2026-06-27 10:37:29.967929
f79252fd-4cfb-42a4-8bfd-34b4fa6e813b	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-27 10:37:50.200795
e75ae7e4-ed20-4dbe-ac2b-107a8102eac0	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-27 10:37:58.248457
b6194047-0a71-48c1-8f0b-97bf30abf339	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0016'.	\N	2026-06-27 10:38:06.183144
66e144d4-18fb-4b90-96cd-0e1620173d01	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-27 10:38:14.341073
8408dfe8-ca20-4cc8-a708-a948eb89e8ff	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0016 paid via stripe.	\N	2026-06-27 10:38:21.734852
9194822a-3466-4b45-bc7f-f13c674873e7	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 10:46:02.780311
b5652446-1ffa-4724-a8a3-9a47b53318b0	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:07:04.943233
328cf859-7b2b-43da-a63b-bbe999b05a88	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:07:05.88939
a32dbf19-05e2-4cf8-8721-089f5de9c78c	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:19:05.526732
c9e6e514-24f6-469e-9993-ede3daf6868a	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:22:46.720421
c20e2110-d80c-4d64-9726-30f055390b93	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:24:47.201889
2d93847f-8914-4adb-9c5f-e711cae245f0	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:25:26.254819
91533925-bbd6-447e-b010-f5d7d0380d68	\N	\N	update_tenant_status	Tenant 'nan' status set to 'suspended'.	\N	2026-06-27 11:26:24.906518
180dfe56-26f8-4fd4-91be-c180180704c8	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-27 11:28:55.69218
00e9b3e0-51eb-43cb-968d-b7bdd310f445	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-27 17:09:28.532824
68ecf3cb-91dc-4fe5-87b1-1dc4e8789bd0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-28 15:43:55.084481
311c00f0-d3ee-41bc-ad0f-b2877fe6fc8f	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 15:45:22.373438
5456d4cf-0e44-4943-a3c1-5a605e19a1a1	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 16:24:10.329431
bb1ecc08-46a2-43db-87a8-dbedf6bf0a09	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-28 17:12:33.156998
2528c31e-6693-45f2-bab0-2877bae9efa4	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 17:13:06.876715
9d16623a-ec07-4d41-8843-46bafff8636f	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0017'.	\N	2026-06-28 17:18:15.722809
fa3be983-5750-4462-8179-3f8b1ee6bbe1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-28 17:20:44.366415
5df29e12-d4c2-4d8f-8102-72b60f202d85	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0018'.	\N	2026-06-28 17:20:55.381021
02cf5537-8456-4fdb-8ddd-f747c994160c	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-28 17:21:21.588627
c6e010d5-6d11-4f6a-8cfc-a38efc1f9bcc	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-28 17:21:27.219119
097bf2d0-bd25-4220-ba5b-06c251dc6d80	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0018'.	\N	2026-06-28 17:21:31.532153
32c83cf3-e499-4e99-85ff-2927fd013e89	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Free!'.	\N	2026-06-28 17:21:38.93045
a6bdf3f6-bd67-4e0b-b278-0c3c7cc0ebbb	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Free activated. Invoice INV-2026-0018 paid via razorpay.	\N	2026-06-28 17:21:43.835297
93f030fe-b307-44bf-af28-6f24961c9b84	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 17:23:21.476059
90edbd16-970a-4584-b2d8-3e965d699fed	\N	\N	update_billing_settings	Super Admin modified system payment gateways and tax configs.	\N	2026-06-28 17:28:20.743551
d3fd6c23-b8a3-4c01-af8a-92ba354454d6	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0019'.	\N	2026-06-28 17:28:34.431142
a23ea5a7-2400-4185-85e7-6a6583cd5d76	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0020'.	\N	2026-06-28 17:31:28.252387
babc5575-9c61-4c78-ae85-9170979d0e86	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-28 17:31:46.896099
3da54ce0-c18a-4fbe-b8f9-2cbe730e07af	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-28 17:31:52.684201
206df27c-cf67-4b29-a65b-7ed8b76ca9b5	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0020'.	\N	2026-06-28 17:31:59.937711
16e2d1d7-1f0a-4486-bdcc-20beb5feb003	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-28 17:32:07.325328
5d73ef79-8627-4fcd-88cb-a46729a47e6e	58afbbe1-aa38-45a0-b546-52981be67c00	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	subscription_activated	Plan Starter activated. Invoice INV-2026-0020 paid via razorpay.	\N	2026-06-28 17:32:13.606983
29d28618-9e6b-447a-a89b-41e9ff39d3a0	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 17:32:52.272287
e66bfddf-8553-4220-a02d-63ab160640f7	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0020'.	\N	2026-06-28 17:33:57.631836
87ad2184-037f-481c-8119-97a133a811d4	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0020'.	\N	2026-06-28 17:34:15.046821
e613dad9-776a-42be-bf29-2330bb289e51	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0020'.	\N	2026-06-28 17:34:15.514303
589d7603-a5c0-42b3-aa55-929eec4aad00	58afbbe1-aa38-45a0-b546-52981be67c00	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0020'.	\N	2026-06-28 17:34:16.033944
8d7797fb-fd60-4506-ab61-ed756e773dad	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 17:47:55.797998
3e894c4a-cb62-48c6-8261-026e5615f9af	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 17:56:30.108132
5fc08b95-d800-4223-bbfd-c02356179def	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-28 18:00:21.432503
dba71980-81fa-406c-bdfa-6da5b5c0ae5c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-28 18:01:17.476446
a675bf37-722a-4cec-8c66-7380610267ed	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-06-28 18:01:52.062658
9eb0539c-e6f2-460c-a62c-94645552199d	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0021'.	\N	2026-06-28 18:01:35.488241
712fef0a-460d-4b9c-bea1-e79c719968ec	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-06-28 18:02:00.203124
d8b67dbb-8e53-4a18-a1a6-c433208e6a11	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0021'.	\N	2026-06-28 18:02:06.839008
bf77229d-e032-4ae6-88a8-38f472998995	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-06-28 18:02:13.064595
79f76225-a49f-4f0b-9fb5-838a78617380	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0021 paid via razorpay.	\N	2026-06-28 18:02:19.710356
c6f5fccf-fe55-4954-b23b-8541f2001d5f	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-29 05:15:24.082066
0d6e774e-e411-435f-a244-e5b4182b72cc	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-29 05:36:20.171112
55d4295d-f1e6-4749-821b-ce3616009bb8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-29 12:37:59.769394
b404a363-23ac-426b-a51d-bfc64d5cfbc1	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-29 16:55:26.988849
7eb78409-bcb9-4b9d-b137-ee1b912044c6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 05:06:08.318615
4ba08107-e243-4e73-9d8c-8c959b71337e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 08:57:41.177538
d9b84661-89d2-4969-b667-0358faef4b7f	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-30 09:30:46.115988
d25ab8b9-7960-48af-af12-251717dbbf42	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 10:27:41.295041
59c74188-e08b-4599-ae73-1820f6660177	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-30 10:38:27.023308
94fdc523-2dba-46e2-bc19-ef760496a64b	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-06-30 11:13:03.926798
2ac59d96-a59a-43d2-8170-3b1b97e5bfea	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 11:42:55.083443
723fbfff-a874-4191-a9ba-e22772fd858c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 13:09:51.711285
2f179644-e41e-4eb3-94d3-d19e9927a264	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0022'.	\N	2026-06-30 13:28:06.651922
4cb67c68-5ec3-4fd7-a68b-378aaea70b59	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0023'.	\N	2026-06-30 13:29:36.474623
01c07338-8590-4000-bafa-ead93837a35b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-06-30 18:45:23.572046
3318784e-3bdd-44df-b44a-22becab6c918	\N	95940c85-31ca-4fe8-932a-1a91c529e824	login	User logged in successfully.	\N	2026-06-30 19:24:03.828758
72144d59-4934-453b-ada6-8f1af2e4c2b3	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 06:13:27.85867
45317f29-f064-4dc3-adc8-7b8e61d7f30b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 06:16:13.847566
fcc60349-6aec-475d-ad91-4653d184d621	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0024'.	\N	2026-07-01 06:18:13.847849
f98f064b-a212-49ce-9c08-faa8e0bedd9c	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-07-01 06:18:31.884124
85a61e8e-abfd-4c23-a1d9-b6392d579f6d	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-07-01 06:18:38.772655
e20233ad-19a7-41b0-8e54-8d45f2fc1504	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0024'.	\N	2026-07-01 06:18:43.521844
2f2c731e-d24c-4410-91eb-69455e4cd35e	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Free!'.	\N	2026-07-01 06:18:49.014905
72f961ba-21b2-43bb-98cc-c19bd6f54c71	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Free activated. Invoice INV-2026-0024 paid via stripe.	\N	2026-07-01 06:18:57.638136
18cf2511-1585-42d6-911b-980dd5aa1bb0	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 06:20:16.73278
7358454e-43dc-4507-be6b-5541ab19d769	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 06:42:59.451725
fd617a03-1f95-490c-85e5-ccc41bfa40ab	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 06:52:43.442514
7e3f8c08-6f8e-49dd-a4ee-b7dcd8165550	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 07:01:02.06739
e087be46-6927-437c-a95f-83283b8e7fb1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 07:07:18.375186
df560140-1aae-44d6-b9b3-0013bf7c4428	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 08:21:47.889159
4e242813-3017-4747-833c-acea699b40ef	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 09:15:31.507649
272d74dc-0f5c-4dfd-99bf-6498ca370729	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 09:17:55.369819
aeba2d8c-b03f-4e5c-b44d-2e6aa248b095	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 10:04:13.198621
cef3ca6e-51b3-464c-b806-ab541e33159c	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0025'.	\N	2026-07-01 10:16:56.025221
476c18af-10e0-49ac-8de3-00bd2a71dd34	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-07-01 10:17:39.10629
551757b0-5add-4c79-af57-6d527ec35752	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-07-01 10:18:02.316851
6011a27f-8506-4d89-b5fd-b31bf713b1a6	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0025'.	\N	2026-07-01 10:18:10.293183
c8b404e4-580a-4de4-b774-9b4b037d71f8	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-07-01 10:18:19.416006
14f65f4b-5b80-4381-85d5-6851c12c3a9e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0025 paid via stripe.	\N	2026-07-01 10:18:31.688107
310612a2-6b96-4002-bacc-9bc2fed603be	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 10:25:00.676606
152c0ced-0389-4add-acd5-34777b9cfa83	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 11:01:49.955076
cd21f13f-ed88-4ca1-99e0-ede0a102e2bf	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-01 11:03:01.509239
2e64454f-dafd-4565-81a8-bf3c943de75d	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-01 11:07:48.56873
0d6f9921-2ae2-4f3e-83cf-9cd708f51821	\N	\N	update_billing_settings	Super Admin modified system payment gateways and tax configs.	\N	2026-07-02 07:28:10.154666
08ce0752-915d-4098-8c2e-9b8553213a90	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-02 09:15:12.5811
286b628b-0ab0-4a0e-9679-b60423f8828d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-02 09:15:44.888331
34adf1a5-0f5d-4503-9b75-0aa93306f484	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-02 09:56:50.999727
2abd8b3e-d3a8-4771-8296-96c3b3c454b7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-02 11:19:50.680944
78263c07-c56d-41a0-b0e6-08c0161de815	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-02 11:34:22.936477
9c8e960e-9f6a-4b16-9642-f9f18d193069	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-03 05:00:21.893194
f1afb65f-e9ef-4eb5-b276-ceeaaa7216bd	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully.	\N	2026-07-03 05:04:09.746234
8f780434-f2d4-42b8-b0d1-72212ff72493	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-03 05:14:27.021972
a796d8d8-d08a-44ae-be5f-df6fca1555d0	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	tenant_registration	Tenant 'yesh' registered with admin 'yeshwanthy1504@gmail.com'.	\N	2026-07-03 09:45:09.864915
ea4e3b96-0079-407d-9294-260887a3c43a	b3925813-0140-477b-84e4-076f28f1daa4	\N	automated_email	Email sent with subject: 'New Workspace Registered: yesh'.	\N	2026-07-03 09:45:10.428133
25479b6d-93e9-46c2-a8d7-db6f3cd7abe4	b3925813-0140-477b-84e4-076f28f1daa4	\N	automated_email	Email sent with subject: 'Welcome to {{company_name}}, {{user_name}}!'.	\N	2026-07-03 09:45:28.730703
827bf43d-a972-4bba-a799-582e71161a8a	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	login	User logged in successfully.	\N	2026-07-03 09:45:50.4486
d16c28c2-4855-4961-9095-026f991af544	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully.	\N	2026-07-06 09:17:35.784865
35fc4524-27df-437f-8096-8b96d5498090	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully via Google.	\N	2026-07-07 05:23:30.986352
b0d9cbdd-9d75-4276-b761-4d1b272de2fa	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully via Google.	\N	2026-07-07 06:19:51.468968
d172b9be-3b53-4eff-8c69-1f173d582add	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0026'.	\N	2026-07-07 06:20:08.34232
dfaa6265-8d68-4bce-8b0c-42bb9682a29a	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-07-07 06:20:58.918393
a182fd65-4f23-444d-8f09-e221b43db8f6	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-07-07 06:21:09.724615
66a057c0-9474-4bb3-8d0b-2fd6399ff271	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Professional!'.	\N	2026-07-07 06:21:27.344045
905fcc38-5f9c-433f-b1ae-c41720c5c066	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0026'.	\N	2026-07-07 06:21:18.846738
d266a29e-8916-47be-a78c-7c3db88a5160	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Professional activated. Invoice INV-2026-0026 paid via razorpay.	\N	2026-07-07 06:21:36.167658
a7638a80-87a2-483a-a8f7-a36907d33cd2	\N	c9ea7b7d-eff2-4de5-9f17-0b339905dae4	login	User logged in successfully via Google.	\N	2026-07-10 05:54:08.256854
4f13cddd-7d84-42c2-9bd2-d6d94e089fc8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	login	User logged in successfully via Google.	\N	2026-07-10 05:57:54.163767
f92f9e6b-3f2f-4851-87ea-7c503a4a1dbd	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Invoice Generated - INV-2026-0027'.	\N	2026-07-10 06:04:06.032929
71a0a48d-882e-47de-b253-b85dc86c9c1f	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Activated Successfully'.	\N	2026-07-10 06:06:49.296558
619672d9-97b4-4a05-a84a-9a709aaacf24	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'New Subscription Purchase'.	\N	2026-07-10 06:06:58.969135
00381773-d11d-43b1-bd06-b99bcfdf22f0	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Payment Successful! Invoice INV-2026-0027'.	\N	2026-07-10 06:07:06.929843
daccbf9b-643f-4a3a-884e-90464f1a9db3	59ffc06a-a098-4c42-9cb7-8df23cbae806	\N	automated_email	Email sent with subject: 'Subscription Upgraded to Starter!'.	\N	2026-07-10 06:07:13.888335
ad0d79c0-4a3e-4750-8115-92b941e347c3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	subscription_activated	Plan Starter activated. Invoice INV-2026-0027 paid via razorpay.	\N	2026-07-10 06:07:19.49452
\.


--
-- Data for Name: billing_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_settings (id, tenant_id, currency, gst_percentage, invoice_prefix, invoice_footer, company_name, company_address, company_email, stripe_enabled, stripe_public_key, stripe_secret_key, razorpay_enabled, razorpay_key_id, razorpay_key_secret, upi_enabled, upi_id, default_gateway, created_at, updated_at) FROM stdin;
4e9cfdf2-8d19-4fb7-9f0a-0afd19016eab	\N	INR	18	INV	For any subscription questions, contact billing@mcc-ai.com.	MCC AI Language Platform	123 Tech Campus, Bangalore, India	billing@mcc-ai.com	t	pk_test_51MccAiStripePubKeyFake	sk_test_51MccAiStripeSecKeyFake	t	rzp_test_T77WnqnS64VBh5	DPxRDRGhjl7vWEns5H1L5Kov	t	mccai@upi	razorpay	2026-06-18 09:41:36.587	2026-07-02 07:28:10.091963
\.


--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branding_settings (id, tenant_id, logo_url, logo_size, logo_position, favicon_url, app_icon_url, platform_name, tagline, footer_text, copyright_text, created_at, updated_at) FROM stdin;
6bca8618-48a5-42cf-a5b4-23dda8e07739	\N	/logo.png	32px	left	\N	\N	Fluentia	AI Language Platform	Powering Next-Gen Language AI	© 2026 Fluentia. All rights reserved.	2026-06-17 10:15:15.33	2026-06-27 05:46:20.837
\.


--
-- Data for Name: custom_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_forms (id, tenant_id, form_name, fields_json, submit_endpoint, created_at) FROM stdin;
\.


--
-- Data for Name: dashboard_widgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dashboard_widgets (id, tenant_id, widget_type, title, config_json, "order", is_visible) FROM stdin;
\.


--
-- Data for Name: document_intelligence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_intelligence (id, user_id, filename, filepath, filetype, filesize, page_count, word_count, character_count, extracted_text, translated_text, summary, created_at, updated_at) FROM stdin;
299f63bb-d4f9-4dad-8bc3-8d4717202fc0	5412749a-2ba3-414d-86c7-e325710f9f76	Nancy_Narmadha_T.pdf	uploads/documents\\299f63bb-d4f9-4dad-8bc3-8d4717202fc0.pdf	application/pdf	160631	1	474	9414	Nancy Narmadha T  \nChennai  | +91 7904327211  | nancythomasselva@gmail.com  | LinkedIn   \n \nObjective  \nAspiring Full Stack Developer with hands -on experience in building web applications , mobile applications  \nusing Fl utter , React,  HTML  and MySQL. Skilled in REST API development, database management, \nauthentication, and AI -based integrations. Seeking an entry -level role to apply my technical skills and \ngrow in a dynamic organization\n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------  \nTechnical Skills  \n• Languages: Python, JavaScript , PHP  \n• Frontend: HTML, CSS, React, Flutter  \n• Backend: Flask, Node.js  \n• Database : MySQL, SQLite , MongoDB  \n• Tools: Git, VS Code  \n• Concepts: REST API, CRUD Operations, \nAuthentication, OOP s concepts  Education  \nMadras Christian College | Chennai                                                                             \nMCA | 79%  \nBon Secours College for Women | Thanjavur                                                            \nBSc Computer Science | 85%  \nRahmath Matric Hr. Sec. School | Muthupet                                                                                                                                                                                                    \nHSC | 90%\n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------  \nInternships  \nI. Web Development Internship Training  course \ncertified by Skill Vertex.                       -  Jan-2024  \n• Built a responsive personal portfolio \nwebsite  on responsive design . \nII. Full Stack Web Development  Internship at \nOriz Software Technology Pvt. Ltd.      \n -  May -2025  \n• Worked on full stack -web development, \ncontributing to both frontend and \nbackend modules.  \n Certifications  \n• Learn About Being a Front -End \nDeveloper  certified by IBM skill \nbuild  \n• Machine Learning and Data \nAnalytics with Python certified by \nMSME -Technology Development \nCenter (PPDC)  \n• Training on Cyber Security and \nDigital Safety Essentials  offered \nby Naan Mudhalvan.  \n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------  \nExperience  \nI. AI-Based Face Recognition for Login and Attendance System  - KOLO ZEN T ech World Private Limited              \nFront -End:  Flutter , Dart Language   \nBack -End:  Flask (Python (Deep Face)), Rust (Actix -web)  \nAI/ML:  Deep  Face, TensorFlow (Basics)  \nDatabase:  SQLite  \n• Developed an AI- based  face recognition –based login and attendance system.  \n• Enabled  secure, contactless authentication using AI -based facial recognition.  \n• Utilized Deep  Face library for facial recognition and identity verification.  \n• Built an admin dashboard for user management, attendance logs, and report generation.  \n• Integrated REST APIs to enable communication between frontend, backend, and AI services.  \n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------  \nProject  \nI. Doctor -Patient Portal for Lung Diagnosis                                                       \nFront -End: React  \nBack -End: Flask (Python), node.js with Express  \nDatabase: MySQL Workbench  \n• Developed a healthcare web application using React and Flask.  \n• Implemented role -based access for doctors, patients, and admin.  \n• Applied U -Net based image segmentation concept for lung image analysis and prediction.  \n• Designed REST API structure for handling file uploads and report generation  with confidence \nscore.  \n• Managed data using MySQL with CRUD operations.	[Translated to Malayalam]: \n\nNancy Narmadha T  \nChennai  | +91 7904327211  | nancythomasselva@gmail.com  | LinkedIn   \n \nObjective  \nAspiring Full Stack Developer with hands -on experience in building web applications , mobile applications  \nusing Fl utter , React,  HTML  and MySQL. Skilled in REST API development, database management, \nauthentication, and AI -based integrations. Seeking an entry -level role to apply my technical skills and \ngrow in a dynamic organization\n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------  \nTechnical Skills  \n• Languages: Python, JavaScript , PHP  \n• Frontend: HTML, CSS, React, Flutter  \n• Backend: Flask, Node.js  \n• Database : MySQL, SQLite , MongoDB  \n• Tools: Git, VS Code  \n• Concepts: REST API, CRUD Operations, \nAuthentication, OOP s concepts  Education  \nMadras Christian College | Chennai                                                                             \nMCA | 79%  \nBon Secours College for Women | Thanjavur                                                            \nBSc Computer Science | 85%  \nRahmath Matric Hr. Sec. School | Muthupet                                                                                                                                                                                                    \nHSC | 90%\n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------  \nInternships  \nI. Web Development Internship Training  course \ncertified by Skill Vertex.                       -  Jan-2024  \n• Built a responsive personal portfolio \nwebsite  on responsive design . \nII. Full Stack Web Development  Internship at \nOriz Software Technology Pvt. Ltd.      \n -  May -2025  \n• Worked on full stack -web development, \ncontributing to both frontend and \nbackend modules.  \n Certifications  \n• Learn About Being a Front -End \nDeveloper  certified by IBM skill \nbuild  \n• Machine Learning and Data \nAnalytics with Python certified by \nMSME -Technology Development \nCenter (PPDC)  \n• Training on Cyber Security and \nDigital Safety Essentials  offered \nby Naan Mudhalvan.  \n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------  \nExperience  \nI. AI-Based Face Recognition for Login and Attendance System  - KOLO ZEN T ech World Private Limited              \nFront -End:  Flutter , Dart Language   \nBack -End:  Flask (Python (Deep Face)), Rust (Actix -web)  \nAI/ML:  Deep  Face, TensorFlow (Basics)  \nDatabase:  SQLite  \n• Developed an AI- based  face recognition –based login and attendance system.  \n• Enabled  secure, contactless authentication using AI -based facial recognition.  \n• Utilized Deep  Face library for facial recognition and identity verification.  \n• Built an admin dashboard for user management, attendance logs, and report generation.  \n• Integrated REST APIs to enable communication between frontend, backend, and AI services.  \n----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------- ------ ----------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------  \nProject  \nI. Doctor -Patient Portal for Lung Diagnosis                                                       \nFront -End: React  \nBack -End: Flask (Python), node.js with Express  \nDatabase: MySQL Workbench  \n• Developed a healthcare web application using React and Flask.  \n• Implemented role -based access for doctors, patients, and admin.  \n• Applied U -Net based image segmentation concept for lung image analysis and prediction.  \n• Designed REST API structure for handling file uploads and report generation  with confidence \nscore.  \n• Managed data using MySQL with CRUD operations.	{"short_summary": "This document covers important details and statistics.", "detailed_summary": "This document contains 474 words. It appears to be a highly detailed report containing various metrics and points of interest that are useful for business analysis.", "key_points": ["First key point", "Second key point", "Important metric observed"], "important_dates": ["2026-06-01", "2026-12-31"], "important_numbers": ["474", "9414"], "action_items": ["Review the document carefully", "Approve the new budget"], "conclusion": "The document suggests a positive trend overall."}	2026-06-30 06:02:21.98517	2026-06-30 06:03:10.434503
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_logs (id, tenant_id, recipient, subject, status, error_message, created_at) FROM stdin;
c2ab8f0b-5741-4efb-a769-4ac1f45e0671	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0022	success	\N	2026-06-30 13:28:20.19591
b6f6185b-916b-4eb6-8010-8258e5b6c5b1	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0023	success	\N	2026-06-30 13:29:45.617843
550f7e23-d404-4d45-b86d-be12d19beb86	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0024	success	\N	2026-07-01 06:18:20.145088
d5cc1914-e332-4f83-99f8-db85416e43d7	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Activated Successfully	success	\N	2026-07-01 06:18:38.007779
14427d09-5d59-4092-938e-a4f5f83cb659	59ffc06a-a098-4c42-9cb7-8df23cbae806	liliana.manohar@gmail.com	New Subscription Purchase	success	\N	2026-07-01 06:18:43.070066
0728b96c-0046-481b-8907-806241d59763	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Payment Successful! Invoice INV-2026-0024	success	\N	2026-07-01 06:18:48.87996
52e0b69e-6367-4e66-8147-43e0977ecef0	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Upgraded to Free!	success	\N	2026-07-01 06:18:57.510108
cfa7baee-0d58-43f6-9d9c-668ff80781c7	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0025	success	\N	2026-07-01 10:17:21.970337
3afed07e-59e9-4964-8ff1-c28599d9fc19	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Activated Successfully	success	\N	2026-07-01 10:18:01.985064
19651525-2e00-4eed-b9bf-3187f3767bf1	59ffc06a-a098-4c42-9cb7-8df23cbae806	aachinancy@gmail.com	New Subscription Purchase	success	\N	2026-07-01 10:18:09.744636
08f3e01c-bbcc-4cf5-a7a3-2eb562f90306	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Payment Successful! Invoice INV-2026-0025	success	\N	2026-07-01 10:18:19.049987
aecef5c8-32d5-4996-9865-2900d267f75a	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Upgraded to Starter!	success	\N	2026-07-01 10:18:31.175194
bb469563-1d37-4c09-ab5f-03581d4edef9	b3925813-0140-477b-84e4-076f28f1daa4	liliana.manohar@gmail.com	New Workspace Registered: yesh	success	\N	2026-07-03 09:45:28.504486
a687be74-0c1f-4267-8b49-d98fbe32f9b1	b3925813-0140-477b-84e4-076f28f1daa4	yeshwanthy1504@gmail.com	Welcome to {{company_name}}, {{user_name}}!	success	\N	2026-07-03 09:45:40.080456
47f3ac2f-98e4-45cd-9fcf-b6991aaef7c7	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0026	success	\N	2026-07-07 06:20:20.293457
8fbeec41-e1d0-4777-a08a-66f0e9460324	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Activated Successfully	success	\N	2026-07-07 06:21:09.51803
812db226-dcbc-46aa-aa0a-eb0fefc0e0e8	59ffc06a-a098-4c42-9cb7-8df23cbae806	liliana.manohar@gmail.com	New Subscription Purchase	success	\N	2026-07-07 06:21:18.458182
42b8ddcf-03d2-4bd6-87f5-7d0bbf85a1b0	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Payment Successful! Invoice INV-2026-0026	success	\N	2026-07-07 06:21:27.173488
17c691d2-04ea-4eeb-861b-20ef9d418b1f	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Upgraded to Professional!	success	\N	2026-07-07 06:21:36.077066
88337b78-a635-4f4b-9356-794218b480fb	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	New Invoice Generated - INV-2026-0027	success	\N	2026-07-10 06:04:20.385564
68b2a040-b026-46ae-a3c3-63eaf543935d	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Activated Successfully	success	\N	2026-07-10 06:06:58.653014
1b7a1282-682e-4307-8114-cbe3375f588d	59ffc06a-a098-4c42-9cb7-8df23cbae806	aachinancy@gmail.com	New Subscription Purchase	success	\N	2026-07-10 06:07:05.195256
e31effa8-18e2-4513-ade5-22dab41ef0c1	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Payment Successful! Invoice INV-2026-0027	success	\N	2026-07-10 06:07:13.724471
3f651dd2-b671-4fca-8d62-942273d4f32c	59ffc06a-a098-4c42-9cb7-8df23cbae806	nancythomasselva@gmail.com	Subscription Upgraded to Starter!	success	\N	2026-07-10 06:07:19.001436
\.


--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_templates (id, tenant_id, template_type, subject, body_html, body_text, from_email, reply_to, is_enabled, updated_at) FROM stdin;
f28d993e-bc0a-44ef-b8e4-1017e5ebafe7	\N	welcome	Welcome to {{company_name}}, {{user_name}}!	<p>Hello <strong>{{user_name}}</strong>,</p><p>Thank you for subscribing to the <strong>{{plan_name}}</strong> plan for <strong>{{tenant_name}}</strong>. Your workspace has been activated.</p><p><a href="{{login_url}}" target="_blank">Click here to login</a></p><br/><p>Enjoy the platform!</p><p>The {{company_name}} Team</p>				t	2026-06-29 05:15:37.749401
6cb8aacc-2396-44fa-b970-22f691a364ce	\N	user_invitation	You have been invited to join {{tenant_name}}	<p>Hello <strong>{{user_name}}</strong>,</p><p>You have been invited to join <strong>{{tenant_name}}</strong> on {{company_name}}!</p><p>Click the link below to accept the invitation:</p><p><a href="{{invite_link}}" target="_blank">Accept Invitation</a></p><br/><p>Thanks,</p><p>The {{company_name}} Team</p>				t	2026-06-29 05:15:37.749401
21cefff3-2992-45a1-9edc-47917224394c	\N	otp_verification	Your Verification Code	<p>Your OTP for verification is: <strong style="font-size: 24px; letter-spacing: 2px;">{{otp}}</strong></p><p>It will expire in {{expiry_minutes}} minutes.</p>				t	2026-06-29 05:15:37.749401
692a58b0-6222-4233-abfc-9c4b71e97ec7	\N	reset_password	Reset Your Password	<p>Hello <strong>{{user_name}}</strong>,</p><p>Click the link below to reset your password:</p><p><a href="{{reset_link}}" target="_blank">Reset Password</a></p>				t	2026-06-29 05:15:37.749401
7314ade6-0c17-4897-ac1a-75ee1315cdfe	\N	invoice_generated	New Invoice Generated - {{invoice_number}}	<p>Hello <strong>{{customer_name}}</strong>,</p><p>A new invoice <strong>{{invoice_number}}</strong> has been generated for your workspace subscription on {{invoice_date}}.</p><p>Total amount: <strong>{{currency}} {{invoice_total}}</strong>.</p><p>Please review it in your Billing settings.</p><p><a href="{{download_invoice_url}}" target="_blank">Download Invoice</a></p><br/><p>Thanks,</p><p>MCC AI Billing</p>				t	2026-06-29 05:15:37.749401
43b27efc-e57f-4aaf-abee-87144b82482e	\N	payment_success	Payment Successful! Invoice {{invoice_number}}	<p>Hello <strong>{{tenant_name}}</strong>,</p><p>Your payment of <strong>${{amount}}</strong> for Invoice {{invoice_number}} via <strong>{{payment_method}}</strong> was successfully processed.</p><p>Transaction ID: {{transaction_id}}.</p><p>Your <strong>{{plan_name}}</strong> subscription is now active and expires on {{expiry_date}}.</p><p>Your invoice is now marked as PAID and a PDF has been generated for your records.</p><br/><p>Thank you for your business!</p><p>MCC AI Billing</p>				t	2026-06-29 05:15:37.749401
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feature_flags (id, tenant_id, name, display_name, is_enabled, restricted_plans) FROM stdin;
17c4319c-b1d4-44c8-b9c6-e506f0ee6f75	\N	audio-upload	Audio Upload	t	
3e2b0bda-f0dd-457b-9221-7046df148b15	\N	voice-to-text	Voice To Text	t	
c473cea2-1a00-424e-b492-8365ef8eda9b	\N	translation	Translation	t	
f45e5ec6-a100-40e6-a454-4e39d4981dda	\N	text-to-speech	Text To Speech	t	
\.


--
-- Data for Name: feature_provider_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feature_provider_mapping (id, feature_name, provider_name, priority, is_enabled, created_at, updated_at) FROM stdin;
16d3c58d-ece2-4802-b461-2f9e20b1863d	Audio To Text	OpenAI	1	t	2026-07-01 11:08:58.358491	2026-07-01 11:08:58.358491
ea1a1ba1-a056-4f3d-8e6c-a9bb514b1055	Text To Speech	OpenAI	1	t	2026-07-01 11:09:04.448148	2026-07-01 11:09:04.448148
82044c76-b7ed-43c2-9742-cea1e4118cd9	Audio To Text	Deepgram	1	t	2026-07-01 11:14:13.579323	2026-07-01 11:14:13.579323
99ecf3d1-ee23-43ac-a517-8772688a6676	Text To Speech	ElevenLabs	1	t	2026-07-01 11:14:21.840872	2026-07-01 11:14:21.840872
\.


--
-- Data for Name: invoice_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_history (id, tenant_id, invoice_id, invoice_number, action, old_status, new_status, amount, created_at) FROM stdin;
01498c99-f604-49fa-a131-5175af0d4e9e	6e1bf4cd-639c-4112-8681-57fdf6a2793b	4da21cc5-c59e-461a-b097-8877aea05915	INV-2026-0013	create	\N	pending	175.82	2026-06-24 18:01:30.347
0575358a-7df2-4db1-add7-fe84c890f23b	4580e056-5929-4cd4-bf6e-6ee2e44749ff	a9dadfb8-b310-4477-baec-98049a4214b6	INV-2026-0002	create	\N	pending	0	2026-06-19 09:35:27.717
062b69fa-2bf3-4187-8840-b3089d3669f5	59ffc06a-a098-4c42-9cb7-8df23cbae806	257cc76c-ac70-450e-bc98-baafdbef80b8	INV-2026-0015	create	\N	pending	0	2026-06-26 11:08:29.797
0920639b-9235-4560-b136-2d688c37016e	771743ea-a1ad-47f3-9467-74f925fc2725	ff8a5d40-eb0c-42a8-89ff-dd51b4311b16	INV-2026-0012	status_change	pending	paid	22.42	2026-06-24 17:48:20.597
1275efe2-4cea-4560-9892-5b2b1dfa518b	59ffc06a-a098-4c42-9cb7-8df23cbae806	c81c77dd-2c59-44e6-a391-b2d753f82c43	INV-2026-0011	create	\N	pending	22.42	2026-06-22 12:19:40.89
15bba5ca-d01b-4d48-8d86-3803b9396cb3	4580e056-5929-4cd4-bf6e-6ee2e44749ff	a9dadfb8-b310-4477-baec-98049a4214b6	INV-2026-0002	status_change	pending	paid	0	2026-06-19 09:35:34.853
1bb11e4b-5515-4b65-88f8-4fb815e2d15f	59ffc06a-a098-4c42-9cb7-8df23cbae806	a63d9429-382a-4d0a-b1c4-cdf19b301c0d	INV-2026-0014	create	\N	pending	22.42	2026-06-26 10:10:07.5
230f9f05-e763-4138-8aaf-cfc94247272e	59ffc06a-a098-4c42-9cb7-8df23cbae806	4d09f4f6-17d5-4c39-be8c-9f7b002b4cc1	INV-2026-0007	create	\N	pending	22.42	2026-06-22 05:24:49.273
42d6f4d5-13f8-4324-ba5a-1279b2dffb86	59ffc06a-a098-4c42-9cb7-8df23cbae806	c81c77dd-2c59-44e6-a391-b2d753f82c43	INV-2026-0011	status_change	pending	paid	22.42	2026-06-22 12:19:56.347
45dd7c8c-b9ea-481c-a81f-0100e5460bae	59ffc06a-a098-4c42-9cb7-8df23cbae806	e6e236ac-6141-4349-89a1-df3a857e5795	INV-2026-0009	create	\N	pending	22.42	2026-06-22 06:18:56.52
4ab11287-46d4-4de5-a39e-21a6fb55e03e	59ffc06a-a098-4c42-9cb7-8df23cbae806	1b4001ba-028d-4aeb-9361-bc89e8633c18	INV-2026-0010	status_change	pending	paid	0	2026-06-22 08:26:55.497
527c6c23-0251-40a4-87b8-81643bd6e168	59ffc06a-a098-4c42-9cb7-8df23cbae806	e6e236ac-6141-4349-89a1-df3a857e5795	INV-2026-0009	status_change	pending	paid	22.42	2026-06-22 06:19:04.53
5eaed6ea-303d-4ae2-8988-f30e3b47a99f	4580e056-5929-4cd4-bf6e-6ee2e44749ff	1a649713-85da-4442-b034-b589f66930cb	INV-2026-0001	status_change	pending	paid	22.42	2026-06-19 08:34:08.253
6d764e07-f343-43e3-932b-329b2f81798c	59ffc06a-a098-4c42-9cb7-8df23cbae806	3a305fdc-541a-492f-acc8-e9ed7420cf45	INV-2026-0005	create	\N	pending	22.42	2026-06-22 04:46:06.237
76c9a4cc-74eb-4a57-9e28-d6e759bb557a	6e1bf4cd-639c-4112-8681-57fdf6a2793b	4da21cc5-c59e-461a-b097-8877aea05915	INV-2026-0013	status_change	pending	paid	175.82	2026-06-24 18:01:46.54
8b77f3e2-55a1-4f5c-b65c-8551fe6f67f0	59ffc06a-a098-4c42-9cb7-8df23cbae806	257cc76c-ac70-450e-bc98-baafdbef80b8	INV-2026-0015	status_change	pending	paid	0	2026-06-26 11:08:46.187
957b7a1f-a795-436f-9d27-b2c8150e1464	59ffc06a-a098-4c42-9cb7-8df23cbae806	1b4001ba-028d-4aeb-9361-bc89e8633c18	INV-2026-0010	create	\N	pending	0	2026-06-22 08:26:20.52
a2279c7a-b903-40f1-9709-90e2f6e0da5e	59ffc06a-a098-4c42-9cb7-8df23cbae806	7a9ad6c8-86fe-4d55-afc2-1da0d00f09f3	INV-2026-0008	status_change	pending	paid	57.82	2026-06-22 05:47:52.097
a5d42d57-8ee8-4f5d-b7ac-fdcdd27d0b07	59ffc06a-a098-4c42-9cb7-8df23cbae806	9280c232-2259-40c9-8a7b-cec00abbd32c	INV-2026-0006	status_change	pending	paid	57.82	2026-06-22 04:55:02.98
a6e0b0f1-71a9-41d0-b3b9-3ec34518a39c	4580e056-5929-4cd4-bf6e-6ee2e44749ff	564c898b-c0b1-4df7-b5ee-af4646a05b6b	INV-2026-0004	status_change	pending	paid	22.42	2026-06-19 10:10:00.723
af9637b2-c13d-4d8d-8906-3feccb3c00fa	59ffc06a-a098-4c42-9cb7-8df23cbae806	9280c232-2259-40c9-8a7b-cec00abbd32c	INV-2026-0006	create	\N	pending	57.82	2026-06-22 04:54:16.26
bbd16f8d-14c5-4c37-afe2-a3fb0157aa75	771743ea-a1ad-47f3-9467-74f925fc2725	ff8a5d40-eb0c-42a8-89ff-dd51b4311b16	INV-2026-0012	create	\N	pending	22.42	2026-06-24 17:47:56.37
bfd330ca-dadf-48fd-939d-581e5503434d	59ffc06a-a098-4c42-9cb7-8df23cbae806	3a305fdc-541a-492f-acc8-e9ed7420cf45	INV-2026-0005	status_change	pending	paid	22.42	2026-06-22 04:46:28.75
cb077dc2-df4c-43ed-9909-bf085d7337e3	4580e056-5929-4cd4-bf6e-6ee2e44749ff	1a649713-85da-4442-b034-b589f66930cb	INV-2026-0001	create	\N	pending	22.42	2026-06-19 08:33:19.513
e1000fde-38ff-40a1-ba69-5f56215ac2e7	4580e056-5929-4cd4-bf6e-6ee2e44749ff	06888568-0915-43a1-be3d-d93767d4fa58	INV-2026-0003	create	\N	pending	22.42	2026-06-19 10:08:52.947
e50eac52-9146-4479-b291-028c05abc8c0	4580e056-5929-4cd4-bf6e-6ee2e44749ff	fe83cd8c-d685-47f5-b783-868d539d773b	INV-TEST-999	status_change	pending	paid	57.82	2026-06-22 06:16:10.427
e6fca1d1-7ce0-4af7-b138-1a0e487ae6bb	4580e056-5929-4cd4-bf6e-6ee2e44749ff	564c898b-c0b1-4df7-b5ee-af4646a05b6b	INV-2026-0004	create	\N	pending	22.42	2026-06-19 10:09:48.663
f5851734-a73f-4fc1-be3a-de5c0a26cf7c	59ffc06a-a098-4c42-9cb7-8df23cbae806	7a9ad6c8-86fe-4d55-afc2-1da0d00f09f3	INV-2026-0008	create	\N	pending	57.82	2026-06-22 05:46:39.427
fe03263f-203e-43e6-84aa-a567c15841e7	59ffc06a-a098-4c42-9cb7-8df23cbae806	4d09f4f6-17d5-4c39-be8c-9f7b002b4cc1	INV-2026-0007	status_change	pending	paid	22.42	2026-06-22 05:24:58.47
f88b7a89-60dd-4278-a34e-97c9071981fe	59ffc06a-a098-4c42-9cb7-8df23cbae806	84f98031-f9c6-4ca0-8da6-e3d340764bd1	INV-2026-0016	create	\N	pending	22.42	2026-06-27 10:37:29.421483
56cdadeb-fc4f-46e9-849c-7ff6a34436e4	59ffc06a-a098-4c42-9cb7-8df23cbae806	84f98031-f9c6-4ca0-8da6-e3d340764bd1	INV-2026-0016	status_change	pending	paid	22.42	2026-06-27 10:37:49.599088
fc1e6b28-203e-4606-92ba-1c0ba62dd679	59ffc06a-a098-4c42-9cb7-8df23cbae806	23edd259-e2bc-42c2-b6fd-7d391fe99651	INV-2026-0017	create	\N	pending	22.42	2026-06-28 17:18:15.688614
d5b65dc2-80cd-4ba7-a16b-a74cf8d945fe	59ffc06a-a098-4c42-9cb7-8df23cbae806	d5a30e45-93aa-442d-9f32-ed348a6e1b92	INV-2026-0018	create	\N	pending	0	2026-06-28 17:20:55.14735
d409b75b-c4c6-49d0-ba45-1806aac534eb	59ffc06a-a098-4c42-9cb7-8df23cbae806	d5a30e45-93aa-442d-9f32-ed348a6e1b92	INV-2026-0018	status_change	pending	paid	0	2026-06-28 17:21:21.40647
2744e816-1bf0-45fc-a1cd-7daae2d98645	58afbbe1-aa38-45a0-b546-52981be67c00	99d77c5f-b7cf-409d-ac89-72b24a594860	INV-2026-0019	create	\N	pending	22.42	2026-06-28 17:28:34.195337
6ed2636a-2b33-43be-becc-335ab2dbc8d8	58afbbe1-aa38-45a0-b546-52981be67c00	5a15056e-3734-476e-948a-a410b1bb6944	INV-2026-0020	create	\N	pending	22.42	2026-06-28 17:31:28.009085
7e9bd0ea-6f7d-4c11-ac05-e5469077b80b	58afbbe1-aa38-45a0-b546-52981be67c00	5a15056e-3734-476e-948a-a410b1bb6944	INV-2026-0020	status_change	pending	paid	22.42	2026-06-28 17:31:46.748842
0cc918a4-3fe7-4e37-811c-dff72be1e1ed	59ffc06a-a098-4c42-9cb7-8df23cbae806	3b443d20-1374-48a7-8af1-a1d8d8e268fb	INV-2026-0021	create	\N	pending	22.42	2026-06-28 18:01:35.304485
9459fb6d-2b19-43d2-b6fe-1be7840170cf	59ffc06a-a098-4c42-9cb7-8df23cbae806	3b443d20-1374-48a7-8af1-a1d8d8e268fb	INV-2026-0021	status_change	pending	paid	22.42	2026-06-28 18:01:51.910925
1704c0ca-d97c-4cb4-9ff3-1ec9a39fc47f	59ffc06a-a098-4c42-9cb7-8df23cbae806	06b8f49a-ecee-48ce-85b1-4ab335d73336	INV-2026-0022	create	\N	pending	0	2026-06-30 13:28:03.282085
5a5c0b9b-b777-44f9-8021-39ecd275538e	59ffc06a-a098-4c42-9cb7-8df23cbae806	580b181b-139a-4346-b025-ca52733b9092	INV-2026-0023	create	\N	pending	555.07	2026-06-30 13:29:32.478923
2bdd1926-2612-44fc-90dc-fe46ab3e866a	59ffc06a-a098-4c42-9cb7-8df23cbae806	8635e789-da5e-4626-a9d4-982c1f7690cb	INV-2026-0024	create	\N	pending	0	2026-07-01 06:18:13.297637
2e5a4795-da40-468d-9771-af5a8330b185	59ffc06a-a098-4c42-9cb7-8df23cbae806	8635e789-da5e-4626-a9d4-982c1f7690cb	INV-2026-0024	status_change	pending	paid	0	2026-07-01 06:18:31.244554
c0786c2c-cc48-4675-83aa-e5b67c9f84a4	59ffc06a-a098-4c42-9cb7-8df23cbae806	f033926a-5fad-40c3-b5d3-23f471415f2c	INV-2026-0025	create	\N	pending	34.22	2026-07-01 10:16:48.767955
a79a1f59-bbb0-4ae8-aa7f-9e84da821f1d	59ffc06a-a098-4c42-9cb7-8df23cbae806	f033926a-5fad-40c3-b5d3-23f471415f2c	INV-2026-0025	status_change	pending	paid	34.22	2026-07-01 10:17:36.570271
aa6df2e0-5a0e-4373-b60b-54159065357b	59ffc06a-a098-4c42-9cb7-8df23cbae806	6bdd4e0f-0ec0-4167-8616-46e774ac56c1	INV-2026-0026	create	\N	pending	57.82	2026-07-07 06:20:06.677432
dc743872-cdfe-4bea-a7c6-9c1a921b2704	59ffc06a-a098-4c42-9cb7-8df23cbae806	6bdd4e0f-0ec0-4167-8616-46e774ac56c1	INV-2026-0026	status_change	pending	paid	57.82	2026-07-07 06:20:57.406273
8e85e015-94c1-4da5-a5f8-4f6d51847425	59ffc06a-a098-4c42-9cb7-8df23cbae806	d925dd11-27ce-42b2-9816-5c24c2efe699	INV-2026-0027	create	\N	pending	22.42	2026-07-10 06:04:01.235912
ec61212c-bc38-4837-8224-cb5643662c51	59ffc06a-a098-4c42-9cb7-8df23cbae806	d925dd11-27ce-42b2-9816-5c24c2efe699	INV-2026-0027	status_change	pending	paid	22.42	2026-07-10 06:06:48.281692
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_number, tenant_id, plan_id, amount, tax_amount, total_amount, currency, status, billing_period_start, billing_period_end, due_date, paid_at, pdf_path, created_at) FROM stdin;
06888568-0915-43a1-be3d-d93767d4fa58	INV-2026-0003	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	pending	2026-06-19 10:08:52.663	2026-07-19 10:08:52.663	2026-06-26 10:08:52.663	\N	\N	2026-06-19 10:08:52.69
1a649713-85da-4442-b034-b589f66930cb	INV-2026-0001	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-19 08:33:18.823	2026-07-19 08:33:18.823	2026-06-26 08:33:18.823	2026-06-19 08:34:01.737	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0001.pdf	2026-06-19 08:33:18.993
1b4001ba-028d-4aeb-9361-bc89e8633c18	INV-2026-0010	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	paid	2026-06-22 08:26:19.64	2026-07-22 08:26:19.64	2026-06-29 08:26:19.64	2026-06-22 08:26:49.99	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0010.pdf	2026-06-22 08:26:19.87
257cc76c-ac70-450e-bc98-baafdbef80b8	INV-2026-0015	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	paid	2026-06-26 11:08:29.713	2026-07-26 11:08:29.713	2026-07-03 11:08:29.713	2026-06-26 11:08:45.563	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0015.pdf	2026-06-26 11:08:29.717
3a305fdc-541a-492f-acc8-e9ed7420cf45	INV-2026-0005	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-22 04:46:03.297	2026-07-22 04:46:03.297	2026-06-29 04:46:03.297	2026-06-22 04:46:27.22	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0005.pdf	2026-06-22 04:46:03.307
4d09f4f6-17d5-4c39-be8c-9f7b002b4cc1	INV-2026-0007	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-22 05:24:48.863	2026-07-22 05:24:48.863	2026-06-29 05:24:48.863	2026-06-22 05:24:57.16	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0007.pdf	2026-06-22 05:24:48.927
4da21cc5-c59e-461a-b097-8877aea05915	INV-2026-0013	6e1bf4cd-639c-4112-8681-57fdf6a2793b	6f5961cc-2635-4c73-a984-685c07fd1664	149	26.82	175.82	INR	paid	2026-06-24 18:01:30.053	2026-07-24 18:01:30.053	2026-07-01 18:01:30.053	2026-06-24 18:01:45.77	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0013.pdf	2026-06-24 18:01:30.123
564c898b-c0b1-4df7-b5ee-af4646a05b6b	INV-2026-0004	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-19 10:09:48.643	2026-07-19 10:09:48.643	2026-06-26 10:09:48.643	2026-06-19 10:09:59.593	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0004.pdf	2026-06-19 10:09:48.643
7a9ad6c8-86fe-4d55-afc2-1da0d00f09f3	INV-2026-0008	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	49	8.82	57.82	INR	paid	2026-06-22 05:46:39.353	2026-07-22 05:46:39.353	2026-06-29 05:46:39.353	2026-06-22 05:47:51.91	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0008.pdf	2026-06-22 05:46:39.37
9280c232-2259-40c9-8a7b-cec00abbd32c	INV-2026-0006	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	49	8.82	57.82	INR	paid	2026-06-22 04:54:16.177	2026-07-22 04:54:16.177	2026-06-29 04:54:16.177	2026-06-22 04:55:02.817	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0006.pdf	2026-06-22 04:54:16.23
a63d9429-382a-4d0a-b1c4-cdf19b301c0d	INV-2026-0014	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	pending	2026-06-26 10:10:07.423	2026-07-26 10:10:07.423	2026-07-03 10:10:07.423	\N	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0014.pdf	2026-06-26 10:10:07.443
a9dadfb8-b310-4477-baec-98049a4214b6	INV-2026-0002	4580e056-5929-4cd4-bf6e-6ee2e44749ff	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	paid	2026-06-19 09:35:27.637	2026-07-19 09:35:27.637	2026-06-26 09:35:27.637	2026-06-19 09:35:34.557	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0002.pdf	2026-06-19 09:35:27.64
c81c77dd-2c59-44e6-a391-b2d753f82c43	INV-2026-0011	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-22 12:19:40.607	2026-07-22 12:19:40.607	2026-06-29 12:19:40.607	2026-06-22 12:19:55.373	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0011.pdf	2026-06-22 12:19:40.623
e6e236ac-6141-4349-89a1-df3a857e5795	INV-2026-0009	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-22 06:18:56.403	2026-07-22 06:18:56.403	2026-06-29 06:18:56.403	2026-06-22 06:19:02.067	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0009.pdf	2026-06-22 06:18:56.423
fe83cd8c-d685-47f5-b783-868d539d773b	INV-TEST-999	4580e056-5929-4cd4-bf6e-6ee2e44749ff	bd2d30c1-c0d4-4a07-82f4-e02df7136745	49	8.82	57.82	INR	paid	2026-06-16 08:22:19.013	2026-06-16 08:22:19.013	2026-06-16 08:22:19.013	2026-06-22 06:16:10.347	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-TEST-999.pdf	2026-06-22 06:16:10.277
ff8a5d40-eb0c-42a8-89ff-dd51b4311b16	INV-2026-0012	771743ea-a1ad-47f3-9467-74f925fc2725	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-24 17:47:55.63	2026-07-24 17:47:55.63	2026-07-01 17:47:55.63	2026-06-24 17:48:18.427	C:\\Users\\nancy\\Downloads\\mcc-ai-language-platform-praveen\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0012.pdf	2026-06-24 17:47:55.7
5a15056e-3734-476e-948a-a410b1bb6944	INV-2026-0020	58afbbe1-aa38-45a0-b546-52981be67c00	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-28 17:31:27.926391	2026-07-28 17:31:27.926391	2026-07-05 17:31:27.926391	2026-06-28 17:31:46.477918	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0020.pdf	2026-06-28 17:31:27.932736
84f98031-f9c6-4ca0-8da6-e3d340764bd1	INV-2026-0016	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-27 10:37:28.88451	2026-07-27 10:37:28.88451	2026-07-04 10:37:28.88451	2026-06-27 10:37:48.666779	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0016.pdf	2026-06-27 10:37:29.318847
23edd259-e2bc-42c2-b6fd-7d391fe99651	INV-2026-0017	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	pending	2026-06-28 17:18:15.66332	2026-07-28 17:18:15.66332	2026-07-05 17:18:15.66332	\N	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0017.pdf	2026-06-28 17:18:15.66332
d5a30e45-93aa-442d-9f32-ed348a6e1b92	INV-2026-0018	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	paid	2026-06-28 17:20:55.084163	2026-07-28 17:20:55.084163	2026-07-05 17:20:55.084163	2026-06-28 17:21:21.130773	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0018.pdf	2026-06-28 17:20:55.095262
99d77c5f-b7cf-409d-ac89-72b24a594860	INV-2026-0019	58afbbe1-aa38-45a0-b546-52981be67c00	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	pending	2026-06-28 17:28:34.183348	2026-07-28 17:28:34.183348	2026-07-05 17:28:34.183348	\N	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0019.pdf	2026-06-28 17:28:34.183348
580b181b-139a-4346-b025-ca52733b9092	INV-2026-0023	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	470.40000000000003	84.67	555.07	INR	pending	2026-06-30 13:29:31.745932	2027-06-30 13:29:31.745932	2026-07-07 13:29:31.745932	\N	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0023.pdf	2026-06-30 13:29:32.007544
3b443d20-1374-48a7-8af1-a1d8d8e268fb	INV-2026-0021	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-06-28 18:01:35.26235	2026-07-28 18:01:35.26235	2026-07-05 18:01:35.26235	2026-06-28 18:01:51.561707	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0021.pdf	2026-06-28 18:01:35.266414
06b8f49a-ecee-48ce-85b1-4ab335d73336	INV-2026-0022	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	pending	2026-06-30 13:28:02.705416	2026-07-30 13:28:02.705416	2026-07-07 13:28:02.705416	\N	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0022.pdf	2026-06-30 13:28:03.045573
8635e789-da5e-4626-a9d4-982c1f7690cb	INV-2026-0024	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	0	0	0	INR	paid	2026-07-01 06:18:13.173589	2026-07-31 06:18:13.173589	2026-07-08 06:18:13.173589	2026-07-01 06:18:30.568783	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0024.pdf	2026-07-01 06:18:13.193154
f033926a-5fad-40c3-b5d3-23f471415f2c	INV-2026-0025	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	29	5.22	34.22	INR	paid	2026-07-01 10:16:48.368052	2026-07-31 10:16:48.368052	2026-07-08 10:16:48.368052	2026-07-01 10:17:34.86251	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0025.pdf	2026-07-01 10:16:48.434429
6bdd4e0f-0ec0-4167-8616-46e774ac56c1	INV-2026-0026	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	49	8.82	57.82	INR	paid	2026-07-07 06:20:06.358007	2026-08-06 06:20:06.358007	2026-07-14 06:20:06.358007	2026-07-07 06:20:56.409135	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0026.pdf	2026-07-07 06:20:06.458788
d925dd11-27ce-42b2-9816-5c24c2efe699	INV-2026-0027	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	19	3.42	22.42	INR	paid	2026-07-10 06:03:59.533837	2026-08-09 06:03:59.533837	2026-07-17 06:03:59.533837	2026-07-10 06:06:46.859804	D:\\mcc-ai-language-platform-praveen\\backend\\invoices_pdf\\INV-2026-0027.pdf	2026-07-10 06:04:00.05096
\.


--
-- Data for Name: media_library; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_library (id, tenant_id, file_name, file_url, file_size, file_type, created_at) FROM stdin;
\.


--
-- Data for Name: navigation_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.navigation_items (id, tenant_id, parent_id, label, route, icon, "order", is_visible, roles) FROM stdin;
4bfe2a55-4339-4e7d-a62f-7aad50182e01	\N	\N	Home	landing	\N	1	t	*
12ef49e5-7dc5-4049-baa0-2675dd0011dc	\N	\N	About	about	\N	2	t	*
0912ecd3-fcb2-4560-8817-855988968a64	\N	\N	AI Tools	ai-language-tools	\N	3	t	*
99852c0f-e708-4cb5-8980-b6220e2931a5	\N	\N	Plans	pricing	\N	4	t	*
bb1c1b0b-9450-42d3-904f-8094524b169b	\N	\N	Contacts	contact	\N	5	t	*
\.


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_transactions (id, payment_id, tenant_id, gateway, event_type, gateway_response, status, error_message, created_at) FROM stdin;
02d0fbef-927b-4d60-ba27-7fdd379f00e0	5f36be88-eb4e-47a4-97df-83b03848cb59	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T04:46:24.260Z"}	success	\N	2026-06-22 04:46:28.953
20c425af-740d-4c90-9848-adb932c5c616	c919776a-7ed5-49c3-a623-92809be317ac	771743ea-a1ad-47f3-9467-74f925fc2725	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-24T17:48:15.696Z"}	success	\N	2026-06-24 17:48:22.843
32328243-1cb6-4572-b99a-268629d3f07f	9aa8e3fc-67e3-401b-88f2-e4d5ab02012b	4580e056-5929-4cd4-bf6e-6ee2e44749ff	upi	payment.succeeded	{"gateway":"upi","status":"captured","time":"2026-06-19T10:09:59.120Z"}	success	\N	2026-06-19 10:10:00.76
43751aa5-7304-483f-8fd2-778be78ac444	24e67cf3-abd6-4791-935b-fa917c3433a9	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T08:26:45.931Z"}	success	\N	2026-06-22 08:26:55.807
5fca329d-cd4f-4127-8482-608ce2a54413	bbfca2a9-58a7-4b77-81f7-6a86e6051330	4580e056-5929-4cd4-bf6e-6ee2e44749ff	upi	payment.succeeded	{"gateway":"upi","status":"captured","time":"2026-06-19T08:34:01.068Z"}	success	\N	2026-06-19 08:34:08.673
6723550e-67ca-497a-bf5d-84a42d7ec2c0	c198845f-9345-48f8-a76d-332751102e84	4580e056-5929-4cd4-bf6e-6ee2e44749ff	stripe	payment.succeeded	{"gateway": "stripe", "status": "success", "payment_id": "c198845f-9345-48f8-a76d-332751102e84", "transaction_id": "TXN-WEBHOOK-TEST-12345"}	success	\N	2026-06-22 06:16:10.43
7bdaa136-9d1b-424b-97ad-47806e5e3de5	bdd967bb-4d80-4626-8c9f-f0397482aa31	4580e056-5929-4cd4-bf6e-6ee2e44749ff	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-19T09:35:34.393Z"}	success	\N	2026-06-19 09:35:34.877
8a753923-1912-4aae-b26e-4984c99b0b41	69bff04d-1d60-4160-9d0d-2f4dc53ac93e	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T05:47:51.750Z"}	success	\N	2026-06-22 05:47:52.103
c4ce2049-de30-4b8c-860f-87a2b4317019	cb18f9b8-0ccf-41c7-a68f-243ea469a76b	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T05:24:56.623Z"}	success	\N	2026-06-22 05:24:58.587
d7d637ea-0058-4889-b5df-93e468277cf9	81713794-0562-472d-abad-42a0697f1a2d	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T12:19:54.690Z"}	success	\N	2026-06-22 12:19:56.59
df4b89df-d6f4-4abd-9e49-3c5c6cdcc72c	0259c514-3800-4625-8f2a-ee691d102495	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T04:55:02.790Z"}	success	\N	2026-06-22 04:55:02.983
f0fcbeee-58c8-4fc1-a114-79adba14ddb6	db706731-46e2-418b-8e65-db886e05c694	6e1bf4cd-639c-4112-8681-57fdf6a2793b	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-24T18:01:45.383Z"}	success	\N	2026-06-24 18:01:46.62
f6b84871-e389-4a1a-ac07-f66d361053a8	98722b2c-98b0-44bb-9823-b4e7b02e85bf	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-26T11:08:44.757Z"}	success	\N	2026-06-26 11:08:46.323
fb8032d0-ee8e-423d-be58-977605853ffb	833d744f-3199-4170-9996-8d91d69b113a	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-22T06:19:01.854Z"}	success	\N	2026-06-22 06:19:04.533
1c87dd88-82ac-4c3f-8031-c9b8ea2f8d77	e6377b84-8d5a-4a78-9455-7db3ea0b2fcb	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-06-27T10:37:48.315Z"}	success	\N	2026-06-27 10:37:49.73116
40ec905f-230a-4220-bf3e-86a036fd12b1	b8f32680-42fa-49cd-afb1-c68ea27d7f08	59ffc06a-a098-4c42-9cb7-8df23cbae806	razorpay	payment.succeeded	{"gateway":"razorpay","status":"captured","time":"2026-06-28T17:21:20.632Z"}	success	\N	2026-06-28 17:21:21.417768
a23571ad-c0d2-45d0-9e48-6affef6c52a2	b662c222-e6f6-489b-ac67-5c89faf172ce	58afbbe1-aa38-45a0-b546-52981be67c00	razorpay	payment.succeeded	{"gateway":"razorpay","status":"captured","time":"2026-06-28T17:31:46.336Z"}	success	\N	2026-06-28 17:31:46.792265
7b3e4ac5-d3aa-4a03-b653-7021831bc747	4c52e559-1252-487b-a431-4aa5fb8c09a1	59ffc06a-a098-4c42-9cb7-8df23cbae806	razorpay	payment.succeeded	{"gateway":"razorpay","status":"captured","time":"2026-06-28T18:01:51.102Z"}	success	\N	2026-06-28 18:01:51.944926
7ce9ef38-f522-49ca-8dc2-13cad9f2e3f2	7eb1dc4e-c78f-47c8-b967-3b1dd5b16f02	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-07-01T06:18:30.240Z"}	success	\N	2026-07-01 06:18:31.249899
e972d264-38e8-4549-9886-e1b900c2da25	bf0dd3d9-7c3b-40dc-9413-234cb27d4c48	59ffc06a-a098-4c42-9cb7-8df23cbae806	stripe	payment.succeeded	{"gateway":"stripe","status":"captured","time":"2026-07-01T10:17:33.876Z"}	success	\N	2026-07-01 10:17:36.591263
4f1bf579-4077-4d7b-b12b-f6d71d376db3	7db492e6-fcef-4a67-9e5e-a5c7f11d53db	59ffc06a-a098-4c42-9cb7-8df23cbae806	razorpay	payment.succeeded	{"gateway":"razorpay","status":"captured","time":"2026-07-07T06:20:55.644Z"}	success	\N	2026-07-07 06:20:57.490402
9feb9694-00fd-469c-9e6b-0f5963484034	6a9af84a-44e6-455f-893a-23b216363be5	59ffc06a-a098-4c42-9cb7-8df23cbae806	razorpay	payment.succeeded	{"gateway":"razorpay","status":"captured","time":"2026-07-10T06:06:45.384Z"}	success	\N	2026-07-10 06:06:48.465315
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, invoice_id, tenant_id, amount, currency, payment_method, status, transaction_id, created_at) FROM stdin;
0259c514-3800-4625-8f2a-ee691d102495	9280c232-2259-40c9-8a7b-cec00abbd32c	59ffc06a-a098-4c42-9cb7-8df23cbae806	57.82	INR	stripe	success	TXN-1782104102790	2026-06-22 04:54:16.31
24e67cf3-abd6-4791-935b-fa917c3433a9	1b4001ba-028d-4aeb-9361-bc89e8633c18	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	INR	stripe	success	TXN-1782116805931	2026-06-22 08:26:24.093
5f36be88-eb4e-47a4-97df-83b03848cb59	3a305fdc-541a-492f-acc8-e9ed7420cf45	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	success	TXN-1782103584260	2026-06-22 04:46:10.637
6881109d-572c-4c52-a761-6fdbbb4b9417	a63d9429-382a-4d0a-b1c4-cdf19b301c0d	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	pending	\N	2026-06-26 10:10:07.567
69bff04d-1d60-4160-9d0d-2f4dc53ac93e	7a9ad6c8-86fe-4d55-afc2-1da0d00f09f3	59ffc06a-a098-4c42-9cb7-8df23cbae806	57.82	INR	stripe	success	TXN-1782107271750	2026-06-22 05:46:39.443
81713794-0562-472d-abad-42a0697f1a2d	c81c77dd-2c59-44e6-a391-b2d753f82c43	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	success	TXN-1782130794690	2026-06-22 12:19:41.173
833d744f-3199-4170-9996-8d91d69b113a	e6e236ac-6141-4349-89a1-df3a857e5795	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	success	TXN-1782109141854	2026-06-22 06:18:56.603
85615322-e0b3-4b6d-b595-b510c988292a	06888568-0915-43a1-be3d-d93767d4fa58	4580e056-5929-4cd4-bf6e-6ee2e44749ff	22.42	INR	stripe	pending	\N	2026-06-19 10:08:53.037
98722b2c-98b0-44bb-9823-b4e7b02e85bf	257cc76c-ac70-450e-bc98-baafdbef80b8	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	INR	stripe	success	TXN-1782472124756	2026-06-26 11:08:29.893
9aa8e3fc-67e3-401b-88f2-e4d5ab02012b	564c898b-c0b1-4df7-b5ee-af4646a05b6b	4580e056-5929-4cd4-bf6e-6ee2e44749ff	22.42	INR	upi	success	TXN-1781863799120	2026-06-19 10:09:48.913
bbfca2a9-58a7-4b77-81f7-6a86e6051330	1a649713-85da-4442-b034-b589f66930cb	4580e056-5929-4cd4-bf6e-6ee2e44749ff	22.42	INR	upi	success	TXN-1781858041068	2026-06-19 08:33:19.91
bdd967bb-4d80-4626-8c9f-f0397482aa31	a9dadfb8-b310-4477-baec-98049a4214b6	4580e056-5929-4cd4-bf6e-6ee2e44749ff	0	INR	stripe	success	TXN-1781861734393	2026-06-19 09:35:27.783
c198845f-9345-48f8-a76d-332751102e84	fe83cd8c-d685-47f5-b783-868d539d773b	4580e056-5929-4cd4-bf6e-6ee2e44749ff	57.82	INR	stripe	success	TXN-WEBHOOK-TEST-12345	2026-06-22 06:16:10.307
c919776a-7ed5-49c3-a623-92809be317ac	ff8a5d40-eb0c-42a8-89ff-dd51b4311b16	771743ea-a1ad-47f3-9467-74f925fc2725	22.42	INR	stripe	success	TXN-1782323295696	2026-06-24 17:47:56.89
cb18f9b8-0ccf-41c7-a68f-243ea469a76b	4d09f4f6-17d5-4c39-be8c-9f7b002b4cc1	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	success	TXN-1782105896623	2026-06-22 05:24:49.733
db706731-46e2-418b-8e65-db886e05c694	4da21cc5-c59e-461a-b097-8877aea05915	6e1bf4cd-639c-4112-8681-57fdf6a2793b	175.82	INR	stripe	success	TXN-1782324105383	2026-06-24 18:01:30.54
e6377b84-8d5a-4a78-9455-7db3ea0b2fcb	84f98031-f9c6-4ca0-8da6-e3d340764bd1	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	success	TXN-1782556668315	2026-06-27 10:37:29.515372
472ce582-ec7f-4dc6-9fec-7d3c43284e05	23edd259-e2bc-42c2-b6fd-7d391fe99651	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	stripe	pending	\N	2026-06-28 17:18:15.696056
b8f32680-42fa-49cd-afb1-c68ea27d7f08	d5a30e45-93aa-442d-9f32-ed348a6e1b92	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	INR	razorpay	success	TXN-1782667280632	2026-06-28 17:20:55.199774
d52325b4-892c-4ae4-90df-0b0b2c2fd8a8	99d77c5f-b7cf-409d-ac89-72b24a594860	58afbbe1-aa38-45a0-b546-52981be67c00	22.42	INR	stripe	pending	\N	2026-06-28 17:28:34.202867
b662c222-e6f6-489b-ac67-5c89faf172ce	5a15056e-3734-476e-948a-a410b1bb6944	58afbbe1-aa38-45a0-b546-52981be67c00	22.42	INR	razorpay	success	TXN-1782667906336	2026-06-28 17:31:28.071635
4c52e559-1252-487b-a431-4aa5fb8c09a1	3b443d20-1374-48a7-8af1-a1d8d8e268fb	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	razorpay	success	TXN-1782669711102	2026-06-28 18:01:35.344281
5479664c-4a97-4068-94e5-d155539da4a2	06b8f49a-ecee-48ce-85b1-4ab335d73336	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	INR	stripe	pending	\N	2026-06-30 13:28:03.577826
9966ae7e-8c3f-4a46-9803-5d75b90aaeab	580b181b-139a-4346-b025-ca52733b9092	59ffc06a-a098-4c42-9cb7-8df23cbae806	555.07	INR	stripe	pending	\N	2026-06-30 13:29:33.244776
7eb1dc4e-c78f-47c8-b967-3b1dd5b16f02	8635e789-da5e-4626-a9d4-982c1f7690cb	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	INR	stripe	success	TXN-1782886710240	2026-07-01 06:18:13.448221
bf0dd3d9-7c3b-40dc-9413-234cb27d4c48	f033926a-5fad-40c3-b5d3-23f471415f2c	59ffc06a-a098-4c42-9cb7-8df23cbae806	34.22	INR	stripe	success	TXN-1782901053876	2026-07-01 10:16:49.448944
7db492e6-fcef-4a67-9e5e-a5c7f11d53db	6bdd4e0f-0ec0-4167-8616-46e774ac56c1	59ffc06a-a098-4c42-9cb7-8df23cbae806	57.82	INR	razorpay	success	TXN-1783405255644	2026-07-07 06:20:06.898884
6a9af84a-44e6-455f-893a-23b216363be5	d925dd11-27ce-42b2-9816-5c24c2efe699	59ffc06a-a098-4c42-9cb7-8df23cbae806	22.42	INR	razorpay	success	TXN-1783663605384	2026-07-10 06:04:01.785914
\.


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_settings (id, tenant_id, invite_only, registration_approval, enable_email_login, enable_google_login, enable_microsoft_login, enable_otp_login, enable_magic_link, custom_css, custom_js, tracking_scripts, created_at, updated_at, allowed_document_types, allowed_document_extensions) FROM stdin;
c15818b4-3db0-49d9-b593-f010801ab859	\N	f	f	t	f	f	f	f	\N	\N	\N	2026-06-17 10:15:15.34	2026-06-17 10:15:15.34	.doc,.docx,.xls,.xlsx	.doc,.docx,.xls,.xlsx
\.


--
-- Data for Name: provider_configurations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_configurations (id, tenant_id, provider_name, is_enabled, credentials_encrypted, priority, config_json, created_at, updated_at, circuit_breaker_failures, circuit_breaker_opened_at) FROM stdin;
\.


--
-- Data for Name: provider_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_logs (id, provider_name, feature, status, error_code, error_message, response_time_ms, retry_count, fallback_occurred, tenant_id, created_at) FROM stdin;
e379882d-6cf9-45b2-8bc4-b2bbb0d71999	openrouter-gemini	translation	success	\N	\N	6234	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-02 11:22:59.564239
0fc9df9a-248e-42e3-88a7-11460cddaa97	openrouter-gemini	translation	success	\N	\N	12186	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 07:37:49.109119
4cb9ec8e-dd01-415e-a601-e383e16ad71b	openrouter-gemini	translation	success	\N	\N	4671	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:01.129418
d0cfa4c1-e813-4436-9665-8ef72b175705	openrouter-gemini	translation	success	\N	\N	7327	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:01.498126
89d74f3d-fd9a-41d6-98ba-72a544eec1b4	openrouter-gemini	translation	success	\N	\N	3859	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:05.044006
620bf5ce-725c-4e68-8f0f-a3774035e6d9	openrouter-gemini	translation	success	\N	\N	4016	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:05.556942
1d2171e9-5cb4-4c2a-b8b4-44f050749ea9	openrouter-gemini	translation	success	\N	\N	4312	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:09.890387
e2f46480-e9dd-4f89-a3ad-177a77812e20	openrouter-gemini	translation	success	\N	\N	4827	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:09.904577
869eca39-eea5-4e09-9cbe-3593f709fe0e	openrouter-gemini	translation	success	\N	\N	3842	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:13.783968
4196d78f-7452-4e14-8d62-0ccaa5d26640	openrouter-gemini	translation	success	\N	\N	4405	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:14.320356
60a5b006-21ed-488e-ab0c-547bf77c7be9	openrouter-gemini	translation	success	\N	\N	3530	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:17.346644
aa730949-012c-432d-86e0-d2382023877d	openrouter-gemini	translation	success	\N	\N	4389	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:18.746983
b04433f4-6204-4ba7-9c90-2a7ea30da56b	openrouter-gemini	translation	success	\N	\N	3719	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:21.098225
bb470e2f-55d0-48bb-a656-595c39a2adf5	openrouter-gemini	translation	success	\N	\N	4594	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:23.359777
09e15a42-8d64-4e40-b72b-8cb30aed875c	openrouter-gemini	translation	success	\N	\N	5765	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:26.900081
feace690-ed1e-47f5-8171-91fa8cf61629	openrouter-gemini	translation	success	\N	\N	4578	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:27.956744
0b3b7cf3-3148-428f-96d0-2f01664f8856	openrouter-gemini	translation	success	\N	\N	6780	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:34.750108
f41067bc-3299-4480-be57-cd6d24304317	openrouter-gemini	translation	success	\N	\N	8343	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:35.265072
3e70da76-2a74-4331-92a3-d722b1f076ef	openrouter-gemini	translation	success	\N	\N	5344	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:40.108807
711ae74f-af29-4ef3-882d-c3cb5d819743	openrouter-gemini	translation	success	\N	\N	5563	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:40.843981
12ccb997-1ca7-4a05-9950-bae96ae2476b	openrouter-gemini	translation	success	\N	\N	3734	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:44.603735
540201fa-d33c-42aa-b19b-c6fd0c6821bb	openrouter-gemini	translation	success	\N	\N	4765	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:44.887733
4ac9061b-298c-4810-97a8-d032196c3d09	openrouter-gemini	translation	success	\N	\N	3860	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:48.499817
ca932645-1d66-4026-93e4-d0418218ccc8	openrouter-gemini	translation	success	\N	\N	4313	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:49.234565
b695c15b-37dc-4240-94f7-807a80b85449	openrouter-gemini	translation	success	\N	\N	4266	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:52.81097
82a355b5-2fae-4b45-b097-89f27f165e73	openrouter-gemini	translation	success	\N	\N	4656	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:53.916506
74b0e1ea-e9a0-4140-bc5f-88b679f4925b	openrouter-gemini	translation	success	\N	\N	4687	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:57.51332
502ec634-289d-468d-811d-2e7c206ef1dd	openrouter-gemini	translation	success	\N	\N	4250	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:39:58.208819
ee6a6dc3-d84f-48e6-b267-9394b0c73345	openrouter-gemini	translation	success	\N	\N	3421	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:00.975814
a04002af-1708-40b3-b2e1-739fdd46da32	openrouter-gemini	translation	success	\N	\N	4000	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:02.224741
0b555b38-ccd6-4074-8d32-ff256718fc49	openrouter-gemini	translation	success	\N	\N	8265	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:09.309363
cb7eb725-3b2d-4080-858d-f0b45f2a0f29	openrouter-gemini	translation	success	\N	\N	7032	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:09.311367
55cbd73e-1e0f-48a5-bead-5ca0e63896a7	openrouter-gemini	translation	success	\N	\N	4515	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:13.839707
00c8a282-0a6f-4321-8514-f362f9467474	openrouter-gemini	translation	success	\N	\N	4860	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:14.181597
0f10326e-44b3-4e04-a3fd-3f1a6b661317	openrouter-gemini	translation	success	\N	\N	3889	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:17.752034
4d94972c-8b03-41f3-9032-6b76f6341725	openrouter-gemini	translation	success	\N	\N	4125	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:18.304207
7d395de4-d1a3-4025-a792-0c4a79caf301	openrouter-gemini	translation	success	\N	\N	3375	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:21.136629
79242f28-bf16-4c2b-b7de-127dd9c429a5	openrouter-gemini	translation	success	\N	\N	4077	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:22.389505
d6f34923-e25c-44aa-ba4f-51a84a02cbb7	openrouter-gemini	translation	success	\N	\N	3719	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:24.893681
67bc6d00-296e-471e-b31c-88c000126e0f	openrouter-gemini	translation	success	\N	\N	3688	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:26.085009
1a9171dd-0cab-4abc-8032-eb39f73b7efd	openrouter-gemini	translation	success	\N	\N	3938	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:28.84588
1bca3ef6-d945-4f4b-9c04-eb64e2eebcfc	openrouter-gemini	translation	success	\N	\N	3765	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:29.861179
cf9a4420-14c9-4722-9f01-2eb7ad3a2d1b	openrouter-gemini	translation	success	\N	\N	3860	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:32.728651
b0ad8ddc-040d-4b1a-9c38-803a9008cbf1	openrouter-gemini	translation	success	\N	\N	4422	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:34.291559
8f04b9ec-0553-4782-a4c1-8df436b6365b	openrouter-gemini	translation	success	\N	\N	2500	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:36.800406
a269e86a-81ce-41a8-af47-afacb27b3ba7	openrouter-gemini	translation	success	\N	\N	4765	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:37.51884
827eb632-4775-4aca-a347-577d73b04774	openrouter-gemini	translation	success	\N	\N	6609	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:43.416392
25a79eb7-e33b-4ada-983d-6181f3c0ff6a	openrouter-gemini	translation	success	\N	\N	6250	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-03 09:40:43.780147
5f82ef14-161b-4deb-9a54-ec97dc18e89c	openrouter-gemini	translation	success	\N	\N	5250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:51:52.828768
7031ce79-f292-4ac1-ab77-286485d7b3c3	openrouter-gemini	translation	success	\N	\N	1467	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:52:01.800563
5efb45d7-e4d5-4e98-9ab0-26f41530ffe5	openrouter-gemini	translation	success	\N	\N	8500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:52:48.537054
67122deb-fa89-4e56-92d3-cbc8d0b95339	openrouter-gemini	translation	success	\N	\N	1936	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:52:50.499275
91163ec8-65f0-40d6-a0f8-96fc00da0adb	openrouter-gemini	translation	success	\N	\N	2062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:52:52.579183
c35100e1-ef1f-4093-a93f-fbe3f85b2c03	openrouter-gemini	translation	success	\N	\N	5452	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:29.877817
c82bb314-9e84-4b32-bdbc-f9e035144188	openrouter-gemini	translation	success	\N	\N	4329	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:34.236469
1d923bc9-aa1a-4eef-aecc-54d29091080b	openrouter-gemini	translation	success	\N	\N	9014	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:43.283525
ed450d4f-a637-4809-a9d6-1b5ee659ca94	openrouter-gemini	translation	success	\N	\N	3812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:47.110417
09d191f6-f668-41f9-bfe1-0cefccb61124	openrouter-gemini	translation	success	\N	\N	4405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:51.525123
61437cd2-de64-4d47-9044-6ec3e0d50e66	openrouter-gemini	translation	success	\N	\N	3968	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 09:59:55.520427
172ec86d-d936-40ed-b1e7-3547c18ee29a	openrouter-gemini	translation	success	\N	\N	8719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:04.245729
19076bce-e852-4458-8034-bd032697e7ce	openrouter-gemini	translation	success	\N	\N	4672	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:08.930059
a525eaa3-4ff5-4097-b09e-8b792f2abf46	openrouter-gemini	translation	success	\N	\N	4562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:13.525677
6297af0a-8378-4444-ac13-316f2dfa4b3b	openrouter-gemini	translation	success	\N	\N	3671	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:17.217869
44c04dbc-c73e-4832-95c3-1c204fee4d0c	openrouter-gemini	translation	success	\N	\N	4562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:21.804487
80ce6a7e-89f3-450e-9aa4-8af41d740a92	openrouter-gemini	translation	success	\N	\N	4610	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:26.433193
875d99fa-9c28-44d4-8725-c3369f07f622	openrouter-gemini	translation	success	\N	\N	4250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:30.709939
367f847e-af85-4f35-817a-aaec87d9b806	openrouter-gemini	translation	success	\N	\N	8953	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:39.680977
3f7e0584-690f-42a8-9b49-bd5b48619bfc	openrouter-gemini	translation	success	\N	\N	4827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:44.529885
ac36efbd-46af-4cfa-89c3-9faa4db55658	openrouter-gemini	translation	success	\N	\N	4000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:48.550273
f638e1ec-c6c6-4213-8d02-dc5f2516682e	openrouter-gemini	translation	success	\N	\N	5312	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:53.981624
681e3392-fdc8-4b4a-be66-8f10d5876e5f	openrouter-gemini	translation	success	\N	\N	4515	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:00:58.51416
ceb9c034-bf78-4d5c-9a3c-a20fd104f096	openrouter-gemini	translation	success	\N	\N	4391	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:01:02.923703
40709899-e248-4746-9903-05cebaca5573	openrouter-gemini	translation	success	\N	\N	4639	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:01:07.5698
96118b88-13a5-4e66-b2f1-d1b7cc183236	openrouter-gemini	translation	success	\N	\N	4906	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:01:12.488318
8912a745-ec69-4cf4-a261-8341cc035488	openrouter-gemini	translation	success	\N	\N	4719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:01:17.217381
daf4712b-2695-485c-98bd-70f822a568b7	openrouter-gemini	translation	success	\N	\N	3187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:01:20.415941
91f31ea7-42f3-4e38-a7e0-1646a9a8146b	openrouter-gemini	translation	success	\N	\N	8640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:21.097428
f6d698cc-4da5-4e54-821d-ec4a8a699e99	openrouter-gemini	translation	success	\N	\N	4890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:26.015044
f0448aa5-debd-4eb0-90dd-b79d739f988d	openrouter-gemini	translation	success	\N	\N	5610	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:31.654208
b0d84d42-4b23-4994-af86-3267feb2956e	openrouter-gemini	translation	success	\N	\N	6405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:38.080391
49c24244-d11e-4909-a2e7-fd4b0647d87c	openrouter-gemini	translation	success	\N	\N	4796	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:42.892766
8d775cc6-522b-497e-93c6-3990fbac425c	openrouter-gemini	translation	success	\N	\N	6641	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:49.541765
db6af580-9d5a-46e3-a50d-a70a2c78b671	openrouter-gemini	translation	success	\N	\N	8796	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:03:58.354437
a8674d7c-e569-4681-a661-58a09f23677b	openrouter-gemini	translation	success	\N	\N	4828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:03.205204
6b5e1bb0-19c7-447b-85c3-09c2763c0a53	openrouter-gemini	translation	success	\N	\N	4311	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:07.532899
22b08bbe-4b1f-4b7d-8969-730233fe80ab	openrouter-gemini	translation	success	\N	\N	4640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:12.18051
84ebc239-3c1d-496c-8197-e5149008095b	openrouter-gemini	translation	success	\N	\N	4000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:16.208869
adedb7bb-2368-4d5e-b5e0-92e6f20f0fc4	openrouter-gemini	translation	success	\N	\N	2515	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:18.738832
8436ae3c-7832-4255-b2ad-4bfcd5d69815	openrouter-gemini	translation	success	\N	\N	4640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:23.395185
081f4425-2315-436f-90ed-cd9a25d7b309	openrouter-gemini	translation	success	\N	\N	5063	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:28.465233
a4c81545-a4b0-4e68-b905-b904e3e69eaa	openrouter-gemini	translation	success	\N	\N	5030	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:33.503237
86fd358e-46e6-4672-b531-72e7cdfc0394	openrouter-gemini	translation	success	\N	\N	4375	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:37.89656
8ae392c6-aad4-41e5-9d39-63f932dfd8c0	openrouter-gemini	translation	success	\N	\N	5297	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:43.203098
1a24e577-bca0-422c-84ed-735c550f23de	openrouter-gemini	translation	success	\N	\N	4703	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:47.915561
158b6487-9e5e-4d51-af46-680e32dc9693	openrouter-gemini	translation	success	\N	\N	5030	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:52.949741
6878deda-b4ee-456f-9a0d-14c0636bc9d7	openrouter-gemini	translation	success	\N	\N	4811	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:04:57.774243
e10dc6ed-bd00-4be0-ac3f-0fb5029b8a2d	openrouter-gemini	translation	success	\N	\N	4250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:05:02.048093
89f43afe-b993-4322-94fe-c02bb6aa1a18	openrouter-gemini	translation	success	\N	\N	7639	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:05:09.696488
919c93c1-6600-4d98-a567-2a33dd2759e7	openrouter-gemini	translation	success	\N	\N	2469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:05:12.184338
e0a3d9b8-fdee-4bfe-b87c-361ef43e417a	openrouter-gemini	translation	success	\N	\N	5344	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:08.246397
421263dc-8a26-45dd-b7a6-0dcc0c08cd8c	openrouter-gemini	translation	success	\N	\N	3687	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:11.977203
324e17b1-1a86-4961-a257-4c7fa739fc7f	openrouter-gemini	translation	success	\N	\N	3390	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:15.390645
76a78e49-75cd-4187-bc9f-df9f7a6b3146	openrouter-gemini	translation	success	\N	\N	3813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:19.218015
2c0820b7-0086-4c76-9861-192b897551ec	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:23.137287
f28c5301-eae1-46df-a4e9-5c621436138c	openrouter-gemini	translation	success	\N	\N	1313	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:24.467962
e10f1f86-e049-46f8-b510-203c1335dfb7	openrouter-gemini	translation	success	\N	\N	4655	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:29.130223
11ec5728-aa9b-4814-b51f-d63c5d2fb70e	openrouter-gemini	translation	success	\N	\N	3860	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:33.023777
725b01be-2d4e-4eb6-b09c-32ad59d1c747	openrouter-gemini	translation	success	\N	\N	4032	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:37.055067
e6aa80ee-c9b8-47ce-8053-c81f02302a1c	openrouter-gemini	translation	success	\N	\N	7686	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:44.750831
f39d1ce8-2244-446e-9727-0b8a2e17a75b	openrouter-gemini	translation	success	\N	\N	4156	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:48.917659
38874ba4-1f13-493a-931a-c343b9555d54	openrouter-gemini	translation	success	\N	\N	2718	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:51.63668
8698c532-4c8b-4e47-bc42-b0960ebee7a3	openrouter-gemini	translation	success	\N	\N	4500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:56.143604
63f5d5bb-333e-4c93-9ee4-aa4b2bf11e0f	openrouter-gemini	translation	success	\N	\N	3547	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:11:59.694253
a7e8ae1c-60ed-498d-9667-428226185515	openrouter-gemini	translation	success	\N	\N	3875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:03.571035
d8ebd84c-f831-4973-b234-87a6fa28312a	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:07.13437
50214de2-c0f5-4439-a599-4db3dc26ef47	openrouter-gemini	translation	success	\N	\N	5234	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:12.367798
a19c66b6-9901-4f85-b90f-8bf4804220fe	openrouter-gemini	translation	success	\N	\N	7188	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:19.564002
dafe1aed-e964-448f-90d7-1f16a35be738	openrouter-gemini	translation	success	\N	\N	3781	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:23.352745
37c687ad-8997-40bd-a369-77727ff58458	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:27.008929
42a54cdd-8c45-4f72-86d0-05b901e1242d	openrouter-gemini	translation	success	\N	\N	4328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:31.335406
44da230f-cf5f-499a-8d1b-377e02cc7d6a	openrouter-gemini	translation	success	\N	\N	2171	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:33.520551
7d8900c2-3dc9-48f6-8af7-68141f0a6b0d	openrouter-gemini	translation	success	\N	\N	3891	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:37.41813
53d4a641-8cb8-48ea-b329-652eaeecc538	openrouter-gemini	translation	success	\N	\N	4640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:42.058751
1390a3ed-d8ce-4bc7-9609-30067647deb1	openrouter-gemini	translation	success	\N	\N	5577	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:47.649279
eae6b7e6-3879-42c2-80f5-b78454d3a46c	openrouter-gemini	translation	success	\N	\N	4375	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:52.033354
2c3848bf-aa54-4fd3-b125-e162be9bd201	openrouter-gemini	translation	success	\N	\N	3780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:55.822627
1e0a9ebc-fc02-4eeb-96c1-fca5eb24b64c	openrouter-gemini	translation	success	\N	\N	3781	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:12:59.60554
a6bb69a0-554a-4e70-be8e-66f4334dabaa	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:03.189996
df618556-1172-4a8b-ab12-9ee1460e052a	openrouter-gemini	translation	success	\N	\N	3875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:07.08027
1d48a201-058e-45c6-8708-094a53acaebe	openrouter-gemini	translation	success	\N	\N	4750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:11.836111
e3ca90c3-7791-40fd-8a18-2a23601e39be	openrouter-gemini	translation	success	\N	\N	2530	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:14.378014
858ef5a6-17df-4254-8546-aaa9db20fe55	openrouter-gemini	translation	success	\N	\N	4078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:18.472008
a229217a-178c-4a5d-9d43-3dea6929dd73	openrouter-gemini	translation	success	\N	\N	7655	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:26.138699
99770147-e6a5-4b21-b499-47a186740149	openrouter-gemini	translation	success	\N	\N	3954	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:30.112465
40c6e862-cb6e-479e-b2b1-e2f5dd09c959	openrouter-gemini	translation	success	\N	\N	4015	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:34.14356
035465fa-3233-4d97-b84b-f4002be51da4	openrouter-gemini	translation	success	\N	\N	3688	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:37.837484
5c2318b1-53ca-48d9-ba8d-3fc6bd91b254	openrouter-gemini	translation	success	\N	\N	2186	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:40.034108
5453b532-cc78-4f5d-9a2f-ddc516d3fe2e	openrouter-gemini	translation	success	\N	\N	6062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:46.103488
bfa71ff1-f687-4cc8-bec3-872b3f35c571	openrouter-gemini	translation	success	\N	\N	3889	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:49.993791
fe8a7509-672a-4c26-9d9b-65dc030eb7c2	openrouter-gemini	translation	success	\N	\N	4719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:13:54.723171
b2b3bb5d-8010-46af-b123-d95474c447a5	openrouter-gemini	translation	success	\N	\N	7500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:02.229032
710187ac-38fe-406b-8126-0b071e08f7c3	openrouter-gemini	translation	success	\N	\N	4078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:06.307408
0849d46a-7fbe-4afd-ad81-4ebd3288ef18	openrouter-gemini	translation	success	\N	\N	3827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:10.132605
2a616ce5-4cff-4a34-a88c-0ac8a89f1766	openrouter-gemini	translation	success	\N	\N	4389	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:14.532829
d86b867d-62c5-4366-9209-1ace52ed8ff7	openrouter-gemini	translation	success	\N	\N	3062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:17.615222
5cb49ec1-2600-4fa7-a569-41edb41039ae	openrouter-gemini	translation	success	\N	\N	4313	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:21.930278
89139c55-f61c-47f2-8bb9-e18ea198d64b	openrouter-gemini	translation	success	\N	\N	4202	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:39.650823
41379bad-b5f7-405d-bb58-8fd8efa36bf3	openrouter-gemini	translation	success	\N	\N	3954	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:59.114084
fa808f0c-d0e5-419f-9a35-e155dbb5b920	openrouter-gemini	translation	success	\N	\N	14952	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:33.249274
ffdaef2e-88a8-482a-9b8b-4aa0bb4a0d71	openrouter-gemini	translation	success	\N	\N	3328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:57.339975
ff9c7301-8b94-41b3-875e-1249b7dcdf65	openrouter-gemini	translation	success	\N	\N	4155	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:08.701507
8bc6a0b2-b453-4ba2-91a8-0583c3d4530c	openrouter-gemini	translation	success	\N	\N	3469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:22.054772
a8a1a531-167e-411c-9c99-a866f7156b5a	openrouter-gemini	translation	success	\N	\N	3969	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:32.693984
eba72719-dde5-44cf-8a4a-b813ff7304f1	openrouter-gemini	translation	success	\N	\N	6687	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:48.14718
d4b62922-673b-40a9-8e20-d9f4c14c4808	openrouter-gemini	translation	success	\N	\N	3203	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:59.586562
e4af67fd-9959-4aa4-a47e-1659d2b2025d	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:09.695927
6be2a44d-4f3e-45ee-b7d7-a4488d9d9dea	openrouter-gemini	translation	success	\N	\N	2859	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:24.796158
a342de4a-5510-4e34-977a-b79aa88ab5ed	openrouter-gemini	translation	success	\N	\N	3641	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:43.292328
99749c26-9a1d-4bb5-834c-e4c055ead01b	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:03.072687
a4479a7d-488a-4eab-8fb4-14cdb959564a	openrouter-gemini	translation	success	\N	\N	4547	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:37.799037
15b5434e-1eda-4fcc-8a88-d580335f8b27	openrouter-gemini	translation	success	\N	\N	3530	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:52.584349
33e138c6-6642-48a0-9573-3373bbe057f1	openrouter-gemini	translation	success	\N	\N	4235	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:04.515792
be73de60-1442-43d2-843f-e8f504c27e55	openrouter-gemini	translation	success	\N	\N	5828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:18.473624
1ccc8ede-46b7-4773-a9aa-7b2da42017e1	openrouter-gemini	translation	success	\N	\N	3500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:28.718406
3db023a1-b98b-48c6-aef3-ffa8112622ec	openrouter-gemini	translation	success	\N	\N	5186	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:42.004131
492df8f9-2f2a-42ca-8df2-012fdf31aec4	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:56.755543
487c7f80-f2dc-4406-bdaf-b8b430998ebe	openrouter-gemini	translation	success	\N	\N	3750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:09.226362
da5fea1b-8884-4cc5-9ae9-2b65c1a9bfd4	openrouter-gemini	translation	success	\N	\N	4217	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:29.025581
a7a548e8-924c-4371-b9f4-aefdd8d223ef	openrouter-gemini	translation	success	\N	\N	4593	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:47.885319
a9ca3bae-f247-49b0-9c46-0df2a683db0f	openrouter-gemini	translation	success	\N	\N	7187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:10.264836
e4007ad3-ae2e-4a7b-b483-f1f248b6ea9a	openrouter-gemini	translation	success	\N	\N	7344	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:45.171846
481ba776-dec7-4c4f-b73d-541e0ecd8fcc	openrouter-gemini	translation	success	\N	\N	3686	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:53.991886
d06df7b5-9950-4cf0-bbcb-a58c1152b1c1	openrouter-gemini	translation	success	\N	\N	3625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:04.46404
20fdb46a-066b-4a73-8789-63f21728844a	openrouter-gemini	translation	success	\N	\N	7328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:18.576076
f69e6fd0-c14d-496b-b60e-8a8096abdd54	openrouter-gemini	translation	success	\N	\N	2828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:28.699096
a965ad16-312e-47d8-870f-29c57f0382a6	openrouter-gemini	translation	success	\N	\N	5360	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:41.435677
e1a7e058-f0fe-4cb2-a4cb-4f8264f00ade	openrouter-gemini	translation	success	\N	\N	4296	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:56.389664
9df58ed2-4b57-4756-a826-edde8c249d24	openrouter-gemini	translation	success	\N	\N	2750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:06.114839
56a06f03-b324-4aaf-98b5-0d586edfd69c	openrouter-gemini	translation	success	\N	\N	2516	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:31.540684
9ee270bd-7dc4-4d73-8687-b59c6d6ff79b	openrouter-gemini	translation	success	\N	\N	3375	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:51.26556
2ded5b90-2fbb-46f6-a8e2-c160c2d2b066	openrouter-gemini	translation	success	\N	\N	3797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:14.083108
1d3f0ce1-6c4b-4609-9c37-1d80e568bd29	openrouter-gemini	translation	success	\N	\N	3719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:56.306296
347ac219-3edf-48f2-ad88-6730c4fac9a0	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:08.053118
d9f73904-7799-424b-9e24-e04306adb1fe	openrouter-gemini	translation	success	\N	\N	3859	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:22.340992
338e7a34-34d9-4885-b1ec-dd6b77839744	openrouter-gemini	translation	success	\N	\N	4125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:32.862742
6b463ddf-57b2-4d68-a9b0-25c631ae2da2	openrouter-gemini	translation	success	\N	\N	6969	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:48.996661
2746cf5d-61ae-46b0-b86b-3de1ba6d44e8	openrouter-gemini	translation	success	\N	\N	4562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:01.318626
9f255bf7-4843-459f-9a83-499e510b3075	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:35.453459
55470890-7bf8-42f0-b8d5-8ff79708b639	openrouter-gemini	translation	success	\N	\N	3875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:14:55.146383
548ba086-344f-4138-bf17-5ed801afd88f	openrouter-gemini	translation	success	\N	\N	4203	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:18.291694
7698b1d4-dc50-49d3-8df8-586b0555a6b9	openrouter-gemini	translation	success	\N	\N	3780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:15:49.004019
b5b3b6f7-f048-44f5-8ee6-299187d61c00	openrouter-gemini	translation	success	\N	\N	3967	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:00.273704
f1227c99-3c9e-4aed-94b0-4689d7d579f5	openrouter-gemini	translation	success	\N	\N	3469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:00.828004
9ec40e8f-d97d-4c5d-98ee-e2225546e291	openrouter-gemini	translation	success	\N	\N	3186	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:11.247986
22f602f2-faf9-4f38-a172-5079a032c79b	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:12.616259
1c1c7142-76cb-4b5c-a2c4-bec6693aef9c	openrouter-gemini	translation	success	\N	\N	3125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:25.202263
4fbe51f4-c414-489f-a095-9b885a9def6b	openrouter-gemini	translation	success	\N	\N	3514	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:25.868468
f763ba50-e364-4833-8248-eb7b315f860d	openrouter-gemini	translation	success	\N	\N	3188	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:36.059662
c0e0528e-095e-44c1-bcf6-4e680a286107	openrouter-gemini	translation	success	\N	\N	4110	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:36.809007
822978ab-17d0-453f-9e4a-0571bee15abe	openrouter-gemini	translation	success	\N	\N	3938	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:52.093495
c470428e-4d19-4ed0-af7a-76addcc528f9	openrouter-gemini	translation	success	\N	\N	3797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:16:52.817223
9b9c649c-07ac-43c5-a882-2ad06a0ff5d1	openrouter-gemini	translation	success	\N	\N	3750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:03.353857
df5203eb-096e-4e58-a384-543b9a52f8cf	openrouter-gemini	translation	success	\N	\N	4125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:05.449846
8d489f27-afb5-4a6b-b0e5-bb9ae7e73be0	openrouter-gemini	translation	success	\N	\N	3670	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:12.907876
888ba9ff-a5a7-4b3e-b658-e8f444e111a9	openrouter-gemini	translation	success	\N	\N	3860	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:13.558641
88a799d1-bac0-49da-bca4-8770f509ec47	openrouter-gemini	translation	success	\N	\N	2360	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:15.307339
2e42106f-f5ed-46f8-9d27-4dedb026d58e	openrouter-gemini	translation	success	\N	\N	3077	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:16.653814
22c0ff4f-c593-4c03-951e-fae816dc2bdd	openrouter-gemini	translation	success	\N	\N	5704	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:22.362624
183c3d37-5358-47a5-a3f8-ca90a0b27036	openrouter-gemini	translation	success	\N	\N	7531	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:22.856603
6b3f1a6b-73b2-4464-92eb-e53897be97b1	openrouter-gemini	translation	success	\N	\N	3860	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:26.23158
8615d08b-c49b-4c8b-be78-595d2e8ad502	openrouter-gemini	translation	success	\N	\N	3625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:26.487179
cd3af71f-6277-4ff3-9f6a-0e1ca8885a24	openrouter-gemini	translation	success	\N	\N	3780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:30.022696
4d26318c-88e4-4460-8db6-9f02b9180c6c	openrouter-gemini	translation	success	\N	\N	4688	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:31.19236
b3540c40-2792-47ca-9ec8-efcbc23d4577	openrouter-gemini	translation	success	\N	\N	3329	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:33.350066
a04cfbb5-da5e-4620-8853-3e9d2d28296d	openrouter-gemini	translation	success	\N	\N	3890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:35.089168
09370dc0-06cb-4231-a617-bc520d1e2942	openrouter-gemini	translation	success	\N	\N	3889	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:37.25472
5ccdcda2-a9aa-4390-93d2-b2289bd54231	openrouter-gemini	translation	success	\N	\N	3921	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:39.019589
0277a495-1392-4963-9ca6-b8ff4ce57c27	openrouter-gemini	translation	success	\N	\N	3984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:41.248201
6c4b457c-dcc0-4f1f-8e98-380bb79972a5	openrouter-gemini	translation	success	\N	\N	3218	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:42.266842
c2a11b3a-2cee-4224-bf9d-d9f54caf6975	openrouter-gemini	translation	success	\N	\N	3907	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:46.179506
9b3efb40-7a79-425f-9a00-2627006f48a4	openrouter-gemini	translation	success	\N	\N	4969	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:46.227756
209e99f8-f652-4ce2-a9e6-4e0323b4d596	openrouter-gemini	translation	success	\N	\N	2296	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:48.500456
8c7d397b-3e6a-4da9-9640-9541a8d6fc09	openrouter-gemini	translation	success	\N	\N	3360	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:49.607419
b2a57039-2792-4ecb-9798-36e07b184751	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:52.450168
abf534d1-a712-4045-bf74-955312b24d92	openrouter-gemini	translation	success	\N	\N	4218	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:53.83137
cd875943-a1fb-4396-8261-820ba66f9622	openrouter-gemini	translation	success	\N	\N	3735	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:56.188064
f7eb16c9-942b-4b45-a42f-e4617b260454	openrouter-gemini	translation	success	\N	\N	3625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:17:57.467731
84be8353-b0eb-49ef-acb8-eed6b1d72812	openrouter-gemini	translation	success	\N	\N	3405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:00.891083
1886c191-a916-4628-9a3c-03e1b80bc40d	openrouter-gemini	translation	success	\N	\N	5687	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:01.892473
c9688e89-2087-4b7f-b4c3-35d58165e28e	openrouter-gemini	translation	success	\N	\N	2844	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:03.736196
f61457f9-ae0b-43ce-b4ef-d81ab08bd849	openrouter-gemini	translation	success	\N	\N	3657	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:05.56786
7d8cf123-13ff-4afd-b204-2e393d88a84d	openrouter-gemini	translation	success	\N	\N	3688	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:07.442402
f1939b08-a828-465d-8226-5c062a32d331	openrouter-gemini	translation	success	\N	\N	3500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:10.966402
904004a1-5af9-4b6f-9340-d011e12ba5b0	openrouter-gemini	translation	success	\N	\N	5390	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:10.968402
92a19a0f-4072-41b6-8696-d316dd3cf595	openrouter-gemini	translation	success	\N	\N	3046	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:14.009706
7c7d9f9a-bb2c-43f8-ab3b-175d9d98287c	openrouter-gemini	translation	success	\N	\N	4202	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:28.131271
29903d87-ab1d-42b8-8e77-dc057a6dbe0d	openrouter-gemini	translation	success	\N	\N	5343	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:46.390471
1fe330ed-80fb-4ec6-9435-6a4c3adf711c	openrouter-gemini	translation	success	\N	\N	7250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:02.054416
c54b73a4-acc8-4dc3-b4fb-a7bab90df49e	openrouter-gemini	translation	success	\N	\N	3827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:13.910606
4a3dd503-f2d1-401b-b834-857d4c504bcb	openrouter-gemini	translation	success	\N	\N	6389	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:30.494141
d0fc5567-2fdc-4079-bd31-22a5969f6697	openrouter-gemini	translation	success	\N	\N	5780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:47.098306
71233f04-69bc-491e-b1b3-8d585e9f1992	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:02.749274
e2b1f25b-ecc8-4305-99b4-3d201f0e96d9	openrouter-gemini	translation	success	\N	\N	4061	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:15.023288
a09f1029-ba28-425d-9fe0-1b810dc67b50	openrouter-gemini	translation	success	\N	\N	5813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:32.708777
7d948d0c-3e9b-48e5-9200-0d962ba09931	openrouter-gemini	translation	success	\N	\N	4030	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:50.45447
e4dde0e8-f8f3-4bc7-a00c-03408489f6a8	openrouter-gemini	translation	success	\N	\N	4796	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:06.851618
12cccb24-8505-47c8-a740-99fdd76ead4d	openrouter-gemini	translation	success	\N	\N	4812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:22.506343
ad3f9f70-1f55-4d5f-b010-602a246e6f5a	openrouter-gemini	translation	success	\N	\N	5734	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:37.578212
488030c5-0925-4be6-869d-88a06aae97e5	openrouter-gemini	translation	success	\N	\N	4030	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:51.141293
3646f44b-de3d-4c03-813d-68c7accef381	openrouter-gemini	translation	success	\N	\N	3983	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:07.163015
adfa8323-789b-4340-841a-3e34ec19afc8	openrouter-gemini	translation	success	\N	\N	4014	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:18.035684
63094e09-b159-4e11-b9f9-032de2218398	openrouter-gemini	translation	success	\N	\N	3625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:31.762499
e2f3310f-82bd-4214-a9d0-6466ec1db895	openrouter-gemini	translation	success	\N	\N	4592	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:47.283736
52cfdf09-376a-473b-b096-860e40d9be19	openrouter-gemini	translation	success	\N	\N	7562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:03.137369
50dd7eed-1d71-4c35-b6ee-32400be14645	openrouter-gemini	translation	success	\N	\N	4500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:17.690851
a7709f6b-bc9d-47f5-ab90-80a8dae917d1	openrouter-gemini	translation	success	\N	\N	4405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:31.828991
2e0d6648-15ca-47df-a41a-079a4ac5e6a4	openrouter-gemini	translation	success	\N	\N	3842	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:48.644844
dcad0af9-30bd-49c4-8857-6da6377545ad	openrouter-gemini	translation	success	\N	\N	5578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:08.340071
83366d40-c933-4db2-90ab-0839630a7e10	openrouter-gemini	translation	success	\N	\N	4172	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:19.204657
2b67f377-a49d-47e4-bd2e-9f82aa48917c	openrouter-gemini	translation	success	\N	\N	5750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:37.51389
d8c01a97-db7b-4aac-86ff-bb3edafc0fa4	openrouter-gemini	translation	success	\N	\N	4265	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:51.556128
b9a0bbfb-f28e-44ff-8e0e-a65ceaa132c1	openrouter-gemini	translation	success	\N	\N	2797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:05.935038
cb0b1cd9-69d0-405a-aa7a-83f12d4d161a	openrouter-gemini	translation	success	\N	\N	4233	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:18.15613
99fb38ae-a371-49cd-b096-82f958544cf6	openrouter-gemini	translation	success	\N	\N	9828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:40.321908
62078bee-0282-4ae0-863d-c8f896fc9443	openrouter-gemini	translation	success	\N	\N	14516	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:03.163656
2d8cd35e-75af-4768-922c-3c17cf858605	openrouter-gemini	translation	success	\N	\N	5890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:23.927248
47931bca-ef03-4092-93da-b1b04fde7de1	openrouter-gemini	translation	success	\N	\N	8296	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:41.04179
bfef31d9-cb0d-4756-a72a-e6290534534b	openrouter-gemini	translation	success	\N	\N	4250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:54.762353
1374b06a-fed2-4785-8a61-286ec1d48a9b	openrouter-gemini	translation	success	\N	\N	4139	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:10.078501
401f0c55-8b5d-40a7-8414-3f237c15f9f9	openrouter-gemini	translation	success	\N	\N	5938	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:24.099052
dcff330c-06b2-4d0a-9039-ec4eeffd4ac5	openrouter-gemini	translation	success	\N	\N	3703	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:41.300644
5b877496-05f7-44c5-94d6-47520512bbb3	openrouter-gemini	translation	success	\N	\N	2954	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:54.109016
ce6ff9ee-3263-4fe4-a5df-dc98fc3f775d	openrouter-gemini	translation	success	\N	\N	7686	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:26.898421
05edf00c-be74-45ba-b23f-b2ed9a0cf497	openrouter-gemini	translation	success	\N	\N	5172	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:42.679505
5be24ba9-cf7a-4ba3-9f41-b294ec1e28d0	openrouter-gemini	translation	success	\N	\N	4000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:18:55.561895
a486659b-162e-44d7-9420-54b35b9e95cc	openrouter-gemini	translation	success	\N	\N	6312	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:13.174838
51c2e383-6489-4296-84e6-8cf4b91a4c63	openrouter-gemini	translation	success	\N	\N	4906	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:27.414733
cbeab42a-a2c8-4c87-a4a3-095a73d7a8cd	openrouter-gemini	translation	success	\N	\N	4453	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:44.798791
22675ace-617a-4d05-b5ad-da8af3957a30	openrouter-gemini	translation	success	\N	\N	4703	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:19:58.827642
3cc6cee1-a860-4472-901c-995dcc128d30	openrouter-gemini	translation	success	\N	\N	5514	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:12.707029
0fadcda4-4bba-4c4f-835b-5ea543d2ce53	openrouter-gemini	translation	success	\N	\N	5155	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:13.520455
95355dce-c873-463f-92f5-66bad2f95220	openrouter-gemini	translation	success	\N	\N	3079	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:16.603142
3e67e02c-c802-4122-bfbd-9e3e634fdf35	openrouter-gemini	translation	success	\N	\N	5546	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:18.26625
35a615c6-9843-445e-8fdb-6ffe7d9d6cfd	openrouter-gemini	translation	success	\N	\N	5875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:24.146746
bf3b2d68-166c-4ebf-86a1-5f89bf7eecfe	openrouter-gemini	translation	success	\N	\N	8593	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:25.196524
88eba491-1537-4c6e-903a-8914cc363a7c	openrouter-gemini	translation	success	\N	\N	4780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:29.999821
9cf5421f-a466-402c-bfae-c15fa4cc8789	openrouter-gemini	translation	success	\N	\N	7671	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:31.841293
853f19b6-3b02-42ab-9368-86b5d2c2d578	openrouter-gemini	translation	success	\N	\N	6031	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:36.047885
c1c644b8-8a85-4790-95cc-9170095a8ca0	openrouter-gemini	translation	success	\N	\N	6686	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:38.524905
963f9fff-8439-4563-b44a-895f44169f34	openrouter-gemini	translation	success	\N	\N	4905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:40.959932
4d6f369d-9c0c-44bb-9612-dd58b23d5f93	openrouter-gemini	translation	success	\N	\N	5937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:46.917491
cd765045-c744-4fc5-877e-a6f916425844	openrouter-gemini	translation	success	\N	\N	10391	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:48.925673
68a95604-871c-41ae-9217-00c88d8cf7f1	openrouter-gemini	translation	success	\N	\N	875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:49.813529
0e019d5f-c05f-4102-bda6-07202d7e151c	openrouter-gemini	translation	success	\N	\N	4561	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:51.506036
db36e891-7d40-4e44-8f80-dc141c4b7b13	openrouter-gemini	translation	success	\N	\N	4140	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:53.965834
efd8c91c-187d-471e-8afd-864b2d4a50f8	openrouter-gemini	translation	success	\N	\N	6047	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:57.560613
9eb7cb18-8ced-4295-95b0-1df3d881938a	openrouter-gemini	translation	success	\N	\N	5561	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:20:59.529126
8236a6fc-5dd7-4c66-a727-24d6c0aa5d93	openrouter-gemini	translation	success	\N	\N	2827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:02.37926
5b40f0af-6bc1-452f-8063-fa7db8fc96d5	openrouter-gemini	translation	success	\N	\N	7342	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:04.910663
8270a35b-3bcb-41da-820f-09e593dfc8a3	openrouter-gemini	translation	success	\N	\N	3047	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:05.44484
3209e704-469c-4e28-9351-72c158373912	openrouter-gemini	translation	success	\N	\N	2671	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:08.139824
de406d7e-34bb-4e11-a1bf-a743791bceea	openrouter-gemini	translation	success	\N	\N	6843	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:11.769147
b4b821ba-aed0-43e7-82a2-35487788b3b1	openrouter-gemini	translation	success	\N	\N	5282	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:13.434419
93bd1414-f83c-4321-91f8-b3fed0102f27	openrouter-gemini	translation	success	\N	\N	4406	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:17.862642
ee469d55-6cc9-43d0-bb7d-4becdbb97be7	openrouter-gemini	translation	success	\N	\N	9140	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:20.9281
f3832820-ac31-4dac-8e6b-6c3c2ffd54d2	openrouter-gemini	translation	success	\N	\N	5734	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:23.624848
4bcae21c-6c94-43d7-b6e0-8cdb7f2648e1	openrouter-gemini	translation	success	\N	\N	4844	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:25.790867
dce34f31-e04e-46d6-983e-33aaf48257de	openrouter-gemini	translation	success	\N	\N	4062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:27.706146
02282d1a-2937-482e-8cb6-7c8297701122	openrouter-gemini	translation	success	\N	\N	4859	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:30.66859
96026618-7607-4ee2-b4c7-0702eb0bb6af	openrouter-gemini	translation	success	\N	\N	6078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:33.801037
b9ef3509-9c53-4155-9f2a-023588c00f70	openrouter-gemini	translation	success	\N	\N	3389	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:34.069231
bdd795a8-4599-4125-971d-ee7157499ddb	openrouter-gemini	translation	success	\N	\N	5296	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:39.125924
db7780e6-450b-47c0-bc09-d34c5a28d02a	openrouter-gemini	translation	success	\N	\N	6890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:40.975818
9e6eb4a0-e2df-4816-90ef-e7f74cba1aaa	openrouter-gemini	translation	success	\N	\N	3812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:42.956273
2dff1129-906c-4632-b994-a1231d1c4cca	openrouter-gemini	translation	success	\N	\N	3344	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:44.338892
2ae693cc-89d1-489c-bfc2-36a45e0be9d5	openrouter-gemini	translation	success	\N	\N	6250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:49.217831
c8f23dd2-7587-4772-940b-74801e5f8c16	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:52.796707
2d0525a1-8d7c-471d-8637-435a41c3258b	openrouter-gemini	translation	success	\N	\N	10843	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:55.195847
ca708fbe-55e7-4345-b29f-1ce5aabfa2ff	openrouter-gemini	translation	success	\N	\N	6764	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:21:59.576169
d88cfa59-0630-4a37-b26f-a6ca1314f5da	openrouter-gemini	translation	success	\N	\N	6421	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:01.639734
4054b994-b225-46f6-a1f6-6bcd8e933109	openrouter-gemini	translation	success	\N	\N	4328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:17.722109
fffa3fb6-7ed3-40ba-bb04-acc5566695a3	openrouter-gemini	translation	success	\N	\N	3813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:38.058193
a93ef812-4191-4d8c-ace6-29bec1f7ea1d	openrouter-gemini	translation	success	\N	\N	6657	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:57.439333
f9faf363-9974-427e-b93e-d8a00bb13a47	openrouter-gemini	translation	success	\N	\N	17234	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:24.577554
88e1235c-fcd1-4f3f-9113-5668d2027c58	openrouter-gemini	translation	success	\N	\N	5735	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:43.430036
c404e935-5fdc-4384-a746-6ecdabf3570c	openrouter-gemini	translation	success	\N	\N	5203	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:56.214661
fb63997b-9a9c-40ee-8054-adfd5742ed10	openrouter-gemini	translation	success	\N	\N	4218	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:09.704756
78567b3a-761e-4a2a-9e83-b935ced4564f	openrouter-gemini	translation	success	\N	\N	3125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:02.72264
c4ff73fc-6287-4ca4-ada6-db4e0c15e999	openrouter-gemini	translation	success	\N	\N	6344	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:19.857512
4e2a0872-0842-4844-80af-8f3a3612bc99	openrouter-gemini	translation	success	\N	\N	3921	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:41.634755
e768238e-9e7e-47da-8ff3-1b91abc4fc92	openrouter-gemini	translation	success	\N	\N	7782	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:00.434075
88f7b1f6-936e-4111-9493-49389b68dbb9	openrouter-gemini	translation	success	\N	\N	4844	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:17.748197
c8592947-66c7-4123-aee6-b033d07fb09f	openrouter-gemini	translation	success	\N	\N	6655	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:39.397284
7c4ecb2a-31c2-4e89-8078-3056fa911c81	openrouter-gemini	translation	success	\N	\N	4187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:53.267017
9f6a17a8-5982-4c38-b0de-a12743a9cf1f	openrouter-gemini	translation	success	\N	\N	3639	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:08.520891
2aa7ae06-3384-405c-acd5-e4db52d20790	openrouter-gemini	translation	success	\N	\N	7235	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:08.881498
4b56cd70-5e44-4354-9abc-1271e3b320b4	openrouter-gemini	translation	success	\N	\N	11468	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:29.194098
fbb622e7-0d4e-4389-9fc2-f35307c503bb	openrouter-gemini	translation	success	\N	\N	3796	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:41.866747
db49d77a-008c-47b2-b7c8-b17a3f51225c	openrouter-gemini	translation	success	\N	\N	9360	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:06.819073
c08a7cd5-f180-44e9-83f5-55e01b7ee461	openrouter-gemini	translation	success	\N	\N	8781	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:32.737135
25e7cffe-5397-4bbd-83be-67eda99278d4	openrouter-gemini	translation	success	\N	\N	4171	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:47.621782
a3192916-ad97-420a-93da-258793cecae5	openrouter-gemini	translation	success	\N	\N	4125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:00.344715
67ea7ca0-33b2-424a-83f3-58c983ffa0b4	openrouter-gemini	translation	success	\N	\N	7672	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:10.414565
c2f9201c-b286-4f09-936a-6552f45862e7	openrouter-gemini	translation	success	\N	\N	11015	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:30.895818
7ce5878b-adc4-467f-bb0d-9d00bcf94a65	openrouter-gemini	translation	success	\N	\N	3907	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:45.563915
da42b1b0-6d08-4ab6-9c22-28cd0114cb81	openrouter-gemini	translation	success	\N	\N	3452	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:03.899843
1cbfec23-3b6f-4f33-90fa-380f32a74b6d	openrouter-gemini	translation	success	\N	\N	6172	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:23.931141
3894b375-faa2-4d54-8fdb-2c21a30e9a7b	openrouter-gemini	translation	success	\N	\N	3015	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:37.685612
b742e3e9-ddee-4416-888d-cfc2a3fe34bf	openrouter-gemini	translation	success	\N	\N	3375	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:51.005026
01542d1b-e926-4bb8-9058-a5a0511084a4	openrouter-gemini	translation	success	\N	\N	5109	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:05.459719
d3eac9bd-8982-452b-9eae-576bccc08bb7	openrouter-gemini	translation	success	\N	\N	2936	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:13.379178
f172f325-d05b-44fa-a8d8-8dc387cde7a1	openrouter-gemini	translation	success	\N	\N	5031	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:34.227227
1b631930-ad99-4bd0-8f6f-fdb79a868f6f	openrouter-gemini	translation	success	\N	\N	10765	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:52.641205
01aa2752-f7e2-4424-8f73-30d90742855f	openrouter-gemini	translation	success	\N	\N	6062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:12.88824
177ccf2a-aa0a-410e-b65d-866c05a4a2d2	openrouter-gemini	translation	success	\N	\N	3889	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:34.651714
8ad5450e-4586-45f6-bc80-4952712f1881	openrouter-gemini	translation	success	\N	\N	4188	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:49.054853
5652c741-85e1-4fd1-bb30-96b581bed055	openrouter-gemini	translation	success	\N	\N	7250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:04.87429
68c73dae-0077-4647-8b82-92d51390087f	openrouter-gemini	translation	success	\N	\N	4594	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:13.494355
166568fc-744d-4216-9d6a-549f280b17f0	openrouter-gemini	translation	success	\N	\N	6780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:37.703718
7838846c-213e-4a7c-bbad-b7050a6a7cdd	openrouter-gemini	translation	success	\N	\N	5187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:22:50.758559
940fdca1-af71-4682-98ee-b59aa167bc45	openrouter-gemini	translation	success	\N	\N	3405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:07.328425
43f7a73a-cd8d-47d8-8c77-4ed61640e913	openrouter-gemini	translation	success	\N	\N	6171	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:30.755206
4e78f9ba-40d7-47a9-a38d-6b6a876422d1	openrouter-gemini	translation	success	\N	\N	5437	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:44.858299
b23b123c-7be5-4902-85b9-4340fd8311ae	openrouter-gemini	translation	success	\N	\N	4329	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:23:57.61252
cd079fe3-6d2b-4624-915e-549b8cf95a8b	openrouter-gemini	translation	success	\N	\N	3782	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:12.314942
71fc229f-134e-4019-abdf-ce152872e741	openrouter-gemini	translation	success	\N	\N	4828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:14.548323
af11e12b-079f-4aec-a992-fe7ca9a7dfa9	openrouter-gemini	translation	success	\N	\N	2328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:16.911622
63ef5cb1-a43b-4d95-b4e8-5dee592e16d2	openrouter-gemini	translation	success	\N	\N	6546	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:18.877044
f68c5bba-9f16-4bda-93be-52415066d55e	openrouter-gemini	translation	success	\N	\N	4092	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:21.025099
e0ae85ea-7ab6-49e1-94de-de9cd7cd464f	openrouter-gemini	translation	success	\N	\N	2234	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:21.125366
45f3de54-a8a4-4fbd-bc4a-92fa4aaa2155	openrouter-gemini	translation	success	\N	\N	3719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:24.85431
1bd624ae-d05c-48c8-a529-8094782763ad	openrouter-gemini	translation	success	\N	\N	4562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:25.607254
d0634c80-3e75-43b7-abe4-f2756b7a7c2f	openrouter-gemini	translation	success	\N	\N	4593	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:29.450725
23f77901-66ad-44c7-a71f-e41f9f6412ef	openrouter-gemini	translation	success	\N	\N	4735	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:30.34953
2ea7447d-dbb9-4ab6-84fc-cb47336be650	openrouter-gemini	translation	success	\N	\N	9469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:39.854875
5f387092-f892-49c0-b45a-e8e4ac1f69d5	openrouter-gemini	translation	success	\N	\N	12796	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:42.256241
3d9f8482-d0d1-4d4e-b182-892d7a2f51e0	openrouter-gemini	translation	success	\N	\N	8078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:47.94443
cd736cab-0c5e-484b-a4b2-0af5581e9fb4	openrouter-gemini	translation	success	\N	\N	3859	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:51.830695
2ef8b613-a2d1-4bdd-af1a-8f502ae442d1	openrouter-gemini	translation	success	\N	\N	10438	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:52.712293
8f6774a3-eccf-4405-b386-0ef67c1e4b69	openrouter-gemini	translation	success	\N	\N	3594	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:55.432811
fe43bbe7-c927-424e-a589-1fe5d4154fd2	openrouter-gemini	translation	success	\N	\N	4078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:56.79502
74eca707-a7db-4fcf-87f4-9de7f8cfc1f2	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:24:59.400113
7ef71e47-deb0-4dc8-ab1a-e192c217c427	openrouter-gemini	translation	success	\N	\N	3827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:00.638504
96b527ab-1c54-4533-aacd-00f69e47aa62	openrouter-gemini	translation	success	\N	\N	3657	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:03.067978
115455b6-c97d-40d5-9468-60bd6151bb51	openrouter-gemini	translation	success	\N	\N	3500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:04.151403
3f18ddb1-d5c6-4cac-8df3-3ec89b32d774	openrouter-gemini	translation	success	\N	\N	4140	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:07.214377
6365a58c-e850-4edc-ad54-fc8a44763df1	openrouter-gemini	translation	success	\N	\N	4515	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:08.695245
9c241f51-f4fa-4d95-884c-5992adec66dc	openrouter-gemini	translation	success	\N	\N	3718	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:10.953448
8682cab2-3dde-4964-a6bf-225a0e2c5bfe	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:12.260425
c8d7ca05-7ca0-40a3-b1ba-f451db888666	openrouter-gemini	translation	success	\N	\N	4953	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:15.923471
30eec68a-309a-4c26-88ee-b779be17d696	openrouter-gemini	translation	success	\N	\N	3891	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:16.174297
5c251ea3-2b02-4f59-a1e7-44f66aec5cf7	openrouter-gemini	translation	success	\N	\N	4421	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:20.602272
0c5143a9-3d7e-4a0b-9bea-6a3da4037d4b	openrouter-gemini	translation	success	\N	\N	4717	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:20.654662
cadd1a0c-b461-43db-9e24-c5fa7601d59d	openrouter-gemini	translation	success	\N	\N	5047	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:25.665222
29062535-5619-4c14-a1bb-90f529f7aeee	openrouter-gemini	translation	success	\N	\N	7968	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:28.631691
e4abe93a-6e10-49fb-a8b2-74e0c89c8c9f	openrouter-gemini	translation	success	\N	\N	5311	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:30.992675
c9bfc0ca-ab7e-410a-a36f-37cb28590371	openrouter-gemini	translation	success	\N	\N	3438	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:32.092113
b6fc249c-67a2-43ec-bcec-c149cc55391e	openrouter-gemini	translation	success	\N	\N	4703	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:35.723145
188deb29-651d-4cb2-afde-64a19ded744a	openrouter-gemini	translation	success	\N	\N	6469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:38.553502
46ee5d7e-bd21-450b-9498-b5731bb92066	openrouter-gemini	translation	success	\N	\N	3750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:39.503545
cf24a34a-d77f-4f04-923c-bdbc448f348a	openrouter-gemini	translation	success	\N	\N	6890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:45.4642
87b27b76-2e3d-4f49-97a7-9f9d71fb11a1	openrouter-gemini	translation	success	\N	\N	8578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:48.094117
b7a2b5e8-7a0d-4ea2-8ce4-84359920c82f	openrouter-gemini	translation	success	\N	\N	4187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:49.677539
81b3c3a7-1974-4c56-bb98-858e2b03ea65	openrouter-gemini	translation	success	\N	\N	3780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:51.890033
864fa61a-e38c-4300-ab80-f23500d356a4	openrouter-gemini	translation	success	\N	\N	4452	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:54.154813
ac97e6a4-6c39-4b17-93ea-d654b47dd7ff	openrouter-gemini	translation	success	\N	\N	3610	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:04.914387
209551e9-c4f5-4860-b5dd-b445b6747bd7	openrouter-gemini	translation	success	\N	\N	7546	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:22.358767
ad1d7914-1bfc-4fc9-8271-c9862d677704	openrouter-gemini	translation	success	\N	\N	5108	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:37.910957
3189d1cb-05c0-4600-b6bd-df075e1a9830	openrouter-gemini	translation	success	\N	\N	7234	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:52.170146
9bb8ddfe-d220-46ee-bdca-76663b8d0e9e	openrouter-gemini	translation	success	\N	\N	3858	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:04.151982
a68cb61a-dad4-4faa-af65-5a0544c2fc9b	openrouter-gemini	translation	success	\N	\N	3890	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:20.591656
8ba0a561-76b4-4ae2-b65b-09cb078c503f	openrouter-gemini	translation	success	\N	\N	3984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:36.298971
b3606a35-424a-4afb-b2c7-831d4ca97314	openrouter-gemini	translation	success	\N	\N	4000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:52.014704
7d4a771f-2bb9-479b-a20b-aa29c9887d3b	openrouter-gemini	translation	success	\N	\N	7469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:10.58532
2aed329d-a418-46b7-80f6-9fa7e4e3b291	openrouter-gemini	translation	success	\N	\N	3813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:55.755213
54a35c1f-38f6-4fea-8c13-ac701d944cea	openrouter-gemini	translation	success	\N	\N	3640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:08.594414
97807250-33cd-4d74-85bf-a5397fc77786	openrouter-gemini	translation	success	\N	\N	4625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:26.99013
f2c61035-3803-4a30-b9b6-f57e16a5d8d0	openrouter-gemini	translation	success	\N	\N	3577	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:41.501036
ee3b3bf3-00b3-4912-91ef-365040e1c957	openrouter-gemini	translation	success	\N	\N	4813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:55.345034
99f0d942-82f1-4beb-b4b4-fd1dc094b394	openrouter-gemini	translation	success	\N	\N	4468	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:07.632881
7c99df23-46d5-4e0f-819a-ffdd227315c0	openrouter-gemini	translation	success	\N	\N	3592	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:20.523873
c750d434-6d5c-4939-9e2e-9d1455888dda	openrouter-gemini	translation	success	\N	\N	3735	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:35.927476
65023b0c-4e2a-4a70-8e0f-cdad33ef5216	openrouter-gemini	translation	success	\N	\N	4108	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:50.148678
cad61182-1027-4b43-90be-b6912d470a81	openrouter-gemini	translation	success	\N	\N	6390	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:03.111415
0841d292-e530-4b99-ac3e-680fc01caaf9	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:58.077519
d561624b-c191-41a5-9c53-6f9d14905b2a	openrouter-gemini	translation	success	\N	\N	5610	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:14.234461
6efb1c97-2f87-4b8a-8a51-eef733553913	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:32.796385
384d9ac5-7bfe-449f-8f9b-c39134c0e367	openrouter-gemini	translation	success	\N	\N	4359	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:46.934756
44604ac3-ff5d-4c02-b3c0-53c4083d34f8	openrouter-gemini	translation	success	\N	\N	4108	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:00.280152
16177e6c-3388-4fcd-83b4-107867c60f5b	openrouter-gemini	translation	success	\N	\N	8813	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:16.688106
f36327de-8016-422f-b95d-fb07c14f532f	openrouter-gemini	translation	success	\N	\N	3797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:32.195821
1563901d-d8f4-4616-9552-fa569a198bb6	openrouter-gemini	translation	success	\N	\N	7859	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:47.994866
a3bdac2a-8ab5-4210-8894-79458c5af340	openrouter-gemini	translation	success	\N	\N	7077	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:03.036946
8b98e7a0-fdde-4d90-9e60-4a3731c854ee	openrouter-gemini	translation	success	\N	\N	2406	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:25:58.174463
349f79bb-1b52-40f9-b5c9-5d4065c10d28	openrouter-gemini	translation	success	\N	\N	3577	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:14.79778
bf6a38c5-85fb-4cf1-836e-f8e78b9386a0	openrouter-gemini	translation	success	\N	\N	6139	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:38.13256
6ccc9709-f174-4c72-a37a-fb7cc01c3aba	openrouter-gemini	translation	success	\N	\N	3577	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:50.518019
94ad2ace-c409-4a59-9235-ee23a7883bfd	openrouter-gemini	translation	success	\N	\N	3795	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:03.158639
18f7afd2-8da6-4dee-9bae-f279b5e77904	openrouter-gemini	translation	success	\N	\N	5469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:16.924554
9f2afad7-d99f-4dfa-ba25-cf39c1eaba0a	openrouter-gemini	translation	success	\N	\N	3657	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:32.30435
1d29a67a-55ac-40a8-9bfc-3b7512109836	openrouter-gemini	translation	success	\N	\N	5500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:45.786842
0815ba7d-9171-4ec2-b41c-f827bf8dbb9e	openrouter-gemini	translation	success	\N	\N	3889	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:55.950261
89356d00-de67-464e-9416-2e9f26c3625b	openrouter-gemini	translation	success	\N	\N	3828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:10.583313
84f64d67-ba12-4031-970d-e6ba41816a84	openrouter-gemini	translation	success	\N	\N	3186	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:01.276413
79727101-6f85-4e37-9584-dd7c4d26283b	openrouter-gemini	translation	success	\N	\N	14969	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:29.216024
bbd8a852-a3a1-4497-a76f-f2a15319d354	openrouter-gemini	translation	success	\N	\N	4406	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:42.558389
ac97c9b4-2279-4c00-acc2-2d823d78458d	openrouter-gemini	translation	success	\N	\N	3967	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:56.157178
7bcb5048-46c1-4887-bec3-961938f44dac	openrouter-gemini	translation	success	\N	\N	3704	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:07.863573
28734028-b241-48df-a4b1-8ad053e43f66	openrouter-gemini	translation	success	\N	\N	8108	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:28.646939
aa1fde3f-6f0b-4dd0-84a8-60f6f4d3e253	openrouter-gemini	translation	success	\N	\N	3952	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:40.269896
05afa038-797b-4c18-8097-d8fb9c591464	openrouter-gemini	translation	success	\N	\N	4812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:56.703878
6e31d06a-a3b7-4a98-b885-1adc94e67175	openrouter-gemini	translation	success	\N	\N	13000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:11.192116
61c17f37-8fc5-4a6c-b2cb-84cb71d3667c	openrouter-gemini	translation	success	\N	\N	4985	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:31.978682
6e9e3e64-168a-46a3-9bde-eee1486a4584	openrouter-gemini	translation	success	\N	\N	3422	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:44.935826
bbb77e56-91e9-4470-a87d-509f9479382b	openrouter-gemini	translation	success	\N	\N	3984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:26:59.345208
747faea6-8b49-46fa-9106-8eb0f8c13d7f	openrouter-gemini	translation	success	\N	\N	3812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:11.447037
e057ce97-8778-4f83-93a5-f6224e910a46	openrouter-gemini	translation	success	\N	\N	7780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:28.391568
8d4233e8-b158-4f89-8d1e-ff863e5e4470	openrouter-gemini	translation	success	\N	\N	4202	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:40.132535
6c8d21f7-f10f-4199-91db-f7fdf1c0f1c7	openrouter-gemini	translation	success	\N	\N	1719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:27:51.875298
0602d8c6-7940-4388-8303-b38a0d055b28	openrouter-gemini	translation	success	\N	\N	3702	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:06.745727
239fb3d6-6e5a-4334-b0a3-f1c5050930a3	openrouter-gemini	translation	success	\N	\N	3171	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:13.761879
a9ef75ea-c16d-4a6c-9290-00c9ec31d3e0	openrouter-gemini	translation	success	\N	\N	4453	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:15.042592
0b988c92-eeb5-445c-a1c8-a7a30d6cb13c	openrouter-gemini	translation	success	\N	\N	3437	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:17.233496
e7988316-46f8-4591-b5b2-8f1d55533182	openrouter-gemini	translation	success	\N	\N	5405	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:20.464692
8b55f810-88f6-43a0-9ef6-fb23fc394990	openrouter-gemini	translation	success	\N	\N	3547	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:20.797711
bd26ef14-f002-4e63-8ce3-a7b5cd85627b	openrouter-gemini	translation	success	\N	\N	3936	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:24.406295
7d09d213-ed33-4468-839b-76a6841f5519	openrouter-gemini	translation	success	\N	\N	4717	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:25.535446
d5e567b1-94c7-4d38-bf27-bc08903ff5ec	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:27.990085
a37b6ebf-e8cb-486f-91c7-49c1442b6519	openrouter-gemini	translation	success	\N	\N	3125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:28.663658
77b392f7-aeb0-425b-b8d9-dc9e3e56d280	openrouter-gemini	translation	success	\N	\N	3452	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:32.139199
418d5cca-5d3c-4362-b7a1-3ed653d08635	openrouter-gemini	translation	success	\N	\N	4500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:32.503713
5dcf5cd4-395f-495e-990c-9e4c4b694c65	openrouter-gemini	translation	success	\N	\N	5812	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:37.946312
ba4ad737-15d1-49f1-8323-3c732a36648c	openrouter-gemini	translation	success	\N	\N	7125	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:39.631451
09aa0393-4365-4a89-9e6d-5dcd59e881a6	openrouter-gemini	translation	success	\N	\N	5500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:43.449813
1332c43d-afac-4fcc-b1d6-0847d948289c	openrouter-gemini	translation	success	\N	\N	5719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:45.371933
12461a4f-414d-4021-b30e-9f018f2dbe6e	openrouter-gemini	translation	success	\N	\N	3530	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:46.997552
fbec0fb0-9bc9-4985-978a-3ffcbca8d49f	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:49.320663
6ae6f902-80b0-46e7-af58-c2e54cbdc4e1	openrouter-gemini	translation	success	\N	\N	4187	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:51.207439
f69d58b8-d389-48d0-b51e-b56dfcd7ca43	openrouter-gemini	translation	success	\N	\N	3750	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:53.073046
ede99def-41a5-423d-8ac7-b7fce33e9ed2	openrouter-gemini	translation	success	\N	\N	3453	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:54.681879
e3b49f28-88e1-45fe-8fc0-61711d53b3e3	openrouter-gemini	translation	success	\N	\N	3359	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:56.45155
4607b692-616e-4c01-b51a-9957a4fad04c	openrouter-gemini	translation	success	\N	\N	3905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:28:58.585622
0cd508ec-5556-4d9c-9ace-c366f9d1c02f	openrouter-gemini	translation	success	\N	\N	3186	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:01.777796
0e63fae1-5f56-47a2-87c6-3df12ce9c71c	openrouter-gemini	translation	success	\N	\N	3407	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:05.189274
3e066991-5420-42c8-b9c6-83def83d86ea	openrouter-gemini	translation	success	\N	\N	10811	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:07.271808
282af4f2-7dad-49f9-a215-194e7e4aa549	openrouter-gemini	translation	success	\N	\N	7000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:12.19865
94a06863-f964-41ec-b57a-2c0c5996b526	openrouter-gemini	translation	success	\N	\N	5454	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:12.732648
fa3ff128-5a91-4519-8ee7-9e0ac47d0c1d	openrouter-gemini	translation	success	\N	\N	3390	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:15.597635
a873d4ba-d9e9-4751-91f1-01a379618bf0	openrouter-gemini	translation	success	\N	\N	3937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:16.661812
55eb860c-6394-48a4-8475-e262023d7ca1	openrouter-gemini	translation	success	\N	\N	3764	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:19.373657
33dbf132-082f-475b-9ddb-43ba03e28065	openrouter-gemini	translation	success	\N	\N	3702	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:20.375799
1d8574a4-e317-4d95-88dc-cde7a11da349	openrouter-gemini	translation	success	\N	\N	4219	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:23.612454
e4b05378-9eb8-4314-8af8-84ac9575ee7b	openrouter-gemini	translation	success	\N	\N	3844	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:24.226343
404cfd9d-e3ae-4dd8-aa15-c174bd83435d	openrouter-gemini	translation	success	\N	\N	2625	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:26.864361
f6ac9c0c-107a-408f-90a3-0cbadc6109b5	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:27.19926
ea7de1b1-aa50-4f6f-85cb-281c19278196	openrouter-gemini	translation	success	\N	\N	4640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:31.838282
ddfe11ec-e5ba-4136-b7a0-5e511d9492b7	openrouter-gemini	translation	success	\N	\N	2328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:34.169428
4816080d-3342-45de-9d45-084fc22a3aab	openrouter-gemini	translation	success	\N	\N	3608	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:37.776692
d02f1a21-9282-4591-a3a2-b6503dbd63a7	openrouter-gemini	translation	success	\N	\N	3485	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:41.256531
6e3dc81f-ab2c-47c5-bca8-6f66400de51f	openrouter-gemini	translation	success	\N	\N	2327	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:07.115596
9d4bf316-b380-4993-9634-161fa64729a3	openrouter-gemini	translation	success	\N	\N	3578	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:36.056952
c381e528-d911-4a86-a172-a71252affe83	openrouter-gemini	translation	success	\N	\N	3358	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:08.657888
ec86dae9-b93b-457e-850f-64a68beeefb7	openrouter-gemini	translation	success	\N	\N	4375	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:32.32963
cecb8523-78fa-482b-a222-d038fd7d9de9	openrouter-gemini	translation	success	\N	\N	2030	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:42.588214
42efdd51-3b4f-48f1-837f-2254b27bb5ae	openrouter-gemini	translation	success	\N	\N	1688	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:02.468958
de3cdf27-8b14-4cec-851a-fc91b5b77bc7	openrouter-gemini	translation	success	\N	\N	2797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:30.061217
c3f39a8b-0753-4a6c-85b9-fa0435a4f800	openrouter-gemini	translation	success	\N	\N	1875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:55.273047
0dd40858-4b4b-4cc9-a57c-47510d476f6b	openrouter-gemini	translation	success	\N	\N	5078	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:24.16246
dc3c2563-08d9-490a-9b81-746690a505b6	openrouter-gemini	translation	success	\N	\N	2452	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:50.137958
ae69d7f9-c160-4e13-9ecd-e90b9f5f44f5	openrouter-gemini	translation	success	\N	\N	1250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:10.022251
16eeff70-6b79-4baa-9aba-0d7156221ab2	openrouter-gemini	translation	success	\N	\N	7000	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:48.263426
292621c3-5966-4437-afa4-d696922e2207	openrouter-gemini	translation	success	\N	\N	4094	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:11.215012
793232f7-1093-4cfe-9947-ead05ee3ba03	openrouter-gemini	translation	success	\N	\N	4984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:41.038665
02811807-e186-466d-8238-6f7f811a641e	openrouter-gemini	translation	success	\N	\N	3718	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:12.388291
06ea8f23-a5c1-481d-846d-6f7bbc0d8aea	openrouter-gemini	translation	success	\N	\N	8561	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:40.910356
7d22c020-f951-4da6-ba17-05947fb2b0cd	openrouter-gemini	translation	success	\N	\N	5094	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:55.37631
f1b60c2a-4021-4f3e-b1cd-f8c78cbec20f	openrouter-gemini	translation	success	\N	\N	4860	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:17.805026
e523a6c3-aecc-416c-bd3d-07c5fae4a344	openrouter-gemini	translation	success	\N	\N	4735	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:42.486874
fc764974-5cfb-4fe2-8e45-02598b971994	openrouter-gemini	translation	success	\N	\N	4109	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:09.996316
a3fd1c80-35fb-446c-81b3-346af1879584	openrouter-gemini	translation	success	\N	\N	6094	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:38.314952
4e2f0785-8ba4-404c-b305-72961f44f4cc	openrouter-gemini	translation	success	\N	\N	5062	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:03.141334
82b5f950-04bd-4a7c-8369-17b5c6fabd3a	openrouter-gemini	translation	success	\N	\N	3906	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:52.176107
045096c0-c2f7-4231-bbe2-f5a244070228	openrouter-gemini	translation	success	\N	\N	4828	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:16.053128
17bc64ae-3179-4304-80b5-502ece13c265	openrouter-gemini	translation	success	\N	\N	3968	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:45.016998
240e9eb5-4c76-4335-8734-dc909f49ab9b	openrouter-gemini	translation	success	\N	\N	1547	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:13.943099
47e176d5-68a8-4655-b10a-170e1fa39ff7	openrouter-gemini	translation	success	\N	\N	4483	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:45.410042
8bf538ff-ba56-4fe3-af21-8d6f3130aed0	openrouter-gemini	translation	success	\N	\N	7092	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:40.54399
4faed82a-e422-402e-9473-4f2bfd1ca75f	openrouter-gemini	translation	success	\N	\N	3640	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:00.770232
3eb7fc53-bb25-434f-9f36-ba8c40aa6f81	openrouter-gemini	translation	success	\N	\N	7531	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:27.232812
2515d358-5d45-490b-b55f-a4aeab449a1c	openrouter-gemini	translation	success	\N	\N	5687	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:53.389705
b7df6049-c74d-4c93-b6c1-aebdd7af81cc	openrouter-gemini	translation	success	\N	\N	6875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:19.084158
bd40908a-7329-4f93-bfad-83dfcb6d6c28	openrouter-gemini	translation	success	\N	\N	7250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:47.673896
08db9b20-0442-4d39-b576-4c85d2198d43	openrouter-gemini	translation	success	\N	\N	4937	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:08.767389
515b803c-1235-454d-9c95-18fc6af238b2	openrouter-gemini	translation	success	\N	\N	4327	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:29:56.519755
0b8e26b3-b8d7-48cb-9bd7-ebe159edb262	openrouter-gemini	translation	success	\N	\N	4467	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:20.522414
3f582f55-9a5e-44cf-b486-e038d4565c45	openrouter-gemini	translation	success	\N	\N	6766	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:51.791434
37365193-593d-44f1-b5cc-fcc897934973	openrouter-gemini	translation	success	\N	\N	5469	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:19.412893
a2b93265-5a20-46a4-a29a-11695b1aad53	openrouter-gemini	translation	success	\N	\N	8921	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:54.337982
7d3e600c-cec2-4283-9cb3-3de0797aefbd	openrouter-gemini	translation	success	\N	\N	1719	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:57.11148
54693e5a-40a3-40ec-9f58-175c1deea86d	openrouter-gemini	translation	success	\N	\N	1875	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:19.688028
0ba60ec0-9be2-4e63-b3ff-599c2c9f571a	openrouter-gemini	translation	success	\N	\N	5203	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:47.693589
4a7b8d94-bc80-4696-8907-ffc50dd2cf37	openrouter-gemini	translation	success	\N	\N	2172	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:12.186575
a2259f04-e58c-4c72-8d4c-74b4603a170d	openrouter-gemini	translation	success	\N	\N	2077	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:40.39921
35313366-b957-4049-bc29-ee2dc829ff23	openrouter-gemini	translation	success	\N	\N	687	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:03.823751
26a8cbee-bf68-4369-8a51-55abda0d0b4b	openrouter-gemini	translation	success	\N	\N	4563	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:01.091258
dad9c53b-7e49-4da0-a48a-0fbf6beec4f1	openrouter-gemini	translation	success	\N	\N	7016	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:27.566938
b8867e15-8c9e-4125-8b8e-e75bd0d6235e	openrouter-gemini	translation	success	\N	\N	7702	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:59.500307
e18691a2-7cb6-4a2f-b8ab-3b7ad5dbfc5f	openrouter-gemini	translation	success	\N	\N	3530	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:22.951445
08ab4610-a56d-465c-a8f9-93a774dbe97d	openrouter-gemini	translation	success	\N	\N	3984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:58.330716
4caf710b-8967-4e60-8945-5c27650105b2	openrouter-gemini	translation	success	\N	\N	5328	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:47.918
979d87b8-ece0-4e0c-b291-74ba7d6a737f	openrouter-gemini	translation	success	\N	\N	5250	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:07.715152
d251b860-9168-46e5-b8f7-7a60e1df2636	openrouter-gemini	translation	success	\N	\N	5827	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:35.887942
00914e28-d21a-40ac-b7e1-ffe8111d7ee5	openrouter-gemini	translation	success	\N	\N	6797	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:02.08263
23ead744-ddbf-47c4-9aa4-78dd4c000fe6	openrouter-gemini	translation	success	\N	\N	6109	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:30.287331
b5852077-56f9-451d-9cb5-6591cc623aa8	openrouter-gemini	translation	success	\N	\N	5391	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:55.551386
d711a482-e6f6-4e51-aea7-9f38e60f367a	openrouter-gemini	translation	success	\N	\N	3686	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:04.780311
9abdc1bb-6f36-40d5-a737-a601a5c3f7e3	openrouter-gemini	translation	success	\N	\N	4671	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:30:32.440837
f210742c-191e-47f3-afde-6e5d4f071835	openrouter-gemini	translation	success	\N	\N	5764	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:05.284922
bbfe2bcb-3384-4fb4-9986-4f76d833d9bb	openrouter-gemini	translation	success	\N	\N	4984	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:31:27.946137
413b7a77-3323-4a49-b596-b7298ec6d1dd	openrouter-gemini	translation	success	\N	\N	2343	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:43:50.265
11eff163-67e5-4e54-aa13-1c1f21d15e0f	openrouter-gemini	translation	success	\N	\N	5219	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:12.940921
3e1c3847-f1d3-4cca-b13a-429ea08f98fe	openrouter-gemini	translation	success	\N	\N	1844	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:44:37.735581
14d348c4-ee7c-4091-a3ea-762506106597	openrouter-gemini	translation	success	\N	\N	3780	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:05.879618
0e245112-cda8-46eb-b08e-fc599960d588	openrouter-gemini	translation	success	\N	\N	1905	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:32.205845
d0f5cef1-276a-4161-89a8-56f2d7c00c89	openrouter-gemini	translation	success	\N	\N	2500	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:45:58.062951
fabfdf5a-c787-4843-b67a-d480bd7fd062	openrouter-gemini	translation	success	\N	\N	4782	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:14.8111
0680107f-4cb9-46df-bcbc-f78c87aa5ecb	openrouter-gemini	translation	success	\N	\N	936	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:15.779061
2bda037c-fbcc-4559-a2f6-4206ea1c0214	openrouter-gemini	translation	success	\N	\N	3562	0	f	b3925813-0140-477b-84e4-076f28f1daa4	2026-07-03 10:46:19.364278
9afa103a-0d3c-481d-9209-680b31868217	openrouter-gemini	translation	success	\N	\N	5922	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:24:49.283147
2bbe20d8-3e64-4446-9f99-64a4b6f75f75	openrouter-gemini	translation	success	\N	\N	1672	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:24:51.009011
b55f8a82-d353-4d2f-ad5e-575dcdf99039	openrouter-gemini	translation	success	\N	\N	4890	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:24:55.934432
81d8713c-3a5a-4ea9-a041-87c8e3e638bb	openrouter-gemini	translation	success	\N	\N	1641	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:24:57.591939
ac216448-9bf1-4833-b3b3-6c3b5b334706	openrouter-gemini	translation	success	\N	\N	6500	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:25:04.124217
e75304fa-a105-4ae9-9d92-95093ade32ea	openrouter-gemini	translation	success	\N	\N	1218	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:25:05.359417
ba02ec4a-8d59-4838-be0c-d0e7ed4fa80e	openrouter-gemini	translation	success	\N	\N	6718	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:25:12.099411
6b78df08-0ac8-4fd9-b7e0-13da0554950d	openrouter-gemini	translation	success	\N	\N	1342	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:25:13.452111
5a15567d-94c4-4449-9fd3-2100c66e55ff	openrouter-gemini	translation	success	\N	\N	8031	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-07 06:25:21.506549
f4901ea5-e24f-45b4-b434-87d0d2ffae28	openrouter-gemini	translation	success	\N	('Connection aborted.', ConnectionResetError(10054, 'An existing connection was forcibly closed by the remote host', None, 10054, None))	67187	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-10 06:01:22.317768
42a93c18-4edc-4d6e-b0ad-3a56865ae678	openrouter-gemini	translation	success	\N	\N	24891	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-10 06:08:08.405148
ee672bce-7a7b-4450-bd3c-243a6f5a0242	openrouter-gemini	translation	success	\N	\N	3358	0	f	59ffc06a-a098-4c42-9cb7-8df23cbae806	2026-07-10 06:08:49.657886
\.


--
-- Data for Name: smtp_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.smtp_settings (id, tenant_id, smtp_host, smtp_port, smtp_username, smtp_password, from_email, reply_to_email, created_at, updated_at, from_name, encryption_type, connection_timeout, enable_authentication, is_enabled) FROM stdin;
8252cf0f-bfe3-41dc-b6db-10c37b9022ad	\N	smtp.gmail.com	587	aachinancy@gmail.com	gAAAAABqQkNgyb584eu-PaymFx5Y0iwjMixkCGV4H8DyZuzEfULJqNdxg-KN-P75X9coaN4v5OI3B1WgYATlgaVlg4_FanrgQlCcDlsNal4byRArpHTWzAg=	aachinancy@gmail.com		2026-06-29 09:34:23.579517	2026-06-29 17:07:20.951982	Fluentia Admin	TLS	10	t	t
\.


--
-- Data for Name: subscription_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_history (id, tenant_id, plan_id, action, price, start_date, end_date, created_at) FROM stdin;
00eb7151-ad26-4f83-aab5-d7bce6c05b2c	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	renew	19	2026-06-19 09:35:15.663	2026-07-19 09:35:15.663	2026-06-19 09:35:15.737
13604056-7673-4f45-aa75-4cb590aeba79	4580e056-5929-4cd4-bf6e-6ee2e44749ff	bd2d30c1-c0d4-4a07-82f4-e02df7136745	upgrade	49	2026-06-22 06:16:10.357	2026-07-22 06:16:10.357	2026-06-22 06:16:10.427
1b26b31d-e5d7-4fe7-8c8c-ba53131e846e	771743ea-a1ad-47f3-9467-74f925fc2725	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-24 17:48:18.697	2026-07-24 17:48:18.697	2026-06-24 17:48:20.22
25e19f23-1f85-477e-9dbd-b32113a60000	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	renew	19	2026-06-22 08:26:07.377	2026-07-22 08:26:07.377	2026-06-22 08:26:07.517
3721ec7d-bc24-4198-8628-d89eff36e255	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-19 08:34:01.78	2026-07-19 08:34:01.78	2026-06-19 08:34:07.37
4977d942-ccbc-4cb4-969c-af1a2e17c436	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-22 04:46:27.397	2026-07-22 04:46:27.397	2026-06-22 04:46:28.667
5141bac6-6970-45d6-ad0d-a93a17a64130	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-22 12:19:55.44	2026-07-22 12:19:55.44	2026-06-22 12:19:56.083
5af88494-f681-4864-b029-0720d644b4fd	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	upgrade	49	2026-06-22 04:55:02.82	2026-07-22 04:55:02.82	2026-06-22 04:55:02.977
6ceca1e9-3324-448c-943c-108be55ed9aa	4580e056-5929-4cd4-bf6e-6ee2e44749ff	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	upgrade	0	2026-06-19 09:35:34.57	2026-07-19 09:35:34.57	2026-06-19 09:35:34.847
741fbeee-1fc6-40d0-b768-2a6b1eff1232	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	upgrade	0	2026-06-22 08:26:50.007	2026-07-22 08:26:50.007	2026-06-22 08:26:55.09
8d2465f4-b558-4be2-9d8e-a6449d27f57a	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	renew	49	2026-06-22 05:24:38.687	2026-07-22 05:24:38.687	2026-06-22 05:24:38.733
90a5380e-ac68-4378-b873-8cae970aa541	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-22 05:24:57.223	2026-07-22 05:24:57.223	2026-06-22 05:24:58.267
96a4a04c-7981-4002-b00c-9f5af37595ee	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	upgrade	49	2026-06-22 05:47:51.95	2026-07-22 05:47:51.95	2026-06-22 05:47:52.093
9da45cf9-567a-481c-985c-1dda4a439f30	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-22 06:19:04.367	2026-07-22 06:19:04.367	2026-06-22 06:19:04.517
a7d6e8a6-1130-4dc1-bc5b-b1d7f9d5c737	6e1bf4cd-639c-4112-8681-57fdf6a2793b	6f5961cc-2635-4c73-a984-685c07fd1664	upgrade	149	2026-06-24 18:01:45.9	2026-07-24 18:01:45.9	2026-06-24 18:01:46.457
a7df7b01-f1a0-4c31-ba9d-5f5db32b3934	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	upgrade	0	2026-06-26 11:08:45.57	2026-07-26 11:08:45.57	2026-06-26 11:08:46.09
b1eceb7d-af3b-44bf-9faa-28f7e9113f40	4580e056-5929-4cd4-bf6e-6ee2e44749ff	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-19 10:09:59.623	2026-07-19 10:09:59.623	2026-06-19 10:10:00.58
f7c6122c-f52d-45d5-b112-18f540455dd0	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-27 10:37:48.692585	2026-07-27 10:37:48.692585	2026-06-27 10:37:49.494058
5723e3e8-5c60-4610-9c7b-abbf77117227	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	upgrade	0	2026-06-28 17:21:21.151346	2026-07-28 17:21:21.151346	2026-06-28 17:21:21.379832
e6ce6ca4-af54-4e59-9b7a-164268a4e73c	58afbbe1-aa38-45a0-b546-52981be67c00	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-28 17:31:46.49399	2026-07-28 17:31:46.49399	2026-06-28 17:31:46.705999
56729765-bbc1-4853-a9e4-103a53237a01	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-06-28 18:01:51.569847	2026-07-28 18:01:51.569847	2026-06-28 18:01:51.8902
4daca441-0bcb-45f3-8b23-130709255a28	59ffc06a-a098-4c42-9cb7-8df23cbae806	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	upgrade	0	2026-07-01 06:18:30.71508	2026-07-31 06:18:30.71508	2026-07-01 06:18:31.149942
c777d808-125f-4b0a-8d69-4674ea4a55cd	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	29	2026-07-01 10:17:34.892478	2026-07-31 10:17:34.892478	2026-07-01 10:17:36.458979
a19c140f-a96a-4294-8201-3dfae6f80967	59ffc06a-a098-4c42-9cb7-8df23cbae806	bd2d30c1-c0d4-4a07-82f4-e02df7136745	upgrade	49	2026-07-07 06:20:56.434445	2026-08-06 06:20:56.434445	2026-07-07 06:20:57.323572
9e40e08a-8bea-48cb-83b0-34d84dea4e81	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	upgrade	19	2026-07-10 06:06:46.966146	2026-08-09 06:06:46.966146	2026-07-10 06:06:48.231555
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, name, price, transcription_limit, translation_limit, tts_limit, storage_limit, active, created_at) FROM stdin;
6f5961cc-2635-4c73-a984-685c07fd1664	Enterprise	149	1200	2000000	1000000	10000	t	2026-06-16 05:10:34.283
bd2d30c1-c0d4-4a07-82f4-e02df7136745	Professional	49	300	500000	250000	2000	t	2026-06-16 05:10:34.283
58328dcf-5fcd-47ae-84b2-73212043a9dc	Starter	19	60	100000	50000	500	t	2026-06-16 05:10:34.283
c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	Free	0	20	10000000	50000	50	t	2026-06-16 05:10:34.283
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, tenant_id, plan_id, status, price, billing_cycle, start_date, end_date, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at) FROM stdin;
257eadc0-76bb-403b-9c1e-413aabdb944a	4580e056-5929-4cd4-bf6e-6ee2e44749ff	bd2d30c1-c0d4-4a07-82f4-e02df7136745	active	49	monthly	2026-06-22 06:16:10.357	2026-07-22 06:16:10.357	2026-06-22 06:16:10.357	2026-07-22 06:16:10.357	f	2026-06-19 08:34:06.983	2026-06-22 06:16:10.423
474233b5-dc5e-45a8-bab7-64db51c94ca5	6e1bf4cd-639c-4112-8681-57fdf6a2793b	6f5961cc-2635-4c73-a984-685c07fd1664	active	149	monthly	2026-06-24 18:01:45.9	2026-07-24 18:01:45.9	2026-06-24 18:01:45.9	2026-07-24 18:01:45.9	f	2026-06-24 18:01:46.407	2026-06-24 18:01:46.407
7ca20f34-12fa-4ec2-bfea-f3d0a98228b0	771743ea-a1ad-47f3-9467-74f925fc2725	58328dcf-5fcd-47ae-84b2-73212043a9dc	active	19	monthly	2026-06-24 17:48:18.697	2026-07-24 17:48:18.697	2026-06-24 17:48:18.697	2026-07-24 17:48:18.697	f	2026-06-24 17:48:19.99	2026-06-24 17:48:19.99
50e6ea3e-d455-40e7-904b-eed2adbcda60	58afbbe1-aa38-45a0-b546-52981be67c00	58328dcf-5fcd-47ae-84b2-73212043a9dc	active	19	monthly	2026-06-28 17:31:46.49399	2026-07-28 17:31:46.49399	2026-06-28 17:31:46.49399	2026-07-28 17:31:46.49399	f	2026-06-28 17:31:46.680034	2026-06-28 17:31:46.680034
9e787549-e124-4fcc-936e-f9f879742624	b3925813-0140-477b-84e4-076f28f1daa4	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	active	0	monthly	2026-07-03 09:45:09.764838	2026-07-10 09:45:09.764838	2026-07-03 09:45:09.764838	2026-07-10 09:45:09.764838	f	2026-07-03 09:45:09.783996	2026-07-03 09:45:09.783996
9b23bc16-01f5-4edc-b946-643b5b2d96a7	59ffc06a-a098-4c42-9cb7-8df23cbae806	58328dcf-5fcd-47ae-84b2-73212043a9dc	active	19	monthly	2026-07-10 06:06:46.966146	2026-08-09 06:06:46.966146	2026-07-10 06:06:46.966146	2026-08-09 06:06:46.966146	f	2026-06-22 04:46:28.627	2026-07-10 06:06:48.181246
\.


--
-- Data for Name: tenant_branding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_branding (id, tenant_id, custom_domain, branding_id, theme_id, created_at) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, tenant_name, slug, status, plan_id, created_at, updated_at) FROM stdin;
4580e056-5929-4cd4-bf6e-6ee2e44749ff	Tekq	tekq	deleted	bd2d30c1-c0d4-4a07-82f4-e02df7136745	2026-06-16 08:22:19.013	2026-06-24 16:45:57.307
6d6f0256-4dad-42c9-a0f0-aea21ec76b83	TekQuora	tekcom	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-06-24 17:32:55.853	2026-06-24 17:32:55.853
6d7a4b69-7143-42be-aa65-b6ebe7d11f57	Raghul Tech	techcom	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-06-26 05:02:14.037	2026-06-26 05:02:14.037
6e54121c-f05c-4e9c-89bb-ff251631d75a	Google	google	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-06-24 05:36:56.853	2026-06-24 05:36:56.853
771743ea-a1ad-47f3-9467-74f925fc2725	MRF	mrf	active	58328dcf-5fcd-47ae-84b2-73212043a9dc	2026-06-24 17:46:59.303	2026-06-24 17:48:19.677
80ce2467-e021-461a-bb93-f60432583032	ppp	ppp	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-06-24 18:16:59.65	2026-06-24 18:16:59.65
eefc685a-4359-421b-b5a6-812b976bf372	Raghu	sdfg	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-06-26 05:15:34.71	2026-06-26 05:15:34.71
6e1bf4cd-639c-4112-8681-57fdf6a2793b	nan	nannn	suspended	6f5961cc-2635-4c73-a984-685c07fd1664	2026-06-24 18:00:29.85	2026-06-27 11:26:24.882655
58afbbe1-aa38-45a0-b546-52981be67c00	Travels	travelscom	active	58328dcf-5fcd-47ae-84b2-73212043a9dc	2026-06-24 17:41:04.307	2026-06-28 17:31:46.670121
b3925813-0140-477b-84e4-076f28f1daa4	yesh	yesh	active	c98f5b29-858c-4bab-bfd3-81a6a4d99c7b	2026-07-03 09:45:06.364973	2026-07-03 09:45:06.364973
59ffc06a-a098-4c42-9cb7-8df23cbae806	MMIP	mmipcom	active	58328dcf-5fcd-47ae-84b2-73212043a9dc	2026-06-20 07:26:28.43	2026-07-10 06:06:48.065276
\.


--
-- Data for Name: test_table2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_table2 (id) FROM stdin;
836fcb36-7f71-4451-8d21-9294f80bac20
\.


--
-- Data for Name: theme_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.theme_settings (id, tenant_id, mode, primary_color, secondary_color, accent_color, success_color, warning_color, error_color, font_family, font_size, heading_styles, border_radius, shadow_style, card_style, sidebar_width, navbar_height, created_at, updated_at) FROM stdin;
ca20ef00-e130-42a5-88ba-ae7b0f6917ba	\N	dark	#2563EB	#4F46E5	#06B6D4	#10B981	#F59E0B	#EF4444	Inter	14px	\N	16px	normal	glassmorphism	256px	64px	2026-06-17 10:15:15.343	2026-06-17 10:15:15.343
\.


--
-- Data for Name: transcription_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcription_history (id, tenant_id, user_id, file_name, file_size, duration_seconds, transcript_text, provider, created_at) FROM stdin;
19a5af85-b286-4320-8649-baddf4a817f7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	663338	18.978252410888672	Good in me. You have to say something. You have to say it later. No, no. I don't know why you are using it. Why could you say it?	local-whisper	2026-06-22 12:19:34.29
2443c01f-cc47-466c-9894-49cdbb83044b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	192864	6	Hello and oh good morning, the sun met. Hello and oh. And oh. Yeah, yeah, T.O. and oh.	local-whisper	2026-06-22 06:33:44.04
57c6a4fa-5de2-4d98-b05d-76e64c7ca579	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	62454	6	Good morning.	local-whisper	2026-06-22 04:44:49.503
fe583c23-6d7d-46e1-9295-9dedf64b9535	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	39270	6	Go and go good morning.	local-whisper	2026-06-22 06:33:25.07
e1d50390-44a1-4dce-8bb1-c705b1d40b66	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	WhatsApp Audio 2026-06-08 at 2.29.05 PM.ogg	6155	6	Hello, Praveen, good morning.	local-whisper	2026-06-30 13:10:38.991586
c7e5b6eb-f948-4fa7-b40b-9d775f28dbf1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	WhatsApp Audio 2026-06-08 at 2.29.05 PM.ogg	6155	6	Hello, Praveen, good morning.	local-whisper	2026-06-30 13:50:00.482505
66a3e12d-8715-4c74-b7af-f99f866f31b2	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	63420	6	Hmm. I'm not coming.	local-whisper	2026-06-30 13:52:44.079133
4f679b2a-003b-4e9c-a0c3-268a01db30b8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	57624	6	Hello good morning	local-whisper	2026-06-30 14:05:42.546941
7d39f26f-ef1c-4c94-bc53-bb962478f5c2	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	106890	6	My name is Nancy. Good name?	local-whisper	2026-06-30 14:07:44.297613
0bae6017-8f9f-4473-88ec-607b86a7a3dd	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	103026	6	Good morning, my name is Nancy. Tomorrow I have a demo work.	local-whisper	2026-06-30 14:09:30.171926
4e1b2bbf-333a-4331-8acb-696252edc555	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	voice-recording.wav	96582	6	Hello	local-whisper	2026-07-01 10:23:53.588881
\.


--
-- Data for Name: translation_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.translation_history (id, tenant_id, user_id, source_text, translated_text, source_lang, target_lang, provider, created_at) FROM stdin;
0591fdc8-a589-4e56-aa7a-c2d35b453bdb	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The current Text-to-Speech implementation is incorrect.\r\n\r\nCurrent behavior:\r\n- English words and numbers are spoken.\r\n- Tamil Unicode text is ignored or skipped.\r\n- Marutham font is correctly applied, so this is NOT a font issue.\r\n- The problem is the speech engine.\r\n\r\nFix the implementation.\r\n\r\nRequirements:\r\n\r\n1. Never use an English voice to read Tamil text.\r\n\r\n2. Detect the language before speaking.\r\n\r\n3. If the detected language is Tamil:\r\n   - Use a real Tamil voice (ta-IN).\r\n   - Do not fall back to English voices.\r\n\r\n4. If the browser has no Tamil voice:\r\n   - Automatically use the configured cloud TTS provider.\r\n   - Prefer Azure AI Speech or Google Cloud TTS if configured.\r\n   - If ElevenLabs is configured, verify the selected model supports Tamil.\r\n\r\n5. Do not read only English words or numbers from mixed Tamil text.\r\n\r\n6. Speak the complete Tamil Unicode text.\r\n\r\n7. Log:\r\n   - detected language\r\n   - selected voice\r\n   - provider used\r\n   - playback status\r\n   - any errors\r\n\r\n8. If no Tamil voice exists locally, display:\r\n   "Using cloud Tamil voice."\r\n\r\n9. Never silently switch to English pronunciation for Tamil text.\r\n\r\n10. Keep the UI unchanged.	???????? ????????????? ?????? ????????????? ???????.\r\n\r\n???????? ??????:\r\n- ?????? ??????????? ??????? ?????? ??????????????.\r\n- ????? ???????? ??? ??????????????????? ?????? ????????????????.\r\n- ?????? ????????? ???????? ??????????????????????, ???? ??? ????????? ????????? ????.\r\n- ???????? ?????? ?????????.\r\n\r\n????????????? ????????????.\r\n\r\n???????:\r\n\r\n1. ????? ??????? ?????? ???????? ??????? ?????????? ????????.\r\n\r\n2. ?????? ???? ???????? ???????????.\r\n\r\n3. ????????????? ???? ????? ???????:\r\n   - ???????? ????? ??????? ?????????????? (ta-IN).\r\n   - ???????? ?????????????? ??????? ????????.\r\n\r\n4. ????????? ????? ????? ????? ???????:\r\n   - ??????????????? ??????? TTS ??????????? ??????? ??????????????.\r\n   - ????????????????????????, Azure AI ?????? ?????? Google Cloud TTS ? ???????????.\r\n   - ElevenLabs ????????????????????????, ??????????????????? ?????? ????? ??????????? ????? ??????????????.\r\n\r\n5. ?????? ????????????? ?????? ?????? ????? ????????????? ???????? ??????? ??????????????.\r\n\r\n6. ????????? ????? ???????? ??????? ?????????.\r\n\r\n7. ?????:\r\n   - ????????????? ????\r\n   - ??????????????????? ?????\r\n   - ????????? ???????????????\r\n   - ??????? ????\r\n   - ??????? ???????\r\n\r\n8. ????????? ????? ????? ????? ???????, ??????:\r\n   "??????? ????? ??????? ??????????????."\r\n\r\n9. ????? ???????? ?????? ?????????????? ???????? ???????????.\r\n\r\n10. UI ??????? ?????????????.	Auto (en)	Tamil	openai	2026-06-25 18:54:42.867
0bc77388-dd96-48a6-baef-785ecf080407	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	????? ?????? ????? ??????? ????????????? ?????????. ????????????? ????????? ?????????, ????????, ???, ??????? ??????? ???????? ???? ????????? ????????? ??????????? ?????????? ?????? ????????. ???? ???????????? ??????????? ???????? ??????????, ?????? ????? ?????????, ???? ????????????? ???????????????????. ?????? ????????????? ??????????? ????????????? ??????? ??????? ???????? ????????. ???????????, ?????? ????????, ??????? ????????? ???????? ??????? ????????????? ????????????? ????? ????? ????? ????????? ?????? ????????????????????. ????? ?????? ??????, ??????????? ??????? ?????? ??????????? ?????? ????????? ??????? ???????? ????????????. ???? ?????? ?????? ??????? ?????? ?????????; ??? ??? ?????????? ??????, ???????, ???????? ??????? ????????????? ?????????????? ??????????? ???????????.	????? ?????? ????? ??????? ????????????? ?????????. ????????????? ????????? ?????????, ????????, ???, ??????? ??????? ???????? ???? ????????? ????????? ??????????? ?????????? ?????? ????????. ???? ???????????? ??????????? ???????? ??????????, ?????? ????? ?????????, ???? ????????????? ???????????????????. ?????? ????????????? ??????????? ????????????? ??????? ??????? ???????? ????????. ???????????, ?????? ????????, ??????? ????????? ???????? ??????? ????????????? ????????????? ????? ????? ????? ????????? ?????? ????????????????????. ????? ?????? ??????, ??????????? ??????? ?????? ??????????? ?????? ????????? ??????? ???????? ????????????. ???? ?????? ?????? ??????? ?????? ?????????; ??? ??? ?????????? ??????, ???????, ???????? ??????? ????????????? ?????????????? ??????????? ???????????.	Auto (ta)	Tamil	openai	2026-06-25 17:10:02.103
0c96f72b-f16d-49f9-b2af-bfa47754ee64	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	??????? ???? ???????	Auto (en)	Tamil	openai	2026-06-26 11:41:11.713
0caa4c32-eae1-43a6-ba3e-d2a28751f673	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	?????????????? ??????? ????????? ??????? ???? ???????????????? ??????? ???????? ????? ???????????? ?????? ?????????????. ?????? ???? ???????? ?????????? ???????? ???????????????????? ?????????? ?????????. ??? ?????, ??????????, ???? ???????, ?????? ??????? ???? ???????????? ?????? ??????? ?????????.\r\n\r\n?????? ??????????? ??????? ???????????, ??????? ??????? ?????????? ???? ??????? ?????????????. ??????? ??????? ?????? ???????????? ??????????????? ???????????, ?????????? ?????? ??????? ???????? ?????????? ??? ????????. ???? ?????? ????? ????????????????? ??? ????? ?????????; ??? ????????? ????????? ??? ?????????.	?????????????? ??????? ????????? ??????? ???? ???????????????? ??????? ???????? ????? ???????????? ?????? ?????????????. ?????? ???? ???????? ?????????? ???????? ???????????????????? ?????????? ?????????. ??? ?????, ??????????, ???? ???????, ?????? ??????? ???? ???????????? ?????? ??????? ?????????.\r\n\r\n?????? ??????????? ??????? ???????????, ??????? ??????? ?????????? ???? ??????? ?????????????. ??????? ??????? ?????? ???????????? ??????????????? ???????????, ?????????? ?????? ??????? ???????? ?????????? ??? ????????. ???? ?????? ????? ????????????????? ??? ????? ?????????; ??? ????????? ????????? ??? ?????????.	Auto (ta)	Tamil	openai	2026-06-25 11:25:02.567
100b6bf3-f179-4176-80c7-191e34ee12ef	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	??????? ?????	Auto (en)	Tamil	openai	2026-06-22 04:41:50.813
1500bf84-c88e-4b65-a124-a0ec9f01d682	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	olá, bom dia	Auto (en)	Portuguese	openai	2026-06-26 11:42:02.327
15aaa27a-7a57-46a9-8adc-6c51196b172d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	bonjour anto	Auto (en)	French	openai	2026-06-22 04:42:11.3
15ae82ba-ceb6-41f0-9324-48ec07c0c839	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	bonjour anto	Auto (en)	French	openai	2026-06-22 04:44:11.36
15c26447-a1a9-40ce-9bab-419c68a527c0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	ciao buongiorno	Auto (en)	Italian	openai	2026-06-26 11:42:21.617
16a6f5d5-8eb1-469c-8d66-cc5db4267525	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	????? ???? ?????	Auto (en)	Arabic	openai	2026-06-26 11:42:07.03
193c6bec-b593-49be-94c3-383be17cce76	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	????	Auto (en)	Chinese (Simplified)	openai	2026-06-22 04:36:01.983
1b067204-b70a-46df-ab65-4ac30c669c3e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	?????? ?????	Auto (en)	Hindi	openai	2026-06-22 04:19:02.39
1b5ee7b4-41e4-4cfb-afb5-7a67824ac45d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	hola, buenos días	Auto (en)	Spanish	openai	2026-06-26 11:41:30.963
1e2f207a-64d8-49c6-93f1-9f9637b4f57c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	bonjour bonjour	Auto (en)	French	openai	2026-06-26 11:41:39.187
1f8ef9a1-7d6a-4974-b7c8-d20d359e90b5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	hola nancy	Auto (en)	Spanish	openai	2026-06-22 04:18:59.277
244ac1e3-011c-48a9-9094-9c657fcaa0ae	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	Hallo Nancy	Auto (en)	German	openai	2026-06-22 10:44:30.09
24ae9366-2e22-4c45-9d5d-a6297217afd5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	xin chào anto	Auto (en)	Vietnamese	openai	2026-06-22 04:43:50.293
2857c726-b164-452c-8c3d-17d13618a648	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	???? ????	Auto (en)	Hindi	openai	2026-06-22 04:41:54.92
bdaca183-f1b1-4bed-8883-c7e08ae844e9	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	Sample College Report (Approx. 50 Pages)\r\n\r\nPage 1: College Education\r\n\r\nHigher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Section 1 on page 1.\r\n\r\nHigher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Higher education plays a significant role in developing knowledge, innovation, research, leadership, employability, and social responsibility. Colleges provide students with academic learning, practical skills, internships, industry exposure, community engagement, and opportunities for lifelong learning. Section	கல்லூரி அறிக்கை மாதிரி (தோராயமாக 50 பக்கங்கள்)\n\nபக்கம் 1: கல்லூரி கல்வி\n\nஉயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புத்தாக்கம், ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் முக்கியப் பங்காற்றுகிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சிப் பட்டறைகள், தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. பக்கம் 1 இல் பிரிவு 1.\n\nஉயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் கற்கும் வாய்ப்புகளை வழங்குகின்றன. உயர்கல்வி அறிவு, புதுமை, ஆராய்ச்சி, தலைமைத்துவம், வேலைவாய்ப்பு மற்றும் சமூகப் பொறுப்பு ஆகியவற்றை வளர்ப்பதில் குறிப்பிடத்தக்க பங்கை வகிக்கிறது. கல்லூரிகள் மாணவர்களுக்கு கல்வி கற்றல், நடைமுறைத் திறன்கள், பயிற்சி, தொழில் வெளிப்பாடு, சமூக ஈடுபாடு மற்றும் வாழ்நாள் முழுவதும் க	Auto	Tamil	auto	2026-07-03 10:31:58.343728
2ad7c740-7579-44fd-af8e-46a696f72187	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	?????? ????? (AI) ????? ?? ??? ????? ?????? ??? ??? ??? ???? ?? ????? ?? ??? ??? ??? ?? ?????? ???? ???? ????? ?? ?????? ????? ??? ??? ???? ??? ???? ?? ????? ?? ????? ????? ???? ?? ???? ????? ??? ??? ????? ?????? ??? ???? ?? ?????? ?? ?????? ??? ???? ?? ????? ??? ???? ?? ????? ?? ?? ?? ??? ?? ???? ???? ??? ????? ??? AI ?? ???? ???? ?????????? ?????? ?? ???????? ?? ??? ?? ??? ????? ???? ??? ??? ???? ???? ???? ????????? ?? ?????? ???? ??? ???????? ?????? ??? ????? ????? ?? ????? ??? ?? ??? ???? ?? AI ?? ??????? ???? ????? ??? ????? ??? ????? ?? ????? AI ??? ???? ?? ???? ???? ?? ?????? ?? ?? ???????? ?????? ?? ???? ????? ??? ??? ???? ??? ?? ????? ?? ??? ????? ?? ???? ????? ????	Auto (en)	Urdu	openai	2026-06-25 17:44:39.153
32519f06-b0d7-43e8-9fc7-7342877bc2ef	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	??????? ??????	Auto (en)	Tamil	openai	2026-06-22 10:44:24.067
32952764-4eb8-45fd-9bce-64bf1e51b06f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.	?????? ???? ??? ?????? ??? ??? ??????? ??? ?? ??????? ??????????? ?????? ???? ?????????? ??? ????????? ?????? ?? ??? ???? ?? ???????? ?? ????? ???????? ??????? ?????? ?????? ??? ??? ?? ???? ?? ??????? ?? ????? ?? ??????? ???? ??? ???? ?????????? ???? ??? ???? ??? ??? ??? ??? ?? ??? ????? ???, ?????? ?????? ?? ??????? ?? ????? ????, ???????-??-????? ?? ????-??-??????? ??? ????? ??? ????? ????? ???	Auto (ta)	Hindi	openai	2026-06-25 11:16:48.793
37bc6689-8cac-4396-9399-204402c32112	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	hallo guten Morgen	Auto (en)	German	openai	2026-06-26 11:41:55.473
3b79e17b-30eb-4136-9e75-29ffa221e992	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello, good morning, raghul prastj	???????????????·?????	Auto (en)	Japanese	openai	2026-06-26 11:40:22.193
3fc00c40-6c49-447e-bbc4-89fbf98d9ce9	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The current Text-to-Speech implementation is incorrect.\r\n\r\nCurrent behavior:\r\n- English words and numbers are spoken.\r\n- Tamil Unicode text is ignored or skipped.\r\n- Marutham font is correctly applied, so this is NOT a font issue.\r\n- The problem is the speech engine.\r\n\r\nFix the implementation.\r\n\r\nRequirements:\r\n\r\n1. Never use an English voice to read Tamil text.\r\n\r\n2. Detect the language before speaking.\r\n\r\n3. If the detected language is Tamil:\r\n   - Use a real Tamil voice (ta-IN).\r\n   - Do not fall back to English voices.\r\n\r\n4. If the browser has no Tamil voice:\r\n   - Automatically use the configured cloud TTS provider.\r\n   - Prefer Azure AI Speech or Google Cloud TTS if configured.\r\n   - If ElevenLabs is configured, verify the selected model supports Tamil.\r\n\r\n5. Do not read only English words or numbers from mixed Tamil text.\r\n\r\n6. Speak the complete Tamil Unicode text.\r\n\r\n7. Log:\r\n   - detected language\r\n   - selected voice\r\n   - provider used\r\n   - playback status\r\n   - any errors\r\n\r\n8. If no Tamil voice exists locally, display:\r\n   "Using cloud Tamil voice."\r\n\r\n9. Never silently switch to English pronunciation for Tamil text.\r\n\r\n10. Keep the UI unchanged.	???????? ????????????? ?????? ????????????? ???????.\r\n\r\n???????? ??????:\r\n- ?????? ??????????? ??????? ?????? ??????????????.\r\n- ????? ???????? ??? ??????????????????? ?????? ????????????????.\r\n- ?????? ????????? ???????? ??????????????????????, ???? ??? ????????? ????????? ????.\r\n- ???????? ?????? ?????????.\r\n\r\n????????????? ????????????.\r\n\r\n???????:\r\n\r\n1. ????? ??????? ?????? ???????? ??????? ?????????? ????????.\r\n\r\n2. ?????? ???? ???????? ???????????.\r\n\r\n3. ????????????? ???? ????? ???????:\r\n   - ???????? ????? ??????? ?????????????? (ta-IN).\r\n   - ???????? ?????????????? ??????? ????????.\r\n\r\n4. ????????? ????? ????? ????? ???????:\r\n   - ??????????????? ??????? TTS ??????????? ??????? ??????????????.\r\n   - ????????????????????????, Azure AI ?????? ?????? Google Cloud TTS ? ???????????.\r\n   - ElevenLabs ????????????????????????, ??????????????????? ?????? ????? ??????????? ????? ??????????????.\r\n\r\n5. ?????? ????????????? ?????? ?????? ????? ????????????? ???????? ??????? ??????????????.\r\n\r\n6. ????????? ????? ???????? ??????? ?????????.\r\n\r\n7. ?????:\r\n   - ????????????? ????\r\n   - ??????????????????? ?????\r\n   - ????????? ???????????????\r\n   - ??????? ????\r\n   - ??????? ???????\r\n\r\n8. ????????? ????? ????? ????? ???????, ??????:\r\n   "??????? ????? ??????? ??????????????."\r\n\r\n9. ????? ???????? ?????? ?????????????? ???????? ???????????.\r\n\r\n10. UI ??????? ?????????????.	Auto (en)	Tamil	openai	2026-06-25 18:52:24.827
3fe977da-38da-4a9c-9277-40fd449d62fa	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello, good morning, raghul prasth	???????????????·????	Auto (hi)	Japanese	openai	2026-06-26 11:40:24.777
481b1db8-0f7b-4b69-81ba-8e500d4743c1	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	????? ????	Auto (en)	Arabic	openai	2026-06-22 04:42:23.793
4cd0cb11-3420-4c87-93f3-c437f2acbe36	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	Alembic ???????????????????, ???????????? ???????? ????????????????? ?????? ?????? PostgreSQL ??????????? ????????????? ????????????.\r\n?????????? ??????????? ???, ??????? ???? ?????????? ?????? ???????????? ??????? ?????? ??????????? ????????.\r\nSaaS ??????????? ?????? ???????????? ????????? ?????????? ?????????????? ?????, ????? ??????? ??????????? ?????????.\r\n??????? PostgreSQL ????????????????????? ????? ????????? ??????????????.\r\n?????? ???? ?????????, ??????????? ???????? ??????? ????????? ?????????? ???????????.\r\n????????????????? ????? ??????? ?????? ????????????????? ????????? ????????????? ??????????????.\r\n???????? ????????? ??????? ??????? ??????????????? ???????????? ????????? ????????? ???????? ?????????????.	Auto (en)	Tamil	openai	2026-06-26 11:38:52.977
4e665393-adbd-4fa4-9fc9-f920f3bc5e30	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	??????? ????????? (AI) ?????? ???? ????????, ??????? ???????? ??????? ??????? ???????? ??????? ???????????. ??? ???????? ???????? ???????? ?????? ????????????? ?????????, ???? ??????????? ????? ????????????? ???????????????? ??????? ??????? ??????????? ????? ?????????? ????????????????. ???? ????????????? ??????? ????? ?????????? ????? ????????? ??????? ????? ???, AI-???????? ???????????????? ?????? ???????????? ?????????? ???????????? ??????????. ????????????? ????????? ??????????????? ????????, ?????????, ?????????? ??????? ???????? ????? ???????? ????? AI ? ??????????? ?????????????? ?????????. ???????????? ???????????????????, ??????????????? ????????????? ??????? ???????????? ???? ?????????? ?????????? ??????? ??????? ???????? ?????? ????????? ??????????? ????? AI ???????????.	Auto (en)	Tamil	openai	2026-06-25 17:59:33.987
5034c4bb-0dca-49bf-a25f-2c44f97d65c4	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Fix the multilingual Text-to-Speech (Listen) feature.\r\n\r\nCurrent Issue:\r\nEnglish speech works correctly, but Tamil and several other languages fail with the error:\r\n"Both native voice and online fallback failed."\r\n\r\nRequirements:\r\n\r\n1. Find the root cause of why Tamil speech fails.\r\n\r\n2. Verify that the browser SpeechSynthesis API loads voices correctly before speaking.\r\n\r\n3. Wait for speechSynthesis.onvoiceschanged before selecting a voice.\r\n\r\n4. Detect the selected language from the Translation language selector.\r\n\r\n5. Map languages to the correct locale:\r\n\r\nEnglish -> en-US\r\nTamil -> ta-IN\r\nHindi -> hi-IN\r\nSpanish -> es-ES\r\nFrench -> fr-FR\r\nGerman -> de-DE\r\nPortuguese -> pt-PT\r\nArabic -> ar-SA\r\nJapanese -> ja-JP\r\nKorean -> ko-KR\r\nChinese (Simplified) -> zh-CN\r\nRussian -> ru-RU\r\nItalian -> it-IT\r\nDutch -> nl-NL\r\nPolish -> pl-PL\r\nTurkish -> tr-TR\r\nVietnamese -> vi-VN\r\nThai -> th-TH\r\nIndonesian -> id-ID\r\nBengali -> bn-IN\r\nUrdu -> ur-PK\r\nSwahili -> sw-KE\r\n\r\n6. Select the best available native voice for the detected language.\r\n\r\n7. If no native browser voice exists:\r\n   - Automatically switch to the configured online TTS provider.\r\n   - Do not fail silently.\r\n\r\n8. Verify the online TTS configuration:\r\n   - API key\r\n   - Endpoint\r\n   - Request payload\r\n   - Response handling\r\n\r\n9. Display the exact error in the console instead of only showing:\r\n   "Both native voice and online fallback failed."\r\n\r\n10. Add detailed logging for:\r\n   - Available browser voices\r\n   - Selected voice\r\n   - Selected language\r\n   - Native TTS status\r\n   - Online TTS request\r\n   - Online TTS response\r\n   - Final playback status\r\n\r\n11. Ensure English, Tamil, Hindi, Bengali, Urdu, Arabic, Japanese, Korean, Chinese and all supported languages can be spoken correctly.\r\n\r\n12. Keep the existing UI unchanged.\r\n\r\n13. Fix the implementation instead of adding temporary workarounds.	??????? ????????????? ?????? (?????????) ???????? ????????????.\r\n\r\n???????? ?????????:\r\n?????? ?????? ?????? ???? ?????????, ????? ????? ??????? ?? ??????? ????????? ???????????????:\r\n"????? ????? ??????? ??????? ????????? ???????? ?????????????."\r\n\r\n???????:\r\n\r\n1. ????? ?????? ??? ?????????????? ?????????? ??? ?????????? ???????????.\r\n\r\n2. ???????? ?????? ????????? ???? ?????? ???? ???????? ?????? ?????????? ???????? ??????????????.\r\n\r\n3. ??? ??????? ?????????????????? ????, speechSynthesis.onvoices ???????????? ??? ???????????????.\r\n\r\n4. ????????????? ???? ?????????? ??????? ??????????????????? ???????? ???????????.\r\n\r\n5. ?????? ???????? ????? ???????:\r\n\r\n???????? -> en-US\r\n????? -> ta-IN\r\n????? -> hi-IN\r\n???????? -> es-ES\r\n??????? -> fr-FR\r\n??????? -> ??-???\r\n??????????????? -> pt-PT\r\n???? -> ar-SA\r\n???????? -> ja-JP\r\n??????? -> ??-?????\r\n????? (?????????????????????) -> zh-CN\r\n?????? -> ru-RU\r\n?????????? -> ???-???\r\n????? -> nl-NL\r\n?????? -> pl-PL\r\n??????????? -> tr-TR\r\n?????????? -> vi-VN\r\n???? -> ???-TH\r\n?????????? -> ???-???\r\n???????? -> bn-IN\r\n????? -> ur-PK\r\n???????? -> sw-KE\r\n\r\n6. ????????????? ????????? ?????? ??????? ??????? ?????????????????.\r\n\r\n7. ????? ????? ????? ????? ???????:\r\n   - ??????????????? ??????? TTS ????????????? ????? ???????.\r\n   - ???????? ?????????? ????????.\r\n\r\n8. ??????? TTS ?????????? ??????????????:\r\n   - API ????\r\n   - ?????????????\r\n   - ?????? ????????\r\n   - ????? ?????????\r\n\r\n9. ????????? ??????? ?????????????? ?????? ?????? ???????? ??????:\r\n   "????? ????? ??????? ??????? ????????? ???????? ?????????????."\r\n\r\n10. ??????? ?????????? ???????????:\r\n   - ????? ???????? ??????????\r\n   - ??????????????????? ?????\r\n   - ??????????????????? ????\r\n   - ????? TTS ????\r\n   - ??????? TTS ????????\r\n   - ??????? TTS ?????\r\n   - ????? ??????? ????\r\n\r\n11. ????????, ?????, ?????, ????????, ?????, ????, ????????, ???????, ????? ??????? ??????? ?????????????? ????????? ???????? ??????? ??????????????.\r\n\r\n12. ??????? ???? UI ? ????????? ?????????????.\r\n\r\n13. ???????? ????????? ?????????????? ?????? ??????????????? ????????????.	Auto (en)	Tamil	openai	2026-06-25 18:03:06.783
50a4191a-0f96-4018-8085-1859811b7b20	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	???? ????????	Auto (en)	Hindi	openai	2026-06-26 11:41:21.02
521c44da-4f38-4767-9961-5f700413514f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	L'intelligence artificielle (IA) transforme la façon dont les gens travaillent, apprennent et communiquent. Il aide à automatiser les tâches répétitives, améliore la prise de décision grâce à l'analyse des données et améliore l'expérience utilisateur dans divers secteurs. De la traduction linguistique et de la reconnaissance vocale aux soins de santé et à l’éducation, les technologies basées sur l’IA rendent les activités quotidiennes plus rapides et plus efficaces. À mesure que la technologie continue d’évoluer, il est important d’utiliser l’IA de manière responsable en garantissant la confidentialité, la sécurité et l’équité. Grâce à une innovation continue, l’IA a le potentiel de créer des solutions plus intelligentes qui améliorent la productivité et rendent la vie plus pratique pour les personnes du monde entier.	Auto (en)	French	openai	2026-06-25 17:43:21.147
54698605-f23f-48ff-b7a4-40208082c0e0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	hello nancy	Auto (en)	Turkish	openai	2026-06-22 04:19:18.203
5b54d54b-da9e-42ac-ba17-6f65999bc258	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	????? ?????	Auto (en)	Arabic	openai	2026-06-22 04:35:52.853
5c93d165-ec3d-4d35-966c-558d3cff9bcb	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	??????? ??????	Auto (en)	Tamil	openai	2026-06-22 04:35:01.62
6447f310-5111-4cca-9b47-d8269c689b1d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	ciao Nancy	Auto (en)	Italian	openai	2026-06-22 04:37:17.77
653ced16-a582-494e-a082-16fe7430aae0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	??????? ?????	Auto (en)	Tamil	openai	2026-06-22 04:42:28.423
66a12f65-4fdd-4cb9-affc-cd63f6aaa8ab	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	?? ?? ??	Auto (en)	Korean	openai	2026-06-26 11:42:14.04
67645e78-8d4d-4ece-b897-ef85bdc3a471	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	hello My name is Nancy. I am currently developing an artificial intelligence based language processing web application. The main objective of this project is to easily process text and voice information in various Indian languages. Whether users are speaking or writing in their native language, the system enables them to convert that information into another language, text-to-speech, and voice-to-text.\r\n\r\nThis app has integrated user-friendly interface, secure login, administrative control and many artificial intelligence services. Our mission is to reduce language barriers and make technology services accessible to all.	Auto (ta)	English	openai	2026-06-25 11:10:26.36
92a5f8ef-dace-46b6-9549-a30ca86271ec	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	?????? ???? ??? ?????? ??? ??? ??????? ??? ?? ??????? ??????????? ?????? ???? ?????????? ??? ????????? ?????? ?? ??? ???? ?? ???????? ?? ????? ???????? ??????? ?????? ?????? ??? ??? ?? ???? ?? ??????? ?? ????? ?? ??????? ???? ??? ???? ?????????? ???? ??? ???? ??? ??? ??? ??? ?? ??? ????? ???, ?????? ?????? ?? ??????? ?? ????? ????, ???????-??-????? ?? ????-??-??????? ??? ????? ??? ????? ????? ???\r\n\r\n?? ?? ??? ?????????? ?? ?????? ???????, ???????? ?????, ????????? ???????? ?? ?? ??????? ??????????? ?????? ?????? ???? ????? ???? ???? ?????? ?????? ?? ?? ???? ?? ???????????? ?????? ?? ??? ?? ??? ???? ????? ???	Auto (ta)	Hindi	openai	2026-06-25 10:58:04.813
6eda4c0a-fbb2-402d-812f-cd718dd34a7a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The current Text-to-Speech implementation is incorrect.\r\n\r\nCurrent behavior:\r\n- English words and numbers are spoken.\r\n- Tamil Unicode text is ignored or skipped.\r\n- Marutham font is correctly applied, so this is NOT a font issue.\r\n- The problem is the speech engine.\r\n\r\nFix the implementation.\r\n\r\nRequirements:\r\n\r\n1. Never use an English voice to read Tamil text.\r\n\r\n2. Detect the language before speaking.\r\n\r\n3. If the detected language is Tamil:\r\n   - Use a real Tamil voice (ta-IN).\r\n   - Do not fall back to English voices.\r\n\r\n4. If the browser has no Tamil voice:\r\n   - Automatically use the configured cloud TTS provider.\r\n   - Prefer Azure AI Speech or Google Cloud TTS if configured.\r\n   - If ElevenLabs is configured, verify the selected model supports Tamil.\r\n\r\n5. Do not read only English words or numbers from mixed Tamil text.\r\n\r\n6. Speak the complete Tamil Unicode text.\r\n\r\n7. Log:\r\n   - detected language\r\n   - selected voice\r\n   - provider used\r\n   - playback status\r\n   - any errors\r\n\r\n8. If no Tamil voice exists locally, display:\r\n   "Using cloud Tamil voice."\r\n\r\n9. Never silently switch to English pronunciation for Tamil text.\r\n\r\n10. Keep the UI unchanged.	The current Text-to-Speech implementation is incorrect.\r\n\r\nCurrent behavior:\r\n- English words and numbers are spoken.\r\n- Tamil Unicode text is ignored or skipped.\r\n- Marutham font is correctly applied, so this is NOT a font issue.\r\n- The problem is the speech engine.\r\n\r\nFix the implementation.\r\n\r\nRequirements:\r\n\r\n1. Never use an English voice to read Tamil text.\r\n\r\n2. Detect the language before speaking.\r\n\r\n3. If the detected language is Tamil:\r\n   - Use a real Tamil voice (ta-IN).\r\n   - Do not fall back to English voices.\r\n\r\n4. If the browser has no Tamil voice:\r\n   - Automatically use the configured cloud TTS provider.\r\n   - Prefer Azure AI Speech or Google Cloud TTS if configured.\r\n   - If ElevenLabs is configured, verify the selected model supports Tamil.\r\n\r\n5. Do not read only English words or numbers from mixed Tamil text.\r\n\r\n6. Speak the complete Tamil Unicode text.\r\n\r\n7. Log:\r\n   - detected language\r\n   - selected voice\r\n   - provider used\r\n   - playback status\r\n   - any errors\r\n\r\n8. If no Tamil voice exists locally, display:\r\n   "Using cloud Tamil voice."\r\n\r\n9. Never silently switch to English pronunciation for Tamil text.\r\n\r\n10. Keep the UI unchanged.	Auto (en)	English	openai	2026-06-25 18:54:35.43
6fe1f1c0-e51c-4253-90eb-1c815904901f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	??????? ??????	Auto (en)	Tamil	openai	2026-06-22 04:18:54.08
7510dc62-d1f7-4254-bb79-a8bdb7e39550	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	???????	Auto (en)	Tamil	openai	2026-06-22 04:09:53.587
75e323d8-0209-4364-8354-2d8980fefde4	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	ciao anto	Auto (en)	Italian	openai	2026-06-22 04:42:44.947
7b7a4c7a-4adb-4bea-a6a6-f28396420807	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	Auto (en)	English	openai	2026-06-25 17:59:21.903
82cabb1a-456a-400c-886a-26abffe69f94	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	merhaba anto	Auto (en)	Turkish	openai	2026-06-22 04:43:30.41
8b066a79-74ab-45e1-ba30-a4ee696fc99c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	I've fixed it!\r\n\r\nThe issue was exactly as you suspected—because Windows doesn't come with a native Tamil speech voice pre-installed by default, it was throwing that warning and falling back to the default English voice. The English voice cannot read the Tamil alphabet, so it would fail and you wouldn't hear anything.\r\n\r\nI've updated the Text-to-Speech service so that if a native voice is missing, it will securely stream the audio using Google's online Text-to-Speech engine instead.\r\n\r\nIt should now play the correct pronunciation for the Translation Output. Give it another click and let me know if you can hear it!	???? ??? ??????????????!\r\n\r\n??????? ???????????? ????? ??????? ????????—????????????? ?????? ??????????? ??????? ????? ???????? ???????? Windows ???????? ????????, ??? ???? ???????????? ????????????? ?????????? ???????? ??????????? ???????????. ???????? ??????? ????? ?????????????? ?????? ????????, ?????? ??? ?????????????, ??????? ??????? ????? ???????????.\r\n\r\n????????-??-?????? ???????? ??????????????????, ?????? ??????? ????? ???????????, ???????? ??????? ????????-??-?????? ????????? ??????????? ????????? ??????????? ???????? ????????.\r\n\r\n??? ??????? ????????????? ??????????????? ?????? ?????????? ????? ????????. ??? ??????? ?????? ??????, ???????? ????? ?????????? ???????? ???????????????????!	Auto (en)	Tamil	openai	2026-06-25 17:56:55.403
8cc214f7-b399-49a9-b2bf-e81903fec0a0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	merhaba nancy	Auto (en)	Turkish	openai	2026-06-22 04:37:57.487
8f3253f2-62ed-4d1d-9a0b-c3b9efef8270	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The current Text-to-Speech implementation is incorrect.\r\n\r\nCurrent behavior:\r\n- English words and numbers are spoken.\r\n- Tamil Unicode text is ignored or skipped.\r\n- Marutham font is correctly applied, so this is NOT a font issue.\r\n- The problem is the speech engine.\r\n\r\nFix the implementation.\r\n\r\nRequirements:\r\n\r\n1. Never use an English voice to read Tamil text.\r\n\r\n2. Detect the language before speaking.\r\n\r\n3. If the detected language is Tamil:\r\n   - Use a real Tamil voice (ta-IN).\r\n   - Do not fall back to English voices.\r\n\r\n4. If the browser has no Tamil voice:\r\n   - Automatically use the configured cloud TTS provider.\r\n   - Prefer Azure AI Speech or Google Cloud TTS if configured.\r\n   - If ElevenLabs is configured, verify the selected model supports Tamil.\r\n\r\n5. Do not read only English words or numbers from mixed Tamil text.\r\n\r\n6. Speak the complete Tamil Unicode text.\r\n\r\n7. Log:\r\n   - detected language\r\n   - selected voice\r\n   - provider used\r\n   - playback status\r\n   - any errors\r\n\r\n8. If no Tamil voice exists locally, display:\r\n   "Using cloud Tamil voice."\r\n\r\n9. Never silently switch to English pronunciation for Tamil text.\r\n\r\n10. Keep the UI unchanged.	???????? ????????????? ?????? ????????????? ???????.\r\n\r\n???????? ??????:\r\n- ?????? ??????????? ??????? ?????? ??????????????.\r\n- ????? ???????? ??? ??????????????????? ?????? ????????????????.\r\n- ?????? ????????? ???????? ??????????????????????, ???? ??? ????????? ????????? ????.\r\n- ???????? ?????? ?????????.\r\n\r\n????????????? ????????????.\r\n\r\n???????:\r\n\r\n1. ????? ??????? ?????? ???????? ??????? ?????????? ????????.\r\n\r\n2. ?????? ???? ???????? ???????????.\r\n\r\n3. ????????????? ???? ????? ???????:\r\n   - ???????? ????? ??????? ?????????????? (ta-IN).\r\n   - ???????? ?????????????? ??????? ????????.\r\n\r\n4. ????????? ????? ????? ????? ???????:\r\n   - ??????????????? ??????? TTS ??????????? ??????? ??????????????.\r\n   - ????????????????????????, Azure AI ?????? ?????? Google Cloud TTS ? ???????????.\r\n   - ElevenLabs ????????????????????????, ??????????????????? ?????? ????? ??????????? ????? ??????????????.\r\n\r\n5. ?????? ????????????? ?????? ?????? ????? ????????????? ???????? ??????? ??????????????.\r\n\r\n6. ????????? ????? ???????? ??????? ?????????.\r\n\r\n7. ?????:\r\n   - ????????????? ????\r\n   - ??????????????????? ?????\r\n   - ????????? ???????????????\r\n   - ??????? ????\r\n   - ??????? ???????\r\n\r\n8. ????????? ????? ????? ????? ???????, ??????:\r\n   "??????? ????? ??????? ??????????????."\r\n\r\n9. ????? ???????? ?????? ?????????????? ???????? ???????????.\r\n\r\n10. UI ??????? ?????????????.	Auto (en)	Tamil	openai	2026-06-25 18:54:32.02
b37d0e47-c305-48c2-bb44-2ef3f994a42d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello, good morning, raghul prasth	?????? ???? ?????? ????? ?????	Auto (hi)	Arabic	openai	2026-06-26 11:40:37.25
b4c166ec-5528-41b9-9278-b3f2cc274eec	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nanc	???????	Auto (la)	Tamil	openai	2026-06-22 04:33:13.383
b9f75a19-e62a-4cba-a175-b2571f9e0d48	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	tamil	?????	Auto (en)	Tamil	openai	2026-06-22 12:19:36.873
92dcfee6-bf2f-4207-a84a-a944b6f670e9	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	I've fixed it!\r\n\r\nThe issue was exactly as you suspected—because Windows doesn't come with a native Tamil speech voice pre-installed by default, it was throwing that warning and falling back to the default English voice. The English voice cannot read the Tamil alphabet, so it would fail and you wouldn't hear anything.\r\n\r\nI've updated the Text-to-Speech service so that if a native voice is missing, it will securely stream the audio using Google's online Text-to-Speech engine instead.\r\n\r\nIt should now play the correct pronunciation for the Translation Output. Give it another click and let me know if you can hear it!	???? ??? ??????????????!\r\n\r\n??????? ???????????? ????? ??????? ????????—????????????? ?????? ??????????? ??????? ????? ???????? ???????? Windows ???????? ????????, ??? ???? ???????????? ????????????? ?????????? ???????? ??????????? ???????????. ???????? ??????? ????? ?????????????? ?????? ????????, ?????? ??? ?????????????, ??????? ??????? ????? ???????????.\r\n\r\n????????-??-?????? ???????? ??????????????????, ?????? ??????? ????? ???????????, ???????? ??????? ????????-??-?????? ????????? ??????????? ????????? ??????????? ???????? ????????.\r\n\r\n??? ??????? ????????????? ??????????????? ?????? ?????????? ????? ????????. ??? ??????? ?????? ??????, ???????? ????? ?????????? ???????? ???????????????????!	Auto (en)	Tamil	openai	2026-06-25 17:56:31.857
95662fe2-50ad-4d5f-b16f-39929d449f6f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.	Auto (ta)	Tamil	openai	2026-06-25 11:16:36.877
95e1163f-d02a-46e6-a3e7-2fedfda39359	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello, good morning, raghul prasth	hello, good morning, raghul prasth	Auto (hi)	Hindi	openai	2026-06-26 11:40:49.803
98a47b29-f55d-4091-bb61-386261c9351e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	??? ???????? ?? ????? ???? ???? ??, ?? ??????? ?? ??? ?? ????? ?? ???? ???? PostgreSQL ????????? ????????? ??????? ?????\r\n?? ?? ?????? ?????? ? ??, ?????? ???????? ?? ??????? ?? ????? ?? ???? ??? ? ??????\r\nSaaS ??????????? ?? ????????? ??????? ?? ???? ???? ??? ??? ?? ??????? ?? ??? ?????, ???????? ?? ???? ??????\r\n??? PostgreSQL ??????????? ?? ??? ???????? ?? ?? ????? ?????\r\n???? ?????? ???????, ?????? ??????? ?? ??????? ?????? ???????\r\n???????? ???? ?? ???????? ?????? ???????? ????????? ?? ??? ?? ????? ???? ???? ???\r\n????????? ?? ?????? ?? ???????? ?? ?????? ????????? ?? ??? ???? ??? ?? ???? ?????	Auto (en)	Hindi	openai	2026-06-26 11:39:11.76
9a32bcf7-1b32-4d88-a20d-d5225e1edaca	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	hello My name is Nancy. I am currently developing an artificial intelligence based language processing web application. The main objective of this project is to easily process text and voice information in various Indian languages. Whether users are speaking or writing in their native language, the system enables them to convert that information into another language, text-to-speech, and voice-to-text.\r\n\r\nThis app has integrated user-friendly interface, secure login, administrative control and many artificial intelligence services. Our mission is to reduce language barriers and make technology services accessible to all.	Auto (ta)	English	openai	2026-06-25 10:58:20.637
9a8a1a8a-1630-46e1-98d4-6731066c51fa	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	Alembic ????????????????????????????? PostgreSQL ??????????????\r\n??????????????????????????????????????????????\r\nSaaS ??????????? ????????????????????????????????????????\r\n???? PostgreSQL ????????????????\r\n??????????????????????????????????\r\n?????????? ?????????????????????????????\r\n?????????????????????????????????????????	Auto (en)	Japanese	openai	2026-06-26 11:39:51.857
9c8da9a9-0064-4efd-852e-df9bb98ec61b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	?? ??	Auto (en)	Korean	openai	2026-06-22 04:43:04.637
a1328c0d-6e03-4f36-a184-f86881cd264a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	?????????????? ??????? ????????? ??????? ???? ???????????????? ??????? ???????? ????? ???????????? ?????? ?????????????. ?????? ???? ???????? ?????????? ???????? ???????????????????? ?????????? ?????????. ??? ?????, ??????????, ???? ???????, ?????? ??????? ???? ???????????? ?????? ??????? ?????????.\r\n\r\n?????? ??????????? ??????? ???????????, ??????? ??????? ?????????? ???? ??????? ?????????????. ??????? ??????? ?????? ???????????? ??????????????? ???????????, ?????????? ?????? ??????? ???????? ?????????? ??? ????????. ???? ?????? ????? ????????????????? ??? ????? ?????????; ??? ????????? ????????? ??? ?????????.	In the future, artificial intelligence and language technologies will combine to further enhance global communication. Systems are created that are instantly understandable to people no matter what language they speak. It will be of great help in education, medicine, government services, business and social development.\r\n\r\nOur mission is to provide safe, fast and accurate language services. Every user should have the opportunity to interact with the world easily using technology in their native language. Language is not only a tool for communication; It is a bridge that connects people.	Auto (ta)	English	openai	2026-06-25 11:28:14.33
a46b4ffc-21ba-4544-b975-2bb0ac28b035	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	?????????????? ??????? ????????? ??????? ???? ???????????????? ??????? ???????? ????? ???????????? ?????? ?????????????. ?????? ???? ???????? ?????????? ???????? ???????????????????? ?????????? ?????????. ??? ?????, ??????????, ???? ???????, ?????? ??????? ???? ???????????? ?????? ??????? ?????????.\r\n\r\n?????? ??????????? ??????? ???????????, ??????? ??????? ?????????? ???? ??????? ?????????????. ??????? ??????? ?????? ???????????? ??????????????? ???????????, ?????????? ?????? ??????? ???????? ?????????? ??? ????????. ???? ?????? ????? ????????????????? ??? ????? ?????????; ??? ????????? ????????? ??? ?????????.	?????????????? ??????? ????????? ??????? ???? ???????????????? ??????? ???????? ????? ???????????? ?????? ?????????????. ?????? ???? ???????? ?????????? ???????? ???????????????????? ?????????? ?????????. ??? ?????, ??????????, ???? ???????, ?????? ??????? ???? ???????????? ?????? ??????? ?????????.\r\n\r\n?????? ??????????? ??????? ???????????, ??????? ??????? ?????????? ???? ??????? ?????????????. ??????? ??????? ?????? ???????????? ??????????????? ???????????, ?????????? ?????? ??????? ???????? ?????????? ??? ????????. ???? ?????? ????? ????????????????? ??? ????? ?????????; ??? ????????? ????????? ??? ?????????.	Auto (ta)	Tamil	openai	2026-06-25 11:29:05.657
a760d9cb-c5e3-439a-9f52-bbe83c237ea5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	Hallo Nancy	Auto (en)	German	openai	2026-06-22 04:38:36.873
a93bcfa5-6f73-4143-a33e-88425505c24f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Fix and improve the Listen (Text-to-Speech) feature for the Translation application.\r\n\r\nRequirements:\r\n\r\n1. The speaker button must correctly read both:\r\n   - Source Text\r\n   - Translation Output\r\n\r\n2. Read the exact text currently displayed in the editor.\r\n\r\n3. Automatically use the selected language to choose the correct speech voice.\r\n\r\n4. Support the following languages:\r\n\r\n- English (en-US)\r\n- Tamil (ta-IN)\r\n- Hindi (hi-IN)\r\n- Spanish (es-ES)\r\n- French (fr-FR)\r\n- German (de-DE)\r\n- Portuguese (pt-PT)\r\n- Arabic (ar-SA)\r\n- Japanese (ja-JP)\r\n- Korean (ko-KR)\r\n- Chinese (Simplified) (zh-CN)\r\n- Russian (ru-RU)\r\n- Italian (it-IT)\r\n- Dutch (nl-NL)\r\n- Polish (pl-PL)\r\n- Turkish (tr-TR)\r\n- Vietnamese (vi-VN)\r\n- Thai (th-TH)\r\n- Indonesian (id-ID)\r\n- Bengali (bn-IN)\r\n- Urdu (ur-PK)\r\n- Swahili (sw-KE)\r\n\r\n5. Detect the selected language automatically and choose the best matching SpeechSynthesis voice.\r\n\r\n6. If multiple voices are available, always use the native voice for that language.\r\n\r\n7. If no matching voice exists, automatically fall back to the closest compatible voice and display a user-friendly warning instead of failing silently.\r\n\r\n8. Fix the issue where clicking the speaker button produces no sound or incorrect pronunciation.\r\n\r\n9. Stop any currently playing speech before starting a new one.\r\n\r\n10. Support Play, Pause, Resume, and Stop.\r\n\r\n11. Ensure long text is spoken completely.\r\n\r\n12. Make the Text-to-Speech feature work immediately after every translation without requiring a page refresh.\r\n\r\n13. Refactor the implementation into a reusable Text-to-Speech service that can be used throughout the application.\r\n\r\n14. Keep the existing UI unchanged and do not break translation functionality.\r\n\r\n15. Thoroughly test all supported languages to ensure correct pronunciation, language selection, and reliable playback.	????????????? ??????????????? ???? (????????????? ??????) ?????????? ????????? ??????????????.\r\n\r\n???????:\r\n\r\n1. ????????? ???????? ?????????? ???????? ?????? ????????:\r\n   - ??? ???\r\n   - ????????????? ????????\r\n\r\n2. ?????????? ??????? ??????????????? ?????? ??????? ??????????.\r\n\r\n3. ?????? ???????? ??????? ???????????, ??????????????????? ???????? ??????? ??????????????.\r\n\r\n4. ????????? ??????? ???????????:\r\n\r\n- ???????? (en-US)\r\n- ????? (ta-IN)\r\n- ????? (hi-IN)\r\n- ???????? (es-ES)\r\n- ??????? (fr-FR)\r\n- ??????? (??-???)\r\n- ??????????????? (pt-PT)\r\n- ???? (ar-SA)\r\n- ???????? (ja-JP)\r\n- ??????? (??-?????)\r\n- ????? (?????????????????????) (zh-CN)\r\n- ?????? (ru-RU)\r\n- ?????????? (it-IT)\r\n- ????? (nl-NL)\r\n- ?????? (pl-PL)\r\n- ??????????? (tr-TR)\r\n- ?????????? (vi-VN)\r\n- ???? (th-TH)\r\n- ?????????? (???-???)\r\n- ???????? (bn-IN)\r\n- ????? (ur-PK)\r\n- ???????? (sw-KE)\r\n\r\n5. ??????????????????? ???????? ??????? ??????????, ?????? ?????????? ?????????????????? ??????? ?????????????????.\r\n\r\n6. ?? ???????? ?????????, ???? ???????? ????????? ??????? ??????? ??????????????.\r\n\r\n7. ?????????????? ????? ??????? ????? ???????, ??????? ??? ?????????? ???????? ??????????? ????????, ???????? ????????????????? ?????? ????? ????? ?????????????? ????????????.\r\n\r\n8. ????????? ???????? ?????? ???????? ????? ??? ?????? ????? ?????????? ??????? ????????? ????????????.\r\n\r\n9. ????? ???????? ????????? ???? ??????? ?????????? ?????? ???????????.\r\n\r\n10. ????, ????????????, ???????? ??????? ?????? ????????? ???????????.\r\n\r\n11. ????? ??? ????????? ??????????? ??????????????.\r\n\r\n12. ??????? ??????????????????? ??????? ?????????? ??????????? ??????? ??????????? ????????????? ?????? ???????? ?????????? ????????? ???????????.\r\n\r\n13. ???????? ????????? ????????????????? ????????????? ????????????? ?????? ??????? ???????????? ???????????????.\r\n\r\n14. ??????? ???? UI ? ????????? ????????????? ??????? ????????????? ??????????? ??????????????.\r\n\r\n15. ?????? ??????????, ???? ?????? ??????? ???????? ????????? ?????????? ??????? ?????????????? ??????????? ??????????? ???????????.	Auto (en)	Tamil	openai	2026-06-25 17:53:58.75
aab6bd26-3f50-4456-9963-4111f3c0c9fa	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	????? ?????	Auto (en)	Arabic	openai	2026-06-22 04:36:42.003
abff8787-a213-4dde-ace4-85037a3d37fe	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	Auto (en)	English	openai	2026-06-25 17:43:33.6
af0934fd-b6ca-49ca-b046-ea9a35809413	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	hallo anto	Auto (en)	Dutch	openai	2026-06-22 04:42:54.53
b14fa59b-9aff-4a5a-96fe-c5fe7bf2c137	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	Auto (ta)	Tamil	openai	2026-06-25 11:10:17.39
b220e381-d7cc-4903-b55b-a6d709d9d2a2	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	Wenn Alembic verwendet wird, generieren Sie ordnungsgemäße PostgreSQL-Migrationsskripts, anstatt die Datenbank neu zu erstellen.\r\nEntfernen oder benennen Sie vorhandene Tabellen oder Spalten nicht um, es sei denn, dies ist unbedingt erforderlich.\r\nMachen Sie den Code gemäß den Best Practices der SaaS-Architektur produktionsbereit, modular und sauber.\r\nVerwenden Sie Umgebungsvariablen für alle PostgreSQL-Anmeldeinformationen.\r\nFügen Sie eine ordnungsgemäße Fehlerbehandlung, Transaktionsverwaltung und Verbindungspooling hinzu.\r\nStellen Sie sicher, dass jeder Backend-Endpunkt nach der Migration weiterhin funktioniert.\r\nHalten Sie das Projekt vollständig kompatibel mit zukünftiger Skalierung und Cloud-Bereitstellung.	Auto (en)	German	openai	2026-06-26 11:39:47.6
ba83c384-0eb9-4a49-9113-21293528d26e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	Auto (en)	English	openai	2026-06-26 11:39:05.65
c5aaccfb-d54a-44be-95cb-0499a48ab031	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	I've fixed it!\r\n\r\nThe issue was exactly as you suspected—because Windows doesn't come with a native Tamil speech voice pre-installed by default, it was throwing that warning and falling back to the default English voice. The English voice cannot read the Tamil alphabet, so it would fail and you wouldn't hear anything.\r\n\r\nI've updated the Text-to-Speech service so that if a native voice is missing, it will securely stream the audio using Google's online Text-to-Speech engine instead.\r\n\r\nIt should now play the correct pronunciation for the Translation Output. Give it another click and let me know if you can hear it!	I've fixed it!\r\n\r\nThe issue was exactly as you suspected—because Windows doesn't come with a native Tamil speech voice pre-installed by default, it was throwing that warning and falling back to the default English voice. The English voice cannot read the Tamil alphabet, so it would fail and you wouldn't hear anything.\r\n\r\nI've updated the Text-to-Speech service so that if a native voice is missing, it will securely stream the audio using Google's online Text-to-Speech engine instead.\r\n\r\nIt should now play the correct pronunciation for the Translation Output. Give it another click and let me know if you can hear it!	Auto (en)	English	openai	2026-06-25 17:56:33.993
c5fe85bc-e4ae-4006-adf1-c9c24a959e32	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	hallo anto	Auto (en)	German	openai	2026-06-22 04:44:04.28
c72a3bd7-a18f-4725-b54b-0323187cbae7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????, ?????? ???????????????\r\n????? ?????? ??????? ????? ??????.\r\n?????? ????? ??? ??????? ??????????.\r\n???? ????? ?????????????? ??????????.\r\n??? ??? ????? ?????????.	Hello, how are you?\r\nToday the weather is very beautiful.\r\nI love to speak tamil.\r\nI am going to office today.\r\nThis is a test sentence.	Auto (ta)	English	openai	2026-06-25 10:55:47.783
cb782b06-b1a2-4fd6-ab80-248744867a35	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	hello nancy	Auto (en)	Dutch	openai	2026-06-22 04:19:13.11
cc964f37-36e9-4f88-89da-52c0379d23d6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????, ?????? ???????????????\r\n????? ?????? ??????? ????? ??????.\r\n?????? ????? ??? ??????? ??????????.\r\n???? ????? ?????????????? ??????????.\r\n??? ??? ????? ?????????.	???????, ?????? ???????????????\r\n????? ?????? ??????? ????? ??????.\r\n?????? ????? ??? ??????? ??????????.\r\n???? ????? ?????????????? ??????????.\r\n??? ??? ????? ?????????.	Auto (ta)	Tamil	openai	2026-06-25 10:55:39.01
d565f8ec-4e1e-400d-bb55-57be34bc9af3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.\r\n\r\n???? ???????????? ????? ????? ????????, ??????????? ?????????, ??????? ??????????? ??????? ?? ??????? ????????? ??????? ???????????????????????. ???? ????? ???? ??????? ?????? ????????, ???????????? ??????????? ??????? ??????? ?????????????? ????????? ?????? ???????.	hello ??? ????? ??????. I am currently developing an artificial intelligence based language processing web application. The main objective of this project is to easily process text and voice information in various Indian languages. Whether users are speaking or writing in their native language, the system enables them to convert that information into another language, text-to-speech, and voice-to-text.\r\n\r\nThis app has integrated user-friendly interface, secure login, administrative control and many artificial intelligence services. Our mission is to reduce language barriers and make technology services accessible to all.	Auto (ta)	English	openai	2026-06-25 10:57:22.827
d61c5a4c-4868-4848-ba88-5979511486ab	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the world by improving the way people work, learn, and communicate. It helps businesses automate repetitive tasks, enables doctors to diagnose diseases more accurately, and allows students to access personalized learning experiences. AI-powered applications such as language translation, speech recognition, and virtual assistants make everyday life more convenient. As technology continues to evolve, it is important to develop AI responsibly by ensuring privacy, security, fairness, and transparency. With continuous innovation, AI has the potential to solve complex global challenges and improve the quality of life for people around the world.	??????? ????????? (AI) ?????? ???? ????????, ??????? ???????? ??????? ??????? ???????? ??????? ??????????????? ????? ???? ???????????. ??? ??????????????? ????????? ????????? ???????? ???????? ????????????? ?????????, ??????????????? ??????? ??????? ???????????? ??????? ?????????, ?????? ?????????????????? ?????? ?????????? ????????? ???? ?????????????. ???? ?????????????, ?????? ?????????? ??????? ????????? ???????????? ????? AI-???????? ??????????? ?????? ?????????? ??????? ????????????????. ????????????? ????????? ??????????????? ????????, ?????????, ??????????, ?????? ??????? ?????????????????? ????? ???????? ????? AI ? ??????????? ???????????? ?????????. ???????????? ???????????????????, AI ???? ???????? ???????? ?????????? ?????????? ??????? ???????????? ???? ???????? ?????????? ?????? ????????????? ???????? ???????????.	Auto (en)	Tamil	openai	2026-06-25 19:15:42.937
d704b2d3-5ee2-4f00-bb1c-5c5e483047b6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the world by improving the way people work, learn, and communicate. It helps businesses automate repetitive tasks, enables doctors to diagnose diseases more accurately, and allows students to access personalized learning experiences. AI-powered applications such as language translation, speech recognition, and virtual assistants make everyday life more convenient. As technology continues to evolve, it is important to develop AI responsibly by ensuring privacy, security, fairness, and transparency. With continuous innovation, AI has the potential to solve complex global challenges and improve the quality of life for people around the world.	??????? ????????? (AI) ?????? ???? ????????, ??????? ???????? ??????? ??????? ???????? ??????? ??????????????? ????? ???? ???????????. ??? ??????????????? ????????? ????????? ???????? ???????? ????????????? ?????????, ??????????????? ??????? ??????? ???????????? ??????? ?????????, ?????? ?????????????????? ?????? ?????????? ????????? ???? ?????????????. ???? ?????????????, ?????? ?????????? ??????? ????????? ???????????? ????? AI-???????? ??????????? ?????? ?????????? ??????? ????????????????. ????????????? ????????? ??????????????? ????????, ?????????, ??????????, ?????? ??????? ?????????????????? ????? ???????? ????? AI ? ??????????? ???????????? ?????????. ???????????? ???????????????????, AI ???? ???????? ???????? ?????????? ?????????? ??????? ???????????? ???? ???????? ?????????? ?????? ????????????? ???????? ???????????.	Auto (en)	Tamil	openai	2026-06-25 19:05:54.547
d9b72a5c-a65e-4c14-8193-10e10d5ca1fd	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	????? ?????	Auto (en)	Arabic	openai	2026-06-22 04:35:49.53
db0ad20a-911d-4b8b-b2dd-0d8ed3b575a6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	hello	Auto (en)	Arabic	openai	2026-06-22 04:09:57.143
e1365531-d032-46cd-b8bc-8d1b9a740257	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	??????? ????????? (AI) ?????? ???? ????????, ??????? ???????? ??????? ??????? ???????? ??????? ???????????. ??? ???????? ???????? ???????? ?????? ????????????? ?????????, ???? ??????????? ????? ????????????? ???????????????? ??????? ??????? ??????????? ????? ?????????? ????????????????. ???? ????????????? ??????? ????? ?????????? ????? ????????? ??????? ????? ???, AI-???????? ???????????????? ?????? ???????????? ?????????? ???????????? ??????????. ????????????? ????????? ??????????????? ????????, ?????????, ?????????? ??????? ???????? ????? ???????? ????? AI ? ??????????? ?????????????? ?????????. ???????????? ???????????????????, ??????????????? ????????????? ??????? ???????????? ???? ?????????? ?????????? ??????? ??????? ???????? ?????? ????????? ??????????? ????? AI ???????????.	Auto (en)	Tamil	openai	2026-06-25 17:30:12.653
e396676e-4179-4bc5-8590-6f0d2c0f6744	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	If Alembic is used, generate proper PostgreSQL migration scripts instead of recreating the database.\r\nDo not remove or rename existing tables or columns unless absolutely required.\r\nMake the code production-ready, modular, and clean following SaaS architecture best practices.\r\nUse environment variables for all PostgreSQL credentials.\r\nAdd proper error handling, transaction management, and connection pooling.\r\nVerify every backend endpoint continues to function after migration.\r\nKeep the project fully compatible with future scaling and cloud deployment.	Alembic ???????????????????, ???????????? ???????? ????????????????? ?????? ?????? PostgreSQL ??????????? ????????????? ????????????.\r\n?????????? ??????????? ???, ??????? ???? ?????????? ?????? ???????????? ??????? ?????? ??????????? ????????.\r\nSaaS ??????????? ?????? ???????????? ????????? ?????????? ?????????????? ?????, ????? ??????? ??????????? ?????????.\r\n??????? PostgreSQL ????????????????????? ????? ????????? ??????????????.\r\n?????? ???? ?????????, ??????????? ???????? ??????? ????????? ?????????? ???????????.\r\n????????????????? ????? ??????? ?????? ????????????????? ????????? ????????????? ??????????????.\r\n???????? ????????? ??????? ??????? ??????????????? ???????????? ????????? ????????? ???????? ?????????????.	Auto (en)	Tamil	openai	2026-06-26 11:39:29.21
e9302d10-b4df-4bb7-b2cb-c74c1cee6d9c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	hallo anto	Auto (en)	German	openai	2026-06-22 04:42:17.93
f1ab94a5-0bff-42bc-a724-1891e6a0d90d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Artificial Intelligence (AI) is transforming the way people work, learn, and communicate. It helps automate repetitive tasks, improves decision-making through data analysis, and enhances user experiences across various industries. From language translation and voice recognition to healthcare and education, AI-powered technologies are making everyday activities faster and more efficient. As technology continues to evolve, it is important to use AI responsibly by ensuring privacy, security, and fairness. With continuous innovation, AI has the potential to create smarter solutions that improve productivity and make life more convenient for people around the world.	??????? ????????? (AI) ?????? ???? ????????, ??????? ???????? ??????? ??????? ???????? ??????? ???????????. ??? ???????? ???????? ???????? ?????? ????????????? ?????????, ???? ??????????? ????? ????????????? ???????????????? ??????? ??????? ??????????? ????? ?????????? ????????????????. ???? ????????????? ??????? ????? ?????????? ????? ????????? ??????? ????? ???, AI-???????? ???????????????? ?????? ???????????? ?????????? ???????????? ??????????. ????????????? ????????? ??????????????? ????????, ?????????, ?????????? ??????? ???????? ????? ???????? ????? AI ? ??????????? ?????????????? ?????????. ???????????? ???????????????????, ??????????????? ????????????? ??????? ???????????? ???? ?????????? ?????????? ??????? ??????? ???????? ?????? ????????? ??????????? ????? AI ???????????.	Auto (en)	Tamil	openai	2026-06-25 17:59:17.923
f1b68f24-897b-4a8d-9add-f032a271f1b0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????. ??? ????? ??????. ???? ??????? ??? ??????? ????????? ????????????? ???? ???????? ???? ?????????? ????????? ?????????. ???? ??????????? ??????? ??????? ??????? ?????? ????????? ???? ??? ??????? ????? ???????? ?????? ???????????? ?????. ???????? ????????? ???????????? ?????????? ?????? ???????????, ???? ????? ???? ??????? ??????????????, ????? ??????????, ????? ?????????? ?????????????? ???? ??????? ?????????.	hello My name is Nancy. I am currently developing an artificial intelligence based language processing web application. The main objective of this project is to easily process text and voice information in various Indian languages. Whether users are speaking or writing in their native language, the system enables them to convert that information into another language, text-to-speech, and voice-to-text.	Auto (ta)	English	openai	2026-06-25 11:16:56.183
f73613aa-cf97-4125-be36-34724d17e8d3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The multilingual Text-to-Speech implementation is still failing.\r\n\r\nCurrent status:\r\n\r\n- English native speech works.\r\n- Tamil does not work.\r\n- The application shows:\r\n  "No native voice found for Tamil. Falling back to configured online TTS provider."\r\n\r\nThis means the browser has no Tamil voice, but the configured online TTS provider is also not producing audio.\r\n\r\nFix the implementation completely.\r\n\r\nRequirements:\r\n\r\n1. Verify the complete online TTS pipeline.\r\n   - API key\r\n   - Endpoint\r\n   - Authentication\r\n   - Request payload\r\n   - Response parsing\r\n   - Audio decoding\r\n   - Audio playback\r\n\r\n2. Log every step in the browser console.\r\n\r\nExample logs:\r\n\r\nNative voice search...\r\nSelected language: Tamil (ta-IN)\r\nNative voice found: false\r\nTrying online provider...\r\nSending request...\r\nResponse received...\r\nAudio URL created...\r\nPlayback started...\r\n\r\n3. If the online provider returns an error,\r\ndisplay the actual error instead of generic fallback messages.\r\n\r\n4. Verify the provider supports Tamil speech.\r\n\r\n5. If the configured provider does not support Tamil,\r\nautomatically use another configured provider that supports Tamil.\r\n\r\n6. If multiple providers are configured\r\n(OpenAI, ElevenLabs, Azure, Google, Deepgram),\r\ntry them in priority order until one succeeds.\r\n\r\n7. Cache generated audio so repeated playback is instant.\r\n\r\n8. Ensure the generated audio automatically plays after a successful response.\r\n\r\n9. Verify the audio MIME type and browser playback compatibility.\r\n\r\n10. Remove the current failure where the UI reports fallback but no audio is played.\r\n\r\n11. Keep the current UI unchanged.\r\n\r\n12. Do not implement fake success messages.\r\nOnly report success after actual audio playback begins.\r\n\r\n13. Produce detailed console logs for every failure so the root cause can be identified immediately.	??????? ????????????? ?????? ????????????? ??????? ?????????? ??????.\r\n\r\n???????? ????:\r\n\r\n- ?????? ????? ?????? ???? ?????????.\r\n- ????? ???? ????????.\r\n- ???????? ???????????:\r\n  "?????????? ??????? ????? ?????. ??????????????? ??????? TTS ???????????? ?????????????."\r\n\r\n?????? ????????? ????? ????? ?????, ????? ??????????????? ??????? TTS ??????????? ??????? ??????????????.\r\n\r\n????????????? ????????? ????????????.\r\n\r\n???????:\r\n\r\n1. ????????? ??????? TTS ?????????? ??????????????.\r\n   - API ????\r\n   - ?????????????\r\n   - ??????????\r\n   - ?????? ????????\r\n   - ????? ??????????????\r\n   - ????? ????????\r\n   - ????? ????????\r\n\r\n2. ????? ????????? ??????? ????????? ????? ?????????.\r\n\r\n??????????????? ????????:\r\n\r\n????? ????? ?????...\r\n??????????????????? ????: ????? (ta-IN)\r\n????? ????? ???????????????: ????\r\n??????? ????????? ???????????????...\r\n?????????? ????????????...\r\n????? ?????????...\r\n????? URL ????????????????...\r\n???????? ??????????...\r\n\r\n3. ??????? ????????? ?????? ??????????,\r\n??????? ????????? ??????????????? ?????? ???????? ???????? ?????????.\r\n\r\n4. ????????? ????? ?????? ???????????? ?????? ??????????????.\r\n\r\n5. ??????????????? ????????? ????? ????????????? ???????,\r\n????? ?????????? ??????? ??????????????? ??????????? ??????????????.\r\n\r\n6. ?? ???????????? ????????????????????????\r\n(OpenAI, ElevenLabs, Azure, Google, Deepgram)\r\n?????? ???????????? ??? ?????????? ????????? ?????? ??????????????.\r\n\r\n7. ???? ?????????????? ????? ???? ???????? ???????? ???????? ?????.\r\n\r\n8. ??????????? ??????????? ????? ?????????????? ????? ??????? ????????? ??????????????.\r\n\r\n9. ????? MIME ??? ??????? ????????? ??????? ?????????????? ??????????????.\r\n\r\n10. UI ????????????? ????????????? ????? ????? ??????? ??????????? ???????? ???????? ?????????.\r\n\r\n11. ???????? UI ??????? ?????????????.\r\n\r\n12. ???? ???????? ??????????? ???????????????????.\r\n???????? ????? ???????? ???????? ????? ??????? ?????????? ??????????????.\r\n\r\n13. ??????? ???????????? ??????? ??????? ???????? ????????????, ???? ????? ??? ???????? ???????? ??????? ????????.	Auto (en)	Tamil	openai	2026-06-25 18:08:28.417
f8fd696d-424e-44b6-ab23-af2f31fe7389	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	hello nancy	Auto (en)	Korean	openai	2026-06-22 04:19:07.08
b09979d3-8fa9-465d-b3eb-ce4f5afe9ee2	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	வணக்கம் நான்சி	Auto (en)	Tamil	openai	2026-06-27 17:45:53.211706
36a0ee97-c601-4409-8513-4927384f3469	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	வணக்கம் காலை வணக்கம்	Auto (en)	Tamil	openai	2026-06-27 17:47:34.68194
654f26bd-3ebe-4f6e-8a2e-d5f550d07ee6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-28 18:01:25.773476
676d38d4-ddb4-4ad6-973c-8f1ffd517fa4	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Hallo	Auto (en)	German	openai	2026-06-28 18:01:29.922029
87b9964b-6f83-441f-987c-dc2ceb36cfc1	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	Hello world	[Simulated Translation to Spanish]: Hello world	English	Spanish	openai	2026-06-29 10:33:49.594656
916aa8be-6525-408d-b375-411441be4754	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	Hello world	[Simulated Translation to Spanish]: Hello world	English	Spanish	openai	2026-06-29 11:48:59.36487
ced48abc-bf74-4684-9150-af2d1eea4c74	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	Hello world	Hola mundo	English	Spanish	openai	2026-06-29 11:49:53.773419
3575638e-8968-4667-9956-ef22fecfedf4	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	வணக்கம், காலை வணக்கம்	Auto (en)	Tamil	openai	2026-06-29 12:38:16.172176
fdab69a3-a7eb-4f70-9d57-fdaff2fc94f8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	வணக்கம் காலை வணக்கம்	Auto (en)	Tamil	openai	2026-06-29 12:50:51.737223
3025d1a7-df80-46ac-a0b7-9af2487e55e9	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	Hello, good morning.	Auto (en)	English	openai	2026-06-29 12:51:41.370236
72be6f2e-31de-4b2c-8288-956923e4cf0b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello good morning	வணக்கம், காலை வணக்கம்	Auto (en)	Tamil	openai	2026-06-29 12:51:51.116823
7369ca22-0af1-49f4-a565-c8306b4b5a30	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-29 12:56:55.857743
bbf3f39d-5dca-46b5-a759-0fb5fd96f6da	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 05:06:34.280203
84091794-1709-45e2-9d24-c577574005dc	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello anto	ஹலோ ஆன்டோ	Auto (en)	Tamil	openai	2026-06-30 05:06:50.387601
4ab6b209-7a90-4fd0-94b6-435a13ba22f8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 05:07:08.465774
297c3818-41ff-4d45-825f-f6a43e0a92bb	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	good morning 	காலை வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 05:08:07.308912
93ff0324-51bc-49a5-a0df-957ba3f2ad23	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hw	எப்படி இருக்கிறீர்கள்?	Auto (en)	Tamil	openai	2026-06-30 05:08:25.73881
600b2802-7153-4f08-9a70-040662c3d0ce	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello n	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 05:08:28.535489
33f567b6-4e43-4fe2-95d5-eeb8c4d43286	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello 	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 05:08:29.701214
647fffb5-614c-4eb1-8762-3a19a775395f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i 	வணக்கம் நான்	Auto (en)	Tamil	openai	2026-06-30 05:08:30.480501
5ceb3211-db17-4112-ad41-4e1bbec3f04a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am 	வணக்கம் நான்	Auto (en)	Tamil	openai	2026-06-30 05:08:31.719712
067c9591-433c-42a1-80ba-ebc02cb7c7ce	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am l	வணக்கம் நான் எல்	Auto (en)	Tamil	openai	2026-06-30 05:08:34.406578
4170054e-8057-46fd-b74b-e9eec9eba529	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am leo	வணக்கம், நான் லியோ.	Auto (en)	Tamil	openai	2026-06-30 05:08:36.880534
24e0702a-3921-4f79-a002-7435252fed87	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am leo	مرحباً أنا ليو	Auto (en)	Arabic	openai	2026-06-30 05:09:02.944386
b338bb3b-4d1b-4df1-ba20-f43440ff1270	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am leo	Hello, I'm Leo.	Auto (en)	English	openai	2026-06-30 05:09:24.616168
5a70afd8-4d05-4891-b0f9-85be222f3fbe	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am leo	Hallo, ich bin Leo.	Auto (en)	German	openai	2026-06-30 05:09:47.764254
eccd2555-60b8-4f0c-82ab-a112f1a072e9	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello i am leo	வணக்கம்! நான் லியோ	Auto (en)	Tamil	openai	2026-06-30 05:10:40.39033
630599fb-8330-4b95-891d-6e6b8bcad26a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	naaaa thaaaa  daaaa leo	நான் டாட ட லியோ	Auto (en)	Tamil	openai	2026-06-30 05:11:43.087697
bfd41272-d642-4528-bc4c-86ca993d9088	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	naaaa thaaaadaaaa leo	நான் தாதா லியோ	Auto (en)	Tamil	openai	2026-06-30 05:11:55.879355
dcc7206d-8f11-4756-bac2-0411f51c0755	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	naaaa thaaaan daaaa leo	நான் தான் டா லியோ.	Auto (en)	Tamil	openai	2026-06-30 05:11:57.389878
e83670e1-81cb-4888-8557-b6eabfe4e222	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	naaaan thaaaan daaaa leo	நான் தான் டா லியோ.	Auto (en)	Tamil	openai	2026-06-30 05:12:00.88741
3ea3a84d-d922-4560-90fb-0ce76f1f7213	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneu	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்வி, மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் குறித்து விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - விவாதம் 1\nதனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - விவாதம் 2\n\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்பு தொடர்பான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள் கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்	Auto	Tamil	auto	2026-07-03 10:01:20.433338
f2fbc520-99b7-45cb-9c6e-fd43c363db7a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Nancy Narmadha T\r\n\r\nChennai | +91 7904327211 | nancythomasselva@gmail.com | LinkedIn \r\n\r\nObjective\r\n\r\nAspiring Full Stack Developer with hands-on experience in building web applications, mobile applications using React, HTML and MySQL. Skilled in REST API development, database management, authentication, and AI-based integrations. Seeking an entry-level role to apply my technical skills and grow in a dynamic organization\r\n\r\n----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n\r\nTechnical Skills\r\n\r\nLanguages: Python, JavaScript, PHP\r\n\r\nFrontend: HTML, CSS, React, Flutter\r\n\r\nBackend: Flask, Node.js\r\n\r\nDatabase: MySQL, SQLite, MongoDB\r\n\r\nTools: Git, VS Code\r\n\r\nConcepts: REST API, CRUD Operations, Authentication, OOPs \r\n\r\nEducation\r\n\r\nMadras Christian College | Chennai                                                                            \r\n\r\nMCA | 79% \r\n\r\nBon Secours College for Women | Thanjavur                                                           \r\n\r\nBSc Computer Science | 85% \r\n\r\nRahmath Matric Hr. Sec. School | Muthupet                                                                                                                                                                                                  \r\n\r\nHSC | 90%\r\n\r\n---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n\r\nInternships\r\n\r\nI. Web Development Internship Training \r\n\r\n-Jan-2024\r\n\r\nBuilt a responsive personal portfolio website on responsive design.\r\n\r\nII. Full Stack Web Development at Oriz Software Technology Pvt. Ltd.    \r\n\r\n -  May-2025\r\n\r\nWorked on full stack-web development, contributing to both frontend and backend modules.\r\n\r\nCertifications \r\n\r\nLearn About Being a Front-End Developer certified by IBM skill build\r\n\r\nMachine Learning and Data Analytics with Python certified by MSME-Technology Development Center (PPDC)\r\n\r\nTraining on Cyber Security and Digital Safety Essentials offered by Naan Mudhalvan.\r\n\r\n--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	நான்சி நர்மதா டி  \n\nசென்னை | +91 7904327211 | nancythomasselva@gmail.com | LinkedIn\n\nநோக்கம் \n\nReact, HTML மற்றும் MySQL ஐப் பயன்படுத்தி வலைப் பயன்பாடுகள், மொபைல் பயன்பாடுகளை உருவாக்கும் அனுபவம் கொண்ட முழு ஸ்டேக் டெவலப்பர். REST API உருவாக்கம், தரவுத்தள மேலாண்மை, அங்கீகாரம் மற்றும் AI அடிப்படையிலான ஒருங்கிணைப்புகளில் திறமையானவர். எனது தொழில்நுட்பத் திறன்களைப் பயன்படுத்தவும், ஒரு ஆற்றல்மிக்க நிறுவனத்தில் வளரவும் ஒரு நுழைவு நிலை வேலையைத் தேடுகிறேன்.\n\nதொழில்நுட்பத் திறன்கள்\n\nமொழிகள்: பைதான், ஜாவாஸ்கிரிப்ட், PHP\n\nமுன்முனை: HTML, CSS, React, Flutter\n\nபின்முனை: Flask, Node.js\n\nதரவுத்தளம்: MySQL, SQLite, MongoDB\n\nகருவிகள்: Git, VS Code\n\nகருத்துகள்: REST API, CRUD செயல்பாடுகள், அங்கீகாரம், OOPs\n\nகல்வி\n\nமெட்ராஸ் கிறிஸ்தவ கல்லூரி | சென்னை\n\nMCA | 79%\n\nபோன் செக்கோயர்ஸ் மகளிர் கல்லூரி | தஞ்சாவூர்\n\nBSc கணினி அறிவியல் | 85%\n\nரஹ்மத் மெட்ரிக் மேல்நிலைப் பள்ளி | முத்துப்பேட்டை\n\nHSC | 90%\n\nபயிற்சிகள்\n\nI. வலை மேம்பாட்டு பயிற்சி\n\n-ஜனவரி -2024\n\nபதிலளிக்கக்கூடிய வடிவமைப்பில் ஒரு பதிலளிக்கக்கூடிய தனிப்பட்ட போர்ட்ஃபோலியோ வலைத்தளத்தை உருவாக்கப்பட்டது.\n\nII. Oriz மென்பொருள் தொழில்நுட்ப பிரைவேட் லிமிடெட் நிறுவனத்தில் முழு ஸ்டேக் வலை மேம்பாடு.\n\n- மே – 2025\n\nமுழு ஸ்டேக் வலை மேம்பாட்டில் பணியாற்றினார், முன்முனை மற்றும் பின்முனை தொகுதிகள் இரண்டிற்கும் பங்களித்தார்.\n\nசான்றிதழ்கள்\n\nIBM skill build ஆல் சான்றளிக்கப்பட்ட முன்முனை டெவலப்பராக இருப்பதைக் கற்றுக்கொள்ளுங்கள்\n\nMSME-தொழில்நுட்ப மேம்பாட்டு மையம் (PPDC) ஆல் சான்றளிக்கப்பட்ட பைதான் மூலம் இயந்திர கற்றல் மற்றும் தரவு பகுப்பாய்வு\n\nநான் முதல்வரால் வழங்கப்படும் இணைய பாதுகாப்பு மற்றும் டிஜிட்டல் பாதுகாப்பு அத்தியாவசியங்கள் குறித்த பயிற்சி.	Auto (en)	Tamil	openai	2026-06-30 05:33:46.920717
a47ec84b-a193-4db7-ad1e-3ed08e5ec10d	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	S.No Student Name                           Project Name                                                    Repository Link Date Added    Status  Link\r\n    1   Alwin Rosh AI Powered Student Portfolio Ecosystem https://github.com/Alwin-21/AI-Powered-Student-Portfolio-Ecosystem 2026-06-11 completed   NaN\r\n    2        Akash               3D Virtual Chemistry Lab           https://github.com/Akash1372004/3D-Virtual-Chemistry-Lab 2026-06-11 completed   NaN\r\n    3      Sathish               3D Virtual Chemistry Lab           https://github.com/Akash1372004/3D-Virtual-Chemistry-Lab 2026-06-11 completed   NaN\r\n    4          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n    5          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n    6          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n    7          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n    8          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n    9          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n   10          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n   11          NaN                                    NaN                                                                NaN        NaT       NaN   NaN\r\n   12          NaN                                    NaN                                                                NaN        NaT       NaN   NaN	வ.எண் மாணவர் பெயர் திட்டத்தின் பெயர் களஞ்சிய இணைப்பு சேர்க்கப்பட்ட தேதி நிலை இணைப்பு\n1 ஆல்வின் ரோஷ் செயற்கை நுண்ணறிவு மூலம் இயங்கும் மாணவர் போர்ட்ஃபோலியோ சூழலியல் https://github.com/Alwin-21/AI-Powered-Student-Portfolio-Ecosystem 2026-06-11 முடிந்தது NaN\n2 ஆகாஷ் 3D மெய்நிகர் வேதியியல் ஆய்வகம் https://github.com/Akash1372004/3D-Virtual-Chemistry-Lab 2026-06-11 முடிந்தது NaN\n3 சதீஷ் 3D மெய்நிகர் வேதியியல் ஆய்வகம் https://github.com/Akash1372004/3D-Virtual-Chemistry-Lab 2026-06-11 முடிந்தது NaN\n4 NaN NaN NaN NaT NaN NaN\n5 NaN NaN NaN NaT NaN NaN\n6 NaN NaN NaN NaT NaN NaN\n7 NaN NaN NaN NaT NaN NaN\n8 NaN NaN NaN NaT NaN NaN\n9 NaN NaN NaN NaT NaN NaN\n10 NaN NaN NaN NaT NaN NaN\n11 NaN NaN NaN NaT NaN NaN\n12 NaN NaN NaN NaT NaN NaN	Auto (en)	Tamil	openai	2026-06-30 05:47:53.825881
16d1c371-806f-4286-bdcf-ed1d15915b2a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Nancy Narmadha T\r\n\r\nChennai | +91 7904327211 | nancythomasselva@gmail.com | LinkedIn \r\n\r\nObjective\r\n\r\nAspiring Full Stack Developer with hands-on experience in building web applications, mobile applications using React, HTML and MySQL. Skilled in REST API development, database management, authentication, and AI-based integrations. Seeking an entry-level role to apply my technical skills and grow in a dynamic organization\r\n\r\n----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n\r\nTechnical Skills\r\n\r\nLanguages: Python, JavaScript, PHP\r\n\r\nFrontend: HTML, CSS, React, Flutter\r\n\r\nBackend: Flask, Node.js\r\n\r\nDatabase: MySQL, SQLite, MongoDB\r\n\r\nTools: Git, VS Code\r\n\r\nConcepts: REST API, CRUD Operations, Authentication, OOPs \r\n\r\nEducation\r\n\r\nMadras Christian College | Chennai                                                                            \r\n\r\nMCA | 79% \r\n\r\nBon Secours College for Women | Thanjavur                                                           \r\n\r\nBSc Computer Science | 85% \r\n\r\nRahmath Matric Hr. Sec. School | Muthupet                                                                                                                                                                                                  \r\n\r\nHSC | 90%\r\n\r\n---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\r\n\r\nInternships\r\n\r\nI. Web Development Internship Training \r\n\r\n-Jan-2024\r\n\r\nBuilt a responsive personal portfolio website on responsive design.\r\n\r\nII. Full Stack Web Development at Oriz Software Technology Pvt. Ltd.    \r\n\r\n -  May-2025\r\n\r\nWorked on full stack-web development, contributing to both frontend and backend modules.\r\n\r\nCertifications \r\n\r\nLearn About Being a Front-End Developer certified by IBM skill build\r\n\r\nMachine Learning and Data Analytics with Python certified by MSME-Technology Development Center (PPDC)\r\n\r\nTraining on Cyber Security and Digital Safety Essentials offered by Naan Mudhalvan.\r\n\r\n--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	நான்சி நர்மதா டி\nசென்னை | +91 7904327211 | nancythomasselva@gmail.com | LinkedIn\n\nநோக்கம்\nReact, HTML மற்றும் MySQL ஐப் பயன்படுத்தி வலைப் பயன்பாடுகள், மொபைல் பயன்பாடுகளை உருவாக்கும் அனுபவமுள்ள ஃபுல் ஸ்டாக் டெவலப்பர் ஆக ஆர்வம். REST API மேம்பாடு, தரவுத்தள மேலாண்மை, அங்கீகாரம் மற்றும் AI அடிப்படையிலான ஒருங்கிணைப்புகளில் திறமையானவர். எனது தொழில்நுட்ப திறன்களைப் பயன்படுத்தவும், ஒரு மாறும் நிறுவனத்தில் வளரவும் ஒரு நுழைவு நிலை வேலையை நாடும் விண்ணப்பதாரர்.\n\n----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n\nதொழில்நுட்ப திறன்கள்\nமொழிகள்: பைதான், ஜாவாஸ்கிரிப்ட், PHP\nமுன்பக்கம்: HTML, CSS, React, Flutter\nபின்பக்கம்: Flask, Node.js\nதரவுத்தளம்: MySQL, SQLite, MongoDB\nகருவிகள்: Git, VS Code\nகருத்துக்கள்: REST API, CRUD செயல்பாடுகள், அங்கீகாரம், OOPs\n\nகல்வி\nமெட்ராஸ் கிறிஸ்தவ கல்லூரி | சென்னை\nMCA | 79%\nபான் செகோர்ட்ஸ் மகளிர் கல்லூரி | தஞ்சாவூர்\nBSc கணினி அறிவியல் | 85%\nரஹ்மத் மெட்ரிக் மேல்நிலைப்பள்ளி | முத்துப்பேட்டை\nHSC | 90%\n\n----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n\nபயிற்சிகள்\nI. வலை மேம்பாட்டு பயிற்சி\n-ஜனவரி-2024\nபதிலளிக்கும் வடிவமைப்பில் ஒரு பதிலளிக்கக்கூடிய தனிப்பட்ட போர்ட்ஃபோலியோ வலைத்தளத்தை உருவாக்கப்பட்டது.\nII. Oriz சாஃப்ட்வேர் டெக்னாலஜி பிரைவேட் லிமிடெட் நிறுவனத்தில் ஃபுல் ஸ்டாக் வலை மேம்பாடு.\n- மே-2025\nமுழு ஸ்டாக் வலை மேம்பாட்டில் வேலை செய்தார், முன் மற்றும் பின் பக்க உள்ளமைவுகளுக்கு பங்களித்தார்.\n\nசான்றிதழ்கள்\nIBM திறன் உருவாக்கம் சான்றளித்த ஒரு Front-End டெவலப்பராக இருப்பது பற்றி அறியவும்.\nMSME-தொழில்நுட்ப மேம்பாட்டு மையம் (PPDC) சான்றளித்த பைத்தான் உடன் இயந்திர கற்றல் மற்றும் தரவு பகுப்பாய்வு.\nநான் முதல்வன் வழங்கிய சைபர் பாதுகாப்பு மற்றும் டிஜிட்டல் பாதுகாப்பு அத்தியாவசியங்கள் குறித்த பயிற்சி.\n\n--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	Auto (en)	Tamil	openai	2026-06-30 05:53:35.574601
01213ab8-04a4-403b-b019-9f653bc45d15	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 11:43:06.913826
eaee3a86-93d6-4e7a-a5b6-238b098e57c5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-06-30 14:10:04.606808
e7a8edc6-6554-43ee-b620-641288ec04a3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The Future of Artificial Intelligence\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.\r\n\r\nLooking ahead, AI is expected to become even more integrated into daily life. Smart assistants, autonomous vehicles, and intelligent business systems will continue to evolve. Success will depend not only on technological innovation but also on responsible development that prioritizes human values and societal well-being.\r\n\r\nIn conclusion, Artificial Intelligence offers tremendous opportunities for innovation and growth. By balancing technological advancement with ethical responsibility, society can harness the power of AI to improve quality of life, increase productivity, and create new possibilities for future generations.\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.	செயற்கை நுண்ணறிவின் எதிர்காலம்\n\nசெயற்கை நுண்ணறிவு (AI) நவீன காலத்தின் மிகவும் உருமாறும் தொழில்நுட்பங்களில் ஒன்றாக மாறியுள்ளது. இது செயல்திறனை மேம்படுத்தவும், திரும்பத் திரும்பச் செய்யக்கூடிய பணிகளைத் தானியங்கவும், சிறந்த முடிவெடுப்பதற்கான ஆதரவை வழங்கவும் பல்வேறு தொழில்துறை முழுவதும் பயன்படுத்தப்படுகிறது. சுகாதாரம் முதல் கல்வி வரை, AI நிபுணர்களுக்கு சிக்கலான சிக்கல்களை முன்னெப்போதையும் விட விரைவாகத் தீர்க்க உதவுகிறது.\n\nAI இன் மிக முக்கியமான நன்மைகளில் ஒன்று, குறுகிய காலத்தில் அதிக அளவு தரவுகளைச் செயலாக்கக்கூடிய திறன் ஆகும். நிறுவனங்கள் வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும், செயல்பாடுகளை மேம்படுத்தவும் AI ஐப் பயன்படுத்துகின்றன. மருத்துவமனைகள் மருத்துவர்களுக்கு நோய்களைக் கண்டறிய உதவ AI-ஆற்றல் கொண்ட அமைப்புகளைப் பயன்படுத்துகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும் அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் AI மூலம் கணிசமாகப் பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள் தனிப்பட்ட மாணவர்களுக்கு ஏற்ப பாடங்களைத் தகவமைத்துக் கொள்ளலாம், இதனால் அவர்கள் தங்கள் சொந்த வேகத்தில் கற்க உதவும். ஆசிரியர்கள் மதிப்பீடுகளை தானியக்கமாக்கலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படும் மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் கவனம் செலுத்த அதிக நேரம் அனுமதிக்கிறது.\n\nஅதன் பல நன்மைகள் இருந்தபோதிலும், AI சவால்களையும் முன்வைக்கிறது. தனியுரிமை கவலைகள், நெறிமுறை சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படக்கூடிய தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புணர்வை உறுதிசெய்யும் பொறுப்பான AI கொள்கைகளை நிறுவ அரசாங்கங்கள், அமைப்புகள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் ஒன்றிணைந்து செயல்பட வேண்டும்.\n\nஎதிர்காலத்தில், AI தினசரி வாழ்க்கையில் இன்னும் அதிகமாக ஒருங்கிணைக்கப்படும் என்று எதிர்பார்க்கப்படுகிறது. ஸ்மார்ட் உதவியாளர்கள், தன்னாட்சி வாகனங்கள் மற்றும் புத்திசாலித்தனமான வணிக அமைப்புகள் தொடர்ந்து உருவாகும். வெற்றி என்பது தொழில்நுட்ப கண்டுபிடிப்புகளை மட்டும் சார்ந்து இருக்காது, ஆனால் மனித மதிப்புகள் மற்றும் சமூக நலனுக்கு முன்னுரிமை அளிக்கும் பொறுப்பான வளர்ச்சியையும் சார்ந்துள்ளது.\n\nமுடிவாக, செயற்கை நுண்ணறிவு புதுமை மற்றும் வளர்ச்சிக்கு மகத்தான வாய்ப்புகளை வழங்குகிறது. தொழில்நுட்ப முன்னேற்றத்தை நெறிமுறை பொறுப்புடன் சமநிலைப்படுத்துவதன் மூலம், சமூகம் AI இன் சக்தியைப் பயன்படுத்தி வாழ்க்கைத் தரத்தை மேம்படுத்தவும், உற்பத்தித்திறனை அதிகரிக்கவும், எதிர்கால தலைமுறைகளுக்கு புதிய சாத்தியக்கூறுகளை உருவாக்கவும் முடியும்.\n\nசெயற்கை நுண்ணறிவு (AI) நவீன காலத்தின் மிகவும் உருமாறும் தொழில்நுட்பங்களில் ஒன்றாக மாறியுள்ளது. இது செயல்திறனை மேம்படுத்தவும், திரும்பத் திரும்பச் செய்யக்கூடிய பணிகளைத் தானியங்கவும், சிறந்த முடிவெடுப்பதற்கான ஆதரவை வழங்கவும் பல்வேறு தொழில்துறை முழுவதும் பயன்படுத்தப்படுகிறது. சுகாதாரம் முதல் கல்வி வரை, AI நிபுணர்களுக்கு சிக்கலான சிக்கல்களை முன்னெப்போதையும் விட விரைவாகத் தீர்க்க உதவுகிறது.\n\nAI இன் மிக முக்கியமான நன்மைகளில் ஒன்று, குறுகிய காலத்தில் அதிக அளவு தரவுகளைச் செயலாக்கக்கூடிய திறன் ஆகும். நிறுவனங்கள் வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும், செயல்பாடுகளை மேம்படுத்தவும் AI ஐப் பயன்படுத்துகின்றன. மருத்துவமனைகள் மருத்துவர்களுக்கு நோய்களைக் கண்டறிய உதவ AI-ஆற்றல் கொண்ட அமைப்புகளைப் பயன்படுத்துகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும் அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் AI மூலம் கணிசமாகப் பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள் தனிப்பட்ட மாணவர்களுக்கு ஏற்ப பாடங்களைத் தகவமைத்துக் கொள்ளலாம், இதனால் அவர்கள் தங்கள் சொந்த வேகத்தில் கற்க உதவும். ஆசிரியர்கள் மதிப்பீடுகளை தானியக்கமாக்கலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படும் மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் கவனம் செலுத்த அதிக நேரம் அனுமதிக்கிறது.\n\nஅதன் பல நன்மைகள் இருந்தபோதிலும், AI சவால்களையும் முன்வைக்கிறது. தனியுரிமை கவலைகள், நெறிமுறை சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படக்கூடிய தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புணர்வை உறுதிசெய்யும் பொறுப்பான AI கொள்கைகளை நிறுவ அரசாங்கங்கள், அமைப்புகள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் ஒன்றிணைந்து செயல்பட வேண்டும்.	Auto (en)	Tamil	openai	2026-06-30 18:46:15.667092
05097462-ab52-4f17-9bc9-e3576170fc43	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneu	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்வி, மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் பற்றிய விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 1\nதனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்தக் கட்டுரை தலைப்பு தொடர்பான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறைப் பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளிலிருந்து வரும் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 2\n\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்படுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்படுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்படுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளிலிருந்து வரும் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு 	Auto	Tamil	auto	2026-07-03 10:05:12.196678
781fe480-4b09-4d9e-b5c4-bf26782e46ca	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Employee ID           Name       Department  Location  Salary\r\n        1001  Alice Johnson      Engineering  New York   85000\r\n        1002    Brian Smith        Marketing   Chicago   68000\r\n        1003  Catherine Lee          Finance    Dallas   72000\r\n        1004    David Brown  Human Resources   Seattle   64000\r\n        1005    Emily Davis            Sales    Boston   70000\r\n        1006   Frank Wilson       IT Support    Austin   61000\r\n        1007   Grace Miller       Operations    Denver   76000\r\n        1008   Henry Taylor         Research San Diego   91000\r\n        1009 Isabella Moore Customer Success   Atlanta   66000\r\n        1010  Jack Anderson            Legal     Miami   83000	ஊழியர் அடையாள அட்டை பெயர் துறை இடம் சம்பளம்\n1001 ஆலிஸ் ஜான்சன் பொறியியல் நியூயார்க் 85000\n1002 பிரையன் ஸ்மித் மார்க்கெட்டிங் சிகாகோ 68000\n1003 கேத்தரின் லீ நிதி டல்லாஸ் 72000\n1004 டேவிட் பிரவுன் மனிதவளம் சியாட்டில் 64000\n1005 எமிலி டேவிஸ் விற்பனை பாஸ்டன் 70000\n1006 ஃபிராங்க் வில்சன் தகவல் தொழில்நுட்ப உதவி ஆஸ்டின் 61000\n1007 கிரேஸ் மில்லர் செயல்பாடுகள் டென்வர் 76000\n1008 ஹென்றி டெய்லர் ஆராய்ச்சி சான் டியாகோ 91000\n1009 இசபெல்லா மூர் வாடிக்கையாளர் வெற்றி அட்லாண்டா 66000\n1010 ஜாக் ஆண்டர்சன் சட்ட மியாமி 83000	Auto (en)	Tamil	openai	2026-06-30 18:47:43.017655
e5a09f65-6aa4-4c37-96ba-13376a8d1896	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The Future of Artificial Intelligence\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.\r\n\r\nLooking ahead, AI is expected to become even more integrated into daily life. Smart assistants, autonomous vehicles, and intelligent business systems will continue to evolve. Success will depend not only on technological innovation but also on responsible development that prioritizes human values and societal well-being.\r\n\r\nIn conclusion, Artificial Intelligence offers tremendous opportunities for innovation and growth. By balancing technological advancement with ethical responsibility, society can harness the power of AI to improve quality of life, increase productivity, and create new possibilities for future generations.\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.	செயற்கை நுண்ணறிவின் எதிர்காலம்\n\nநவீன காலத்தில் பெரும் மாற்றங்களை ஏற்படுத்திய தொழில்நுட்பங்களில் செயற்கை நுண்ணறிவு (AI) முதன்மையானது. திறனை மேம்படுத்துவதற்கும், திரும்பத் திரும்பச் செய்யப்படும் பணிகளை தானியங்குபடுத்துவதற்கும், சிறந்த முடிவுகளை எடுப்பதற்கும் இது பல்வேறு தொழில்களில் பயன்படுத்தப்படுகிறது. மருத்துவம் முதல் கல்வி வரை, AI நிபுணர்கள் சிக்கலான பிரச்சனைகளை முன்னெப்போதையும் விட வேகமாக தீர்க்க உதவுகிறது.\n\nAI இன் மிகப்பெரிய நன்மைகளில் ஒன்று, குறுகிய காலத்தில் பெரிய அளவிலான தரவுகளை செயலாக்கும் திறன் ஆகும். வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும், செயல்பாடுகளை மேம்படுத்தவும் வணிகங்கள் AI ஐப் பயன்படுத்துகின்றன. நோய்களைக் கண்டறிவதில் மருத்துவர்களுக்கு உதவ AI-ஆற்றல் பெற்ற அமைப்புகளை மருத்துவமனைகள் பயன்படுத்துகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும், அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் AI ஆல் கணிசமாக பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள் தனிப்பட்ட மாணவர்களுக்கு ஏற்ப பாடங்களை மாற்றியமைக்க முடியும், அவர்களுக்கு தங்கள் சொந்த வேகத்தில் கற்றுக்கொள்ள உதவுகின்றன. ஆசிரியர்கள் தரப்படுத்துதலை தானியங்குபடுத்தலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படக்கூடிய மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் அதிக கவனம் செலுத்த அனுமதிக்கிறது.\n\nஅதன் பல நன்மைகள் இருந்தபோதிலும், AI சவால்களையும் முன்வைக்கிறது. தனியுரிமைக் கவலைகள், நெறிமுறைச் சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படும் தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புக்கூறலை உறுதி செய்யும் பொறுப்பான AI கொள்கைகளை நிறுவ அரசாங்கங்கள், நிறுவனங்கள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் இணைந்து செயல்பட வேண்டும்.\n\nஎதிர்காலத்தில், AI அன்றாட வாழ்க்கையில் மேலும் ஒருங்கிணைக்கப்படும் என்று எதிர்பார்க்கப்படுகிறது. ஸ்மார்ட் உதவியாளர்கள், தன்னாட்சி வாகனங்கள் மற்றும் புத்திசாலித்தனமான வணிக அமைப்புகள் தொடர்ந்து வளர்ச்சியடையும். வெற்றி என்பது தொழில்நுட்ப கண்டுபிடிப்புகளைப் பொறுத்தது மட்டுமல்லாமல், மனித விழுமியங்கள் மற்றும் சமூக நலனுக்கு முன்னுரிமை அளிக்கும் பொறுப்பான வளர்ச்சியையும் பொறுத்தது.\n\nமுடிவாக, செயற்கை நுண்ணறிவு புதுமை மற்றும் வளர்ச்சிக்கு மகத்தான வாய்ப்புகளை வழங்குகிறது. தொழில்நுட்ப முன்னேற்றத்தை நெறிமுறைப் பொறுப்புடன் சமநிலைப்படுத்துவதன் மூலம், வாழ்க்கைத் தரத்தை மேம்படுத்தவும், உற்பத்தித்திறனை அதிகரிக்கவும், எதிர்கால தலைமுறைகளுக்கு புதிய வாய்ப்புகளை உருவாக்கவும் AI இன் சக்தியை சமூகம் பயன்படுத்த முடியும்.\n\nநவீன காலத்தில் பெரும் மாற்றங்களை ஏற்படுத்திய தொழில்நுட்பங்களில் செயற்கை நுண்ணறிவு (AI) முதன்மையானது. திறனை மேம்படுத்துவதற்கும், திரும்பத் திரும்பச் செய்யப்படும் பணிகளை தானியங்குபடுத்துவதற்கும், சிறந்த முடிவுகளை எடுப்பதற்கும் இது பல்வேறு தொழில்களில் பயன்படுத்தப்படுகிறது. மருத்துவம் முதல் கல்வி வரை, AI நிபுணர்கள் சிக்கலான பிரச்சனைகளை முன்னெப்போதையும் விட வேகமாக தீர்க்க உதவுகிறது.\n\nAI இன் மிகப்பெரிய நன்மைகளில் ஒன்று, குறுகிய காலத்தில் பெரிய அளவிலான தரவுகளை செயலாக்கும் திறன் ஆகும். வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும், செயல்பாடுகளை மேம்படுத்தவும் வணிகங்கள் AI ஐப் பயன்படுத்துகின்றன. நோய்களைக் கண்டறிவதில் மருத்துவர்களுக்கு உதவ AI-ஆற்றல் பெற்ற அமைப்புகளை மருத்துவமனைகள் பயன்படுத்துகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும், அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் AI ஆல் கணிசமாக பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள் தனிப்பட்ட மாணவர்களுக்கு ஏற்ப பாடங்களை மாற்றியமைக்க முடியும், அவர்களுக்கு தங்கள் சொந்த வேகத்தில் கற்றுக்கொள்ள உதவுகின்றன. ஆசிரியர்கள் தரப்படுத்துதலை தானியங்குபடுத்தலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படக்கூடிய மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் அதிக கவனம் செலுத்த அனுமதிக்கிறது.\n\nஅதன் பல நன்மைகள் இருந்தபோதிலும், AI சவால்களையும் முன்வைக்கிறது. தனியுரிமைக் கவலைகள், நெறிமுறைச் சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படும் தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புக்கூறலை உறுதி செய்யும் பொறுப்பான AI கொள்கைகளை நிறுவ அரசாங்கங்கள், நிறுவனங்கள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் இணைந்து செயல்பட வேண்டும்.	Auto (en)	Tamil	openai	2026-07-01 06:17:46.740176
4f10d225-1b16-4609-86db-01f5966c4a6a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-07-01 08:12:57.641449
685d2872-6010-4410-88d6-027ccf643593	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-07-01 09:16:35.230533
3cca236e-bd2c-4644-b97d-39837a181bdb	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-07-01 10:09:35.970224
96630e07-dcbf-4734-9890-c6658d7e8ef5	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto (en)	Tamil	openai	2026-07-01 10:23:59.277936
38aa3f1f-2800-455d-9712-03df97148fda	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	werty	வெர்ட்டி	Auto (en)	Tamil	openai	2026-07-01 10:23:59.96168
34873df2-e9ae-491f-a999-17ae4325dcf4	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	20e62d6f-d5a5-40d8-8869-d5d8028d63b1	Hello world	Hola mundo	English	Spanish	openai	2026-07-02 09:06:12.24872
d13c8231-68b6-4416-aacc-e12ecc9a2586	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	[Simulated Translation to Tamil]: hello	Auto (en)	Tamil	openai	2026-07-02 09:16:12.901101
57b5cb96-c8f1-4674-aa80-a8175ed7d01a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	PRAVEEN N\r\n\r\nChennai | +91 9600097807 |praveen.natarajan.in@gmail.com | LinkedIn \r\n\r\nPROFESSIONAL SUMMARY\r\n\r\nMotivated Full Stack and Mobile Application Developer with expertise in Flutter, Dart, Python (Flask), Java, and modern web technologies. Experienced in developing scalable web and mobile applications, integrating APIs, managing databases, and implementing secure authentication systems. Strong understanding of Software Development Life Cycle (SDLC), object-oriented programming, and cross-platform application development. Passionate about building efficient, user-friendly, and innovative software solutions.\r\n\r\nTECHNICAL SKILLS\r\n\r\nProgramming Languages: Java, Python, Dart, C, C++, C#\r\n\r\nMobile Development: Flutter, Android Application Development\r\n\r\nWeb Technologies: HTML, CSS, JavaScript, ASP.NET\r\n\r\nFrameworks: Flutter, Flask, ReactJS\r\n\r\nDatabases: MySQL, SQLite\r\n\r\nData Analytics: Power BI, Tableau, Microsoft Excel\r\n\r\nTools & Platforms: Visual Studio Code, Android Studio, NetBeans, Git, GitHub\r\n\r\nConcepts: REST APIs, SDLC, OOP, Database Design, Authentication & Authorization\r\n\r\nEXPERIENCE\r\n\r\nFlutter & Full Stack Developer | Yireh Trading Pvt. Ltd.\r\n\r\n* Developed and maintained cross-platform mobile applications using Flutter and Dart.\r\n\r\n* Designed responsive and user-friendly mobile interfaces for business applications.\r\n\r\n* Integrated REST APIs, authentication systems, and backend services.\r\n\r\n* Developed backend functionalities using Python and Flask.\r\n\r\n* Worked with MySQL and SQLite databases for data storage and management.\r\n\r\n* Optimized application performance and improved user experience.\r\n\r\n* Participated in requirement analysis, development, testing, debugging, and deployment activities.\r\n\r\n* Collaborated with team members to deliver scalable and maintainable software solutions.\r\n\r\nFull Stack Development Intern | Oriz Software Private Limited\r\n\r\n* Engineered frontend and backend components using Python and Flask with modular architecture.\r\n\r\n* Implemented REST APIs and backend logic to handle dynamic data operations efficiently.\r\n\r\n* Applied SDLC principles to improve code maintainability and collaboration.\r\n\r\n* Assisted in developing scalable web applications and database-driven solutions.\r\n\r\n* Participated in testing, debugging, and deployment of software modules.\r\n\r\nPROJECTS\r\n\r\nAI-Powered Student Performance Analyzer\r\n\r\nTechnologies: Python, Flask, Gemini API\r\n\r\n* Developed an intelligent reporting system using Gemini API for automated student performance analysis.\r\n\r\n* Generated AI-powered insights and performance evaluations.\r\n\r\n* Implemented multi-format report exports including PDF, Word, and Markdown.\r\n\r\nFlutter Mobile Applications\r\n\r\nTechnologies: Flutter, Dart, REST APIs, SQLite\r\n\r\n* Developed cross-platform mobile applications using Flutter.\r\n\r\n* Designed responsive UI/UX components for Android devices.\r\n\r\n* Integrated APIs and database connectivity for real-time data management.\r\n\r\n* Implemented user authentication and profile management features.	பிரவீன் என்\n\nசென்னை | +91 9600097807 | praveen.natarajan.in@gmail.com | LinkedIn\n\nதொழில்முறைச் சுருக்கம்\n\nஃப்ளட்டர், டார்ட், பைத்தான் (ஃப்ளாஸ்க்), ஜாவா மற்றும் நவீன இணையத் தொழில்நுட்பங்களில் நிபுணத்துவத்துடன் ஊக்கமளிக்கும் முழு ஸ்டாக் மற்றும் மொபைல் அப்ளிகேஷன் டெவலப்பர். அளவிடக்கூடிய இணைய மற்றும் மொபைல் அப்ளிகேஷன்களை உருவாக்குதல், APIகளை ஒருங்கிணைத்தல், தரவுத்தளங்களை நிர்வகித்தல் மற்றும் பாதுகாப்பான அங்கீகார அமைப்புகளைச் செயல்படுத்துதல் ஆகியவற்றில் அனுபவம் வாய்ந்தவர். மென்பொருள் மேம்பாட்டு வாழ்க்கைச் சுழற்சி (SDLC), ஆப்ஜெக்ட்-ஓரியண்டட் நிரலாக்கம் மற்றும் குறுக்கு-தள அப்ளிகேஷன் மேம்பாடு குறித்து வலுவான புரிதல் கொண்டவர். திறமையான, பயனர் நட்பு மற்றும் புதுமையான மென்பொருள் தீர்வுகளை உருவாக்குவதில் ஆர்வமிக்கவர்.\n\nதொழில்நுட்பத் திறன்கள்\n\nநிரலாக்க மொழிகள்: ஜாவா, பைத்தான், டார்ட், சி, சி++, சி#\n\nமொபைல் மேம்பாடு: ஃப்ளட்டர், ஆண்ட்ராய்டு அப்ளிகேஷன் மேம்பாடு\n\nஇணையத் தொழில்நுட்பங்கள்: HTML, CSS, ஜாவாஸ்கிரிப்ட், ASP.NET\n\nவரைச்சட்டங்கள் (Frameworks): ஃப்ளட்டர், ஃப்ளாஸ்க், ரியாக்ட்ஜெஎஸ்\n\nதரவுத்தளங்கள்: MySQL, SQLite\n\nதரவு பகுப்பாய்வு: பவர் BI, டாபுலே, மைக்ரோசாப்ட் எக்செல்\n\nகருவிகள் & தளங்கள்: விஷுவல் ஸ்டுடியோ கோட், ஆண்ட்ராய்டு ஸ்டுடியோ, நெட்பீன்ஸ், கிட், கிட்ஹப்\n\nகோட்பாடுகள்: REST APIகள், SDLC, OOP, தரவுத்தள வடிவமைப்பு, அங்கீகாரம் & அதிகாரமளித்தல்\n\nஅனுபவம்\n\nஃப்ளட்டர் & முழு ஸ்டாக் டெவலப்பர் | யிரேஹ் ட்ரேடிங் பிரைவேட் லிமிடெட்.\n\n* ஃப்ளட்டர் மற்றும் டார்ட் பயன்படுத்தி குறுக்கு-தள மொபைல் அப்ளிகேஷன்களை உருவாக்கிப் பராமரித்தார்.\n\n* வணிகப் பயன்பாடுகளுக்காகப் பதிலளிக்கக்கூடிய மற்றும் பயனர் நட்பு மொபைல் இடைமுகங்களை வடிவமைத்தார்.\n\n* REST APIகள், அங்கீகார அமைப்புகள் மற்றும் பின்தள சேவைகளை ஒருங்கிணைத்தார்.\n\n* பைத்தான் மற்றும் ஃப்ளாஸ்க் பயன்படுத்தி பின்தள செயல்பாடுகளை உருவாக்கினார்.\n\n* தரவு சேமிப்பு மற்றும் நிர்வாகத்திற்காக MySQL மற்றும் SQLite தரவுத்தளங்களுடன் பணிபுரிந்தார்.\n\n* அப்ளிகேஷன் செயல்திறனை மேம்படுத்தி பயனர் அனுபவத்தைச் செம்மைப்படுத்தினார்.\n\n* தேவைகள் பகுப்பாய்வு, மேம்பாடு, சோதனை, பிழைத்திருத்தம் மற்றும் வரிசைப்படுத்தல் நடவடிக்கைகளில் பங்கேற்றார்.\n\n* அளவிடக்கூடிய மற்றும் பராமரிக்கக்கூடிய மென்பொருள் தீர்வுகளை வழங்க குழு உறுப்பினர்களுடன் ஒத்துழைத்தார்.\n\nமுழு ஸ்டாக் மேம்பாட்டு இன்டர்ன் | ஓரிஸ் மென்பொருள் பிரைவேட் லிமிடெட்\n\n* பைத்தானையும் ஃப்ளாஸ்கையும் பயன்படுத்தி முன்பக்க மற்றும் பின்பக்க கூறுகளை மாடுலர் கட்டுமானத்துடன் வடிவமைத்தார்.\n\n* REST APIகள் மற்றும் பின்பக்க தர்க்கத்தை உருவாக்கி, மாறும் தரவு செயல்பாடுகளைத் திறமையாகக் கையாண்டார்.\n\n* குறியீடு பராமரிப்பு மற்றும் ஒத்துழைப்பை மேம்படுத்த SDLC கொள்கைகளைப் பயன்படுத்தினார்.\n\n* அளவிடக்கூடிய இணையப் பயன்பாடுகள் மற்றும் தரவுத்தளத்தால் இயக்கப்படும் தீர்வுகளை உருவாக்க உதவினார்.\n\n* மென்பொருள் தொகுதிகளின் சோதனை, பிழைத்திருத்தம் மற்றும் வரிசைப்படுத்தலில் பங்கேற்றார்.\n\nதிட்டங்கள்\n\nAI-உந்துதல் மாணவர் செயல் திறன் பகுப்பாய்வி\n\nதொழில்நுட்பங்கள்: பைத்தான், ஃப்ளாஸ்க், ஜெமினி API\n\n* தானியங்கு மாணவர் செயல்திறன் பகுப்பாய்விற்காக ஜெமினி API ஐப் பயன்படுத்தி ஒரு அறிவார்ந்த அறிக்கை அமைப்பை உருவாக்கினார்.\n\n* AI-ஆற்றல் பெற்ற நுண்ணறிவுகளையும் செயல்திறன் மதிப்பீடுகளையும் உருவாக்கினார்.\n\n* PDF, Word மற்றும் Markdown உள்ளிட்ட பல வடிவிலான அறிக்கை ஏற்றுமதிகளைச் செயல்படுத்தினார்.\n\nஃப்ளட்டர் மொபைல் அப்ளிகேஷன்கள்\n\nதொழில்நுட்பங்கள்: ஃப்ளட்டர், டார்ட், REST APIகள், SQLite\n\n* ஃப்ளட்டர் பயன்படுத்தி குறுக்கு-தள மொபைல் அப்ளிகேஷன்களை உருவாக்கினார்.\n\n* ஆண்ட்ராய்டு சாதனங்களுக்கான பதிலளிக்கக்கூடிய UI/UX கூறுகளை வடிவமைத்தார்.\n\n* நிகழ்நேர தரவு நிர்வாகத்திற்காக APIகள் மற்றும் தரவுத்தள இணைப்பை ஒருங்கிணைத்தார்.\n\n* பயனர் அங்கீகாரம் மற்றும் சுயவிவர மேலாண்மை அம்சங்களைச் செயல்படுத்தினார்.	Auto (en)	Tamil	gemini	2026-07-02 09:23:33.240114
452e7716-8e04-42a9-8f02-8df75c100340	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneu	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்விப் படிப்புகள், மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் குறித்து விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - விவாதம் 1\nதனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்கி வருகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் அனைவரையும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்கி வருகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் அனைவரையும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்கி வருகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் அனைவரையும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்தக் கட்டுரை தலைப்பு தொடர்பான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - விவாதம் 2\n\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எ	Auto	Tamil	auto	2026-07-03 10:29:26.897265
e7e9ab0c-c584-4b4e-a42a-09e36c1c912c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	MCC AI Language Platform\r\n123 Tech Campus, Bangalore, India\r\nEmail: billing@mcc-ai.com\r\nPAYMENT RECEIPT\r\nTransaction ID: TXN-1782901053876\r\nInvoice Number: INV-2026-0025\r\nPayment Date: 2026-07-01 10:16:49\r\nGateway/Method: STRIPE\r\nStatus: SUCCESS\r\nPaid By:\r\nTenant Workspace: MMIP\r\nItem Description Payment Method Amount Paid\r\nSubscription Payment - Starter STRIPE INR 34.22\r\nTotal Paid INR 34.22\r\nFor any subscription questions, contact billing@mcc-ai.com.	MCC AI மொழித் தளம்\n123 டெக் கேம்பஸ், பெங்களூரு, இந்தியா\nமின்னஞ்சல்: billing@mcc-ai.com\nபணம் செலுத்தியதற்கான ரசீது\nபரிவர்த்தனை ஐடி: TXN-1782901053876\nவிலைப்பட்டியல் எண்: INV-2026-0025\nபணம் செலுத்திய தேதி: 2026-07-01 10:16:49\nகேட்வே/முறை: STRIPE\nநிலை: வெற்றி\nபணம் செலுத்தியவர்:\nகுத்தகைதாரர் பணியிடம்: MMIP\nபொருள் விளக்கம் பணம் செலுத்தும் முறை செலுத்திய தொகை\nசந்தா கட்டணம் - ஸ்டார்டர் STRIPE INR 34.22\nமொத்தம் செலுத்தியது INR 34.22\nஏதேனும் சந்தா கேள்விகளுக்கு, billing@mcc-ai.com ஐத் தொடர்பு கொள்ளவும்.	Auto	Tamil	auto	2026-07-02 11:22:59.613471
8205c1d4-8642-4a39-9895-b47fb2d4be29	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்வி, மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் குறித்து விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 1\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துக்கள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 2\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. திறமையான நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துக்கள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 3\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கிய பங்கு வகிக்கின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூகம்	Auto	Tamil	auto	2026-07-03 07:37:49.210742
7521bcfe-8f9b-49fa-b910-b0af5a38de0e	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneu	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்வி, மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் குறித்து விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 1\nதனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள் கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 2\n\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் படிப்புகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள் கல்லூரிகள் காலப்போக்கில் எவ்வா	Auto	Tamil	auto	2026-07-03 09:40:43.434609
f3a6284c-beb1-420a-ba46-481560e87681	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Comprehensive Report on Colleges\r\n\r\nThis report provides an extensive overview of colleges, higher education systems, admissions, academics, student life, technology, research, governance, challenges, and future trends.\r\n\r\n\r\nChapter 1: Introduction to Colleges\r\n\r\nIntroduction to Colleges - Discussion 1\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 2\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. Colleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneurship, community engagement, and digital technologies. Institutions continuously adapt to changing industry needs, globalization, sustainability goals, and emerging technologies such as artificial intelligence and cloud computing. Effective governance, quality faculty, student support services, and inclusive policies contribute to successful educational outcomes. This section examines concepts, examples, benefits, limitations, best practices, and practical recommendations relevant to the topic. Examples from different countries illustrate how colleges evolve over time and respond to economic, technological, and social changes.\r\n\r\n\r\nIntroduction to Colleges - Discussion 3\r\nColleges play a vital role in shaping individuals and societies. They provide academic knowledge, professional skills, research opportunities, and personal development. Modern colleges integrate classroom learning with laboratories, projects, internships, entrepreneu	கல்லூரிகள் குறித்த விரிவான அறிக்கை\n\nஇந்த அறிக்கை கல்லூரிகள், உயர்கல்வி அமைப்புகள், சேர்க்கைகள், கல்வி, மாணவர் வாழ்க்கை, தொழில்நுட்பம், ஆராய்ச்சி, நிர்வாகம், சவால்கள் மற்றும் எதிர்காலப் போக்குகள் குறித்து விரிவான கண்ணோட்டத்தை வழங்குகிறது.\n\nஅத்தியாயம் 1: கல்லூரிகள் அறிமுகம்\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 1\nதனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் கல்லூரிகள் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், இன்டர்ன்ஷிப்கள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. மாறிவரும் தொழில்துறை தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்கு நிறுவனங்கள் தொடர்ந்து இணங்குகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்கு பங்களிக்கின்றன. இந்தக் கட்டுரை தலைப்புக்கு பொருத்தமான கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள் கல்லூரிகள் காலப்போக்கில் எவ்வாறு உருவாகின்றன மற்றும் பொருளாதார, தொழில்நுட்ப மற்றும் சமூக மாற்றங்களுக்கு எவ்வாறு பதிலளிக்கின்றன என்பதை விளக்குகின்றன.\n\nகல்லூரிகள் அறிமுகம் - கலந்துரையாடல் 2\n\nகல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் பட்டறைகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்குப் பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் பட்டறைகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்குப் பங்களிக்கின்றன. கல்லூரிகள் தனிநபர்களையும் சமூகங்களையும் வடிவமைப்பதில் முக்கியப் பங்காற்றுகின்றன. அவை கல்வி அறிவு, தொழில்முறை திறன்கள், ஆராய்ச்சி வாய்ப்புகள் மற்றும் தனிப்பட்ட வளர்ச்சியை வழங்குகின்றன. நவீன கல்லூரிகள் வகுப்பறை கற்றலை ஆய்வகங்கள், திட்டங்கள், பயிற்சிப் பட்டறைகள், தொழில்முனைவு, சமூக ஈடுபாடு மற்றும் டிஜிட்டல் தொழில்நுட்பங்களுடன் ஒருங்கிணைக்கின்றன. நிறுவனங்கள் மாறிவரும் தொழில் தேவைகள், உலகமயமாக்கல், நிலைத்தன்மை இலக்குகள் மற்றும் செயற்கை நுண்ணறிவு மற்றும் கிளவுட் கம்ப்யூட்டிங் போன்ற வளர்ந்து வரும் தொழில்நுட்பங்களுக்குத் தொடர்ந்து ஏற்புடையதாக மாறுகின்றன. பயனுள்ள நிர்வாகம், தரமான ஆசிரியர்கள், மாணவர் ஆதரவு சேவைகள் மற்றும் உள்ளடக்கிய கொள்கைகள் வெற்றிகரமான கல்வி விளைவுகளுக்குப் பங்களிக்கின்றன. இந்த பகுதி தலைப்புக்கு தொடர்புடைய கருத்துகள், எடுத்துக்காட்டுகள், நன்மைகள், வரம்புகள், சிறந்த நடைமுறைகள் மற்றும் நடைமுறை பரிந்துரைகளை ஆராய்கிறது. வெவ்வேறு நாடுகளின் எடுத்துக்காட்டுகள், கல்லூரிகள் காலப்போக்கி	Auto	Tamil	auto	2026-07-03 09:40:43.799261
1031163c-6643-4f15-9523-7de8dcb1d873	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	hello	வணக்கம்	Auto	Tamil	auto	2026-07-03 09:51:52.878247
a4916d02-226b-4ac2-8b3c-12be690c1b22	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	hello	வணக்கம்	Auto	Tamil	auto	2026-07-03 09:52:01.884111
182e7af7-d7f0-425a-9fd5-1b3e418b15ed	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	The Future of Artificial Intelligence\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.\r\n\r\nLooking ahead, AI is expected to become even more integrated into daily life. Smart assistants, autonomous vehicles, and intelligent business systems will continue to evolve. Success will depend not only on technological innovation but also on responsible development that prioritizes human values and societal well-being.\r\n\r\nIn conclusion, Artificial Intelligence offers tremendous opportunities for innovation and growth. By balancing technological advancement with ethical responsibility, society can harness the power of AI to improve quality of life, increase productivity, and create new possibilities for future generations.\r\n\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\n\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\n\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\n\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.	செயற்கை நுண்ணறிவின் எதிர்காலம்\n\nசெயற்கை நுண்ணறிவு (AI) நவீன காலத்தின் மிகவும் மாற்றியமைக்கும் தொழில்நுட்பங்களில் ஒன்றாக மாறியுள்ளது. இது தொழில்துறைகள் முழுவதும் செயல்திறனை மேம்படுத்தவும், திரும்பத் திரும்பச் செய்யும் பணிகளை தானியங்குபடுத்தவும், சிறந்த முடிவெடுப்பதை ஆதரிக்கவும் பயன்படுத்தப்படுகிறது. சுகாதாரம் முதல் கல்வி வரை, AI நிபுணர்களுக்கு சிக்கலான சிக்கல்களை முன்னெப்போதையும் விட வேகமாக தீர்க்க உதவுகிறது.\n\nAI இன் மிகப்பெரிய நன்மைகளில் ஒன்று, குறுகிய காலத்தில் பெரிய அளவிலான தரவுகளைச் செயலாக்கும் திறன் ஆகும். வணிகங்கள் AI ஐப் பயன்படுத்தி வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும் மற்றும் செயல்பாடுகளை மேம்படுத்தவும் செய்கின்றன. மருத்துவமனைகள் AI-இயங்கும் அமைப்புகளைப் பயன்படுத்தி நோய்களைக் கண்டறிவதில் மருத்துவர்களுக்கு உதவுகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும் அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் AI ஆல் கணிசமாகப் பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள் தனிப்பட்ட மாணவர்களுக்கு ஏற்ப பாடங்களை மாற்றியமைக்க முடியும், அவர்களுக்கு அவர்களின் சொந்த வேகத்தில் கற்றுக்கொள்ள உதவுகின்றன. ஆசிரியர்கள் தரப்படுத்துதலை தானியங்குபடுத்தலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படும் மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் அதிக கவனம் செலுத்த அனுமதிக்கிறது.\n\nஅதன் பல நன்மைகள் இருந்தபோதிலும், AI சவால்களையும் முன்வைக்கிறது. தனியுரிமை கவலைகள், நெறிமுறை சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படக்கூடிய தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புக்கூறலை உறுதி செய்யும் பொறுப்பான AI கொள்கைகளை நிறுவ அரசாங்கங்கள், நிறுவனங்கள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் இணைந்து செயல்பட வேண்டும்.\n\nஎதிர்காலத்தில், AI அன்றாட வாழ்க்கையில் இன்னும் அதிகமாக ஒருங்கிணைக்கப்படும் என்று எதிர்பார்க்கப்படுகிறது. ஸ்மார்ட் உதவியாளர்கள், தன்னாட்சி வாகனங்கள் மற்றும் புத்திசாலித்தனமான வணிக அமைப்புகள் தொடர்ந்து உருவாகும். வெற்றி தொழில்நுட்ப கண்டுபிடிப்புகளை மட்டுமல்லாமல், மனித மதிப்புகள் மற்றும் சமூக நலனுக்கு முன்னுரிமை அளிக்கும் பொறுப்பான வளர்ச்சியையும் சார்ந்துள்ளது.\n\nமுடிவாக, செயற்கை நுண்ணறிவு புதுமை மற்றும் வளர்ச்சிக்கு மிகப்பெரிய வாய்ப்புகளை வழங்குகிறது. தொழில்நுட்ப முன்னேற்றத்தை நெறிமுறை பொறுப்புடன் சமநிலைப்படுத்துவதன் மூலம், சமூகம் AI இன் சக்தியைப் பயன்படுத்தி வாழ்க்கைத் தரத்தை மேம்படுத்தவும், உற்பத்தித்திறனை அதிகரிக்கவும், எதிர்கால தலைமுறைகளுக்கு புதிய சாத்தியக்கூறுகளை உருவாக்கவும் முடியும்.\n\nசெயற்கை நுண்ணறிவு (AI) நவீன காலத்தின் மிகவும் மாற்றியமைக்கும் தொழில்நுட்பங்களில் ஒன்றாக மாறியுள்ளது. இது தொழில்துறைகள் முழுவதும் செயல்திறனை மேம்படுத்தவும், திரும்பத் திரும்பச் செய்யும் பணிகளை தானியங்குபடுத்தவும், சிறந்த முடிவெடுப்பதை ஆதரிக்கவும் பயன்படுத்தப்படுகிறது. சுகாதாரம் முதல் கல்வி வரை, AI நிபுணர்களுக்கு சிக்கலான சிக்கல்களை முன்னெப்போதையும் விட வேகமாக தீர்க்க உதவுகிறது.\n\nAI இன் மிகப்பெரிய நன்மைகளில் ஒன்று, குறுகிய காலத்தில் பெரிய அளவிலான தரவுகளைச் செயலாக்கும் திறன் ஆகும். வணிகங்கள் AI ஐப் பயன்படுத்தி வாடிக்கையாளர் நடத்தையை பகுப்பாய்வு செய்யவும், போக்குகளை கணிக்கவும் மற்றும் செயல்பாடுகளை மேம்படுத்தவும் செய்கின்றன. மருத்துவமனைகள் AI-இயங்கும் அமைப்புகளைப் பயன்படுத்தி நோய்களைக் கண்டறிவதில் மருத்துவர்களுக்கு உதவுகின்றன, அதே நேரத்தில் நிதி நிறுவனங்கள் மோசடியைக் கண்டறியவும் அபாயங்களை நிர்வகிக்கவும் AI ஐ நம்பியுள்ளன.\n\nகல்வியும் செயற்கை நுண்ணறிவால் கணிசமாகப் பயனடைந்துள்ளது. தனிப்பயனாக்கப்பட்ட கற்றல் தளங்கள், பாடங்களை மாணவர்களின் தனிப்பட்ட தேவைகளுக்கு ஏற்ப மாற்றியமைத்து, அவர்கள் தங்கள் சொந்த வேகத்தில் கற்க உதவுகின்றன. ஆசிரியர்கள் மதிப்பெண் இடுவதை தானியங்குபடுத்தலாம், கற்றல் பொருட்களை உருவாக்கலாம் மற்றும் கூடுதல் ஆதரவு தேவைப்படும் மாணவர்களை அடையாளம் காணலாம். இது கல்வியாளர்கள் கற்பித்தல் மற்றும் வழிகாட்டுதலில் அதிக கவனம் செலுத்த அனுமதிக்கிறது.\n\nபல நன்மைகள் இருந்தாலும், செயற்கை நுண்ணறிவு சவால்களையும் முன்வைக்கிறது. தனியுரிமை கவலைகள், நெறிமுறை சிக்கல்கள் மற்றும் வேலைவாய்ப்பில் ஏற்படக்கூடிய தாக்கம் ஆகியவை கவனமாக பரிசீலிக்கப்பட வேண்டும். வெளிப்படைத்தன்மை, நியாயம் மற்றும் பொறுப்புணர்வை உறுதிசெய்யும் பொறுப்பான செயற்கை நுண்ணறிவு கொள்கைகளை உருவாக்க அரசாங்கங்கள், நிறுவனங்கள் மற்றும் தொழில்நுட்ப நிறுவனங்கள் இணைந்து செயல்பட வேண்டும்.	Auto	Tamil	auto	2026-07-03 09:52:52.586626
fad4113c-e2a8-4ba3-9c51-ffe2ae32d10d	b3925813-0140-477b-84e4-076f28f1daa4	934e8b21-2231-46a4-afc8-08314da3e7e3	1 INTRODUCTION\r\n\r\nThe AI-Based Face Recognition Login and Attendance System is an intelligent, AI-powered employee authentication and attendance management application designed to automate workforce monitoring using facial recognition technology. In traditional attendance systems, organizations rely on manual registers, ID cards, or fingerprint devices to track employee presence. These methods are often time-consuming, prone to errors, and allow proxy attendance, which reduces reliability and transparency. Managing attendance, leave requests, meetings, and project assignments separately also creates data inconsistency and makes monitoring employee performance difficult.\r\n\r\nThe proposed system solves these challenges by providing a centralized platform that integrates AI-based face recognition with attendance tracking and employee management features. The system captures the employee’s face using a device camera and verifies identity using trained AI models. After successful authentication, attendance is automatically recorded with clock-in time, clock-out time, and working hours. The platform includes role-based dashboards for admin and employees, allowing real-time monitoring, project assignment, leave management, meeting scheduling, and analytics tracking. This unified solution improves accuracy, enhances security, eliminates proxy attendance, and provides an efficient and contactless method for managing employee attendance and organizational workflow.\r\n\r\n1.1 Company Profile\r\n\r\nKOLOZEN Tech World Private Limited is an innovative technology company specializing in software development, IoT solutions, and data-driven platforms. The organization focuses on building scalable, secure, and user-friendly applications that solve real-world problems using modern technologies. The company emphasizes research-driven development and practical implementation of artificial intelligence to improve business operations and automation.\r\n\r\nThe company provides technology solutions in areas such as web application development, mobile application development, AI-based systems, and enterprise software solutions. With a strong commitment to quality, innovation, and reliability, KOLOZEN Tech World Private Limited aims to deliver efficient digital solutions that enhance productivity and operational efficiency. The organization also promotes the development of intelligent systems such as AI-based face recognition attendance platforms, helping organizations automate employee monitoring, improve security, and streamline workforce management.\r\n\r\n1.2 Project Overview\r\n\r\nThe AI-Based Face Recognition Login and Attendance System is an intelligent application developed to automate employee authentication and attendance tracking using artificial intelligence. The system provides a centralized platform where employee login, attendance records, leave requests, meetings, and project assignments are managed in a single integrated environment. By replacing traditional attendance methods, the system improves accuracy, reduces manual work, and enhances overall workforce management.\r\n\r\nIn many organizations, attendance is recorded using manual registers, ID cards, or fingerprint devices. These methods are not secure, allow proxy attendance, and require additional maintenance. Managing attendance data manually is also time-consuming and difficult to analyze. The proposed system addresses these challenges by using AI-based facial recognition to identify employees and automatically record attendance in real time. The system captures the employee’s face using the device camera, verifies identity using trained AI models, and records clock-in time, clock-out time, and working hours automatically.\r\n\r\nThe system also includes role-based dashboards for both admin and employees. Employees can log in using face recognition, view attendance details, apply leave, check meeting schedules, track assigned projects, and monitor performance through analytics. Admin users can manage employees, assign projects, schedule meetings, approve leave requests, and monitor attendance statistics. This integrated approach improves transparency, reduces manual errors, and provides real-time monitoring of employee activities.\r\n\r\nThis project was developed to demonstrate the practical implementation of artificial intelligence in attendance automation along with software engineering concepts such as database design, modular architecture, user interface development, and backend API integration. The system reflects real-world organizational requirements and provides a secure, scalable, and efficient solution for employee attendance and workforce management.\r\n\r\n1.3 Module Description\r\n\r\nThe AI-Based Face Recognition Login and Attendance System is divided into multiple modules to manage authentication, attendance tracking, employee management, and administrative operations efficiently. Each module performs a specific function and together they form a complete workforce management sys	1 அறிமுகம்\n\nAI அடிப்படையிலான முக அங்கீகார உள்நுழைவு மற்றும் வருகை அமைப்பு என்பது, முக அங்கீகார தொழில்நுட்பத்தைப் பயன்படுத்தி பணியாளர் கண்காணிப்பை தானியங்குபடுத்துவதற்காக வடிவமைக்கப்பட்ட ஒரு அறிவார்ந்த, AI-ஆற்றல் பெற்ற பணியாளர் அங்கீகாரம் மற்றும் வருகை மேலாண்மைப் பயன்பாடாகும். பாரம்பரிய வருகை அமைப்புகளில், நிறுவனங்கள் பணியாளர்களின் இருப்பைக் கண்காணிக்க கைமுறைப் பதிவேடுகள், அடையாள அட்டைகள் அல்லது கைரேகை சாதனங்களை நம்பியிருந்தன. இந்த முறைகள் பெரும்பாலும் நேரத்தைச் செலவழிப்பவை, பிழைகளுக்கு ஆளாகக்கூடியவை, மேலும் பதிலாள் வருகைக்கு அனுமதிப்பவை, இது நம்பகத்தன்மையையும் வெளிப்படைத்தன்மையையும் குறைக்கிறது. வருகை, விடுப்புக் கோரிக்கைகள், கூட்டங்கள் மற்றும் திட்டப் பணிகளைத் தனித்தனியாக நிர்வகிப்பதும் தரவு முரண்பாட்டை உருவாக்குகிறது மற்றும் பணியாளர் செயல்திறனைக் கண்காணிப்பதை கடினமாக்குகிறது.\n\nமுன்மொழியப்பட்ட அமைப்பு, AI அடிப்படையிலான முக அங்கீகாரத்தை வருகைக் கண்காணிப்பு மற்றும் பணியாளர் மேலாண்மை அம்சங்களுடன் ஒருங்கிணைக்கும் ஒரு மையப்படுத்தப்பட்ட தளத்தை வழங்குவதன் மூலம் இந்த சவால்களைத் தீர்க்கிறது. இந்த அமைப்பு ஒரு சாதன கேமராவைப் பயன்படுத்தி பணியாளரின் முகத்தைப் படம்பிடித்து, பயிற்சி பெற்ற AI மாதிரிகளைப் பயன்படுத்தி அடையாளத்தைச் சரிபார்க்கிறது. வெற்றிகரமான அங்கீகாரத்திற்குப் பிறகு, வருகை தானாகவே உள்நுழைவு நேரம், வெளியேறும் நேரம் மற்றும் வேலை நேரம் ஆகியவற்றுடன் பதிவு செய்யப்படுகிறது. இந்தத் தளத்தில் நிர்வாகி மற்றும் பணியாளர்களுக்கான பங்கு அடிப்படையிலான டாஷ்போர்டுகள் உள்ளன, இது நிகழ்நேர கண்காணிப்பு, திட்டப் பணி, விடுப்பு மேலாண்மை, கூட்ட அட்டவணை மற்றும் பகுப்பாய்வு கண்காணிப்பு ஆகியவற்றை அனுமதிக்கிறது. இந்த ஒருங்கிணைந்த தீர்வு துல்லியத்தை மேம்படுத்துகிறது, பாதுகாப்பை அதிகரிக்கிறது, பதிலாள் வருகையை நீக்குகிறது, மேலும் பணியாளர் வருகை மற்றும் நிறுவன பணிப்பாய்வுகளை நிர்வகிப்பதற்கான திறமையான மற்றும் தொடர்பற்ற முறையை வழங்குகிறது.\n\n1.1 நிறுவனத்தின் விவரம்\n\nKOLOZEN டெக் வேர்ல்ட் பிரைவேட் லிமிடெட் என்பது மென்பொருள் மேம்பாடு, IoT தீர்வுகள் மற்றும் தரவு சார்ந்த தளங்களில் நிபுணத்துவம் பெற்ற ஒரு புதுமையான தொழில்நுட்ப நிறுவனமாகும். நவீன தொழில்நுட்பங்களைப் பயன்படுத்தி நிஜ உலகப் பிரச்சனைகளைத் தீர்க்கும் வகையில் அளவிடக்கூடிய, பாதுகாப்பான மற்றும் பயனர் நட்பு பயன்பாடுகளை உருவாக்குவதில் இந்த அமைப்பு கவனம் செலுத்துகிறது. வணிகச் செயல்பாடுகள் மற்றும் ஆட்டோமேஷனை மேம்படுத்த ஆராய்ச்சி சார்ந்த மேம்பாடு மற்றும் செயற்கை நுண்ணறிவின் நடைமுறைச் செயலாக்கத்திற்கு நிறுவனம் முக்கியத்துவம் அளிக்கிறது.\n\nவலைப் பயன்பாட்டு மேம்பாடு, மொபைல் பயன்பாட்டு மேம்பாடு, AI அடிப்படையிலான அமைப்புகள் மற்றும் நிறுவன மென்பொருள் தீர்வுகள் போன்ற துறைகளில் நிறுவனம் தொழில்நுட்ப தீர்வுகளை வழங்குகிறது. தரம், புதுமை மற்றும் நம்பகத்தன்மைக்கு வலுவான அர்ப்பணிப்புடன், KOLOZEN டெக் வேர்ல்ட் பிரைவேட் லிமிடெட் உற்பத்தித்திறன் மற்றும் செயல்பாட்டுத் திறனை மேம்படுத்தும் திறமையான டிஜிட்டல் தீர்வுகளை வழங்குவதை நோக்கமாகக் கொண்டுள்ளது. AI அடிப்படையிலான முக அங்கீகார வருகைத் தளங்கள் போன்ற அறிவார்ந்த அமைப்புகளின் மேம்பாட்டையும் இந்த அமைப்பு ஊக்குவிக்கிறது, இது நிறுவனங்கள் பணியாளர் கண்காணிப்பை தானியங்குபடுத்தவும், பாதுகாப்பை மேம்படுத்தவும் மற்றும் பணியாளர் மேலாண்மையை நெறிப்படுத்தவும் உதவுகிறது.\n\n1.2 திட்டத்தின் மேலோட்டம்\n\nAI அடிப்படையிலான முக அடையாள உள்நுழைவு மற்றும் வருகைப் பதிவு அமைப்பு என்பது, செயற்கை நுண்ணறிவைப் பயன்படுத்தி ஊழியர்களின் அங்கீகாரம் மற்றும் வருகைப் பதிவைக் கண்காணிக்கும் ஒரு புத்திசாலித்தனமான செயலியாகும். இந்த அமைப்பு ஒரு மையப்படுத்தப்பட்ட தளத்தை வழங்குகிறது, அங்கு ஊழியர்களின் உள்நுழைவு, வருகைப் பதிவுகள், விடுப்பு கோரிக்கைகள், கூட்டங்கள் மற்றும் திட்டப் பணிகள் அனைத்தும் ஒரே ஒருங்கிணைந்த சூழலில் நிர்வகிக்கப்படுகின்றன. பாரம்பரிய வருகைப் பதிவு முறைகளுக்குப் பதிலாக, இந்த அமைப்பு துல்லியத்தை மேம்படுத்துகிறது, கைமுறை வேலையைக் குறைக்கிறது மற்றும் ஒட்டுமொத்த பணியாளர் நிர்வாகத்தை மேம்படுத்துகிறது.\n\nபல நிறுவனங்களில், வருகைப்பதிவு கையேடு பதிவேடுகள், அடையாள அட்டைகள் அல்லது கைரேகை சாதனங்கள் மூலம் பதிவு செய்யப்படுகிறது. இந்த முறைகள் பாதுகாப்பற்றவை, பதிலாள் வருகையை அனுமதிக்கின்றன, மேலும் கூடுதல் பராமரிப்பு தேவைப்படுகிறது. வருகை தரவை கைமுறையாக நிர்வகிப்பது நேரத்தை எடுத்துக்கொள்வது மற்றும் பகுப்பாய்வு செய்வது கடினம். முன்மொழியப்பட்ட அமைப்பு, AI அடிப்படையிலான முக அங்கீகாரத்தைப் பயன்படுத்தி ஊழியர்களை அடையாளம் கண்டு, நிகழ்நேரத்தில் வருகையை தானாகவே பதிவு செய்வதன் மூலம் இந்த சவால்களை எதிர்கொள்கிறது. இந்த அமைப்பு சாதன கேமராவைப் பயன்படுத்தி ஊழியரின் முகத்தைப் படம்பிடித்து, பயிற்சி பெற்ற AI மாதிரிகளைப் பயன்படுத்தி அடையாளத்தைச் சரிபார்த்து, உள்ளே வரும் நேரம், வெளியேறும் நேரம் மற்றும் வேலை நேரங்களை தானாகவே பதிவு செய்கிறது.\n\nஇந்த அமைப்பில் நிர்வாகி மற்றும் ஊழியர்கள் இருவருக்கும் பங்கு அடிப்படையிலான டாஷ்போர்டுகளும் அடங்கும். ஊழியர்கள் முக அங்கீகாரத்தைப் பயன்படுத்தி உள்நுழையலாம், வருகை விவரங்களைப் பார்க்கலாம், விடுப்புக்கு விண்ணப்பிக்கலாம், சந்திப்பு அட்டவணைகளைச் சரிபார்க்கலாம், ஒதுக்கப்பட்ட திட்டங்களைக் கண்காணிக்கலாம் மற்றும் பகுப்பாய்வு மூலம் செயல்திறனைக் கண்காணிக்கலாம். நிர்வாகப் பயனர்கள் ஊழியர்களை நிர்வகிக்கலாம், திட்டங்களை ஒதுக்கலாம், சந்திப்புகளை திட்டமிடலாம், விடுப்பு கோரிக்கைகளை அங்கீகரிக்கலாம் மற்றும் வருகை புள்ளிவிவரங்களைக் கண்காணிக்கலாம். இந்த ஒருங்கிணைந்த அணுகுமுறை வெளிப்படைத்தன்மையை மேம்படுத்துகிறது, கைமுறை பிழைகளைக் குறைக்கிறது மற்றும் ஊழியர்களின் செயல்பாடுகளை நிகழ்நேரத்தில் கண்காணிக்கிறது.\n\nதரவுத்தள வடி	Auto	Tamil	auto	2026-07-03 10:46:19.378514
ea782ec3-b23f-4c40-8136-0dcc31d7c7a6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	AI – Based Greater Chennai Police Website and News Platform\r\n\r\nJuly 02, 2026\r\n\r\nPrepared by                                                                \r\n\r\nMCC-MRF Innovation Park                                       \r\n\r\n       Prepared for    \r\n\r\n       Chennai Guardian                                       \r\n\r\nMadras Christian College                                        Greater Chennai Police\r\n\r\nTambaram, Chennai                                                 \r\n\r\n        Vepery, Chennai   \r\n\r\nABSTRACT\r\n\r\nThe rapid advancement of information technology and digital communication has significantly transformed the way government organizations interact with citizens. In today's digital era, people expect quick access to accurate information, official announcements, and public services through online platforms. To meet these expectations, government departments are increasingly adopting web-based solutions that provide timely information and improve public engagement.\r\n\r\nThe Chennai Guardian – Greater Chennai Police News and Information Portal is a comprehensive web-based application developed to serve as an official digital communication platform for the Greater Chennai Police. The primary objective of this project is to provide a centralized portal through which citizens can access the latest police news, public safety information, official announcements, crime prevention awareness campaigns, cyber security initiatives, women safety programs, community outreach activities, and various government notifications.\r\n\r\nThe system offers a professional news portal experience similar to modern digital news channels while maintaining the standards, security, and reliability expected from a government website. The portal is designed with a user-friendly and responsive interface that ensures accessibility across desktops, tablets, and mobile devices. The website supports both English and Tamil languages, enabling a wider audience to access information conveniently.\r\n\r\nA powerful Admin Dashboard has been developed to manage the entire content of the website. The administrative panel provides features such as news article management, hero slider management, breaking news ticker management, media library, video management, web stories, SEO and Meta Tag management, and role-based access control. Administrators can easily create, edit, publish, and delete content, while all changes are automatically reflected on the public website.\r\n\r\nINTRODUCTION\r\n\r\nThe rapid growth of information technology and digital communication has significantly changed the way government organizations interact with citizens. In today's digital world, people expect immediate access to information, official announcements, and public services through online platforms. Government departments and public institutions are increasingly adopting digital solutions to improve transparency, accessibility, and communication with the public. \r\n\r\nTraditionally, police-related information such as public safety announcements, crime prevention campaigns, official activities, and government notifications was communicated through newspapers, television channels, and social media platforms. \r\n\r\nThe Chennai Guardian – Greater Chennai Police News and Information Portal have been developed to address these challenges by providing a centralized and professional web-based platform for the Greater Chennai Police. The portal enables citizens to access the latest police news, public safety information, official announcements, cyber security awareness campaigns, women safety initiatives, crime prevention programs, community outreach activities, and important government notifications from a single location. Additionally, the portal supports both English and Tamil languages, ensuring that information is accessible to a wider audience.\r\n\r\nA comprehensive Admin Dashboard has also been developed to simplify content management. The administrative system enables authorized users to manage news articles, hero sliders, breaking news tickers, media assets, videos, web stories, SEO configurations, and user permissions. All updates made through the administrative panel are automatically reflected on the public website, ensuring that information remains accurate and up to date.\r\n\r\nThe primary objective of this project is to strengthen communication between the Greater Chennai Police and the public by creating a secure, scalable, and user-friendly digital platform. The implementation of the Chennai Guardian portal contributes to improved transparency, efficient information dissemination, and enhanced public engagement while supporting the digital transformation initiatives of government organizations.\r\n\r\nPROBLEM STATEMENT AND OBJECTIVES\r\n\r\nProblem Statement\r\n\r\nIn the modern digital era, citizens expect quick and reliable access to government information through online platforms. However, traditional methods of disseminating police information such as newspapers, television, and social 	AI அடிப்படையிலான பெருநகர சென்னை காவல் இணையதளம் மற்றும் செய்தி தளம்\n\nஜூலை 02, 2026\n\nதயாரித்தவர்:\n\nMCC-MRF புத்தாக்கப் பூங்கா\n\nதயாரிக்கப்பட்டது:\n\nசென்னை கார்டியன்\n\nமெட்ராஸ் கிறிஸ்தவக் கல்லூரி\n\nதாம்பரம், சென்னை\n\nபெருநகர சென்னை காவல்\n\nவேப்பேரி, சென்னை\n\nசுருக்கம்\n\nதகவல் தொழில்நுட்பம் மற்றும் டிஜிட்டல் தகவல்தொடர்புகளின் விரைவான முன்னேற்றம், அரசு அமைப்புகள் குடிமக்களுடன் தொடர்பு கொள்ளும் விதத்தை கணிசமாக மாற்றியுள்ளது. இன்றைய டிஜிட்டல் யுகத்தில், மக்கள் துல்லியமான தகவல்கள், அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் பொதுச் சேவைகளை ஆன்லைன் தளங்கள் மூலம் விரைவாக அணுக எதிர்பார்க்கிறார்கள். இந்த எதிர்பார்ப்புகளை பூர்த்தி செய்ய, அரசுத் துறைகள் சரியான நேரத்தில் தகவல்களை வழங்கும் மற்றும் பொது ஈடுபாட்டை மேம்படுத்தும் இணைய அடிப்படையிலான தீர்வுகளை அதிகரித்து வருகின்றன.\n\nசென்னை கார்டியன் – பெருநகர சென்னை காவல் செய்தி மற்றும் தகவல் போர்டல் என்பது பெருநகர சென்னை காவல்துறைக்கான அதிகாரப்பூர்வ டிஜிட்டல் தகவல்தொடர்பு தளமாக செயல்பட உருவாக்கப்பட்ட ஒரு விரிவான இணைய அடிப்படையிலான பயன்பாடாகும். இந்த திட்டத்தின் முதன்மை நோக்கம், குடிமக்கள் சமீபத்திய காவல் செய்திகள், பொது பாதுகாப்பு தகவல்கள், அதிகாரப்பூர்வ அறிவிப்புகள், குற்றத் தடுப்பு விழிப்புணர்வு பிரச்சாரங்கள், இணைய பாதுகாப்பு முயற்சிகள், பெண்கள் பாதுகாப்பு திட்டங்கள், சமூக outreach செயல்பாடுகள் மற்றும் பல்வேறு அரசு அறிவிப்புகளை அணுகக்கூடிய ஒரு மையப்படுத்தப்பட்ட போர்ட்டலை வழங்குவதாகும்.\n\nஇந்த அமைப்பு நவீன டிஜிட்டல் செய்தி சேனல்களைப் போன்ற ஒரு தொழில்முறை செய்தி போர்டல் அனுபவத்தை வழங்குகிறது, அதே நேரத்தில் ஒரு அரசு இணையதளத்தில் எதிர்பார்க்கப்படும் தரநிலைகள், பாதுகாப்பு மற்றும் நம்பகத்தன்மையை பராமரிக்கிறது. இந்த போர்டல் ஒரு பயனர் நட்பு மற்றும் பதிலளிக்கக்கூடிய இடைமுகத்துடன் வடிவமைக்கப்பட்டுள்ளது, இது டெஸ்க்டாப்புகள், டேப்லெட்டுகள் மற்றும் மொபைல் சாதனங்கள் முழுவதும் அணுகலை உறுதி செய்கிறது. இந்த இணையதளம் ஆங்கிலம் மற்றும் தமிழ் ஆகிய இரு மொழிகளையும் ஆதரிக்கிறது, இது பரந்த பார்வையாளர்களுக்கு தகவல்களை வசதியாக அணுக உதவுகிறது.\n\nஇணையதளத்தின் முழு உள்ளடக்கத்தையும் நிர்வகிக்க ஒரு சக்திவாய்ந்த நிர்வாக டாஷ்போர்டு உருவாக்கப்பட்டுள்ளது. நிர்வாகப் பலகம் செய்தி கட்டுரை மேலாண்மை, ஹீரோ ஸ்லைடர் மேலாண்மை, முக்கிய செய்தி டிக்கர் மேலாண்மை, மீடியா லைப்ரரி, வீடியோ மேலாண்மை, வலைக் கதைகள், SEO மற்றும் மெட்டா டேக் மேலாண்மை மற்றும் பங்கு அடிப்படையிலான அணுகல் கட்டுப்பாடு போன்ற அம்சங்களை வழங்குகிறது. நிர்வாகிகள் உள்ளடக்கத்தை எளிதாக உருவாக்கலாம், திருத்தலாம், வெளியிடலாம் மற்றும் நீக்கலாம், அதே நேரத்தில் அனைத்து மாற்றங்களும் பொது இணையதளத்தில் தானாகவே பிரதிபலிக்கப்படும்.\n\nஅறிமுகம்\n\nதகவல் தொழில்நுட்பம் மற்றும் டிஜிட்டல் தகவல்தொடர்புகளின் விரைவான வளர்ச்சி, அரசு அமைப்புகள் குடிமக்களுடன் தொடர்பு கொள்ளும் விதத்தை கணிசமாக மாற்றியுள்ளது. இன்றைய டிஜிட்டல் உலகில், மக்கள் ஆன்லைன் தளங்கள் மூலம் தகவல்கள், அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் பொதுச் சேவைகளை உடனடியாக அணுக எதிர்பார்க்கிறார்கள். அரசுத் துறைகள் மற்றும் பொது நிறுவனங்கள் வெளிப்படைத்தன்மை, அணுகல் மற்றும் பொதுமக்களுடனான தகவல்தொடர்புகளை மேம்படுத்த டிஜிட்டல் தீர்வுகளை அதிகரித்து வருகின்றன.\n\nபாரம்பரியமாக, பொது பாதுகாப்பு அறிவிப்புகள், குற்றத் தடுப்புப் பிரச்சாரங்கள், அதிகாரப்பூர்வ நடவடிக்கைகள் மற்றும் அரசு அறிவிப்புகள் போன்ற காவல்துறை தொடர்பான தகவல்கள் செய்தித்தாள்கள், தொலைக்காட்சி அலைவரிசைகள் மற்றும் சமூக ஊடக தளங்கள் மூலம் வெளியிடப்பட்டன.\n\nசென்னை காவல்துறை - பெருநகர சென்னை காவல்துறை செய்தி மற்றும் தகவல் வலைத்தளம், பெருநகர சென்னை காவல்துறைக்கு ஒரு மையப்படுத்தப்பட்ட மற்றும் தொழில்முறை வலை அடிப்படையிலான தளத்தை வழங்குவதன் மூலம் இந்த சவால்களை எதிர்கொள்ள உருவாக்கப்பட்டுள்ளது. இந்த வலைத்தளம் குடிமக்கள் சமீபத்திய காவல்துறை செய்திகள், பொது பாதுகாப்பு தகவல்கள், அதிகாரப்பூர்வ அறிவிப்புகள், இணைய பாதுகாப்பு விழிப்புணர்வு பிரச்சாரங்கள், பெண்கள் பாதுகாப்பு முயற்சிகள், குற்ற தடுப்பு திட்டங்கள், சமூக outreach நடவடிக்கைகள் மற்றும் முக்கியமான அரசு அறிவிப்புகளை ஒரே இடத்தில் இருந்து அணுக உதவுகிறது. கூடுதலாக, இந்த வலைத்தளம் ஆங்கிலம் மற்றும் தமிழ் ஆகிய இரு மொழிகளிலும் தகவல்களை வழங்குகிறது, இதன் மூலம் பரந்த பார்வையாளர்களுக்கு தகவல்கள் சென்றடைவதை உறுதி செய்கிறது.\n\nஉள்ளடக்க நிர்வாகத்தை எளிதாக்க ஒரு விரிவான நிர்வாக டாஷ்போர்டும் உருவாக்கப்பட்டுள்ளது. இந்த நிர்வாக அமைப்பு அங்கீகரிக்கப்பட்ட பயனர்கள் செய்தி கட்டுரைகள், ஹீரோ ஸ்லைடர்கள், பிரேக்கிங் நியூஸ் டிக்கர்கள், மீடியா சொத்துக்கள், வீடியோக்கள், வலை கதைகள், SEO உள்ளமைவுகள் மற்றும் பயனர் அனுமதிகளை நிர்வகிக்க உதவுகிறது. நிர்வாக குழு மூலம் செய்யப்படும் அனைத்து புதுப்பிப்புகளும் பொது வலைத்தளத்தில் தானாகவே பிரதிபலிக்கின்றன, இதன் மூலம் தகவல்கள் துல்லியமாகவும் புதுப்பித்த நிலையிலும் இருப்பதை உறுதி செய்கிறது.\n\nஇந்த திட்டத்தின் முதன்மை நோக்கம், பாதுகாப்பான, அளவிடக்கூடிய மற்றும் பயனர் நட்பு டிஜிட்டல் தளத்தை உருவாக்குவதன் மூலம் பெருநகர சென்னை காவல்துறைக்கும் பொதுமக்களுக்கும் இடையிலான தொடர்பை வலுப்படுத்துவதாகும். சென்னை காவல்துறை வலைத்தளத்தின் அமலாக்கம் மேம்பட்ட வெளிப்படைத்தன்மை, திறமையான தகவல் பரவல் மற்றும் மேம்பட்ட பொது ஈடுபாட்டிற்கு பங்களிக்கிறது, அதே நேரத்தில் அரசு நிறுவனங்களின் டிஜிட்டல் மாற்ற முயற்சிகளுக்கும் ஆதரவளிக்கிறது.\n\nசிக்கல் அறிக்கை மற்றும் நோக்கங்கள்\n\nசிக்கல் அறிக்கை\n\nநவீன டிஜிட்டல் யுகத்தில், குடிமக்கள் ஆன்லைன் தளங்கள் மூலம் அரசு தகவல்களை விரைவாகவும் நம்பகத்தன்மையுடனும் அணுக எதிர்பார்க்கிறார்கள். இருப்பினும், செய்தித்தாள்கள், தொலைக்காட்சி மற்றும் சமூக ஊடகங்கள் ப	Auto	Tamil	auto	2026-07-07 06:25:21.536547
c7abd00a-58c6-413f-93f4-6e4a72274bbd	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto	Tamil	auto	2026-07-10 06:01:22.375439
f5aacaec-8441-4396-a19b-6c694537d279	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	வணக்கம்	Auto	Tamil	auto	2026-07-10 06:08:08.453776
51b73f50-22f9-4030-b180-1f9f206905d6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	ljklhjkghfjghddghjkk	ல்ஜ்க்ல்ஹ்ஜ்கேஹ்ஜ்கேஎஹ்ஜ்கேடிடிஜிஹ்ஜ்கேகே	Auto	Tamil	auto	2026-07-10 06:08:49.681109
\.


--
-- Data for Name: tts_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tts_history (id, tenant_id, user_id, text, voice_name, characters_count, file_path, provider, created_at) FROM stdin;
15006e45-5f63-45c8-857e-f777c56ca03c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Alembic ???????????????????, ???????????? ???????? ????????????????? ?????? ?????? PostgreSQL ??????????? ????????????? ????????????.	alloy	133		openai	2026-06-26 11:39:30.623
1c90fe07-24b1-41f9-8c65-1f4c9ad62f54	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-06-22 10:44:10.153
343d9273-bca2-4f42-8af1-4b787d1616aa	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-06-25 19:27:29.087
707cf4ae-8d12-44b0-84b7-50e11ada1206	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	?????? ???? ?????? ????? ?????	alloy	30		openai	2026-06-26 11:40:43.24
78635094-497b-46d3-8a0d-9f2abfc7fdcc	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	??????? ???? ???????	alloy	20		openai	2026-06-26 11:41:14.427
9c3417bc-411b-466f-8c0a-28b651e03b33	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	???????????????·????	alloy	20		openai	2026-06-26 11:40:38.113
d9bc9a95-2df5-4564-9fab-540934030094	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	????? ???? ?????	alloy	16		openai	2026-06-26 11:42:08.477
fc727976-165d-4cc0-99e3-1fa85b8338b6	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	??????? ????????????? ?????? (?????????) ???????? ????????????.	alloy	63		openai	2026-06-25 18:03:10.587
1f97c508-3f4f-407e-9e00-963b08578b30	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello praveen	Microsoft David - English (United States)	13		openai	2026-06-27 17:09:45.002993
48d6f799-44d6-4964-b223-904fad947dca	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	வணக்கம், காலை வணக்கம்	alloy	21		openai	2026-06-29 12:39:17.443088
c66b60f7-8093-4213-b778-57c5943a89d7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	வணக்கம் காலை வணக்கம்	alloy	20		openai	2026-06-29 12:51:00.729319
84961702-250c-470f-a934-2587ffb5a6e7	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	வணக்கம்	alloy	7		openai	2026-06-29 12:56:59.304775
b9b70a44-fbdc-458c-aa3f-6ea9a9ab7fe8	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	مرحباً أنا ليو	alloy	14		openai	2026-06-30 05:09:05.498849
8fef48f9-8cee-455c-83bc-a01b0a841311	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-06-30 13:10:06.741533
dca5e6b5-594d-40d3-a918-7506042f7387	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	The Future of Artificial Intelligence\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.\r\nLooking ahead, AI is expected to become even more integrated into daily life. Smart assistants, autonomous vehicles, and intelligent business systems will continue to evolve. Success will depend not only on technological innovation but also on responsible development that prioritizes human values and societal well-being.\r\nIn conclusion, Artificial Intelligence offers tremendous opportunities for innovation and growth. By balancing technological advancement with ethical responsibility, society can harness the power of AI to improve quality of life, increase productivity, and create new possibilities for future generations.\r\nArtificial Intelligence (AI) has become one of the most transformative technologies of the modern era. It is being used across industries to improve efficiency, automate repetitive tasks, and support better decision-making. From healthcare to education, AI is helping professionals solve complex problems faster than ever before.\r\nOne of the greatest advantages of AI is its ability to process large amounts of data in a short period of time. Businesses use AI to analyze customer behavior, predict trends, and optimize operations. Hospitals use AI-powered systems to assist doctors in diagnosing diseases, while financial institutions rely on AI to detect fraud and manage risks.\r\nEducation has also benefited significantly from AI. Personalized learning platforms can adapt lessons to individual students, helping them learn at their own pace. Teachers can automate grading, generate learning materials, and identify students who may need additional support. This allows educators to focus more on teaching and mentoring.\r\nDespite its many benefits, AI also presents challenges. Privacy concerns, ethical issues, and the potential impact on employment require careful consideration. Governments, organizations, and technology companies must work together to establish responsible AI policies that ensure transparency, fairness, and accountability.	Microsoft David - English (United States)	3370		openai	2026-06-30 13:15:17.150395
5ff4779d-f83a-41a9-a08c-7202c5c26ada	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	Looking ahead, AI is expected to become even more integrated into daily life. Smart assistants, autonomous vehicles, and intelligent business systems will continue to evolve. Success will depend not only on technological innovation but also on responsible development that prioritizes human values and societal well-being.\r\nIn conclusion, Artificial Intelligence offers tremendous opportunities for innovation and growth. By balancing technological advancement with ethical responsibility, society can harness the power of AI to improve quality of life, increase productivity, and create new possibilities for future generations.	Microsoft David - English (United States)	629		openai	2026-06-30 13:19:47.168934
8a0578ef-8d36-4fe6-90df-76a94e731f8b	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello nancy	Microsoft David - English (United States)	11		openai	2026-06-30 13:42:03.671831
97047363-7940-4c5f-ae16-790d19f62b27	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 06:49:35.477447
b68173ec-d93e-4c33-acda-60731cd9e12f	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 06:49:39.806949
17ad55da-55ee-4a70-840c-d7db6eecb237	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 06:52:20.75641
18ad69e5-12a9-4a66-969a-e1b2feaf693a	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 08:13:09.900993
b1262c4c-ae78-405c-b937-b12bd7e8f9c3	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 08:20:07.548365
855aaf29-b889-4807-9d9b-6d9dc8191d9c	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	hello	Microsoft David - English (United States)	5		openai	2026-07-01 08:20:07.798567
0cf2dd4d-f1dd-495c-a4ba-062381126ba0	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	plot	Microsoft David - English (United States)	4		openai	2026-07-01 10:22:21.880977
fc503766-9287-4213-9a0c-a0a138116234	59ffc06a-a098-4c42-9cb7-8df23cbae806	5412749a-2ba3-414d-86c7-e325710f9f76	plot	Microsoft David - English (United States)	4		openai	2026-07-01 10:22:30.479264
\.


--
-- Data for Name: usage_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usage_tracking (id, tenant_id, audio_minutes_used, translation_chars_used, tts_chars_used, api_calls_used, storage_bytes_used, billing_period_start, billing_period_end, updated_at) FROM stdin;
06f527f2-b64f-4f89-9da2-7b499ec8726b	6e54121c-f05c-4e9c-89bb-ff251631d75a	0	0	0	0	0	2026-06-24 05:36:58.423	2026-07-24 05:36:58.423	2026-06-24 05:36:58.423
11480778-ed80-486e-81cf-06ae65fd66cd	6d7a4b69-7143-42be-aa65-b6ebe7d11f57	0	0	0	0	0	2026-06-26 05:02:16.137	2026-07-26 05:02:16.137	2026-06-26 05:02:16.137
1a350daa-b613-4a23-848a-a53702165571	80ce2467-e021-461a-bb93-f60432583032	0	0	0	0	0	2026-06-24 18:17:00.787	2026-07-24 18:17:00.787	2026-06-24 18:17:00.787
3117f2d9-0b39-4da4-907f-c13419af7bf5	eefc685a-4359-421b-b5a6-812b976bf372	0	0	0	0	0	2026-06-26 05:15:35.263	2026-07-26 05:15:35.263	2026-06-26 05:15:35.263
49da70f9-1497-4695-87d5-f17b6ffe74a5	6e1bf4cd-639c-4112-8681-57fdf6a2793b	0	0	0	0	0	2026-06-24 18:01:45.9	2026-07-24 18:01:45.9	2026-06-24 18:01:46.513
86564237-6ac2-4bc5-8bc1-4a97481021e4	771743ea-a1ad-47f3-9467-74f925fc2725	0	0	0	0	0	2026-06-24 17:48:18.697	2026-07-24 17:48:18.697	2026-06-24 17:48:20.487
a449142b-4f14-4cc7-94ab-d88d313a017a	58afbbe1-aa38-45a0-b546-52981be67c00	0	0	0	0	0	2026-06-28 17:31:46.49399	2026-07-28 17:31:46.49399	2026-06-28 17:31:46.733445
74088045-38bb-4489-b380-a181f32150f0	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	0	0	0	0	0	2026-06-24 17:32:57.97	2026-07-24 17:32:57.97	2026-07-03 09:57:00.386712
8b07fcc0-1a0b-4d74-98e4-1be05e36dd4b	4580e056-5929-4cd4-bf6e-6ee2e44749ff	0	0	0	0	0	2026-06-22 06:16:10.357	2026-07-22 06:16:10.357	2026-07-03 09:57:00.386712
5c259435-034a-4f7f-bd10-e90d3f978811	b3925813-0140-477b-84e4-076f28f1daa4	0	1166401	0	5	0	2026-07-03 09:45:09.581202	2026-08-02 09:45:09.581202	2026-07-03 10:46:19.395163
49810f50-6090-470a-8a4a-4a41bb56177a	59ffc06a-a098-4c42-9cb7-8df23cbae806	0	25	0	2	0	2026-07-10 06:06:46.966146	2026-08-09 06:06:46.966146	2026-07-10 06:08:49.700942
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, tenant_id, name, email, password_hash, role, status, last_login, created_at, updated_at) FROM stdin;
20e62d6f-d5a5-40d8-8869-d5d8028d63b1	771743ea-a1ad-47f3-9467-74f925fc2725	Pravinn	praveenrock2609@gmail.com	$2b$12$FVbORrA9u0lnuQrNS83nSOsbwCYNjXcsua.ua/N3dH4nJZGluNVdm	tenant_admin	active	2026-06-24 17:47:45.61	2026-06-24 17:47:00.167	2026-06-24 17:47:45.973
21c57def-9578-446d-9ce6-f020c6b4afed	58afbbe1-aa38-45a0-b546-52981be67c00	thomas	nancynarmadha512@gmail.com	$2b$12$e3d1RhuzWZtF.F.S/L4XQujze8JuCKjJ4YTYpD0B2/qXFazH1ssI.	tenant_admin	active	2026-06-24 17:42:33.757	2026-06-24 17:41:05.083	2026-06-24 17:42:33.823
8bd1e61e-ad97-4531-8115-e7bc702bfe1c	6d6f0256-4dad-42c9-a0f0-aea21ec76b83	Pravin	praveen.natarajan.in@gmail.com	$2b$12$/j1txqBuBtxOQbl0l2LSSerbRV2cKzlqmmYPc7sbdncJIPlzDhe2.	tenant_admin	active	2026-06-24 17:33:27.633	2026-06-24 17:32:58.067	2026-06-24 17:33:27.69
8ea4fd36-2b3c-4bcd-b0b0-a589b802da3a	6d7a4b69-7143-42be-aa65-b6ebe7d11f57	Raghul	prasathragul75@gmail.com	$2b$12$dmviXiA0bUihkl8Aj6pRjOZjr236QH8EQruktCusCdUO.uQfd293m	tenant_admin	active	2026-06-26 05:03:23.313	2026-06-26 05:02:16.227	2026-06-26 05:03:23.667
be3f979a-8521-49ec-8bbe-717da7aba277	eefc685a-4359-421b-b5a6-812b976bf372	Raghu	unfortunately2909@gmail.com	$2b$12$id2b/j281xDhuCVamDOsx..24PMWlTVW519PoSKrk8LxvNWuew/hW	tenant_admin	active	2026-06-26 05:16:32.193	2026-06-26 05:15:35.38	2026-06-26 05:16:32.223
c9ea7b7d-eff2-4de5-9f17-0b339905dae4	\N	Nancy	aachinancy@gmail.com	$2b$12$uu7bZSVEuOzevccn3ODHq.VH5P8R6EG6lzpQHJJAcc516nQDrPx1m	super_admin	active	2026-07-10 05:54:08.053035	2026-06-16 05:10:34.72	2026-07-10 05:54:08.924034
5412749a-2ba3-414d-86c7-e325710f9f76	59ffc06a-a098-4c42-9cb7-8df23cbae806	Nancy	nancythomasselva@gmail.com	$2b$12$LIGKwWEwpkAG05GGEWcX6OOF52O/mL1Ewah3PbUGmQVwmrY7wvyNu	tenant_admin	active	2026-07-10 05:57:53.93657	2026-06-20 07:26:29.427	2026-07-10 05:57:54.205346
3a0e587e-f249-42a9-a417-96df2d03579e	6e54121c-f05c-4e9c-89bb-ff251631d75a	Anto	antorajan501@gmail.com	$2b$12$gktqtmi3c0ohOmt0gnmoCOjd8suA43db7p6iuQL7JWFibSQ8CTEcW	tenant_admin	active	\N	2026-06-24 05:36:58.52	2026-07-02 05:24:09.805285
95940c85-31ca-4fe8-932a-1a91c529e824	\N	sharon	liliana.manohar@gmail.com	$2b$12$2aLfDG7sapzgX8d2FfKzHeBDtfo/WYIPltENtOKVOTLfaCqEmZ7rO	super_admin	active	2026-06-30 19:24:03.807621	2026-06-29 17:06:31.269467	2026-06-30 19:24:03.914904
934e8b21-2231-46a4-afc8-08314da3e7e3	b3925813-0140-477b-84e4-076f28f1daa4	yeshwanth	yeshwanthy1504@gmail.com	$2b$12$l1X.8uGRd7AhvJE/l7Tvre1JorJHF70/FI3QTkElUfjOrrT/Uo3vy	tenant_admin	active	2026-07-03 09:45:50.434573	2026-07-03 09:45:09.705164	2026-07-03 09:45:50.451588
\.


--
-- Data for Name: website_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.website_pages (id, tenant_id, slug, title, subtitle, is_active, "order", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: website_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.website_sections (id, page_id, section_type, title, subtitle, content, image_url, video_url, button_text, button_link, metadata_json, "order", is_active) FROM stdin;
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: billing_settings billing_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_settings
    ADD CONSTRAINT billing_settings_pkey PRIMARY KEY (id);


--
-- Name: branding_settings branding_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_pkey PRIMARY KEY (id);


--
-- Name: custom_forms custom_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_forms
    ADD CONSTRAINT custom_forms_pkey PRIMARY KEY (id);


--
-- Name: dashboard_widgets dashboard_widgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_pkey PRIMARY KEY (id);


--
-- Name: document_intelligence document_intelligence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_intelligence
    ADD CONSTRAINT document_intelligence_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: feature_provider_mapping feature_provider_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_provider_mapping
    ADD CONSTRAINT feature_provider_mapping_pkey PRIMARY KEY (id);


--
-- Name: invoice_history invoice_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_history
    ADD CONSTRAINT invoice_history_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: media_library media_library_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_library
    ADD CONSTRAINT media_library_pkey PRIMARY KEY (id);


--
-- Name: navigation_items navigation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: provider_configurations provider_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_configurations
    ADD CONSTRAINT provider_configurations_pkey PRIMARY KEY (id);


--
-- Name: provider_logs provider_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_logs
    ADD CONSTRAINT provider_logs_pkey PRIMARY KEY (id);


--
-- Name: smtp_settings smtp_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smtp_settings
    ADD CONSTRAINT smtp_settings_pkey PRIMARY KEY (id);


--
-- Name: subscription_history subscription_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_history
    ADD CONSTRAINT subscription_history_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_name_key UNIQUE (name);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tenant_branding tenant_branding_custom_domain_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_custom_domain_key UNIQUE (custom_domain);


--
-- Name: tenant_branding tenant_branding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_pkey PRIMARY KEY (id);


--
-- Name: tenant_branding tenant_branding_tenant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_tenant_id_key UNIQUE (tenant_id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_slug_key UNIQUE (slug);


--
-- Name: test_table2 test_table2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_table2
    ADD CONSTRAINT test_table2_pkey PRIMARY KEY (id);


--
-- Name: theme_settings theme_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.theme_settings
    ADD CONSTRAINT theme_settings_pkey PRIMARY KEY (id);


--
-- Name: transcription_history transcription_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcription_history
    ADD CONSTRAINT transcription_history_pkey PRIMARY KEY (id);


--
-- Name: translation_history translation_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translation_history
    ADD CONSTRAINT translation_history_pkey PRIMARY KEY (id);


--
-- Name: tts_history tts_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_history
    ADD CONSTRAINT tts_history_pkey PRIMARY KEY (id);


--
-- Name: usage_tracking usage_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: website_pages website_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_pages
    ADD CONSTRAINT website_pages_pkey PRIMARY KEY (id);


--
-- Name: website_sections website_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_sections
    ADD CONSTRAINT website_sections_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_tenant_id ON public.audit_logs USING btree (tenant_id);


--
-- Name: idx_audit_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_invoices_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_invoice_number ON public.invoices USING btree (invoice_number);


--
-- Name: idx_invoices_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_tenant_id ON public.invoices USING btree (tenant_id);


--
-- Name: idx_subscriptions_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_tenant_id ON public.subscriptions USING btree (tenant_id);


--
-- Name: idx_tenants_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenants_slug ON public.tenants USING btree (slug);


--
-- Name: idx_transcription_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transcription_user_id ON public.transcription_history USING btree (user_id);


--
-- Name: idx_translation_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_translation_user_id ON public.translation_history USING btree (user_id);


--
-- Name: idx_tts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tts_user_id ON public.tts_history USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_tenant_id ON public.users USING btree (tenant_id);


--
-- Name: audit_logs audit_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: billing_settings billing_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_settings
    ADD CONSTRAINT billing_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: branding_settings branding_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: custom_forms custom_forms_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_forms
    ADD CONSTRAINT custom_forms_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: dashboard_widgets dashboard_widgets_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: document_intelligence document_intelligence_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_intelligence
    ADD CONSTRAINT document_intelligence_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: email_logs email_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: email_templates email_templates_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: feature_flags feature_flags_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: invoice_history invoice_history_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_history
    ADD CONSTRAINT invoice_history_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: invoice_history invoice_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_history
    ADD CONSTRAINT invoice_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: invoices invoices_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: media_library media_library_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_library
    ADD CONSTRAINT media_library_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: navigation_items navigation_items_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: payment_transactions payment_transactions_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: payment_transactions payment_transactions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: payments payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id);


--
-- Name: platform_settings platform_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: provider_configurations provider_configurations_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_configurations
    ADD CONSTRAINT provider_configurations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: smtp_settings smtp_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smtp_settings
    ADD CONSTRAINT smtp_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: subscription_history subscription_history_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_history
    ADD CONSTRAINT subscription_history_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: subscription_history subscription_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_history
    ADD CONSTRAINT subscription_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: subscriptions subscriptions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_branding tenant_branding_branding_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_branding_id_fkey FOREIGN KEY (branding_id) REFERENCES public.branding_settings(id);


--
-- Name: tenant_branding tenant_branding_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_branding tenant_branding_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_branding
    ADD CONSTRAINT tenant_branding_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.theme_settings(id);


--
-- Name: tenants tenants_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE SET NULL;


--
-- Name: theme_settings theme_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.theme_settings
    ADD CONSTRAINT theme_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: transcription_history transcription_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcription_history
    ADD CONSTRAINT transcription_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: transcription_history transcription_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcription_history
    ADD CONSTRAINT transcription_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: translation_history translation_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translation_history
    ADD CONSTRAINT translation_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: translation_history translation_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translation_history
    ADD CONSTRAINT translation_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tts_history tts_history_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_history
    ADD CONSTRAINT tts_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tts_history tts_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_history
    ADD CONSTRAINT tts_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: usage_tracking usage_tracking_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: users users_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: website_pages website_pages_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_pages
    ADD CONSTRAINT website_pages_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: website_sections website_sections_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.website_sections
    ADD CONSTRAINT website_sections_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.website_pages(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict WTb29TlhZIpUaaid0vylYmOEUFuMp2qLgKqIZ2nUDRMRZAbtHvWmVB60UNheKD0

