#!/usr/bin/env bash
# Phase 02 — generate Capacitor iOS/Android native projects
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
npm install

echo "==> Building web assets"
npm run build

if [[ ! -d android ]]; then
  echo "==> Adding Android platform"
  npx cap add android
else
  echo "==> Android platform already present"
fi

if [[ "$(uname)" == "Darwin" ]]; then
  if [[ ! -d ios ]]; then
    echo "==> Adding iOS platform"
    npx cap add ios
  else
    echo "==> iOS platform already present"
  fi
else
  echo "==> Skipping iOS (requires macOS). Run on a Mac: npx cap add ios"
fi

echo "==> Syncing web assets into native projects"
npx cap sync

echo ""
echo "Done."
echo "  Android: npx cap open android"
echo "  iOS:     npx cap open ios   (macOS only)"
