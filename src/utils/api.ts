const API_BASE = "http://127.0.0.1:8000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem("mcc-ai-token");
  const tenantSlug = localStorage.getItem("mcc-ai-tenant-slug");

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
