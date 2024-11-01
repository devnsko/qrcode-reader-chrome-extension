document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById("scan");

    if (scanButton) {
        scanButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "captureScreen" }, (response) => {
                if (response && response.dataUrl) {
                    const img = new Image();
                    img.src = response.dataUrl;
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);

                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        const resultText = code ? `QR Code Data: ${code.data}` : "QR Code not found!";
                        document.getElementById("result").innerText = resultText;

                        // Переход по ссылке, если QR-код содержит URL
                        if (code && code.data) {
                            let url = code.data;

                            // Проверка на наличие протокола и добавление http://, если его нет
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'http://' + url;
                            }

                            const openLinkButton = document.createElement("button");
                            openLinkButton.innerText = "Open Link";
                            openLinkButton.addEventListener("click", () => {
                                chrome.tabs.create({ url: url });
                            });
                            document.body.appendChild(openLinkButton);
                        }
                    };
                }
            });
        });
    } else {
        console.error("Element with id 'scan' not found");
    }
});
