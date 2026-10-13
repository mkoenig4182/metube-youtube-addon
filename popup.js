document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["metubeUrl"], (data) => {
    if (!data.metubeUrl) {
      chrome.runtime.openOptionsPage();
      window.close();
      return;
    }

    const baseUrl = data.metubeUrl.replace(/\/+$/, "");

    // MP4 Download (Video + Audio im MP4-Container)
    document.getElementById("btnMp4").addEventListener("click", () => {
      sendToMetube(baseUrl, { url: "", quality: "best", format: "mp4" }, "MP4");
    });

    // MP3 Download (Nur Audio als MP3)
    document.getElementById("btnMp3").addEventListener("click", () => {
      sendToMetube(baseUrl, { url: "", download_type: "audio", quality: "best", format: "mp3" }, "MP3");
    });

    // MeTube UI öffnen
    document.getElementById("btnOpenMetube").addEventListener("click", () => {
      chrome.tabs.create({ url: baseUrl });
      window.close();
    });

    // Einstellungen-Link unten im Popup
    document.getElementById("openOptions").addEventListener("click", (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
      window.close();
    });
  });
});

async function sendToMetube(baseUrl, payloadData, label) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url && tab.url.includes("youtube.com/watch")) {
    const targetApi = `${baseUrl}/add`;
    payloadData.url = tab.url;

    try {
      const response = await fetch(targetApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData)
      });

      if (response.ok) {
        showToast(tab.id, `Erfolgreich als ${label} an MeTube gesendet!`, true);
      } else {
        showToast(tab.id, `MeTube Server-Fehler (${response.status})`, false);
      }
    } catch (error) {
      showToast(tab.id, "Netzwerkfehler: Verbindung zu MeTube fehlgeschlagen", false);
    }
  } else {
    alert("Bitte öffne ein YouTube-Video, um es zu senden.");
  }
  window.close();
}

function showToast(tabId, message, isSuccess) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (msg, success) => {
      const existing = document.getElementById('metube-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'metube-toast';
      toast.textContent = msg;
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.right = '20px';
      toast.style.zIndex = '999999';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '8px';
      toast.style.color = '#ffffff';
      toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      toast.style.fontSize = '14px';
      toast.style.fontWeight = 'bold';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      toast.style.backgroundColor = success ? '#2e7d32' : '#c62828';
      toast.style.transition = 'opacity 0.3s ease';

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    },
    args: [message, isSuccess]
  });
}