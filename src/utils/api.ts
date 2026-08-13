import { storage } from "../utils/storage";

const API_BASE = "/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = storage.getItem("mcc-ai-token");
  
  let tenantSlug = storage.getItem("mcc-ai-tenant-slug");
  if (!tenantSlug) {
    try {
      const userStr = localStorage.getItem("mcc-ai-user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        tenantSlug = userObj?.tenant_slug || null;
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

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        storage.removeItem("mcc-ai-token");
        storage.removeItem("mcc-ai-user");
        storage.removeItem("mcc-ai-refresh-token");
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent("mcc-ai-unauthorized"));
        }
      }
      let errorMsg = `API Error (${response.status}): ${response.statusText}`;
      try {
        const text = await response.text();
        if (text) {
          try {
            const errData = JSON.parse(text);
            errorMsg = errData.detail || errData.message || errorMsg;
          } catch (_) {
            errorMsg = text;
          }
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error: any) {
    if (error?.message !== "Could not validate credentials" && !error?.message?.includes("401")) {
      console.warn(`[API] Request failed for ${endpoint}:`, error?.message || error);
    }
    throw error;
  }
}
