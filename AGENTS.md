# Arbeitsregeln für dieses Projekt

## Release-Paket bauen

Beim Packen einer neuen Version **niemals** die vorhandene `.xpi` (oder andere ZIPs)
mit einpacken. Die XPI ist das signierte Release-Artefakt und darf nicht in sich
selbst landen.

Dafür immer das Skript verwenden:

```bash
./build.sh
```

Es liest die Version aus `manifest.json`, erzeugt `metube-addon-<version>.zip` im
Projektordner und lässt `*.xpi`/`*.zip` aus. Das ZIP ist über `.gitignore`
ausgeschlossen und wird nicht committet.

## Ablauf bei einer Änderung

1. Code anpassen.
2. Bei einem Release: `version` in `manifest.json` und in `updates.json` erhöhen.
3. `./build.sh` ausführen und das erzeugte ZIP signieren lassen.
4. Die signierte XPI als `send-to-metube-latest.xpi` ablegen und committen.
5. Pushen.

## Projekt

Firefox-/Chromium-Erweiterung (Manifest V3), reines Vanilla-JS, keine Build-Toolchain.
Einstiegspunkte: `popup.js` (Menü/API), `background.js` (Kontextmenü),
`options.js` (Konfiguration), `manifest.json` (Version, Berechtigungen).
