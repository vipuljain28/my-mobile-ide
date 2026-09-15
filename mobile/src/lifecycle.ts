/**
 * Native lifecycle + network handling for the mobile shell.
 * Phase 02: pause/resume workbench visibility and surface offline state.
 */

import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { Capacitor } from "@capacitor/core";

export type LifecycleHandlers = {
  onResume: () => void;
  onPause: () => void;
  onNetworkChange: (connected: boolean) => void;
};

export async function setupLifecycle(handlers: LifecycleHandlers): Promise<() => void> {
  const cleanups: Array<() => void> = [];

  if (Capacitor.isNativePlatform()) {
    const appState = await App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        handlers.onResume();
      } else {
        handlers.onPause();
      }
    });
    cleanups.push(() => {
      void appState.remove();
    });

    const net = await Network.addListener("networkStatusChange", (status) => {
      handlers.onNetworkChange(status.connected);
    });
    cleanups.push(() => {
      void net.remove();
    });

    const current = await Network.getStatus();
    handlers.onNetworkChange(current.connected);
  } else {
    const onOnline = () => handlers.onNetworkChange(true);
    const onOffline = () => handlers.onNetworkChange(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    handlers.onNetworkChange(navigator.onLine);
    cleanups.push(() => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    });
  }

  return () => {
    for (const c of cleanups) c();
  };
}
