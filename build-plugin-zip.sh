#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

ZIP_NAME="speedx-car-game.zip"
PLUGIN_DIR="speedx-car-game"

if [ ! -f "$PLUGIN_DIR/speedx-car-game.php" ]; then
  echo "Error: $PLUGIN_DIR/speedx-car-game.php not found." >&2
  exit 1
fi

rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" "$PLUGIN_DIR" -x "*.DS_Store" "__MACOSX/*"

echo "Built $ZIP_NAME"
unzip -l "$ZIP_NAME"
