"use strict";

/* ============================================================
   UNIVERSAL SCANNER
   QR / BARCODE SCANNER + DOCUMENT OCR
   ============================================================ */


/* ============================================================
   CONFIG
   ============================================================ */

const SCANNER_CONFIG = {
    maxScanHistory: 20,

    duplicateScanDelay: 2500,

    maxOcrFileSize: 10 * 1024 * 1024,

    maxOcrDimension: 2500,

    cameraStartTimeout: 15000
};


/* ============================================================
   STATE
   ============================================================ */

let codeReader = null;

let cameraActive = false;

let cameraStarting = false;

let scanHistory = [];

let lastScanValue = null;

let lastScanTime = 0;

let selectedCameraId = null;

let ocrRunning = false;


/* ============================================================
   DOM READY
   ============================================================ */

function initUniversalScanner() {

    const codeTabBtn =
        document.getElementById("tab-btn-code");

    const ocrTabBtn =
        document.getElementById("tab-btn-ocr");

    const startScanningBtn =
        document.getElementById("camera");

    const toggleCameraBtn =
        document.getElementById("camera-toggle-btn");

    const cameraSelect =
        document.getElementById("camera-select");

    const ocrCameraBtn =
        document.getElementById("ocr-camera-btn");

    const ocrUploadBtn =
        document.getElementById("ocr-upload-btn");

    const ocrExtractBtn =
        document.getElementById("ocr-extract-btn");

    const ocrCopyBtn =
        document.getElementById("ocr-copy-btn");

    const ocrCameraInput =
        document.getElementById("ocr-camera-input");

    const ocrUploadInput =
        document.getElementById("ocr-upload-input");


    /* ========================================================
       TAB EVENTS
       ======================================================== */

    codeTabBtn?.addEventListener(
        "click",
        () => switchTab("code")
    );

    ocrTabBtn?.addEventListener(
        "click",
        () => switchTab("ocr")
    );


    /* ========================================================
       CAMERA EVENTS
       ======================================================== */

    startScanningBtn?.addEventListener(
        "click",
        startScanningFromHero
    );

    toggleCameraBtn?.addEventListener(
        "click",
        toggleCamera
    );

    cameraSelect?.addEventListener(
        "change",
        handleCameraSelectionChange
    );


    /* ========================================================
       OCR EVENTS
       ======================================================== */

    ocrCameraBtn?.addEventListener(
        "click",
        triggerOcrCamera
    );

    ocrUploadBtn?.addEventListener(
        "click",
        triggerOcrUpload
    );

    ocrExtractBtn?.addEventListener(
        "click",
        runOcr
    );

    ocrCopyBtn?.addEventListener(
        "click",
        copyOcrText
    );


    /* ========================================================
       OCR INPUT EVENTS
       ======================================================== */

    ocrCameraInput?.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files?.[0];

            handleOcrFile(file);

            event.target.value = "";

        }
    );


    ocrUploadInput?.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files?.[0];

            handleOcrFile(file);

            event.target.value = "";

        }
    );


    /* ========================================================
       DYNAMIC COPY BUTTONS
       ======================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target instanceof Element
                    ? event.target
                    : null;

            if (!target) {
                return;
            }


            const copyButton =
                target.closest(
                    "[data-copy-value]"
                );


            if (!copyButton) {
                return;
            }


            const value =
                copyButton.getAttribute(
                    "data-copy-value"
                ) || "";


            copyToClipboard(value);

        }
    );


    /* ========================================================
       CAMERA CLEANUP
       ======================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden &&
                cameraActive
            ) {

                stopCamera();

            }

        }
    );


    window.addEventListener(
        "pagehide",
        function () {

            if (cameraActive) {

                stopCamera();

            }

        }
    );


    window.addEventListener(
        "beforeunload",
        function () {

            if (cameraActive) {

                stopCamera();

            }

        }
    );


    /* ========================================================
       INITIAL UI
       ======================================================== */

    renderScanHistory();

}


/* ============================================================
   INITIALIZATION
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initUniversalScanner,
        {
            once: true
        }
    );

} else {

    initUniversalScanner();

}


/* ============================================================
   TAB SWITCHING
   ============================================================ */

function switchTab(tab) {

    const codeButton =
        document.getElementById(
            "tab-btn-code"
        );

    const ocrButton =
        document.getElementById(
            "tab-btn-ocr"
        );

    const codeTab =
        document.getElementById(
            "tab-code"
        );

    const ocrTab =
        document.getElementById(
            "tab-ocr"
        );


    const isCode =
        tab === "code";


    codeButton?.classList.toggle(
        "active",
        isCode
    );


    ocrButton?.classList.toggle(
        "active",
        !isCode
    );


    codeTab?.classList.toggle(
        "hidden",
        !isCode
    );


    ocrTab?.classList.toggle(
        "hidden",
        isCode
    );


    if (
        !isCode &&
        cameraActive
    ) {

        stopCamera();

    }

}


/* ============================================================
   CAMERA ERROR
   ============================================================ */

function showCameraError(message) {

    const element =
        document.getElementById(
            "camera-err"
        );


    if (!element) {
        return;
    }


    element.textContent =
        String(message || "Camera error");


    element.classList.add(
        "show"
    );

}


