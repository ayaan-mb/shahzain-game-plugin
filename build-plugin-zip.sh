#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

PLUGIN_DIR="speedx-car-game"
DIST_DIR="dist"
ZIP_NAME="speedx-car-game.zip"
ZIP_PATH="$DIST_DIR/$ZIP_NAME"

if [ ! -f "$PLUGIN_DIR/speedx-car-game.php" ]; then
  echo "Error: $PLUGIN_DIR/speedx-car-game.php not found." >&2
  exit 1
fi

mkdir -p "$DIST_DIR"
rm -f "$ZIP_PATH"
zip -r "$ZIP_PATH" "$PLUGIN_DIR" -x "*.DS_Store" "__MACOSX/*" >/dev/null

echo "Built: $ZIP_PATH"
echo "Contents:"
unzip -l "$ZIP_PATH"

echo "\nValidation: plugin header found in archive"
unzip -p "$ZIP_PATH" "$PLUGIN_DIR/speedx-car-game.php" | sed -n '1,12p'
