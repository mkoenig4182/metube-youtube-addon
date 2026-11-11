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

## Versionsnummer

Die Versionsnummer wird **immer als Patch-Version erhöht**: `x.x.N` → `x.x.(N+1)`,
also z. B. `2.0.7` → `2.0.8`. Keine Minor-/Major-Sprünge, außer es wird
ausdrücklich anders gewünscht.

Die Nummer steht an **zwei** Stellen und muss überall gleich sein:

- `manifest.json` → `version`
- `updates.json` → `updates[0].version`

## Ablauf bei einer Änderung

1. Code anpassen.
2. Versionsnummer nach der Regel oben erhöhen (in `manifest.json` und `updates.json`).
3. `./build.sh` ausführen und das erzeugte ZIP signieren lassen.
4. Die signierte XPI als `send-to-metube-latest.xpi` ablegen und committen.
5. Pushen.

## Projekt

Firefox-/Chromium-Erweiterung (Manifest V3), reines Vanilla-JS, keine Build-Toolchain.
Einstiegspunkte: `popup.js` (Menü/API), `background.js` (Kontextmenü),
`options.js` (Konfiguration), `manifest.json` (Version, Berechtigungen).
