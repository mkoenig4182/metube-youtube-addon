# 🎬 YouTube to MeTube Chrome Extension

Eine schlanke Manifest V3 Browser-Erweiterung, die auf YouTube-Videoseiten einen **"MeTube"**-Button einfügt. Ein Klick sendet das aktuelle Video direkt an eine eigene [MeTube](https://github.com/alexta69/metube)-Instanz (yt-dlp GUI) im Hintergrund.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Brave%20%7C%20Edge%20%7C%20Firefox-orange.svg)

---

## 🚀 Features

- **Nahtlose Integration:** Fügt sich optisch perfekt in die native YouTube-Aktionsleiste unterhalb des Video-Players ein.
- **SPA-Support:** Funktioniert zuverlässig beim Navigieren zwischen Videos ohne Seiten-Reload (via `MutationObserver`).
- **Visuelles Feedback:** Zeigt Statuszustände an (*Sende...*, *Gesendet! ✓*, *Fehler!*).
- **Lightweight:** Keine unnötigen Abhängigkeiten, reines Vanilla JavaScript und CSS.

---

## 🛠️ Installation

Da es sich um eine private Erweiterung handelt, wird sie als entpackte Erweiterung im Entwicklermodus installiert:

1. **Repository klonen oder ZIP herunterladen:**
   ```bash
   git clone [https://github.com/mkoenig4182/metube-youtube-addon.git](https://github.com/mkoenig4182/metube-youtube-addon.git)