function clearCameraError() {

    const element =
        document.getElementById(
            "camera-err"
        );


    if (!element) {
        return;
    }


    element.textContent = "";

    element.classList.remove(
        "show"
    );

}


/* ============================================================
   START SCANNING FROM HERO
   ============================================================ */

function startScanningFromHero() {

    if (
        cameraActive ||
        cameraStarting
    ) {
        return;
    }


    toggleCamera();

}


/* ============================================================
   CHECK CAMERA SUPPORT
   ============================================================ */

function hasCameraSupport() {

    return Boolean(
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia ===
            "function"
    );

}


/* ============================================================
   GET VIDEO DEVICES
   ============================================================ */

async function getVideoDevices() {

    if (
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.enumerateDevices !==
            "function"
    ) {

        return [];

    }


    const devices =
        await navigator.mediaDevices.enumerateDevices();


    return devices.filter(
        function (device) {

            return (
                device.kind ===
                "videoinput"
            );

        }
    );

}


/* ============================================================
   REQUEST CAMERA PERMISSION
   ============================================================ */

async function requestCameraPermission() {

    const stream =
        await navigator.mediaDevices.getUserMedia(
            {
                video: true,
                audio: false
            }
        );


    stream
        .getTracks()
        .forEach(
            function (track) {

                try {
                    track.stop();
                } catch (_) {}

            }
        );

}


/* ============================================================
   CAMERA DEVICE SETUP
   ============================================================ */

async function prepareCameraDevices() {

    let devices =
        await getVideoDevices();


    /*
     * Before permission is granted some browsers may return
     * no devices or devices without labels.
     */

    const needsPermission =
        devices.length === 0 ||
        devices.every(
            function (device) {

                return !device.label;

            }
        );


    if (needsPermission) {

        await requestCameraPermission();

        devices =
            await getVideoDevices();

    }


    return devices;

}


/* ============================================================
   POPULATE CAMERA SELECT
   ============================================================ */

function populateCameraSelect(devices) {

    const select =
        document.getElementById(
            "camera-select"
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    devices.forEach(
        function (device, index) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                device.deviceId;


            option.textContent =
                device.label ||
                `Camera ${index + 1}`;


            select.appendChild(
                option
            );

        }
    );


    /*
     * Prefer rear/environment camera.
     */

    const backCamera =
        devices.find(
            function (device) {

                return /back|rear|environment/i
                    .test(
                        device.label || ""
                    );

            }
        );


    if (selectedCameraId) {

        const stillExists =
            devices.some(
                function (device) {

                    return (
                        device.deviceId ===
                        selectedCameraId
                    );

                }
            );


        if (!stillExists) {

            selectedCameraId =
                null;

        }

    }


    if (!selectedCameraId) {

        selectedCameraId =
            backCamera?.deviceId ||
            devices[0]?.deviceId ||
            null;

    }


    if (selectedCameraId) {

        select.value =
            selectedCameraId;

    }


    if (
        devices.length > 1
    ) {

        select.classList.remove(
            "hidden"
        );

    } else {

        select.classList.add(
            "hidden"
        );

    }

}


/* ============================================================
   TOGGLE CAMERA
   ============================================================ */

