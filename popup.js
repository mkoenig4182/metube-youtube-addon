document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get(["metubeUrl"], async (data) => {
    if (!data.metubeUrl) {
      chrome.runtime.openOptionsPage();
      window.close();
      return;
    }

    const baseUrl = data.metubeUrl.replace(/\/+$/, "");

    // Prüfen, ob der aktive Tab eine YouTube-Playlist ist
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const btnPlaylist = document.getElementById("btnPlaylist");

    if (tab && tab.url && tab.url.includes("youtube.com") && (tab.url.includes("list=") || tab.url.includes("/playlist"))) {
      if (btnPlaylist) {
        btnPlaylist.classList.remove("hidden");
      }
    }

    // MP4 Download (Video + Audio im MP4-Container)
    document.getElementById("btnMp4").addEventListener("click", () => {
      sendToMetube(baseUrl, { url: "", quality: "best", format: "mp4" }, "MP4");
    });

    // MP3 Download (Nur Audio als MP3)
    document.getElementById("btnMp3").addEventListener("click", () => {
      sendToMetube(baseUrl, { url: "", download_type: "audio", quality: "best", format: "mp3" }, "MP3");
    });

    // Playlist an MeTube senden
    if (btnPlaylist) {
      btnPlaylist.addEventListener("click", () => {
        sendPlaylistToMetube(baseUrl, tab);
      });
    }

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

async function sendPlaylistToMetube(baseUrl, tab) {
  if (!tab || !tab.id) return;

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const linkElements = document.querySelectorAll(
          'ytd-playlist-video-renderer a#video-title, a#video-title, ytd-playlist-panel-video-renderer a#wc-endpoint'
        );
        return Array.from(linkElements)
          .map(a => a.href)
          .filter(href => href && href.includes('watch?v='))
          .map(href => href.split('&list=')[0])
          .filter((url, index, self) => self.indexOf(url) === index);
      }
    });

    const links = results[0]?.result || [];

    if (links.length === 0) {
      showToast(tab.id, "Keine Playlist-Videos auf der Seite gefunden.", false);
      window.close();
      return;
    }

    showToast(tab.id, `Sende ${links.length} Videos aus der Playlist an MeTube...`, true);

    const targetApi = `${baseUrl}/add`;
    let successCount = 0;

    for (const videoUrl of links) {
      try {
        const response = await fetch(targetApi, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoUrl, quality: "best", format: "mp4" })
        });
        if (response.ok) successCount++;
      } catch (e) {
        console.error("Fehler beim Senden von", videoUrl, e);
      }
    }

    showToast(tab.id, `Fertig! ${successCount}/${links.length} Playlist-Videos gesendet.`, true);

  } catch (err) {
    console.error("Fehler beim Auslesen der Playlist:", err);
    showToast(tab.id, "Fehler beim Auslesen der Playlist.", false);
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