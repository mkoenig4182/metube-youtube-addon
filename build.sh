#!/usr/bin/env bash
# Baut das Release-Zip der Erweiterung.
# Wichtig: XPI/ZIP-Dateien dürfen nicht mit eingepackt werden.
set -euo pipefail
cd "$(dirname "$0")"

version=$(python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
out="metube-addon-${version}.zip"

rm -f "$out"
zip -r -X "$out" \
  manifest.json background.js popup.html popup.js \
  options.html options.js icon.svg updates.json README.md \
  -x '*.xpi' '*.zip' > /dev/null

echo "Erstellt: $out"
unzip -l "$out"
