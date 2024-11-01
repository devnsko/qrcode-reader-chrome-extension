async function decodeQRCode(imageDataUrl) {
    try {
        // Creating FormData to send the image
        const formData = new FormData();
        const response = await fetch(imageDataUrl);

        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.status}`);
        }

        const blob = await response.blob();
        formData.append('file', blob);

        const apiResponse = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            body: formData
        });

        // Checking the response status
        if (!apiResponse.ok) {
            throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        console.log("API response:", data); // Logging API response for debugging

        return data[0]?.symbol[0]?.data; // Extracting QR code data from API response
    } catch (error) {
        console.error("Error decoding QR code:", error);
        return null; // Returning null in case of an error
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById("scan");

    if (scanButton) {
        scanButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "captureScreen" }, async (response) => {
                if (response && response.dataUrl) {
                    const url = response.dataUrl;
                    const qrCodeData = await decodeQRCode(url);

                    if (qrCodeData) {
                        let resultText = `QR Code Data: <b>${qrCodeData}</b>`;
                        document.getElementById("result").innerHTML = resultText; // Use innerHTML to render HTML tags
                    
                        // Checking for protocol and adding http:// if it's missing
                        let finalUrl = qrCodeData; // Creating a new variable for the final URL
                        if (!/^https?:\/\//i.test(finalUrl)) {
                            finalUrl = 'http://' + finalUrl; // Adding http:// if the protocol is absent
                        }
                    
                        const openLinkButton = document.createElement("button");
                        openLinkButton.innerText = `Open Link: ${finalUrl}`;
                        openLinkButton.className = "link-button"; // Assigning the new class for styling
                        openLinkButton.addEventListener("click", () => {
                            chrome.tabs.create({ url: finalUrl }); // Using the final URL
                        });
                        document.body.appendChild(openLinkButton);
                    } else {
                        document.getElementById("result").innerText = "QR Code not found!";
                    }
                }
            });
        });
    } else {
        console.error("Element with id 'scan' not found");
    }
});
