# Send to MeTube (Browser Extension)

Eine schlanke, plattformübergreifende Browser-Erweiterung (Manifest V3) für Firefox und Chromium-basierte Browser, um YouTube-Videos mit nur einem Klick direkt an eine eigene [MeTube](https://github.com/alexta69/metube)-Instanz zu senden.

---

## Funktionen

* **Direktzugriff über Toolbar-Icon:** Ein Klick auf das Erweiterungs-Icon in der Symbolleiste sendet das aktive YouTube-Video direkt an MeTube.
* **Visuelles Feedback:** Direktes Feedback auf dem Icon (grünes Häkchen bei Erfolg, rotes Symbol bei Fehlern).
* **Einstellungsseite (Options UI):** Beim ersten Klick (oder falls noch keine URL hinterlegt ist) öffnet sich automatisch die Konfigurationsseite, auf der die Basis-URL deiner MeTube-Instanz hinterlegt werden kann.
* **Plattformübergreifend:** Unterstützt Firefox und Google Chrome / Edge.

---

## Installation

Du kannst die Erweiterung auf zwei Wegen installieren:

### Methode 1: Fertige `.xpi`-Datei (Empfohlen für Firefox)
1. Lade die aktuelle **`send-to-metube-latest.xpi`** (bzw. die `.xpi` aus den Releases) herunter.
2. Öffne in Firefox `about:debugging#/runtime/this-firefox`.
3. Klicke auf **„Temporäre Add-on-Datei laden …“** und wähle die heruntergeladene `.xpi`-Datei aus.

### Methode 2: Aus dem Quellcode (Entwicklermodus / ZIP)
1. Lade das Repository als [ZIP-Datei von GitHub herunter](https://github.com/mkoenig4182/metube-youtube-addon/archive/refs/heads/main.zip) und entpacke es.
2. **In Firefox:**
   * Gehe auf `about:debugging#/runtime/this-firefox`.
   * Klicke auf **„Temporäre Add-on-Datei laden …“** und wähle die `manifest.json` aus dem entpackten Ordner aus.
3. **In Google Chrome / Edge:**
   * Gehe auf `chrome://extensions/` bzw. `edge://extensions/`.
   * Aktiviere oben rechts den **Entwicklermodus**.
   * Klicke auf **„Entpackte Erweiterung laden“** und wähle den Ordner aus.

---

## Ersteinrichtung

1. Klicke nach der Installation auf das MeTube-Erweiterungssymbol in deiner Browser-Leiste.
2. Da noch keine URL hinterlegt ist, öffnet sich automatisch die Einstellungsseite.
3. Trage dort die Basis-URL deiner MeTube-Instanz ein (z. B. `https://ytdl.deine-domain.de`) und klicke auf **Speichern**.
4. Ab sofort sendet ein Klick auf das Symbol das aktuell geöffnete YouTube-Video direkt an deinen Downloader!

---

## Projektstruktur

```text
metube-youtube-addon/
├── manifest.json      # Erweiterungs-Konfiguration (Manifest V3)
├── background.js      # Service Worker für API-Kommunikation und Klick-Handling
├── options.html       # Einstellungsseite für die MeTube-URL
├── options.js         # Logik zum Speichern der Einstellungen
└── icon.svg           # Vektor-Icon der Erweiterung