async function toggleCamera() {

    if (
        cameraStarting
    ) {
        return;
    }


    if (
        cameraActive
    ) {

        stopCamera();

        return;

    }


    clearCameraError();


    if (
        typeof ZXing ===
        "undefined"
    ) {

        showCameraError(
            "The barcode scanner library could not be loaded. Please reload the page."
        );

        return;

    }


    if (
        typeof ZXing.BrowserMultiFormatReader !==
        "function"
    ) {

        showCameraError(
            "The barcode scanner library is unavailable. Please reload the page."
        );

        return;

    }


    if (!hasCameraSupport()) {

        showCameraError(
            "Camera access is not supported by this browser. Use a modern browser over HTTPS."
        );

        return;

    }


    const button =
        document.getElementById(
            "camera-toggle-btn"
        );


    if (!button) {
        return;
    }


    cameraStarting = true;

    button.disabled = true;

    button.textContent =
        "Starting camera…";


    try {

        /*
         * Create reader once.
         */

        if (!codeReader) {

            codeReader =
                new ZXing.BrowserMultiFormatReader();

        }


        /*
         * Get cameras using the browser API.
         *
         * IMPORTANT:
         * Do not use:
         *
         * ZXing.BrowserCodeReader.listVideoInputDevices()
         *
         */

        const devices =
            await prepareCameraDevices();


        if (!devices.length) {

            throw createCameraError(
                "NotFoundError",
                "No camera was found on this device."
            );

        }


        populateCameraSelect(
            devices
        );


        const select =
            document.getElementById(
                "camera-select"
            );


        selectedCameraId =
            select &&
            !select.classList.contains(
                "hidden"
            )
                ? select.value
                : (
                    selectedCameraId ||
                    devices[0].deviceId
                );


        /*
         * Reset the reader before a new session.
         */

        try {

            codeReader.reset();

        } catch (_) {}


        /*
         * UI before start.
         */

        document
            .getElementById(
                "scan-idle-msg"
            )
            ?.classList.add(
                "hidden"
            );


        const frame =
            document.getElementById(
                "scan-frame"
            );


        if (frame) {

            frame.style.display =
                "block";

        }


        document
            .getElementById(
                "scanner-hero"
            )
            ?.classList.add(
                "hidden"
            );


        /*
         * Start ZXing.
         */

        codeReader.decodeFromVideoDevice(
            selectedCameraId || undefined,
            "scan-video",
            function (result, error) {

                if (result) {

                    handleScanResult(
                        result
                    );

                }

                /*
                 * ZXing reports "not found" continuously
                 * while looking for a barcode.
                 *
                 * Do not display this as an error.
                 */

            }
        );


        /*
         * Mark active only after decoder was started.
         */

        cameraActive = true;

        button.textContent =
            "Stop Camera";


    } catch (error) {

        console.error(
            "Camera start error:",
            error
        );


        cameraActive =
            false;


        let message =
            "Couldn't access the camera.";


        switch (
            error?.name
        ) {

            case "NotAllowedError":

                message =
                    "Camera permission was denied. Allow camera access in your browser settings and try again.";

                break;


            case "NotFoundError":

                message =
                    "No camera was found on this device.";

                break;


            case "NotReadableError":

                message =
                    "The camera is already being used by another application or could not be opened.";

                break;


            case "OverconstrainedError":

                message =
                    "The selected camera is unavailable. Please choose another camera.";

                break;


            case "SecurityError":

                message =
                    "Camera access is blocked by browser security settings. Make sure the site is using HTTPS.";

                break;


            case "AbortError":

                message =
                    "Camera startup was interrupted. Please try again.";

                break;


            default:

                if (
                    error?.message
                ) {

                    message =
                        error.message;

                }

        }


        showCameraError(
            message
        );


        document
            .getElementById(
                "scan-idle-msg"
            )
            ?.classList.remove(
                "hidden"
            );


        document
            .getElementById(
                "scanner-hero"
            )
            ?.classList.remove(
                "hidden"
            );


        const frame =
            document.getElementById(
                "scan-frame"
            );


        if (frame) {

            frame.style.display =
                "none";

        }


        try {

            codeReader?.reset();

        } catch (_) {}

    } finally {

        cameraStarting =
            false;


        button.disabled =
            false;


        if (!cameraActive) {

            button.textContent =
                "Start Camera";

        }

    }

}


/* ============================================================
   CAMERA ERROR OBJECT
   ============================================================ */

function createCameraError(
    name,
    message
) {

    const error =
        new Error(message);


    error.name =
        name;


    return error;

}


/* ============================================================
   CAMERA SWITCH
   ============================================================ */

async function handleCameraSelectionChange(
    event
) {

    const value =
        event.target.value;


    if (!value) {
        return;
    }


    selectedCameraId =
        value;


    if (!cameraActive) {

        return;

    }


    /*
     * Stop current camera first.
     */

    stopCamera();


    /*
     * Start the selected camera again.
     */

    await new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                100
            );

        }
    );


    toggleCamera();

}


/* ============================================================
   STOP CAMERA
   ============================================================ */

function stopCamera() {

    cameraStarting =
        false;


    if (codeReader) {

        try {

            codeReader.reset();

        } catch (error) {

            console.warn(
                "Scanner reset failed:",
                error
            );

        }

    }


    const video =
        document.getElementById(
            "scan-video"
        );


    /*
     * Stop native tracks as extra cleanup.
     */

    if (
        video &&
        video.srcObject instanceof MediaStream
    ) {

        video.srcObject
            .getTracks()
            .forEach(
                function (track) {

                    try {
                        track.stop();
                    } catch (_) {}

                }
            );


        video.srcObject =
            null;

    }


    cameraActive =
        false;


    const button =
        document.getElementById(
            "camera-toggle-btn"
        );


    if (button) {

        button.textContent =
            "Start Camera";

        button.disabled =
            false;

    }


    const frame =
        document.getElementById(
            "scan-frame"
        );


    if (frame) {

        frame.style.display =
            "none";

    }


    document
        .getElementById(
            "scan-idle-msg"
        )
        ?.classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "scanner-hero"
        )
        ?.classList.remove(
            "hidden"
        );

}


/* ============================================================
   HANDLE SCAN
   ============================================================ */

function handleScanResult(result) {

    if (!result) {
        return;
    }


    const value =
        String(
            result.getText() || ""
        ).trim();


    if (!value) {
        return;
    }


    const now =
        Date.now();


    /*
     * Prevent duplicate reads.
     */

    if (
        value === lastScanValue &&
        now - lastScanTime <
            SCANNER_CONFIG.duplicateScanDelay
    ) {

        return;

    }


    lastScanValue =
        value;


    lastScanTime =
        now;


    let formatName =
        "CODE";


    try {

        formatName =
            ZXing.BarcodeFormat[
                result.getBarcodeFormat()
            ] ||
            formatName;

    } catch (_) {}


    const entry = {

        value:

            value,

        format:

            formatName,

        time:

            new Date()

    };


    scanHistory.unshift(
        entry
    );


    if (
        scanHistory.length >
        SCANNER_CONFIG.maxScanHistory
    ) {

        scanHistory =
            scanHistory.slice(
                0,
                SCANNER_CONFIG.maxScanHistory
            );

    }


    renderScanResult(
        entry
    );


    renderScanHistory();


    if (
        typeof navigator.vibrate ===
        "function"
    ) {

        try {

            navigator.vibrate(80);

        } catch (_) {}

    }

}


