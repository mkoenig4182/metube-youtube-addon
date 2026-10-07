const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendToMeTube") {
    fetch("https://ytdl.marcelkoenig.de/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: request.url,
        quality: "best"
      })
    })
    .then(response => {
      if (response.ok) {
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, status: response.status });
      }
    })
    .catch(error => {
      console.error("MeTube Background Error:", error);
      sendResponse({ success: false, error: error.toString() });
    });

    return true; // Wichtig für asynchrone Antworten
  }
});