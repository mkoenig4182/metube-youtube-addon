# MeTube YouTube Addon

Ein plattformübergreifendes Browser-Add-on (Manifest V3) für **Microsoft Edge**, **Google Chrome** und **Mozilla Firefox**, das einen Download-Button direkt in die YouTube-Bedienoberfläche einbettet. Ein Klick sendet die URL des aktuellen Videos automatisch an eine eigene [MeTube](https://github.com/alexta69/metube)-Instanz.

![MeTube YouTube Addon Preview](preview.jpg)

---

## Features

- **Cross-Browser Support**: Ein einziger Codebase-Standard für Edge, Chrome und Firefox.
- **Nahtlose Integration**: Fügt sich optisch direkt neben dem Abonnieren-Button auf YouTube ein.
- **CORS-Bypass**: Die Anfragen werden über ein Background-Script (Service Worker) abgewickelt, um Cross-Origin-Blockaden zuverlässig zu vermeiden.
- **SPA-Kompatibel**: Erkennt Seitenwechsel auf YouTube automatisch via `MutationObserver`.

---

## Installation & Einrichtung

### 1. Repository klonen
```bash
git clone [https://github.com/mkoenig4182/metube-youtube-addon.git](https://github.com/mkoenig4182/metube-youtube-addon.git)