/* ============================================================
   CLASSIFY SCANNED VALUE
   ============================================================ */

function classifyScanValue(
    value
) {

    const text =
        String(value || "").trim();


    if (
        /^https?:\/\//i.test(
            text
        )
    ) {

        return {
            type: "url"
        };

    }


    if (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(text)
    ) {

        return {
            type: "email"
        };

    }


    if (
        /^\+?\d[\d\s-]{7,14}\d$/
            .test(text)
    ) {

        return {
            type: "phone"
        };

    }


    try {

        const parsed =
            JSON.parse(text);


        if (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
        ) {

            return {

                type:
                    "json",

                data:
                    parsed

            };

        }

    } catch (_) {}


    return {
        type: "text"
    };

}


/* ============================================================
   SAFE URL
   ============================================================ */

function getSafeUrl(
    value
) {

    try {

        const url =
            new URL(
                String(value || "").trim()
            );


        /*
         * Only allow normal web URLs.
         *
         * This prevents javascript:, data:, file:
         * and other dangerous schemes from being opened.
         */

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return null;

        }


        return url.href;

    } catch (_) {

        return null;

    }

}


/* ============================================================
   RENDER SCAN RESULT
   ============================================================ */

function renderScanResult(
    entry
) {

    const card =
        document.getElementById(
            "scan-result-card"
        );


    if (!card) {
        return;
    }


    const value =
        entry.value;


    const format =
        entry.format;


    const classified =
        classifyScanValue(
            value
        );


    const typeBadgeMap = {

        url:
            [
                "rt-url",
                "Link"
            ],

        email:
            [
                "rt-email",
                "Email"
            ],

        phone:
            [
                "rt-phone",
                "Phone number"
            ],

        json:
            [
                "rt-json",
                "Structured data"
            ],

        text:
            [
                "rt-text",
                format
            ]

    };


    const badge =
        typeBadgeMap[
            classified.type
        ] ||
        typeBadgeMap.text;


    let bodyHtml =
        "";

    let actionsHtml =
        "";


    /* ========================================================
       JSON
       ======================================================== */

    if (
        classified.type ===
        "json"
    ) {

        bodyHtml =
            `
            <div class="json-kv">
                ${
                    Object.entries(
                        classified.data
                    )
                    .map(
                        function ([key, value]) {

                            return `
                                <div class="k">
                                    ${escapeHtml(key)}
                                </div>

                                <div class="v">
                                    ${escapeHtml(
                                        String(value)
                                    )}
                                </div>
                            `;

                        }
                    )
                    .join("")
                }
            </div>
            `;

    } else {

        bodyHtml =
            `
            <div class="result-value">
                ${escapeHtml(value)}
            </div>
            `;

    }


    /* ========================================================
       URL
       ======================================================== */

    if (
        classified.type ===
        "url"
    ) {

        const safeUrl =
            getSafeUrl(value);


        if (safeUrl) {

            actionsHtml +=
                `
                <a
                    class="btn btn-sage"
                    href="${escapeHtml(
                        safeUrl
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open link ↗
                </a>
                `;

        }

    }


    /* ========================================================
       EMAIL
       ======================================================== */

    else if (
        classified.type ===
        "email"
    ) {

        actionsHtml +=
            `
            <a
                class="btn btn-sage"
                href="mailto:${encodeURIComponent(
                    value
                )}"
            >
                Send email
            </a>
            `;

    }


    /* ========================================================
       PHONE
       ======================================================== */

    else if (
        classified.type ===
        "phone"
    ) {

        const phone =
            value.replace(
                /[^+\d]/g,
                ""
            );


        actionsHtml +=
            `
            <a
                class="btn btn-sage"
                href="tel:${escapeHtml(
                    phone
                )}"
            >
                Call
            </a>
            `;

    }


    /* ========================================================
       COPY BUTTON
       ======================================================== */

    actionsHtml +=
        `
        <button
            type="button"
            class="btn btn-ghost"
            data-copy-value="${escapeHtml(
                value
            )}"
        >
            Copy
        </button>
        `;


    card.innerHTML =
        `
        <span class="result-type ${escapeHtml(
            badge[0]
        )}">
            ${escapeHtml(
                badge[1]
            )}
        </span>

        ${bodyHtml}

        <div class="result-actions">
            ${actionsHtml}
        </div>
        `;

}


/* ============================================================
   RENDER HISTORY
   ============================================================ */

