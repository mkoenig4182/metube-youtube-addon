document.addEventListener("DOMContentLoaded", () => {
  // Werte vorausfüllen
  chrome.storage.sync.get(["metubeUrl"], (result) => {
    if (result.metubeUrl) {
      document.getElementById("metubeUrl").value = result.metubeUrl;
      checkPermissions(result.metubeUrl);
    } else {
      document.getElementById("permStatus").textContent = "Keine MeTube-URL hinterlegt.";
    }
  });
});

// Berechtigungsstatus prüfen
async function checkPermissions(url) {
  try {
    const origin = `${new URL(url).origin}/*`;
    const hasPerm = await chrome.permissions.contains({ origins: [origin] });
    const permDiv = document.getElementById("permStatus");
    if (hasPerm) {
      permDiv.innerHTML = `✅ Zugriff auf <b>${origin}</b> ist aktiv und erlaubt.`;
      permDiv.style.color = "#2e7d32";
    } else {
      permDiv.innerHTML = `⚠️ Kein direkter Zugriff auf <b>${origin}</b> erteilt.`;
      permDiv.style.color = "#c62828";
    }
  } catch (e) {
    document.getElementById("permStatus").textContent = "Ungültige URL angegeben.";
  }
}

// Einstellungen speichern
document.getElementById("save").addEventListener("click", async () => {
  let url = document.getElementById("metubeUrl").value.trim();
  if (url.endsWith("/")) url = url.slice(0, -1);

  try {
    const urlPattern = `${new URL(url).origin}/*`;
    const granted = await chrome.permissions.request({ origins: [urlPattern] });

    if (granted) {
      chrome.storage.sync.set({ metubeUrl: url }, () => {
        const status = document.getElementById("status");
        status.textContent = "Einstellungen & Berechtigungen gespeichert!";
        checkPermissions(url);
        setTimeout(() => status.textContent = "", 3000);
      });
    } else {
      alert("Berechtigung wurde verweigert.");
    }
  } catch (e) {
    alert("Bitte gib eine gültige URL ein.");
  }
});

// Berechtigung manuell anfordern Button
document.getElementById("requestPerm").addEventListener("click", async () => {
  let url = document.getElementById("metubeUrl").value.trim();
  if (!url) {
    alert("Bitte zuerst eine URL eintragen.");
    return;
  }
  if (url.endsWith("/")) url = url.slice(0, -1);

  try {
    const urlPattern = `${new URL(url).origin}/*`;
    const granted = await chrome.permissions.request({ origins: [urlPattern] });
    if (granted) {
      checkPermissions(url);
      alert("Berechtigung erfolgreich erteilt!");
    } else {
      alert("Berechtigung nicht erteilt.");
    }
  } catch (e) {
    alert("Fehler beim Anfordern der Berechtigung.");
  }
});