(() => {
    "use strict";

    // ============================================================
    // DOM HELPERS
    // ============================================================

    const $ = (id) => document.getElementById(id);

    const video = $("cameraVideo");
    const canvas = $("overlayCanvas");
    const ctx = canvas?.getContext("2d");

    const startCameraBtn = $("startCameraBtn");
    const cameraMessage = $("cameraMessage");

    const sensorMessage = $("sensorMessage");
    const sensorMessageText = $("sensorMessageText");
    const enableSensorsBtn = $("enableSensorsBtn");

    const captureBtn = $("captureBtn");
    const switchCameraBtn = $("switchCameraBtn");
    const torchBtn = $("torchBtn");
    const saveReadingBtn = $("saveReadingBtn");
    const backBtn = $("backBtn");
    const calibrateBtn = $("calibrateBtn");

    const modeLabel = $("modeLabel");
    const toolTitle = $("toolTitle");
    const toolDescription = $("toolDescription");

    const readoutValue = $("readoutValue");
    const readoutLabel = $("readoutLabel");

    const metricX = $("metricX");
    const metricY = $("metricY");
    const metricStatus = $("metricStatus");

    const markTools = $("markTools");
    const clearMarksBtn = $("clearMarksBtn");
    const referenceDistanceInput = $("referenceDistanceInput");
    const referenceUnit = $("referenceUnit");

    const historyList = $("historyList");
    const clearHistoryBtn = $("clearHistoryBtn");

    const toast = $("toast");


    // ============================================================
    // MODES
    // ============================================================

    const MODES = {
        level: {
            label: "Level",
            title: "Digital Level",
            description:
                "Place the phone flat on the surface. Zero means level."
        },

        plumb: {
            label: "Plumb",
            title: "Plumb / Vertical",
            description:
                "Hold the phone upright against the wall or frame."
        },

        angle: {
            label: "Angle",
            title: "Angle Finder",
            description:
                "Use device tilt to estimate the current angle."
        },

        slope: {
            label: "Slope",
            title: "Slope Meter",
            description:
                "Shows angle, percentage and approximate ratio."
        },

        grid: {
            label: "Grid",
            title: "Construction Grid",
            description:
                "Use the overlay as a visual alignment reference."
        },

        mark: {
            label: "Mark",
            title: "Camera Marking",
            description:
                "Tap two points to draw a reference line."
        }
    };


    // ============================================================
    // STORAGE
    // ============================================================

    const STORAGE_KEY =
        "buildskil_construction_camera_history_v1";


    // ============================================================
    // STATE
    // ============================================================

    let stream = null;
    let videoTrack = null;

    let cameraFacing = "environment";
    let torchOn = false;

    let currentMode = "level";

    let sensorActive = false;
    let sensorPermissionRequested = false;

    // Device orientation
    let alpha = 0;
    let beta = 0;
    let gamma = 0;

    // Calibration
    let calibration = {
        alpha: 0,
        beta: 0,
        gamma: 0
    };

    // Two-point marking
    let markPoints = [];


    // ============================================================
    // TOAST
    // ============================================================

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }


    // ============================================================
    // MODE
    // ============================================================

    function setMode(mode) {
        if (!MODES[mode]) {
            return;
        }

        currentMode = mode;

        document.querySelectorAll(".mode-btn").forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );
        });

        if (modeLabel) {
            modeLabel.textContent = MODES[mode].label;
        }

        if (toolTitle) {
            toolTitle.textContent = MODES[mode].title;
        }

        if (toolDescription) {
            toolDescription.textContent =
                MODES[mode].description;
        }

        if (markTools) {
            markTools.classList.toggle(
                "hidden",
                mode !== "mark"
            );
        }

        updateReadout();
        drawOverlay();
    }


    // ============================================================
    // CAMERA
    // ============================================================

    async function startCamera() {
        if (!navigator.mediaDevices?.getUserMedia) {
            showToast(
                "Camera is not supported in this browser."
            );
            return;
        }

        stopCamera();

        try {
            stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: cameraFacing
                        },
                        width: {
                            ideal: 1280
                        },
                        height: {
                            ideal: 720
                        }
                    },
                    audio: false
                });

            video.srcObject = stream;

            await video.play();

            videoTrack =
                stream.getVideoTracks()[0] || null;

            cameraMessage?.classList.add("hidden");

            if (captureBtn) {
                captureBtn.disabled = false;
            }

            if (switchCameraBtn) {
                switchCameraBtn.disabled = false;
            }

            if (torchBtn) {
                torchBtn.disabled = !videoTrack;
            }

            resizeCanvas();
            drawOverlay();

            await requestSensorPermission();

        } catch (error) {
            console.error(
                "Camera start error:",
                error
            );

            if (error.name === "NotAllowedError") {
                showToast(
                    "Camera permission was denied."
                );
            } else {
                showToast(
                    "Could not start the camera."
                );
            }
        }
    }


    function stopCamera() {
        if (stream) {
            stream
                .getTracks()
                .forEach((track) => track.stop());

            stream = null;
        }

        videoTrack = null;
        torchOn = false;
    }


    async function switchCamera() {
        cameraFacing =
            cameraFacing === "environment"
                ? "user"
                : "environment";

        await startCamera();
    }


    async function toggleTorch() {
        if (!videoTrack?.applyConstraints) {
            showToast(
                "Torch is not supported on this device."
            );

            return;
        }

        const capabilities =
            videoTrack.getCapabilities?.();

        if (!capabilities?.torch) {
            showToast(
                "Torch is not supported on this camera."
            );

            return;
        }

        torchOn = !torchOn;

        try {
            await videoTrack.applyConstraints({
                advanced: [
                    {
                        torch: torchOn
                    }
                ]
            });

            if (torchBtn) {
                torchBtn.textContent =
                    torchOn ? "◉" : "☼";
            }

        } catch (error) {
            console.error(
                "Torch error:",
                error
            );

            torchOn = false;

            showToast(
                "Could not change torch."
            );
        }
    }


    // ============================================================
    // DEVICE MOTION / ORIENTATION
    // ============================================================

    async function requestSensorPermission() {
        if (sensorPermissionRequested) {
            return;
        }

        sensorPermissionRequested = true;

        try {
            if (
                typeof DeviceOrientationEvent !== "undefined" &&
                typeof DeviceOrientationEvent.requestPermission ===
                    "function"
            ) {
                const permission =
                    await DeviceOrientationEvent.requestPermission();

                if (permission !== "granted") {
                    sensorMessage?.classList.remove("hidden");

                    if (sensorMessageText) {
                        sensorMessageText.textContent =
                            "Motion access was not granted.";
                    }

                    return;
                }
            }

            window.addEventListener(
                "deviceorientation",
                handleOrientation,
                true
            );

            sensorActive = true;

            sensorMessage?.classList.add("hidden");

            showToast(
                "Motion tools enabled."
            );

        } catch (error) {
            console.error(
                "Sensor permission error:",
                error
            );

            sensorMessage?.classList.remove("hidden");

            if (sensorMessageText) {
                sensorMessageText.textContent =
                    "Motion sensors are unavailable or permission was denied.";
            }
        }
    }


    function handleOrientation(event) {
        alpha =
            Number.isFinite(event.alpha)
                ? event.alpha
                : 0;

        beta =
            Number.isFinite(event.beta)
                ? event.beta
                : 0;

        gamma =
            Number.isFinite(event.gamma)
                ? event.gamma
                : 0;

        updateReadout();
        drawOverlay();
    }


    // ============================================================
    // CALIBRATION
    // ============================================================

    function calibrate() {
        calibration = {
            alpha,
            beta,
            gamma
        };

        showToast(
            "Current position calibrated."
        );

        updateReadout();
        drawOverlay();
    }


    function getTilt() {
        return {
            x: gamma - calibration.gamma,
            y: beta - calibration.beta
        };
    }


    // ============================================================
    // LEVEL
    // ============================================================

    function getLevelReading() {
        const {
            x,
            y
        } = getTilt();

        const absolute =
            Math.max(
                Math.abs(x),
                Math.abs(y)
            );

        let status = "TILT";

        if (absolute <= 1) {
            status = "LEVEL";
        } else if (absolute <= 3) {
            status = "NEAR";
        }

        return {
            x,
            y,
            absolute,
            status
        };
    }


    // ============================================================
    // PLUMB
    // ============================================================

    function getPlumbReading() {
        const calibratedBeta =
            beta - calibration.beta;

        const absoluteBeta =
            Math.abs(calibratedBeta);

        const deviation =
            Math.abs(
                absoluteBeta - 90
            );

        let status = "OFF";

        if (deviation <= 1) {
            status = "PLUMB";
        } else if (deviation <= 3) {
            status = "NEAR";
        }

        return {
            deviation,
            status
        };
    }


    // ============================================================
    // ANGLE
    // ============================================================

    function getAngleReading() {
        const angle =
            Math.abs(
                beta - calibration.beta
            );

        return {
            angle
        };
    }


    // ============================================================
    // SLOPE
    // ============================================================

    function getSlopeReading() {
        const angle =
            Math.abs(
                beta - calibration.beta
            );

        const slopePercent =
            Math.tan(
                angle * Math.PI / 180
            ) * 100;

        let ratio = "FLAT";

        if (slopePercent > 0.01) {
            ratio =
                `1:${(
                    100 / slopePercent
                ).toFixed(1)}`;
        }

        return {
            angle,
            slopePercent,
            ratio
        };
    }


    // ============================================================
    // UPDATE READOUT
    // ============================================================

    function updateReadout() {
        if (!readoutValue) {
            return;
        }

        if (currentMode === "level") {
            const reading =
                getLevelReading();

            readoutValue.textContent =
                `${reading.absolute.toFixed(1)}°`;

            readoutLabel.textContent =
                reading.status;

            metricX.textContent =
                `${reading.x.toFixed(1)}°`;

            metricY.textContent =
                `${reading.y.toFixed(1)}°`;

            metricStatus.textContent =
                reading.status;

            return;
        }

        if (currentMode === "plumb") {
            const reading =
                getPlumbReading();

            readoutValue.textContent =
                `${reading.deviation.toFixed(1)}°`;

            readoutLabel.textContent =
                reading.status;

            metricX.textContent =
                `${gamma.toFixed(1)}°`;

            metricY.textContent =
                `${beta.toFixed(1)}°`;

            metricStatus.textContent =
                reading.status;

            return;
        }

        if (currentMode === "angle") {
            const reading =
                getAngleReading();

            readoutValue.textContent =
                `${reading.angle.toFixed(1)}°`;

            readoutLabel.textContent =
                "ANGLE";

            metricX.textContent =
                `${alpha.toFixed(1)}°`;

            metricY.textContent =
                `${beta.toFixed(1)}°`;

            metricStatus.textContent =
                "LIVE";

            return;
        }

        if (currentMode === "slope") {
            const reading =
                getSlopeReading();

            readoutValue.textContent =
                `${reading.slopePercent.toFixed(1)}%`;

            readoutLabel.textContent =
                `${reading.angle.toFixed(1)}° · ${reading.ratio}`;

            metricX.textContent =
                `${reading.angle.toFixed(1)}°`;

            metricY.textContent =
                `${reading.slopePercent.toFixed(1)}%`;

            metricStatus.textContent =
                reading.ratio;

            return;
        }

        if (currentMode === "grid") {
            readoutValue.textContent =
                "GRID";

            readoutLabel.textContent =
                "ALIGNMENT";

            metricX.textContent =
                `${gamma.toFixed(1)}°`;

            metricY.textContent =
                `${beta.toFixed(1)}°`;

            metricStatus.textContent =
                "GUIDE";

            return;
        }

        if (currentMode === "mark") {
            const reference =
                Number(
                    referenceDistanceInput?.value || 0
                );

            readoutValue.textContent =
                `${markPoints.length}/2`;

            readoutLabel.textContent =
                "MARK POINTS";

            metricX.textContent = "—";
            metricY.textContent = "—";

            metricStatus.textContent =
                markPoints.length === 2
                    ? "READY"
                    : "TAP";

            return;
        }
    }


    // ============================================================
    // CANVAS
    // ============================================================

    function resizeCanvas() {
        if (!video || !canvas || !ctx) {
            return;
        }

        const rect =
            video.getBoundingClientRect();

        const dpr =
            Math.max(
                1,
                window.devicePixelRatio || 1
            );

        canvas.width =
            Math.round(
                rect.width * dpr
            );

        canvas.height =
            Math.round(
                rect.height * dpr
            );

        canvas.style.width =
            `${rect.width}px`;

        canvas.style.height =
            `${rect.height}px`;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function drawOverlay() {
        if (!canvas || !ctx || !video) {
            return;
        }

        const rect =
            video.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        if (currentMode === "grid") {
            drawGrid(
                width,
                height
            );
        }

        if (
            currentMode === "level" ||
            currentMode === "plumb" ||
            currentMode === "slope"
        ) {
            drawAlignmentGuides(
                width,
                height
            );
        }

        if (currentMode === "mark") {
            drawMarks(
                width,
                height
            );
        }
    }


    function drawGrid(width, height) {
        ctx.strokeStyle =
            "rgba(255,255,255,0.35)";

        ctx.lineWidth = 1;

        const verticalLines = 6;
        const horizontalLines = 8;

        for (
            let i = 1;
            i < verticalLines;
            i++
        ) {
            const x =
                (width * i) /
                verticalLines;

            ctx.beginPath();

            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);

            ctx.stroke();
        }

        for (
            let i = 1;
            i < horizontalLines;
            i++
        ) {
            const y =
                (height * i) /
                horizontalLines;

            ctx.beginPath();

            ctx.moveTo(0, y);
            ctx.lineTo(width, y);

            ctx.stroke();
        }

        ctx.strokeStyle =
            "rgba(82,212,141,0.8)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            width / 2,
            0
        );

        ctx.lineTo(
            width / 2,
            height
        );

        ctx.moveTo(
            0,
            height / 2
        );

        ctx.lineTo(
            width,
            height / 2
        );

        ctx.stroke();
    }


    function drawAlignmentGuides(width, height) {
        ctx.strokeStyle =
            "rgba(82,212,141,0.75)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            0,
            height / 2
        );

        ctx.lineTo(
            width,
            height / 2
        );

        ctx.moveTo(
            width / 2,
            0
        );

        ctx.lineTo(
            width / 2,
            height
        );

        ctx.stroke();
    }


    function drawMarks(width, height) {
        if (!markPoints.length) {
            return;
        }

        ctx.strokeStyle =
            "#52d48d";

        ctx.fillStyle =
            "#52d48d";

        ctx.lineWidth = 3;

        markPoints.forEach((point) => {
            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        if (markPoints.length !== 2) {
            return;
        }

        const pointA =
            markPoints[0];

        const pointB =
            markPoints[1];

        ctx.beginPath();

        ctx.moveTo(
            pointA.x,
            pointA.y
        );

        ctx.lineTo(
            pointB.x,
            pointB.y
        );

        ctx.stroke();

        const reference =
            Number(
                referenceDistanceInput?.value || 0
            );

        if (reference <= 0) {
            return;
        }

        const labelX =
            (pointA.x + pointB.x) / 2;

        const labelY =
            (pointA.y + pointB.y) / 2;

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            labelX - 65,
            labelY - 18,
            130,
            32
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 13px system-ui";

        ctx.textAlign =
            "center";

        ctx.fillText(
            `${reference} ${
                referenceUnit.value
            }`,
            labelX,
            labelY + 4
        );
    }


    // ============================================================
    // MARK MODE
    // ============================================================

    function handleMarkTap(event) {
        if (currentMode !== "mark") {
            return;
        }

        if (!canvas) {
            return;
        }

        const rect =
            canvas.getBoundingClientRect();

        const point = {
            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top
        };

        if (markPoints.length >= 2) {
            markPoints = [];
        }

        markPoints.push(point);

        drawOverlay();
        updateReadout();

        if (markPoints.length === 2) {
            showToast(
                "Two points marked."
            );
        }
    }


    // ============================================================
    // CAPTURE PHOTO
    // ============================================================

    function capturePhoto() {
        if (
            !video ||
            !video.videoWidth ||
            !video.videoHeight
        ) {
            showToast(
                "Start the camera first."
            );

            return;
        }

        const photoCanvas =
            document.createElement(
                "canvas"
            );

        photoCanvas.width =
            video.videoWidth;

        photoCanvas.height =
            video.videoHeight;

        const photoCtx =
            photoCanvas.getContext("2d");

        if (cameraFacing === "user") {
            photoCtx.translate(
                photoCanvas.width,
                0
            );

            photoCtx.scale(
                -1,
                1
            );
        }

        photoCtx.drawImage(
            video,
            0,
            0,
            photoCanvas.width,
            photoCanvas.height
        );

        const fileName =
            `buildskil-camera-${new Date()
                .toISOString()
                .replace(/[:.]/g, "-")}.jpg`;

        photoCanvas.toBlob(
            (blob) => {
                if (!blob) {
                    showToast(
                        "Could not create photo."
                    );

                    return;
                }

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;
                link.download = fileName;

                document.body.appendChild(link);

                link.click();

                link.remove();

                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1500);

                saveHistory({
                    type: "Photo",
                    value: "Captured",
                    detail: fileName
                });

                showToast(
                    "Photo saved."
                );
            },
            "image/jpeg",
            0.92
        );
    }


    // ============================================================
    // CURRENT READING
    // ============================================================

    function getCurrentReading() {
        if (currentMode === "level") {
            const reading =
                getLevelReading();

            return {
                type: "Level",

                value:
                    `${reading.absolute.toFixed(1)}°`,

                detail:
                    reading.status
            };
        }

        if (currentMode === "plumb") {
            const reading =
                getPlumbReading();

            return {
                type: "Plumb",

                value:
                    `${reading.deviation.toFixed(1)}°`,

                detail:
                    reading.status
            };
        }

        if (currentMode === "angle") {
            const reading =
                getAngleReading();

            return {
                type: "Angle",

                value:
                    `${reading.angle.toFixed(1)}°`,

                detail:
                    "Device angle"
            };
        }

        if (currentMode === "slope") {
            const reading =
                getSlopeReading();

            return {
                type: "Slope",

                value:
                    `${reading.slopePercent.toFixed(1)}%`,

                detail:
                    `${reading.angle.toFixed(1)}° · ${reading.ratio}`
            };
        }

        if (currentMode === "grid") {
            return {
                type: "Grid",
                value: "Active",
                detail: "Visual guide"
            };
        }

        if (currentMode === "mark") {
            const reference =
                Number(
                    referenceDistanceInput?.value || 0
                );

            return {
                type: "Mark",

                value:
                    `${markPoints.length}/2`,

                detail:
                    reference > 0
                        ? `${reference} ${
                              referenceUnit.value
                          } reference`
                        : "No reference"
            };
        }

        return {
            type: "Unknown",
            value: "—",
            detail: ""
        };
    }


    // ============================================================
    // SAVE READING
    // ============================================================

    function saveCurrentReading() {
        if (
            currentMode === "mark" &&
            markPoints.length !== 2
        ) {
            showToast(
                "Mark two points first."
            );

            return;
        }

        const reading =
            getCurrentReading();

        saveHistory(reading);

        showToast(
            "Reading saved locally."
        );
    }


    // ============================================================
    // HISTORY
    // ============================================================

    function getHistory() {
        try {
            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );

            const history =
                JSON.parse(
                    stored || "[]"
                );

            return Array.isArray(history)
                ? history
                : [];

        } catch (error) {
            console.error(
                "History read error:",
                error
            );

            return [];
        }
    }


    function saveHistory(item) {
        const history =
            getHistory();

        history.unshift({
            ...item,
            createdAt:
                new Date().toISOString()
        });

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                history.slice(0, 30)
            )
        );

        renderHistory();
    }


    function renderHistory() {
        if (!historyList) {
            return;
        }

        const history =
            getHistory();

        if (!history.length) {
            historyList.innerHTML =
                `
                <div class="empty-history">
                    No saved readings yet.
                </div>
                `;

            return;
        }

        historyList.innerHTML =
            history
                .map((item) => {
                    const date =
                        new Date(
                            item.createdAt
                        );

                    return `
                        <div class="history-item">
                            <div class="history-main">
                                <strong>
                                    ${escapeHtml(item.type)}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        item.detail || ""
                                    )}
                                    ·
                                    ${date.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div class="history-value">
                                ${escapeHtml(
                                    item.value || ""
                                )}
                            </div>
                        </div>
                    `;
                })
                .join("");
    }


    function clearHistory() {
        localStorage.removeItem(
            STORAGE_KEY
        );

        renderHistory();

        showToast(
            "Local history cleared."
        );
    }


    // ============================================================
    // HTML ESCAPE
    // ============================================================

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    // ============================================================
    // EVENTS
    // ============================================================

    document
        .querySelectorAll(".mode-btn")
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    setMode(
                        button.dataset.mode
                    );
                }
            );
        });


    startCameraBtn?.addEventListener(
        "click",
        startCamera
    );


    switchCameraBtn?.addEventListener(
        "click",
        switchCamera
    );


    torchBtn?.addEventListener(
        "click",
        toggleTorch
    );


    captureBtn?.addEventListener(
        "click",
        capturePhoto
    );


    saveReadingBtn?.addEventListener(
        "click",
        saveCurrentReading
    );


    calibrateBtn?.addEventListener(
        "click",
        calibrate
    );


    enableSensorsBtn?.addEventListener(
        "click",
        requestSensorPermission
    );


    clearMarksBtn?.addEventListener(
        "click",
        () => {
            markPoints = [];

            drawOverlay();
            updateReadout();
        }
    );


    clearHistoryBtn?.addEventListener(
        "click",
        clearHistory
    );


    canvas?.addEventListener(
        "pointerdown",
        handleMarkTap
    );


    referenceDistanceInput?.addEventListener(
        "input",
        () => {
            drawOverlay();
            updateReadout();
        }
    );


    referenceUnit?.addEventListener(
        "change",
        () => {
            drawOverlay();
            updateReadout();
        }
    );


    backBtn?.addEventListener(
        "click",
        () => {
            if (
                window.history.length > 1
            ) {
                window.history.back();
            } else {
                window.location.href = "/";
            }
        }
    );


    window.addEventListener(
        "resize",
        () => {
            resizeCanvas();
            drawOverlay();
        }
    );


    window.addEventListener(
        "beforeunload",
        stopCamera
    );


    // ============================================================
    // INITIALIZE
    // ============================================================

    if (captureBtn) {
        captureBtn.disabled = true;
    }

    if (switchCameraBtn) {
        switchCameraBtn.disabled = true;
    }

    if (torchBtn) {
        torchBtn.disabled = true;
    }

    setMode("level");

    renderHistory();

})();