function renderScanHistory() {

    const container =
        document.getElementById(
            "scan-history"
        );


    if (!container) {
        return;
    }


    if (
        scanHistory.length === 0
    ) {

        container.innerHTML =
            `
            <div class="empty-state">
                No scans yet — point the camera at a QR code or barcode.
            </div>
            `;

        return;

    }


    container.innerHTML =
        scanHistory
            .map(
                function (item) {

                    const time =
                        item.time.toLocaleTimeString(
                            "en-IN",
                            {
                                hour:
                                    "2-digit",

                                minute:
                                    "2-digit"
                            }
                        );


                    return `
                        <div class="history-item">

                            <div>

                                <div class="hv">
                                    ${escapeHtml(
                                        item.value
                                    )}
                                </div>

                                <div class="ht">
                                    ${escapeHtml(
                                        item.format
                                    )}
                                    ·
                                    ${escapeHtml(
                                        time
                                    )}
                                </div>

                            </div>


                            <button
                                type="button"
                                class="btn btn-ghost"
                                style="padding:6px 10px; font-size:12px;"
                                data-copy-value="${escapeHtml(
                                    item.value
                                )}"
                            >
                                Copy
                            </button>

                        </div>
                    `;

                }
            )
            .join("");

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   CLIPBOARD
   ============================================================ */

async function copyToClipboard(
    text
) {

    const value =
        String(
            text ?? ""
        );


    if (!value) {
        return;
    }


    try {

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
                "function"
        ) {

            await navigator.clipboard.writeText(
                value
            );

            return;

        }


        /*
         * Fallback for older browsers.
         */

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            value;


        textarea.setAttribute(
            "readonly",
            ""
        );


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    } catch (error) {

        console.warn(
            "Clipboard copy failed:",
            error
        );

    }

}


/* ============================================================
   OCR — CAMERA
   ============================================================ */

function triggerOcrCamera() {

    const input =
        document.getElementById(
            "ocr-camera-input"
        );


    input?.click();

}


/* ============================================================
   OCR — UPLOAD
   ============================================================ */

function triggerOcrUpload() {

    const input =
        document.getElementById(
            "ocr-upload-input"
        );


    input?.click();

}


/* ============================================================
   OCR FILE
   ============================================================ */

function handleOcrFile(
    file
) {

    if (!file) {
        return;
    }


    /*
     * Only images.
     */

    if (
        !file.type ||
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please select an image file."
        );

        return;

    }


    /*
     * Prevent very large files from consuming excessive memory.
     */

    if (
        file.size >
        SCANNER_CONFIG.maxOcrFileSize
    ) {

        alert(
            "This image is too large. Please choose an image smaller than 10 MB."
        );

        return;

    }


    if (ocrRunning) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const preview =
                document.getElementById(
                    "ocr-preview-img"
                );


            const previewWrap =
                document.getElementById(
                    "ocr-preview-wrap"
                );


            const extractButton =
                document.getElementById(
                    "ocr-extract-btn"
                );


            const resultWrap =
                document.getElementById(
                    "ocr-result-wrap"
                );


            if (
                !preview ||
                !event.target?.result
            ) {

                return;

            }


            preview.src =
                event.target.result;


            previewWrap?.classList.remove(
                "hidden"
            );


            extractButton?.classList.remove(
                "hidden"
            );


            resultWrap?.classList.add(
                "hidden"
            );

        };


    reader.onerror =
        function () {

            alert(
                "The image could not be read. Please try another image."
            );

        };


    reader.readAsDataURL(
        file
    );

}


/* ============================================================
   RESIZE OCR IMAGE
   ============================================================ */

async function prepareOcrImage(
    imageSource
) {

    return new Promise(
        function (resolve, reject) {

            const image =
                new Image();


            image.onload =
                function () {

                    let width =
                        image.naturalWidth;

                    let height =
                        image.naturalHeight;


                    if (
                        !width ||
                        !height
                    ) {

                        reject(
                            new Error(
                                "Invalid image dimensions."
                            )
                        );

                        return;

                    }


                    const maxDimension =
                        SCANNER_CONFIG.maxOcrDimension;


                    if (
                        width >
                            maxDimension ||
                        height >
                            maxDimension
                    ) {

                        const scale =
                            Math.min(
                                maxDimension /
                                    width,

                                maxDimension /
                                    height
                            );


                        width =
                            Math.round(
                                width *
                                    scale
                            );


                        height =
                            Math.round(
                                height *
                                    scale
                            );

                    }


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;


                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    if (!context) {

                        reject(
                            new Error(
                                "Canvas is not supported."
                            )
                        );

                        return;

                    }


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    /*
                     * JPEG keeps memory/use reasonable for OCR.
                     */

                    resolve(
                        canvas.toDataURL(
                            "image/jpeg",
                            0.88
                        )
                    );

                };


            image.onerror =
                function () {

                    reject(
                        new Error(
                            "Image could not be decoded."
                        )
                    );

                };


            image.src =
                imageSource;

        }
    );

}


/* ============================================================
   RUN OCR
   ============================================================ */

