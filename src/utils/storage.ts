export const isAdminPath = () => typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

export const getStorageKey = (key: string) => {
  if (!key.startsWith("mcc-ai-")) return key;
  return isAdminPath() ? key.replace("mcc-ai-", "mcc-ai-admin-") : key;
};

export const storage = {
  getItem: (key: string) => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return null;
    return localStorage.getItem(getStorageKey(key));
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    localStorage.setItem(getStorageKey(key), value);
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    localStorage.removeItem(getStorageKey(key));
  },
};
