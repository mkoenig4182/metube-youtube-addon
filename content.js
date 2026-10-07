const METUBE_URL = "https://ytdl.marcelkoenig.de/add";

function addDownloadButton() {
  // Verhindern, dass der Button doppelt eingefügt wird
  if (document.getElementById("metube-download-btn")) return;

  // Das YouTube-Aktionsmenü finden (unter dem Video)
  const targetContainer = document.querySelector("#owner #top-level-buttons-computed, #actions-inner #top-level-buttons-computed");
  if (!targetContainer) return;

  const button = document.createElement("button");
  button.id = "metube-download-btn";
  button.className = "metube-btn";
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
      <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
    </svg>
    MeTube
  `;

  button.addEventListener("click", async () => {
    const videoUrl = window.location.href;
    button.classList.add("loading");
    button.innerText = "Sende...";

    try {
      const response = await fetch(METUBE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: videoUrl,
          quality: "best"
        })
      });

      if (response.ok) {
        button.innerText = "Gesendet! ?";
        button.style.backgroundColor = "#2e7d32";
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      console.error("MeTube Addon Error:", err);
      button.innerText = "Fehler!";
      button.style.backgroundColor = "#c62828";
    }

    setTimeout(() => {
      button.classList.remove("loading");
      button.innerText = "MeTube";
      button.style.backgroundColor = "";
    }, 3000);
  });

  targetContainer.appendChild(button);
}

// Beobachter, da YouTube eine Single Page App (SPA) ist und Seiten dynamisch lädt
const observer = new MutationObserver(() => {
  if (window.location.pathname === "/watch") {
    addDownloadButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });