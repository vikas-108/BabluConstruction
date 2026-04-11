let timerInterval, startTime, pausedTime = 0;
let isPaused = false;
let currentRate = 50; // default helper rate
let warnings = 0;
let lastPresenceTime = Date.now();
let genuineEarnings = 0;
let isAbsent = false;
let absenceStart = null;
let accumulatedTime = 0; // total time before pause
let totalHoursWorked = 0;
let totalEarningsToday = 0;
let sessionId = null;
const API_BASE = "https://api.buildskil.com/api/work"; // change if using domain
const SERVER_BASE = "https://api.buildskil.com";
function authHeaders(isFormData = false) {

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
document.getElementById("role").addEventListener("change", function() {
  currentRate = parseInt(this.selectedOptions[0].dataset.rate || 0);
});

document.getElementById("startBtn").addEventListener("click", async () => {

  const roleSelect = document.getElementById("role");
  const selectedOption = roleSelect.options[roleSelect.selectedIndex];
  // ✅ Guard clause: check if role is selected
  if (!selectedOption.dataset.rate) {
    showToast("Please select a role first!");
    return; // stop execution
  }
  const role = selectedOption.text.split(" ")[0];
  const rate = selectedOption.dataset.rate;

  try {

    const res = await fetch(`${API_BASE}/start`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        role: role,
        rate: rate
      })
    });

    const data = await res.json();

    sessionId = data._id;

    console.log("Session Started:", sessionId);

    // Existing logic
    startCamera();
    startTimer();
    startMotionDetection();
    startAudioCapture();
    toggleButtons(true);

    document.getElementById("addMemberBtn").style.display = "inline-block";
    document.getElementById("role").disabled = true;

  } catch (err) {
    console.error("Start session failed", err);
  }

});
document.getElementById("stopBtn").addEventListener("click", async () => {

  if (!isPaused) {

    clearInterval(timerInterval);
    isPaused = true;

    stopAudioCapture();
    stopCamera();

    accumulatedTime += (Date.now() - startTime);

    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";

    document.getElementById("stopBtn").textContent = "Resume";

  } else {

    startCamera();
    startAudioCapture();

    startTime = Date.now();
    startTimer();

    isPaused = false;

    document.getElementById("stopBtn").textContent = "Stop";

  }

});
document.getElementById("finishBtn").addEventListener("click", async () => {
  stopCamera();
  stopAudioCapture();
   stopTimer();
   // ✅ Reset role dropdown
    const roleSelect = document.getElementById("role");
    roleSelect.selectedIndex = 0;   // go back to "Select role"
    roleSelect.disabled = false;    // re-enable dropdown

  try {
    const res = await fetch(`${API_BASE}/stop/${sessionId}`, {
      method: "POST",
       headers: authHeaders(),
    });

    const data = await res.json();
    console.log("Session stopped:", data);

    // ✅ Update history with backend session data
    logHistory(data);

    // ✅ Show earnings/duration
    //alert(`Session ended. Earnings: ₹${data.earnings.toFixed(2)} for ${data.duration.toFixed(2)} hours`);
    if (data.earnings && data.duration) {
  alert(`Session ended. Earnings: ₹${data.earnings.toFixed(2)} for ${data.duration.toFixed(2)} hours`);
} else {
  console.error("Invalid session data:", data);
  alert("Error: Session data incomplete.");
}
  } catch (err) {
    console.error("Finish API error:", err);
    alert("Error: Could not stop session.");
  }

  resetSession();
  toggleButtons(false);

  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";

  document.getElementById("role").disabled = false;

  const addMemberBtn = document.getElementById("addMemberBtn");
  const permissionSection = document.getElementById("permissionSection");

  if (addMemberBtn) addMemberBtn.style.display = "none";
  if (permissionSection) permissionSection.style.display = "none";
});
const phoneInput = document.getElementById("memberPhone");

