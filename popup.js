async function captureScreen() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "captureScreen" }, (response) => {
            resolve(response.dataUrl);
        });
    });
}

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
        // Hide loading spinner after processing
        document.getElementById("loading").style.display = "none"; // Hide loading spinner
        document.getElementById("scan").disabled = false; // Re-enable the scan button
    }
}

function loadLinks() {
    chrome.storage.local.get('savedLinks', (data) => {
        const linkList = document.getElementById("linkList");
        linkList.innerHTML = ''; // Clear the current list
        const links = data.savedLinks || [];

        links.forEach((linkData, index) => {
            addLink(linkData, index, links)
        });
    });
}

function addLink(linkData, index, links) {
    // Create the link button
    const linkButton = document.createElement("button");
    linkButton.className = "link-button"; // Apply the button styling
    linkButton.textContent = linkData; // Display the QR code data
    linkButton.onclick = () => {
        // Open the link in a new tab when the button is clicked
        window.open(linkData, '_blank');
    };

    // Create the delete icon
    const deleteIcon = document.createElement("button");
    deleteIcon.className = "delete-icon"; // Apply the delete icon styling
    deleteIcon.textContent = "🗑️"; // Unicode character for a cross
    deleteIcon.onclick = (event) => {
        event.stopPropagation(); // Prevent the link button click event
        // Remove the link from storage and reload links
        links.splice(index, 1); // Remove link from array
        saveLinks(links); // Save updated links
        loadLinks(); // Reload the links
    };

    // Append the delete icon to the link button
    linkButton.appendChild(deleteIcon);
    linkList.appendChild(linkButton); // Append the link button to the link list
}

function saveLinks(links) {
    chrome.storage.local.set({ savedLinks: links }, () => {
        console.log('Links saved:', links);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById("scan");
    loadLinks(); // Load links when the popup is opened

    if (scanButton) {
        scanButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "captureScreen" }, async (response) => {
                if (response && response.dataUrl) {
                    const url = response.dataUrl;
                    const qrCodeData = await decodeQRCode(url);

                    if (qrCodeData) {
                        let resultText = `QR Code Data: <b>${qrCodeData}</b>`;
                        document.getElementById("result").innerHTML = resultText;

                        // Create a new list item
                        const listItem = document.createElement("li");
                        
                        // Create an anchor element
                        const link = document.createElement("a");
                        link.href = qrCodeData; // Set the link URL
                        link.target = "_blank"; // Open in a new tab
                        link.textContent = qrCodeData; // Display the QR code data
                        
                        // // Append the anchor to the list item
                        // listItem.appendChild(link);
                        // // Append the list item to the ordered list
                        // document.getElementById("linkList").appendChild(listItem);

                        // Save the new link to storage
                        chrome.storage.local.get('savedLinks', (data) => {
                            const links = data.savedLinks || [];
                            links.push(qrCodeData);
                            saveLinks(links); // Save updated links
                            loadLinks(); // Reload the links
                        });
                    }
                }
            });
        });
    }
});