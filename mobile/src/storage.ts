/**
 * Secure-enough session storage for Phase 02.
 * Uses Capacitor Preferences on device; falls back to sessionStorage on web.
 * Phase 04+ will use platform keychain / EncryptedSharedPreferences.
 */

import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { STORAGE_KEYS } from "./config";

async function nativeAvailable(): Promise<boolean> {
  return Capacitor.isNativePlatform();
}

export async function getSessionToken(): Promise<string | null> {
  try {
    if (await nativeAvailable()) {
      const { value } = await Preferences.get({ key: STORAGE_KEYS.sessionToken });
      return value;
    }
    return sessionStorage.getItem(STORAGE_KEYS.sessionToken);
  } catch {
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  if (await nativeAvailable()) {
    await Preferences.set({ key: STORAGE_KEYS.sessionToken, value: token });
    return;
  }
  sessionStorage.setItem(STORAGE_KEYS.sessionToken, token);
}

export async function clearSessionToken(): Promise<void> {
  if (await nativeAvailable()) {
    await Preferences.remove({ key: STORAGE_KEYS.sessionToken });
    return;
  }
  sessionStorage.removeItem(STORAGE_KEYS.sessionToken);
}