phoneInput.addEventListener("input", async () => {

  const phone = phoneInput.value.trim();

  if (phone.length !== 10) {
    phoneInput.style.borderColor = "red";
    return;
  }

  const res = await fetch(`${API_BASE}/check-phone`, {
    method: "POST",
     headers: authHeaders(),
    body: JSON.stringify({ phone })
  });

  const data = await res.json();

  if (data.ownNumber) {

    phoneInput.style.borderColor = "red";
    showToast("You cannot enter your own phone");

  } else if (data.exists) {

    phoneInput.style.borderColor = "green";

  } else {

    phoneInput.style.borderColor = "red";
  }

});
// Toggle phone input when Add Member is clicked
document.getElementById("addMemberBtn").addEventListener("click", () => {
  document.getElementById("permissionSection").style.display = "block";
});
// Handle permission demo
document.getElementById("permissionBtn").addEventListener("click", async () => {

  const phone = document.getElementById("memberPhone").value.trim();

  if (!phone) {
    showToast("Enter phone number");
    return;
  }

  const res = await fetch(`${API_BASE}/permission`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ phone })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast(data.message);
    return;
  }

   showToast("Permission granted");
  // hide permission UI
  document.getElementById("addMemberBtn").style.display = "none";
  document.getElementById("permissionSection").style.display = "none";

});
function showToast(message) {
const container = document.getElementById("toastField");
  const toast = document.createElement("div");

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "30px";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "9999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);

}
async function loadMyPermissions() {

  const res = await fetch(`${API_BASE}/my-permissions`, {
    headers: authHeaders()
  });

  const permissions = await res.json();

  const table = document.getElementById("historyTable");

  permissions.forEach(p => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="5">
        ${p.name} shared work access
        <button class="viewWorkBtn">📂 Work</button>
         <button class="viewSnapshotsBtn">📷 Snapshots</button>
        <button class="viewLiveBtn">🔴  Live</button>
      </td>
    `;

    table.appendChild(row);
    //document.getElementById("historyTable").appendChild(row);
    row.querySelector(".viewWorkBtn").addEventListener("click", () => {
      showWorkForUser(p.ownerId);
    });
    row.querySelector(".viewSnapshotsBtn").addEventListener("click", () => {
    showSnapshots(p.ownerId);
  });
    row.querySelector(".viewLiveBtn").addEventListener("click", () => {
      startLiveStreamForUser(p.ownerId);
    });

  });

}
loadMyPermissions();
async function showWorkForUser(ownerId) {

  const res = await fetch(`${API_BASE}/permission-work?owner=${ownerId}`, {
  headers: authHeaders()
  });

  const sessions = await res.json();
  const table = document.getElementById("historyTable");

  // clear previous rows
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Duration</th>
      <th>Date & Time</th>
      <th>Earnings</th>
    </tr>
  `;

  if (!sessions || sessions.length === 0) {

    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="5" style="text-align:center;color:red;">
        This work session was deleted by the worker
      </td>
    `;

    table.appendChild(row);
    return;
  }
  sessions.forEach(s => {
    const hours = Math.floor(s.duration);
    const minutes = Math.floor((s.duration * 60) % 60);
    const row = document.createElement("tr");

     row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.role}</td>
      <td>${s.duration.toFixed(2)} hr</td>
      <td>${new Date(s.createdAt).toLocaleString()}</td>
      <td>₹${s.earnings.toFixed(2)}</td>
    `;

    table.appendChild(row);

  });

}
function startLiveStreamForUser(){
  alert("Live camera feature will be implemented next");
}
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
async function startCamera() {
  const video = document.getElementById("cameraStream");

  try {
    const constraints = isMobileDevice()
      ? { video: { facingMode: "user" }, audio: true } // ✅ front camera, no audio
      : { video: true, audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.muted = true; // 🔥 FIX
    video.playsInline = true; // mobile fix
    // ✅ Explicit play call required on mobile
    await video.play();

    if (isMobileDevice()) {
      showToast("Camera started — tap again if video doesn’t autoplay.");
    }

    console.log("Camera started successfully");
  } catch (err) {
    console.error("Camera access error:", err);
    showToast("Unable to access camera: " + err.message);
  }
}


function stopCamera() {
  const video = document.getElementById("cameraStream");
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }
}

