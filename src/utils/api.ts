import { storage } from "../utils/storage";

const API_BASE = "/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = storage.getItem("mcc-ai-token");
  
  // Try to get tenant slug from dedicated key first, then fall back to user profile
  let tenantSlug = storage.getItem("mcc-ai-tenant-slug");
  if (!tenantSlug) {
    // Fallback: read from user profile object
    try {
      const userStr = localStorage.getItem("mcc-ai-user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        tenantSlug = userObj?.tenant_slug || null;
        // If we recovered the slug, save it back to the dedicated key
        if (tenantSlug) {
          localStorage.setItem("mcc-ai-tenant-slug", tenantSlug);
        }
      }
    } catch (_) {}
  }

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (tenantSlug) {
    headers.set("x-tenant-slug", tenantSlug);
  }

  // Set Content-Type only if body is not FormData (FormData handles its own boundaries)
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // Check if content-type is json before parsing
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}
