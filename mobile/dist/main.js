/**
 * Phase 02 production shell (plain JS).
 * Mirrors src/*.ts — works with or without Capacitor native bridges.
 */
const WORKBENCH_URL = "https://vscode.dev";
const STORAGE_KEY = "mmi.sessionToken";
const LOAD_TIMEOUT_MS = 45000;

const screenMap = {
  auth: "auth-screen",
  loading: "loading-screen",
  error: "error-screen",
  workbench: "workbench-screen",
};

let loadTimer = null;
let workbenchLoaded = false;
let nativePrefs = null;
let nativeApp = null;
let nativeNetwork = null;
let isNative = false;

function showScreen(id) {
  for (const [key, elId] of Object.entries(screenMap)) {
    const el = document.getElementById(elId);
    if (el) el.classList.toggle("hidden", key !== id);
  }
}

function setLoadingMessage(msg) {
  const el = document.getElementById("loading-message");
  if (el) el.textContent = msg;
}

function setErrorMessage(msg) {
  const el = document.getElementById("error-message");
  if (el) el.textContent = msg;
}

function setAuthError(msg) {
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

function setStatus(text, kind = "idle") {
  const el = document.getElementById("shell-status");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("online", "offline");
  if (kind === "online") el.classList.add("online");
  if (kind === "offline") el.classList.add("offline");
}

function isValidToken(token) {
  return typeof token === "string" && token.trim().length > 0;
}

async function getToken() {
  try {
    if (nativePrefs) {
      const { value } = await nativePrefs.get({ key: STORAGE_KEY });
      return value;
    }
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function setToken(token) {
  if (nativePrefs) {
    await nativePrefs.set({ key: STORAGE_KEY, value: token });
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, token);
}

async function clearToken() {
  if (nativePrefs) {
    await nativePrefs.remove({ key: STORAGE_KEY });
    return;
  }
  sessionStorage.removeItem(STORAGE_KEY);
}

function clearLoadTimer() {
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }
}

function loadWorkbench() {
  const frame = document.getElementById("workbench-frame");
  if (!frame) {
    setErrorMessage("Workbench frame missing.");
    showScreen("error");
    return;
  }
  workbenchLoaded = false;
  showScreen("loading");
  setLoadingMessage("Loading workbench…");
  setStatus("connecting", "idle");
  clearLoadTimer();
  loadTimer = setTimeout(() => {
    if (!workbenchLoaded) {
      setErrorMessage("Workbench took too long to load. Check your network and try again.");
      showScreen("error");
      setStatus("timeout", "offline");
    }
  }, LOAD_TIMEOUT_MS);

  const onLoad = () => {
    workbenchLoaded = true;
    clearLoadTimer();
    showScreen("workbench");
    setStatus("online", "online");
    frame.removeEventListener("load", onLoad);
  };
  frame.addEventListener("load", onLoad);
  const url = new URL(WORKBENCH_URL);
  url.searchParams.set("mmi", String(Date.now()));
  frame.src = url.toString();
}

async function signOut() {
  clearLoadTimer();
  await clearToken();
  const frame = document.getElementById("workbench-frame");
  if (frame) frame.src = "about:blank";
  workbenchLoaded = false;
  setAuthError(null);
  showScreen("auth");
  setStatus("signed out", "idle");
}

async function tryStartSession() {
  const token = await getToken();
  if (!token || !isValidToken(token)) {
    showScreen("auth");
    return;
  }
  loadWorkbench();
}

function wireUi() {
  document.getElementById("auth-submit")?.addEventListener("click", async () => {
    const input = document.getElementById("auth-token");
    const value = input?.value ?? "";
    if (!isValidToken(value)) {
      setAuthError("Enter a non-empty access token.");
      return;
    }
    setAuthError(null);
    await setToken(value.trim());
    if (input) input.value = "";
    loadWorkbench();
  });
  document.getElementById("error-retry")?.addEventListener("click", () => loadWorkbench());
  document.getElementById("error-signout")?.addEventListener("click", () => void signOut());
  document.getElementById("shell-signout")?.addEventListener("click", () => void signOut());
  document.getElementById("auth-token")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("auth-submit")?.click();
  });
}

async function setupNative() {
  try {
    const core = await import("@capacitor/core");
    isNative = core.Capacitor.isNativePlatform();
    if (!isNative) return;
    const [{ Preferences }, { App }, { Network }] = await Promise.all([
      import("@capacitor/preferences"),
      import("@capacitor/app"),
      import("@capacitor/network"),
    ]);
    nativePrefs = Preferences;
    nativeApp = App;
    nativeNetwork = Network;

    await App.addListener("appStateChange", ({ isActive }) => {
      if (isActive && workbenchLoaded) setStatus("online", "online");
      else if (!isActive) setStatus("background", "idle");
    });
    await Network.addListener("networkStatusChange", (status) => {
      onNetwork(status.connected);
    });
    const status = await Network.getStatus();
    onNetwork(status.connected);
  } catch {
    window.addEventListener("online", () => onNetwork(true));
    window.addEventListener("offline", () => onNetwork(false));
    onNetwork(navigator.onLine);
  }
}

function onNetwork(connected) {
  if (!connected) {
    setStatus("offline", "offline");
    if (workbenchLoaded) {
      setErrorMessage("Network connection lost. Reconnect when online.");
      showScreen("error");
    }
  } else if (workbenchLoaded) {
    setStatus("online", "online");
    showScreen("workbench");
  } else {
    setStatus("online", "online");
  }
}

async function bootstrap() {
  showScreen("loading");
  setLoadingMessage("Starting…");
  wireUi();
  await setupNative();
  await tryStartSession();
}

void bootstrap();