async function runOcr() {

    if (ocrRunning) {
        return;
    }


    if (
        typeof Tesseract ===
        "undefined"
    ) {

        alert(
            "The OCR library could not be loaded. Please reload the page."
        );

        return;

    }


    const image =
        document.getElementById(
            "ocr-preview-img"
        );


    const extractButton =
        document.getElementById(
            "ocr-extract-btn"
        );


    const progressWrap =
        document.getElementById(
            "ocr-progress"
        );


    const progressFill =
        document.getElementById(
            "ocr-progress-fill"
        );


    const progressLabel =
        document.getElementById(
            "ocr-progress-label"
        );


    if (
        !image ||
        !image.src
    ) {

        alert(
            "Please select an image first."
        );

        return;

    }


    ocrRunning =
        true;


    if (extractButton) {

        extractButton.disabled =
            true;

        extractButton.textContent =
            "Reading…";

    }


    progressWrap?.classList.remove(
        "hidden"
    );


    if (progressFill) {

        progressFill.style.width =
            "0%";

    }


    if (progressLabel) {

        progressLabel.textContent =
            "Preparing image…";

    }


    try {

        /*
         * Resize before sending to Tesseract.
         */

        const preparedImage =
            await prepareOcrImage(
                image.src
            );


        if (progressLabel) {

            progressLabel.textContent =
                "Loading text recognizer…";

        }


        const result =
            await Tesseract.recognize(
                preparedImage,
                "eng",
                {

                    logger:
                        function (message) {

                            if (
                                !message
                            ) {
                                return;
                            }


                            if (
                                message.status ===
                                "recognizing text"
                            ) {

                                const progress =
                                    Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Math.round(
                                                Number(
                                                    message.progress ||
                                                    0
                                                ) *
                                                100
                                            )
                                        )
                                    );


                                if (progressLabel) {

                                    progressLabel.textContent =
                                        `Reading document… ${progress}%`;

                                }


                                if (progressFill) {

                                    progressFill.style.width =
                                        `${progress}%`;

                                }

                            } else if (
                                message.status
                            ) {

                                const status =
                                    String(
                                        message.status
                                    );


                                if (progressLabel) {

                                    progressLabel.textContent =
                                        status
                                            .charAt(0)
                                            .toUpperCase() +
                                        status.slice(1) +
                                        "…";

                                }

                            }

                        }

                }
            );


        const text =
            String(
                result?.data?.text ||
                ""
            ).trim();


        const output =
            document.getElementById(
                "ocr-text-output"
            );


        if (output) {

            output.value =
                text ||
                "(No text was recognized in this image.)";

        }


        renderOcrDetectedChips(
            text
        );


        document
            .getElementById(
                "ocr-result-wrap"
            )
            ?.classList.remove(
                "hidden"
            );


    } catch (error) {

        console.error(
            "OCR error:",
            error
        );


        alert(
            "Couldn't read the document. Try a clearer, well-lit image."
        );


    } finally {

        ocrRunning =
            false;


        if (extractButton) {

            extractButton.disabled =
                false;

            extractButton.textContent =
                "Extract text";

        }


        progressWrap?.classList.add(
            "hidden"
        );

    }

}


/* ============================================================
   OCR DETECTED DETAILS
   ============================================================ */

