/**
 * My Mobile IDE — Phase 02 mobile shell entry.
 *
 * Responsibilities limited to Phase 02:
 * - Auth gate (POC token)
 * - Load Code - OSS compatible web workbench in iframe/WebView
 * - Loading / error / reconnect states
 * - Native lifecycle + network awareness
 *
 * Out of scope: remote workspace, terminal, Git, LSP, AI, real gateway.
 */

import { WORKBENCH_URL, WORKBENCH_LOAD_TIMEOUT_MS, isValidPocToken } from "./config";
import { getSessionToken, setSessionToken, clearSessionToken } from "./storage";
import { setupLifecycle } from "./lifecycle";
import {
  showScreen,
  setLoadingMessage,
  setErrorMessage,
  setAuthError,
  setStatus,
  getWorkbenchFrame,
} from "./ui";

let loadTimer: ReturnType<typeof setTimeout> | null = null;
let teardownLifecycle: (() => void) | null = null;
let workbenchLoaded = false;

function clearLoadTimer(): void {
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }
}

function loadWorkbench(): void {
  const frame = getWorkbenchFrame();
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
      setErrorMessage(
        "Workbench took too long to load. Check your network and try again."
      );
      showScreen("error");
      setStatus("timeout", "offline");
    }
  }, WORKBENCH_LOAD_TIMEOUT_MS);

  const onLoad = () => {
    workbenchLoaded = true;
    clearLoadTimer();
    showScreen("workbench");
    setStatus("online", "online");
    frame.removeEventListener("load", onLoad);
  };

  frame.addEventListener("load", onLoad);
  // Cache-bust so reconnects re-fetch when needed
  const url = new URL(WORKBENCH_URL);
  url.searchParams.set("mmi", String(Date.now()));
  frame.src = url.toString();
}

async function signOut(): Promise<void> {
  clearLoadTimer();
  await clearSessionToken();
  const frame = getWorkbenchFrame();
  if (frame) frame.src = "about:blank";
  workbenchLoaded = false;
  setAuthError(null);
  showScreen("auth");
  setStatus("signed out", "idle");
}

async function tryStartSession(): Promise<void> {
  const token = await getSessionToken();
  if (!token || !isValidPocToken(token)) {
    showScreen("auth");
    return;
  }
  loadWorkbench();
}

function wireUi(): void {
  document.getElementById("auth-submit")?.addEventListener("click", async () => {
    const input = document.getElementById("auth-token") as HTMLInputElement | null;
    const value = input?.value ?? "";
    if (!isValidPocToken(value)) {
      setAuthError("Enter a non-empty access token.");
      return;
    }
    setAuthError(null);
    await setSessionToken(value.trim());
    if (input) input.value = "";
    loadWorkbench();
  });

  document.getElementById("error-retry")?.addEventListener("click", () => {
    loadWorkbench();
  });

  document.getElementById("error-signout")?.addEventListener("click", () => {
    void signOut();
  });

  document.getElementById("shell-signout")?.addEventListener("click", () => {
    void signOut();
  });

  // Enter key on token field
  document.getElementById("auth-token")?.addEventListener("keydown", (e) => {
    if ((e as KeyboardEvent).key === "Enter") {
      document.getElementById("auth-submit")?.click();
    }
  });
}

async function bootstrap(): Promise<void> {
  showScreen("loading");
  setLoadingMessage("Starting…");
  wireUi();

  teardownLifecycle = await setupLifecycle({
    onResume: () => {
      if (workbenchLoaded) {
        setStatus("online", "online");
      }
    },
    onPause: () => {
      setStatus("background", "idle");
    },
    onNetworkChange: (connected) => {
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
    },
  });

  await tryStartSession();
}

void bootstrap();

// Hot-dispose for Vite HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearLoadTimer();
    teardownLifecycle?.();
  });
}
