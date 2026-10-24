document.addEventListener("DOMContentLoaded", () => {
  const metubeUrlInput = document.getElementById("metubeUrl");
  const saveBtn = document.getElementById("save");
  const permStatus = document.getElementById("permStatus");
  const requestPermBtn = document.getElementById("requestPerm");
  const statusDiv = document.getElementById("status");

  chrome.storage.sync.get(["metubeUrl"], (data) => {
    if (data.metubeUrl) {
      metubeUrlInput.value = data.metubeUrl;
      checkPermissions(data.metubeUrl);
    } else {
      permStatus.textContent = "Bitte gib zuerst eine gültige MeTube-URL ein und klicke auf Speichern.";
    }
  });

  saveBtn.addEventListener("click", () => {
    let url = metubeUrlInput.value.trim();
    if (!url) {
      statusDiv.textContent = "Bitte eine URL eingeben!";
      statusDiv.style.color = "#c62828";
      return;
    }
    url = url.replace(/\/+$/, "");
    metubeUrlInput.value = url;

    chrome.storage.sync.set({ metubeUrl: url }, () => {
      statusDiv.textContent = "Einstellungen gespeichert!";
      statusDiv.style.color = "#2e7d32";
      checkPermissions(url);
      setTimeout(() => { statusDiv.textContent = ""; }, 3000);
    });
  });

  requestPermBtn.addEventListener("click", () => {
    const url = metubeUrlInput.value.trim();
    if (!url) return;

    try {
      const urlObj = new URL(url);
      const origin = `${urlObj.protocol}//${urlObj.hostname}/*`;

      chrome.permissions.request({ origins: [origin] }, (granted) => {
        if (granted) {
          permStatus.textContent = `✅ Zugriff auf ${origin} ist aktiv und erlaubt.`;
          permStatus.style.color = "#2e7d32";
        } else {
          permStatus.textContent = `❌ Zugriff auf ${origin} wurde abgelehnt.`;
          permStatus.style.color = "#c62828";
        }
      });
    } catch (e) {
      alert("Ungültige URL angegeben.");
    }
  });

  function checkPermissions(url) {
    try {
      const urlObj = new URL(url);
      const origin = `${urlObj.protocol}//${urlObj.hostname}/*`;

      chrome.permissions.contains({ origins: [origin] }, (result) => {
        if (result) {
          permStatus.textContent = `✅ Zugriff auf ${origin} ist aktiv und erlaubt.`;
          permStatus.style.color = "#2e7d32";
        } else {
          permStatus.textContent = `⚠️ Kein expliziter Zugriff auf ${origin} erteilt.`;
          permStatus.style.color = "#d84315";
        }
      });
    } catch (e) {
      permStatus.textContent = "Ungültige URL-Formatierung.";
      permStatus.style.color = "#c62828";
    }
  }
});