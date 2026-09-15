export type ScreenId = "auth" | "loading" | "error" | "workbench";

const screenMap: Record<ScreenId, string> = {
  auth: "auth-screen",
  loading: "loading-screen",
  error: "error-screen",
  workbench: "workbench-screen",
};

export function showScreen(id: ScreenId): void {
  for (const [key, elId] of Object.entries(screenMap)) {
    const el = document.getElementById(elId);
    if (!el) continue;
    el.classList.toggle("hidden", key !== id);
  }
}

export function setLoadingMessage(msg: string): void {
  const el = document.getElementById("loading-message");
  if (el) el.textContent = msg;
}

export function setErrorMessage(msg: string): void {
  const el = document.getElementById("error-message");
  if (el) el.textContent = msg;
}

export function setAuthError(msg: string | null): void {
  const el = document.getElementById("auth-error");
  if (!el) return;
  if (!msg) {
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.classList.remove("hidden");
  el.textContent = msg;
}

export function setStatus(text: string, kind: "idle" | "online" | "offline" = "idle"): void {
  const el = document.getElementById("shell-status");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("online", "offline");
  if (kind === "online") el.classList.add("online");
  if (kind === "offline") el.classList.add("offline");
}

export function getWorkbenchFrame(): HTMLIFrameElement | null {
  return document.getElementById("workbench-frame") as HTMLIFrameElement | null;
}
