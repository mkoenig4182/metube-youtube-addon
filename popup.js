document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.sync.get(["metubeUrl"], async (data) => {
    if (!data.metubeUrl) {
      chrome.runtime.openOptionsPage();
      window.close();
      return;
    }

    const baseUrl = data.metubeUrl.replace(/\/+$/, "");

    // Playlist-Erkennung: Button nur bei echten Playlist-Links einblenden
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const btnPlaylist = document.getElementById("btnPlaylist");
    const playlistUrl = getPlaylistUrl(tab && tab.url);

    if (playlistUrl && btnPlaylist) {
      btnPlaylist.classList.remove("hidden");
      btnPlaylist.addEventListener("click", () => {
        sendPlaylistToMetube(baseUrl, tab, playlistUrl);
      });
    }

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

// Prüft, ob eine URL eine echte YouTube-Playlist ist, und liefert die
// kanonische Playlist-URL zurück (sonst null).
//
// Reines "list=" im Query-String genügt nicht: YouTube hängt an viele
// Video-Links automatisch Mixes (list=RD...) an. Und "/playlist" steckt
// auch in Seiten wie /feed/playlists oder /@channel/playlists.
function getPlaylistUrl(rawUrl) {
  if (!rawUrl) return null;

  let url;
  try {
    url = new URL(rawUrl);
  } catch (e) {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (host !== "youtube.com" && host !== "www.youtube.com" &&
      host !== "m.youtube.com" && host !== "music.youtube.com") {
    return null;
  }

  const list = url.searchParams.get("list");
  if (!list) return null;

  // Automatisch generierte Mixes/Radios sind keine echten Playlists.
  if (list.startsWith("RD")) return null;

  // Playlist-Seite (youtube.com/playlist?list=...) oder Video, das in
  // einer Playlist läuft (youtube.com/watch?v=...&list=...).
  const isPlaylistPage = url.pathname === "/playlist";
  const isVideoInPlaylist = url.pathname === "/watch" && url.searchParams.get("v");

  if (!isPlaylistPage && !isVideoInPlaylist) return null;

  return `https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`;
}

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

async function sendPlaylistToMetube(baseUrl, tab, playlistUrl) {
  if (!tab || !tab.id || !playlistUrl) return;

  const targetApi = `${baseUrl}/add`;

  try {
    // MeTube bekommt die Playlist-URL selbst und holt alle Einträge über
    // yt-dlp. Das ist robuster als das Auslesen der YouTube-DOM, die sich
    // mit jedem YouTube-Redesign ändert.
    const response = await fetch(targetApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: playlistUrl, quality: "best", format: "mp4" })
    });

    if (response.ok) {
      showToast(tab.id, "Playlist an MeTube gesendet – die Videos werden nacheinander geladen.", true);
    } else {
      showToast(tab.id, `MeTube Server-Fehler (${response.status})`, false);
    }
  } catch (error) {
    showToast(tab.id, "Netzwerkfehler: Verbindung zu MeTube fehlgeschlagen", false);
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