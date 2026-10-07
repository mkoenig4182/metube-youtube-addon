function injectMeTubeButton() {
  if (document.getElementById("metube-download-btn")) return;

  const ownerContainer = document.querySelector("ytd-watch-metadata #owner, #owner");
  if (!ownerContainer) return;

  const button = document.createElement("button");
  button.id = "metube-download-btn";
  button.className = "metube-img-btn";
  
  const imgUrl = chrome.runtime.getURL("button.jpg");
  button.innerHTML = `<img src="${imgUrl}" alt="MeTube Download" />`;

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const videoUrl = window.location.href;
    console.log("[MeTube Addon] Sende via Background-Script:", videoUrl);
    
    button.style.opacity = "0.5";

    chrome.runtime.sendMessage(
      { action: "sendToMeTube", url: videoUrl },
      (response) => {
        if (response && response.success) {
          console.log("[MeTube Addon] Erfolgreich gesendet!");
          button.style.outline = "2px solid #2e7d32";
        } else {
          console.error("[MeTube Addon] Fehler:", response ? response.error : "Keine Antwort");
          button.style.outline = "2px solid #c62828";
        }

        setTimeout(() => {
          button.style.opacity = "1";
          button.style.outline = "none";
        }, 3000);
      }
    );
  });

  ownerContainer.appendChild(button);
}

setInterval(() => {
  if (window.location.pathname === "/watch") {
    injectMeTubeButton();
  }
}, 1000);

const observer = new MutationObserver(() => {
  if (window.location.pathname === "/watch") {
    injectMeTubeButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });