#!/usr/bin/env bash
set -euo pipefail

ASSET_BASE="${MACCLEANER_ASSET_BASE:-https://workshop.mastermindshq.business/downloads}"
PACKAGE_URL="${ASSET_BASE}/maccleaner-package.tar.gz"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/maccleaner.XXXXXX")"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

echo "Downloading MacCleaner package..."

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${PACKAGE_URL}" -o "${TMP_DIR}/maccleaner-package.tar.gz"
elif command -v python3 >/dev/null 2>&1; then
  python3 - "${PACKAGE_URL}" "${TMP_DIR}/maccleaner-package.tar.gz" <<'PY'
import sys, urllib.request
urllib.request.urlretrieve(sys.argv[1], sys.argv[2])
PY
else
  echo "Need curl or python3 to download MacCleaner." >&2
  exit 1
fi

tar -xzf "${TMP_DIR}/maccleaner-package.tar.gz" -C "${TMP_DIR}"
cd "${TMP_DIR}/maccleaner"
chmod +x install.sh maccleaner.js
./install.sh

echo
echo "MacCleaner installed."
echo "Run a safe preview with: maccleaner"
echo "Run a real cleanup with: maccleaner --confirm-clean"
