import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://127.0.0.1:8000';

const DEFAULT_GLOBAL_CONFIG = {
  branding: {
    platform_name: "Fluentia",
    tagline: "Language Platform",
    logo_url: "/logo.png",
    logo_size: "32px",
    logo_position: "left",
    favicon_url: "",
    app_icon_url: "",
    footer_text: "Powering Next-Gen AI",
    copyright_text: "© 2026 Fluentia. All rights reserved."
  },
  theme: {
    mode: "dark",
    primary_color: "#2563EB",
    secondary_color: "#4F46E5",
    accent_color: "#06B6D4",
    success_color: "#10B981",
    warning_color: "#F59E0B",
    error_color: "#EF4444",
    font_family: "Inter",
    border_radius: "16px"
  },
  platform: {
    invite_only: false,
    enable_email_login: true,
    enable_google_login: true,
    allowed_document_extensions: ".doc,.docx,.xls,.xlsx"
  },
  navigation: [],
  features: [],
  pages: []
};

const DEFAULT_PLANS = [
  {
    id: "free-plan-default",
    name: "Free",
    price: 0.0,
    transcription_limit: 15,
    translation_limit: 10000,
    tts_limit: 5000,
    storage_limit: 50,
    active: true,
    features: ["audio_processing", "translation_services", "text_to_speech", "cloud_storage", "document_intelligence"]
  },
  {
    id: "starter-plan-default",
    name: "Starter",
    price: 19.0,
    transcription_limit: 60,
    translation_limit: 100000,
    tts_limit: 50000,
    storage_limit: 500,
    active: true,
    features: ["audio_processing", "translation_services", "text_to_speech", "cloud_storage", "document_intelligence"]
  },
  {
    id: "pro-plan-default",
    name: "Professional",
    price: 49.0,
    transcription_limit: 300,
    translation_limit: 500000,
    tts_limit: 250000,
    storage_limit: 2000,
    active: true,
    features: ["audio_processing", "translation_services", "text_to_speech", "cloud_storage", "document_intelligence"]
  }
];

async function handleProxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await props.params;
  const pathArr = resolvedParams?.path || [];
  const pathStr = pathArr.join('/');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/api/${pathStr}${searchParams}`;

  const reqHeaders = new Headers(req.headers);
  reqHeaders.delete('host');

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();
    
    const res = await fetch(targetUrl, {
      method: req.method,
      headers: reqHeaders,
      body,
      cache: 'no-store'
    });

    const resHeaders = new Headers(res.headers);
    resHeaders.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    const resBody = await res.arrayBuffer();
    return new NextResponse(resBody, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders
    });
  } catch (_err) {
    // Connection to backend failed or timed out (backend offline or starting up)
    const normalizedPath = pathStr.replace(/_/g, '-');

    if (normalizedPath === 'platform-builder/global-config') {
      return NextResponse.json(DEFAULT_GLOBAL_CONFIG, { status: 200 });
    }
    if (normalizedPath === 'billing/plans') {
      return NextResponse.json(DEFAULT_PLANS, { status: 200 });
    }
    if (normalizedPath === 'health') {
      return NextResponse.json({ status: "ok", engine: "fallback" }, { status: 200 });
    }

    return NextResponse.json(
      { detail: "Backend service connection unavailable. Please start backend service." },
      { status: 503 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
