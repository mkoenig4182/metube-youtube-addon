# Send to MeTube

Ein Browser-Add-on für Firefox, Chrome, Edge und weitere Chromium-Browser, das auf YouTube-Videoseiten einen Button einfügt, um Videos direkt an die eigene MeTube-Instanz zu senden.

---

## 🛠️ Installation

### 🦊 Firefox

Für Firefox ist die Erweiterung signiert und kann direkt über die `.xpi`-Datei installiert werden:

1. Lade die Datei `send_to_metube.xpi` (oder die entsprechende `.xpi`-Datei aus den Releases / Downloads) herunter.
2. Öffne Firefox.
3. Ziehe die gedownloadete `.xpi`-Datei per **Drag & Drop** in ein beliebiges Firefox-Fenster.
4. Bestätige die Sicherheitsabfrage mit **Hinzufügen**.

> **Hinweis:** Da die Datei von Mozilla signiert ist, bleibt das Add-on dauerhaft und dauerhaft aktiv installiert (auch nach Browser-Neustarts).

---

### 🌐 Chrome, Microsoft Edge, Brave, Opera (Chromium)

In Chromium-basierten Browsern lässt sich das Add-on im Entwicklermodus aus dem Quellcode laden:

1. Lade das Repository als ZIP-Datei herunter und entpacke sie in einen beliebigen Ordner (oder klone das Repository).
2. Öffne die Erweiterungsverwaltung in deinem Browser:
   - **Chrome:** `chrome://extensions/`
   - **Microsoft Edge:** `edge://extensions/`
   - **Brave:** `brave://extensions/`
   - **Opera:** `opera://extensions/`
3. Aktiviere oben rechts den **Entwicklermodus** (*Developer mode*).
4. Klicke auf **Entpackte Erweiterung laden** (*Load unpacked*).
5. Wähle den Ordner aus, der die `manifest.json` enthält.

---

## ⚙️ Konfiguration

Standardmäßig sendet das Add-on Anfragen an die konfigurierte MeTube-URL. Bei Bedarf kann die URL in der `background.js` angepasst werden.