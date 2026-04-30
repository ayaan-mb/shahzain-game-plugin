#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

DIST_DIR="dist"
ZIP_NAME="speedx-car-game.zip"
ZIP_PATH="$DIST_DIR/$ZIP_NAME"

if [ ! -f "speedx-car-game.php" ]; then
  echo "Error: speedx-car-game.php not found." >&2
  exit 1
fi

if [ ! -d "speedx-car-game" ]; then
  echo "Error: speedx-car-game/ assets folder not found." >&2
  exit 1
fi

mkdir -p "$DIST_DIR"
rm -f "$ZIP_PATH"
zip -r "$ZIP_PATH" speedx-car-game.php speedx-car-game -x "*.DS_Store" "__MACOSX/*" >/dev/null

echo "Built: $ZIP_PATH"
unzip -l "$ZIP_PATH"

echo "\nValidation: root plugin header"
unzip -p "$ZIP_PATH" speedx-car-game.php | sed -n '1,14p'
