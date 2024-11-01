async function decodeQRCode(imageDataUrl) {
    try {
        const formData = new FormData();
        const response = await fetch(imageDataUrl);

        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.status}`);
        }

        const blob = await response.blob();
        formData.append('file', blob);

        // Show loading spinner
        document.getElementById("loading").style.display = "block"; // Show loading spinner

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
    } finally {
        // Hide loading spinner
        document.getElementById("loading").style.display = "none"; // Hide loading spinner
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById("scan");
    const linkList = document.getElementById("linkList"); // Get the ordered list element

    if (scanButton) {
        scanButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "captureScreen" }, async (response) => {
                if (response && response.dataUrl) {
                    const url = response.dataUrl;
                    const qrCodeData = await decodeQRCode(url);

                    if (qrCodeData) {
                        let resultText = `QR Code Data: <b>${qrCodeData}</b>`;
                        document.getElementById("result").innerHTML = resultText;

                        let finalUrl = qrCodeData; // Creating a new variable for the final URL
                        if (!/^https?:\/\//i.test(finalUrl)) {
                            finalUrl = 'http://' + finalUrl; // Adding http:// if the protocol is absent
                        }

                        // Create a new list item for the link
                        const listItem = document.createElement("li");
                        const openLinkButton = document.createElement("button");
                        openLinkButton.innerText = `Open Link: ${finalUrl}`;
                        openLinkButton.className = "link-button"; // Assigning the new class for styling
                        openLinkButton.addEventListener("click", () => {
                            chrome.tabs.create({ url: finalUrl }); // Using the final URL
                        });
                        listItem.appendChild(openLinkButton); // Append button to list item
                        linkList.appendChild(listItem); // Append list item to the ordered list
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