// Toggle buttons visibility
function toggleButtons(started) {
  document.getElementById("startBtn").style.display = started ? "none" : "inline-block";
  document.getElementById("stopBtn").style.display = started ? "inline-block" : "none";
  document.getElementById("finishBtn").style.display = started ? "inline-block" : "none";
  document.getElementById("captureBtn").style.display = started ? "inline-block" : "none";
  document.getElementById("muteBtn").style.display = started ? "inline-block" : "none";
  document.getElementById("volumeSlider").style.display = started ? "inline-block" : "none";
}
// Timer
function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}
function updateTimer() {
  const elapsed =  accumulatedTime +(Date.now() - startTime); // include time before pause;
  const hours = Math.floor(elapsed / (1000*60*60));
  const minutes = Math.floor((elapsed / (1000*60)) % 60);
  const seconds = Math.floor((elapsed / 1000) % 60);

  document.getElementById("timerDisplay").textContent =
    `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

  genuineEarnings = (elapsed / (1000*60*60)) * currentRate;

  /* Deduction if absent > 5 minutes
  if (Date.now() - lastPresenceTime > 5*60*1000) {
    genuineEarnings -= ((Date.now() - lastPresenceTime) / (1000*60*60)) * currentRate;
    giveWarning();
  }*/

  document.getElementById("earningsDisplay").textContent = `₹${genuineEarnings.toFixed(2)}`;
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  console.log("Timer stopped.");
}

// Reset session
function resetSession() {
  warnings = 0;
  lastPresenceTime = Date.now();
  genuineEarnings = 0;
  accumulatedTime = 0;
  isPaused = false; 
  document.getElementById("warnings").textContent = "";
  document.getElementById("timerDisplay").textContent = "00:00:00";
  document.getElementById("earningsDisplay").textContent = "₹0";
}


function logHistory(sessionData) {

  const durationHours = sessionData.duration || 0;
  const earnings = sessionData.earnings || 0;

  const hours = Math.floor(durationHours);
  const minutes = Math.floor((durationHours * 60) % 60);
  const seconds = Math.floor((durationHours * 3600) % 60);

  const now = new Date(sessionData.createdAt || Date.now());

  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-GB");

  // Update dashboard totals
  totalHoursWorked += durationHours * 3600000;
  totalEarningsToday += earnings;

  const totalHours = Math.floor(totalHoursWorked / (1000 * 60 * 60));
  const totalMinutes = Math.floor((totalHoursWorked / (1000 * 60)) % 60);

  document.getElementById("totalHours").textContent =
    `${totalHours}h ${totalMinutes}m`;

  document.getElementById("totalEarnings").textContent =
    `₹${totalEarningsToday.toFixed(2)}`;

  const row = document.createElement("tr");

  row.innerHTML = `
   <td>${sessionData.name}</td>
    <td>${sessionData.role}</td>
    <td>${hours}h ${minutes}m ${seconds}s</td>
    <td>${dateStr} ${timeStr}</td>
    <td>₹${earnings.toFixed(2)}</td>
    <td>
      <button class="deleteBtn" data-id="${sessionData._id}">🗑️</button>
    </td>
  `;

  document.getElementById("historyTable").appendChild(row);
// attach delete event
  row.querySelector(".deleteBtn").addEventListener("click", async () => {

    if (!confirm("Delete this work session?")) return;

    const res = await fetch(`${API_BASE}/session/${sessionData._id}`, {
      method: "DELETE",
      headers: authHeaders()
    });

    const data = await res.json();

    if (data.success) {

      // remove row
      row.remove();

      // subtract totals
      totalHoursWorked -= durationHours * 3600000;
      totalEarningsToday -= earnings;

      const totalHours = Math.floor(totalHoursWorked / (1000 * 60 * 60));
      const totalMinutes = Math.floor((totalHoursWorked / (1000 * 60)) % 60);

      document.getElementById("totalHours").textContent =
        `${totalHours}h ${totalMinutes}m`;

      document.getElementById("totalEarnings").textContent =
        `₹${totalEarningsToday.toFixed(2)}`;

    } else {
      alert("Delete failed");
    }

  });

}
async function loadHistory() {

  const res = await fetch(`${API_BASE}/history`, {
    headers: authHeaders(),
  });

  const sessions = await res.json();

  sessions.forEach(session => logHistory(session));

}

loadHistory();

function startAudioCapture() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioElement = document.getElementById("backgroundAudio");
      audioElement.srcObject = stream;
      audioElement.play();
    })
    .catch(err => {
      console.error("Microphone access error:", err);
      alert("Unable to access microphone.");
    });
}
function stopAudioCapture() {
  const audioElement = document.getElementById("backgroundAudio");
  const stream = audioElement.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    audioElement.srcObject = null;
  }
}
let isMuted = false;
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const audioElement = document.getElementById("backgroundAudio");
const videoControls = document.getElementById("videoControls");
const cameraStream = document.getElementById("cameraStream");
const cameraWrapper = document.querySelector(".camera-wrapper");
// Mute toggle
muteBtn.addEventListener("click", () => {
  if (!isMuted) {
    audioElement.muted = true;
    muteBtn.textContent = "🔇";
    isMuted = true;
  } else {
    audioElement.muted = false;
    muteBtn.textContent = "🔊";
    isMuted = false;
  }
});

// Volume control
volumeSlider.addEventListener("input", (e) => {
  audioElement.volume = e.target.value;
});

// Auto-hide logic
let hideTimeout;

function showControls() {
  videoControls.classList.remove("hidden");
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    // Only hide if not hovering over controls
    if (!videoControls.matches(":hover")) {
      videoControls.classList.add("hidden");
    }
  }, 3000);
}

// Show when hovering anywhere on wrapper (video or controls)
cameraWrapper.addEventListener("mousemove", showControls);
cameraWrapper.addEventListener("mouseenter", showControls);
cameraWrapper.addEventListener("mouseleave", () => {
  videoControls.classList.add("hidden");
});

// Keep visible while hovering over controls
videoControls.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  videoControls.classList.remove("hidden");
});
videoControls.addEventListener("mouseleave", showControls);


document.getElementById("volumeSlider").addEventListener("input", (e) => {
  const audioElement = document.getElementById("backgroundAudio");
  audioElement.volume = e.target.value;
});
 async function captureSnapshot() {

  if (!sessionId) return; // ensure session started

  const video = document.getElementById("cameraStream");
  const canvas = document.getElementById("snapshotCanvas");
    if (!video || !canvas) {
    console.error("Video or canvas element missing");
    return;
  }
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  canvas.toBlob(async (blob) => {
     if (!blob) {
    console.error("Canvas did not produce a blob — check if it's empty or MIME type unsupported.");
    return;
  }
    const formData = new FormData();
    formData.append("image", blob, "snapshot.jpg");

    try {

      const res = await fetch(`${SERVER_BASE}/api/work/snapshot/${sessionId}`, {
        method: "POST",
       headers: authHeaders(true), // ← important
        body: formData
      });

      const data = await res.json();

      console.log("📸 Snapshot uploaded:", data.snapshot);

    } catch (err) {
      console.error("Snapshot upload failed:", err);
    }

  }, "image/jpeg", 0.7);

}
// Capture every 8 minutes (480,000 ms)
setInterval(captureSnapshot, 480000);
// Warning logic
function giveWarning(msg) {
  warnings++;
  document.getElementById("warnings").textContent = `⚠ Warning ${warnings}/2 - ${msg || ""}`;

  if (warnings >= 3) {
    stopCamera();
    stopTimer();
    clearInterval(timerInterval);
    document.getElementById("warnings").textContent = "❌ Session closed due to inactivity.";
  }
}
function showOverlay(status) {
  const video = document.getElementById("cameraStream");
  let overlay = document.getElementById("overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "absolute";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999";
    document.body.appendChild(overlay);
  }

  overlay.style.top = video.offsetTop + "px";
  overlay.style.left = video.offsetLeft + "px";
  overlay.style.width = video.offsetWidth + "px";
  overlay.style.height = video.offsetHeight + "px";

  if (status === "present") {
    overlay.style.background = "rgba(0,255,0,0.3)"; // green
    overlay.style.display = "block";
  } else if (status === "resumed") {
    overlay.style.background = "rgba(0,0,255,0.3)"; // blue
    overlay.style.display = "block";
  } else if (status === "absent") {
    overlay.style.background = "rgba(255,0,0,0.3)"; // red
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}
// Presence detection (placeholder logic)
function showPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.background = "#333";
  popup.style.color = "#fff";
  popup.style.padding = "10px";
  popup.style.borderRadius = "6px";
  popup.style.zIndex = "9999";
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 4000);
}
function startMotionDetection() {
  const video = document.getElementById("cameraStream");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // ✅ optimization

  let lastImageData;

  setInterval(() => {
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width,
         canvas.height);

    if (lastImageData) {
      let diff = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg1 = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
        const avg2 = (lastImageData.data[i] + lastImageData.data[i+1] + lastImageData.data[i+2]) / 3;
        if (Math.abs(avg1 - avg2) > 30) diff++;
      }

      // If enough pixels changed, assume presence
      if (diff > 5000) {
        detectPresence(true);
      } else {
        detectPresence(false);
      }
    }
     lastImageData = imageData;
  }, 2000); // check every 2 seconds
}
function stopMotionDetection() {
  if (motionIntervalId) {
    clearInterval(motionIntervalId);
    motionIntervalId = null;
    console.log("Motion detection stopped.");
  }
}

// Call this when presence status changes
function detectPresence(isPresent) {
  if (isPresent) {
    if (isAbsent) {
      const absenceDuration = Date.now() - absenceStart;

      if (absenceDuration > 5 * 60 * 1000) {
        const wastedHours = absenceDuration / (1000 * 60 * 60);
        genuineEarnings -= wastedHours * currentRate;
        giveWarning("You were absent for " + Math.floor(absenceDuration / 60000) + " minutes. Deduction applied.");
      }

      isAbsent = false;
      absenceStart = null;
      showPopup("✅ Face detected again, work resumed.");
      showOverlay("resumed"); // blue overlay
    } else {
      showOverlay("present"); // green overlay

    }
    lastPresenceTime = Date.now();
    
  } else {
    if (!isAbsent) {
      isAbsent = true;
      absenceStart = Date.now();
      showPopup("⚠ Face vanished, monitoring absence...");
    }
    showOverlay("absent"); // red overlay
  }
}


async function showSnapshots(ownerId = null) {

  const historyDiv = document.getElementById("snapshotHistory");

  if (!historyDiv) return;

  historyDiv.innerHTML = "Loading snapshots...";

  try {
 // choose correct API
    const url = ownerId
      ? `${SERVER_BASE}/api/work/permission-work?owner=${ownerId}`
      : `${SERVER_BASE}/api/work/history`;

    const res = await fetch(url, {
      headers: authHeaders(true)
    });
    const sessions = await res.json();

    historyDiv.innerHTML = "";

    sessions.forEach(session => {

      if (!session.snapshots || session.snapshots.length === 0) return;

      session.snapshots.forEach(snapshot => {

        const img = document.createElement("img");

        img.src = SERVER_BASE + snapshot.url;

        img.style.width = "150px";
        img.style.margin = "5px";
        img.style.border = "1px solid #ccc";

        const caption = document.createElement("p");
        //caption.textContent = new Date(snapshot.timestamp).toLocaleString();
        caption.textContent = snapshot.timestamp
                   ? new Date(snapshot.timestamp).toLocaleString()
                   : "Time not available";
        historyDiv.appendChild(img);
        historyDiv.appendChild(caption);

      });

    });

  } catch (err) {

    console.error("Failed to load snapshots:", err);
    historyDiv.innerHTML = "Failed to load snapshots.";

  }

}
document.getElementById("captureBtn").addEventListener("click", () => {
  const video = document.getElementById("cameraStream");
  const canvas = document.getElementById("snapshotCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL("image/png");
  // Save to local storage
  localStorage.setItem("snapshot", imageData);
});
// Common function to deter screenshots
function preventScreenshots() {
  // Detect PrintScreen key
  document.addEventListener("keyup", (e) => {
    if (e.key === "PrintScreen") {
      // Blur the entire page
      document.body.style.filter = "blur(15px)";
        showToast("Screenshots are disabled on this page.");

      // Restore after a few seconds
      setTimeout(() => {
        document.body.style.filter = "none";
      }, 3000);
    }
  });

  // Detect copy attempts (Ctrl+C)
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    showToast("Copying content is restricted on this page.");
  });

  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

// Call once when page loads
preventScreenshots();
