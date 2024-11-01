chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureScreen") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            sendResponse({ dataUrl: dataUrl });
        });
        return true; // to indicate to Chrome that the response will be asynchronous
    }
});
