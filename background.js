chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureScreen") {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        sendResponse({ dataUrl: dataUrl });
      });
      return true; // чтобы указать Chrome, что ответ будет асинхронным
    }
  });
  