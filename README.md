# **QR Code Scanner** 📷

![QR Code Scanner](https://img.shields.io/badge/QR--Scanner-v1.0-blue.svg?style=for-the-badge)  
Scan QR codes directly from your browser screen with ease!

## **Description**
QR Code Scanner is a Chrome extension that captures your current tab's visible screen, scans it for QR codes, and instantly displays the result. Perfect for quickly accessing URLs or other embedded information on QR codes without needing a mobile device.

## **Features**
- Capture the visible part of any tab in Chrome.
- Automatically scans for QR codes within the captured image.
- Displays the decoded text or URL in the popup.
- Saved scans for easy access and deletion when needed.
- Stylish, minimalistic popup design for a clean user experience.

## **Screenshots**
| Feature | Screenshot |
|---------|------------|
| **Popup Interface** | ![Popup UI](https://github.com/devnsko/qrcode-reader-chrome-extension/blob/1c9f337477447606f7044d5653ba48a394995d2c/readme_imgs/screen-1.png) |
| **Scanning in Action** | ![Scanning Process](https://github.com/devnsko/qrcode-reader-chrome-extension/blob/1c9f337477447606f7044d5653ba48a394995d2c/readme_imgs/screen-2.png) |

## **Installation**
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right corner).
4. Click **Load unpacked** and select the folder containing this project.

Now, the extension is installed and ready to use!

## **Usage**
1. Open the extension by clicking the QR Code Scanner icon in your Chrome toolbar.
2. Click **Scan QR Code**.
3. Wait for the capture and decoding process.
4. Your scanned result will appear in the popup, with an option to save or delete it.

## **Project Structure**
- **background.js**: Handles screen capture and communicates with the popup.
- **manifest.json**: Manages permissions and configuration for Chrome.
- **popup.html / popup.js**: The UI and main logic for scanning and displaying QR code results.

## **Contributing**
Contributions are welcome! Feel free to submit a pull request with bug fixes, enhancements, or new features.

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **Credits**
Created by [Dev.nsko](https://github.com/devnsko).

---

### Enjoy seamless QR code scanning from your desktop browser!
