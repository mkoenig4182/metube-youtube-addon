// Beim Installieren: Kontextmenü erstellen & Einstellungsseite öffnen
chrome.runtime.onInstalled.addListener((details) => {
  // Rechtsklick-Kontextmenü hinzufügen
  chrome.contextMenus.create({
    id: "open-metube-instance",
    title: "MeTube-Instanz öffnen",
    contexts: ["action"]
  });

  // Falls frisch installiert: Direkt Options-Seite öffnen
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

// Reagiere auf Klick im Kontextmenü (Rechtsklick)
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "open-metube-instance") {
    chrome.storage.sync.get(["metubeUrl"], (data) => {
      if (data.metubeUrl) {
        const baseUrl = data.metubeUrl.replace(/\/+$/, "");
        chrome.tabs.create({ url: baseUrl });
      } else {
        chrome.runtime.openOptionsPage();
      }
    });
  }
});