function renderOcrDetectedChips(
    text
) {

    const cleanText =
        String(
            text || ""
        );


    const chips = [];


    /* ========================================================
       EMAILS
       ======================================================== */

    const emails =
        cleanText.match(
            /[^\s@]+@[^\s@]+\.[^\s@]+/g
        ) || [];


    emails.forEach(
        function (value) {

            const safeValue =
                value.trim();


            chips.push(
                `
                <span class="chip">
                    ✉
                    <a
                        href="mailto:${encodeURIComponent(
                            safeValue
                        )}"
                    >
                        ${escapeHtml(
                            safeValue
                        )}
                    </a>
                </span>
                `
            );

        }
    );


    /* ========================================================
       URLS
       ======================================================== */

    const urls =
        cleanText.match(
            /https?:\/\/[^\s<>"']+/gi
        ) || [];


    urls.forEach(
        function (value) {

            /*
             * Remove common punctuation accidentally captured
             * at the end of a sentence.
             */

            const cleanedUrl =
                value.replace(
                    /[),.;!?]+$/,
                    ""
                );


            const safeUrl =
                getSafeUrl(
                    cleanedUrl
                );


            if (!safeUrl) {
                return;
            }


            chips.push(
                `
                <span class="chip">
                    🔗
                    <a
                        href="${escapeHtml(
                            safeUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeHtml(
                            safeUrl
                        )}
                    </a>
                </span>
                `
            );

        }
    );


    /* ========================================================
       PHONE NUMBERS
       ======================================================== */

    const phones =
        cleanText.match(
            /\+?\d[\d\s-]{8,14}\d/g
        ) || [];


    phones.forEach(
        function (value) {

            const displayPhone =
                value.trim();


            const telPhone =
                displayPhone.replace(
                    /[^\d+]/g,
                    ""
                );


            chips.push(
                `
                <span class="chip">
                    ☎
                    <a
                        href="tel:${escapeHtml(
                            telPhone
                        )}"
                    >
                        ${escapeHtml(
                            displayPhone
                        )}
                    </a>
                </span>
                `
            );

        }
    );


    /* ========================================================
       DATES
       ======================================================== */

    const dates =
        cleanText.match(
            /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g
        ) || [];


    dates.forEach(
        function (value) {

            chips.push(
                `
                <span class="chip">
                    📅
                    ${escapeHtml(
                        value
                    )}
                </span>
                `
            );

        }
    );


    const container =
        document.getElementById(
            "ocr-detected-chips"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        chips.length > 0
            ? chips.join("")
            : `
                <span
                    class="chip"
                    style="background:transparent;"
                >
                    No emails, links, phone numbers,
                    or dates detected.
                </span>
            `;

}


/* ============================================================
   COPY OCR TEXT
   ============================================================ */

function copyOcrText() {

    const output =
        document.getElementById(
            "ocr-text-output"
        );


    if (!output) {
        return;
    }


    copyToClipboard(
        output.value
    );

}


/*function switchTab(tab){
  document.getElementById('tab-btn-code').classList.toggle('active', tab==='code');
  document.getElementById('tab-btn-ocr').classList.toggle('active', tab==='ocr');
  document.getElementById('tab-code').classList.toggle('hidden', tab!=='code');
  document.getElementById('tab-ocr').classList.toggle('hidden', tab!=='ocr');
  // stop the camera when leaving the code-scanner tab, so it isn't left running in the background
  if(tab !== 'code' && cameraActive) stopCamera();
}

let codeReader = null;
let cameraActive = false;
let scanHistory = [];
let lastScanValue = null, lastScanTime = 0;

function showCameraError(msg){
  const el = document.getElementById('camera-err');
  el.textContent = msg;
  el.classList.add('show');
}
function clearCameraError(){
  document.getElementById('camera-err').classList.remove('show');
}
function startScanningFromHero(){
  if(!cameraActive) toggleCamera();
}

async function toggleCamera(){
  if(cameraActive){ stopCamera(); return; }
  clearCameraError();

  if(typeof ZXing === 'undefined'){
    showCameraError("The scanning library didn't load — check your internet connection and reload the page.");
    return;
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    showCameraError("This browser doesn't support camera access, or the page isn't loaded over HTTPS (camera access requires a secure connection).");
    return;
  }

  const btn = document.getElementById('camera-toggle-btn');
  btn.disabled = true;
  btn.textContent = 'Starting camera…';

  try{
    if(!codeReader) codeReader = new ZXing.BrowserMultiFormatReader();
    const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
    const select = document.getElementById('camera-select');
    if(devices.length > 1){
      select.innerHTML = devices.map((d,i)=>`<option value="${d.deviceId}">${d.label || 'Camera ' + (i+1)}</option>`).join('');
      // prefer a "back"/"rear" camera by default on phones with multiple cameras
      const backCam = devices.find(d=>/back|rear|environment/i.test(d.label));
      if(backCam) select.value = backCam.deviceId;
      select.classList.remove('hidden');
    } else {
      select.classList.add('hidden');
    }
    const deviceId = select.classList.contains('hidden') ? undefined : select.value;

    document.getElementById('scan-idle-msg').classList.add('hidden');
    document.getElementById('scan-frame').style.display = 'block';
    document.getElementById('scanner-hero').classList.add('hidden');

    codeReader.decodeFromVideoDevice(deviceId, 'scan-video', (result, err)=>{
      if(result) handleScanResult(result);
      // NotFoundException fires continuously while no code is in view — that's expected, not an error
    });

    cameraActive = true;
    btn.textContent = 'Stop Camera';
  }catch(err){
    let msg = "Couldn't access the camera.";
    if(err && err.name === 'NotAllowedError') msg = "Camera access was denied — allow camera permission in your browser settings and try again.";
    else if(err && err.name === 'NotFoundError') msg = "No camera was found on this device.";
    showCameraError(msg);
    document.getElementById('scan-idle-msg').classList.remove('hidden');
    document.getElementById('scanner-hero').classList.remove('hidden');
  }finally{
    btn.disabled = false;
    if(!cameraActive) btn.textContent = 'Start Camera';
  }
}

function stopCamera(){
  if(codeReader) codeReader.reset();
  cameraActive = false;
  document.getElementById('camera-toggle-btn').textContent = 'Start Camera';
  document.getElementById('scan-frame').style.display = 'none';
  document.getElementById('scan-idle-msg').classList.remove('hidden');
  document.getElementById('scanner-hero').classList.remove('hidden');
}

function handleScanResult(result){
  const value = result.getText();
  const now = Date.now();
  if(value === lastScanValue && (now - lastScanTime) < 2500) return; // debounce repeat reads of the same code
  lastScanValue = value;
  lastScanTime = now;

  let formatName = 'CODE';
  try{ formatName = ZXing.BarcodeFormat[result.getBarcodeFormat()] || formatName; }catch(e){}

  const entry = { value, format: formatName, time: new Date() };
  scanHistory.unshift(entry);
  if(scanHistory.length > 20) scanHistory.pop();

  renderScanResult(entry);
  renderScanHistory();
  if(navigator.vibrate) navigator.vibrate(80);
}

function classifyScanValue(value){
  if(/^https?:\/\//i.test(value)) return { type:'url' };
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return { type:'email' };
  if(/^\+?\d[\d\s-]{7,14}\d$/.test(value.trim())) return { type:'phone' };
  try{
    const parsed = JSON.parse(value);
    if(parsed && typeof parsed === 'object') return { type:'json', data:parsed };
  }catch(e){  not JSON — fall through  }
  return { type:'text' };
}

function renderScanResult(entry){
  const { value, format } = entry;
  const classified = classifyScanValue(value);
  const card = document.getElementById('scan-result-card');
  card.classList.remove('hidden');

  const typeBadgeMap = {
    url:   ['rt-url', 'Link'],
    email: ['rt-email', 'Email'],
    phone: ['rt-phone', 'Phone number'],
    json:  ['rt-json', 'Structured data'],
    text:  ['rt-text', format]
  };
  const [cls, label] = typeBadgeMap[classified.type];

  let bodyHtml = '';
  let actionsHtml = '';

  if(classified.type === 'json'){
    bodyHtml = `<div class="json-kv">` + Object.entries(classified.data).map(([k,v])=>
      `<div class="k">${escapeHtml(k)}</div><div class="v">${escapeHtml(String(v))}</div>`
    ).join('') + `</div>`;
  } else {
    bodyHtml = `<div class="result-value">${escapeHtml(value)}</div>`;
  }

  if(classified.type === 'url'){
    actionsHtml = `<a class="btn btn-sage" href="${encodeURI(value)}" target="_blank" rel="noopener">Open link ↗</a>`;
  } else if(classified.type === 'email'){
    actionsHtml = `<a class="btn btn-sage" href="mailto:${value}">Send email</a>`;
  } else if(classified.type === 'phone'){
    actionsHtml = `<a class="btn btn-sage" href="tel:${value.replace(/\s|-/g,'')}">Call</a>`;
  }
  actionsHtml += `<button class="btn btn-ghost" onclick="copyToClipboard(${JSON.stringify(value)})">Copy</button>`;

  card.innerHTML = `
    <span class="result-type ${cls}">${label}</span>
    ${bodyHtml}
    <div class="result-actions">${actionsHtml}</div>
  `;
}

function renderScanHistory(){
  const el = document.getElementById('scan-history');
  if(!scanHistory.length){ el.innerHTML = `<div class="empty-state">No scans yet — point the camera at a QR code or barcode.</div>`; return; }
  el.innerHTML = scanHistory.map(h=>`
    <div class="history-item">
      <div>
        <div class="hv">${escapeHtml(h.value)}</div>
        <div class="ht">${h.format} · ${h.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
      </div>
      <button class="btn btn-ghost" style="padding:6px 10px; font-size:12px;" onclick="copyToClipboard(${JSON.stringify(h.value)})">Copy</button>
    </div>
  `).join('');
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function copyToClipboard(text){
  navigator.clipboard.writeText(text).catch(()=>{});
}


function triggerOcrCamera(){ document.getElementById('ocr-camera-input').click(); }
function triggerOcrUpload(){ document.getElementById('ocr-upload-input').click(); }

function handleOcrFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    document.getElementById('ocr-preview-img').src = ev.target.result;
    document.getElementById('ocr-preview-wrap').classList.remove('hidden');
    document.getElementById('ocr-extract-btn').classList.remove('hidden');
    document.getElementById('ocr-result-wrap').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}
document.getElementById('ocr-camera-input').addEventListener('change', e=>{ handleOcrFile(e.target.files[0]); e.target.value=''; });
document.getElementById('ocr-upload-input').addEventListener('change', e=>{ handleOcrFile(e.target.files[0]); e.target.value=''; });

async function runOcr(){
  if(typeof Tesseract === 'undefined'){
    alert("The text-recognition library didn't load — check your internet connection and reload the page.");
    return;
  }
  const img = document.getElementById('ocr-preview-img');
  const extractBtn = document.getElementById('ocr-extract-btn');
  const progressWrap = document.getElementById('ocr-progress');
  const progressFill = document.getElementById('ocr-progress-fill');
  const progressLabel = document.getElementById('ocr-progress-label');

  extractBtn.disabled = true;
  progressWrap.classList.remove('hidden');
  progressFill.style.width = '0%';
  progressLabel.textContent = 'Loading text recognizer…';

  try{
    const result = await Tesseract.recognize(img.src, 'eng', {
      logger: m=>{
        if(m.status === 'recognizing text'){
          progressLabel.textContent = 'Reading document… ' + Math.round(m.progress*100) + '%';
          progressFill.style.width = Math.round(m.progress*100) + '%';
        } else {
          progressLabel.textContent = m.status.charAt(0).toUpperCase() + m.status.slice(1) + '…';
        }
      }
    });
    const text = result.data.text.trim();
    document.getElementById('ocr-text-output').value = text || '(No text was recognized in this image.)';
    renderOcrDetectedChips(text);
    document.getElementById('ocr-result-wrap').classList.remove('hidden');
  }catch(err){
    alert("Couldn't read the document — try a clearer, well-lit photo.");
  }finally{
    extractBtn.disabled = false;
    progressWrap.classList.add('hidden');
  }
}

function renderOcrDetectedChips(text){
  const chips = [];
  const emails = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) || [];
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  const phones = text.match(/\+?\d[\d\s-]{8,14}\d/g) || [];
  const dates = text.match(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g) || [];

  emails.forEach(v=>chips.push(`<span class="chip">✉ <a href="mailto:${v}">${escapeHtml(v)}</a></span>`));
  urls.forEach(v=>chips.push(`<span class="chip">🔗 <a href="${encodeURI(v)}" target="_blank" rel="noopener">${escapeHtml(v)}</a></span>`));
  phones.forEach(v=>chips.push(`<span class="chip">☎ <a href="tel:${v.replace(/\s|-/g,'')}">${escapeHtml(v)}</a></span>`));
  dates.forEach(v=>chips.push(`<span class="chip">📅 ${escapeHtml(v)}</span>`));

  const container = document.getElementById('ocr-detected-chips');
  container.innerHTML = chips.length ? chips.join('') : `<span class="chip" style="background:transparent;">No emails, links, phone numbers, or dates detected.</span>`;
}
function copyOcrText(){
  const text = document.getElementById('ocr-text-output').value;
  navigator.clipboard.writeText(text).catch(()=>{});
}*/
