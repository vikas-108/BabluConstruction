/**const EXTERNAL_LINKS = [
  {
    title: "IS Code for Concrete (IS 456)",
    description: "Official Indian Standard code for plain and reinforced concrete",
    url: "https://bis.gov.in",
    keywords: "is code concrete is456 rcc standard"
  },
  {
    title: "Cement Price Today in India",
    description: "Latest cement prices by brand and location",
    url: "https://www.indiamart.com",
    keywords: "cement price today cement cost"
  },
  {
    title: "Architect House Design Ideas",
    description: "Modern house plans and architectural inspirations",
    url: "https://www.archdaily.com",
    keywords: "architect design ideas house plan"
  },
  {
    title: "Soil Testing Methods",
    description: "Soil testing procedures used in construction",
    url: "https://www.civillearning.com",
    keywords: "soil testing foundation geotechnical"
  }
];
function searchExternalLinks(query) {
  return EXTERNAL_LINKS.filter((link) =>
    (link.title + " " + link.keywords).toLowerCase().includes(query)
  );
}
function isValidURL(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
    // EXTERNAL LINK RESULT
// ✅ If user pasted a URL
let rawInput = input.value.trim();

if (rawInput.startsWith("www.")) {
  rawInput = "https://" + rawInput;
}
if (isValidURL(input.value.trim())) {
  results.innerHTML = `
    <div class="card">
      <div class="badge material">EXTERNAL WEBSITE</div>
      <h3>Open External Website</h3>
      <p>${input.value}</p>
      <a href="${input.value}" target="_blank" rel="noopener noreferrer">
        🔗 Open Link
      </a>
    </div>
  `;
  saveSearch(input.value.trim());
  return;
}
// in applysearch function after filtering dataresult 
 const theoryResults = q ? searchTheory(q) : [];
  const designResults = q ? searchDesigns(q) : [];
  const externalResults = q ? searchExternalLinks(q) : [];
  render([
    ...filtered,
    ...theoryResults,
    ...designResults,
    ...dataResults,
    ...externalResults,
  ]);
}  
  // css code 
  .card a {
  display: inline-block;
  margin-top: 10px;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
}
.card a:hover {
  text-decoration: underline;
} **/

// this is code of search function which is deleted recently
  /**function applySearch() {
  const q = input.value.toLowerCase().trim();

  if (
    !q &&
    !categoryFilter.value &&
    !stateFilter.value &&
    !districtFilter.value
  ) {
    results.innerHTML =
      "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
    return;
  }
  const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (categoryFilter.value === "" || item.category === categoryFilter.value) &&
      (stateFilter.value === "" || item.state === stateFilter.value) &&
      (districtFilter.value === "" || item.district === districtFilter.value)
  );

  const filtered = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (categoryFilter.value === "" || item.category === categoryFilter.value) &&
      (stateFilter.value === "" ||
        item.state === stateFilter.value.toLowerCase()) &&
      (districtFilter.value === "" ||
        item.district === districtFilter.value.toLowerCase())
  );
  const theoryResults = q ? searchTheory(q) : [];
  const designResults = q ? searchDesigns(q) : [];
  const mediaResults = q ? searchMedia(q) : [];
  render([
    ...filtered,
    ...theoryResults,
    ...designResults,
    ...dataResults,
    ...mediaResults,
  ]);
} */










  // 🔹 SEARCH DATA (ONLY ONCE)
 /**  const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (category === "" || item.category === category) &&
      (state === "" || item.state === state) &&
      (district === "" || item.district === district)
  );
  */
 // 🔹 SEARCH DATA (ONLY ONCE)
    /* const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (category === "" || item.category === category) &&
      (state === "" || item.state === state) &&
      (district === "" || item.district === district)
  );*/
    /*const dataResults = SEARCH_DATA.filter(item => {
    const textMatch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(q);

    const categoryMatch =
      !category || item.category?.toLowerCase() === category;

    const stateMatch =
      !state || item.state?.toLowerCase() === state;

    const districtMatch =
      !district || item.district?.toLowerCase().includes(district);

    return textMatch && categoryMatch && stateMatch && districtMatch;
  });*/


//this is also delete recently

  /**
   * // previous code: instant search on input
   * const debouncedSearch = debounce(applySearch, 800);

[input, categoryFilter, stateFilter, districtFilter].forEach((el) =>
  el.addEventListener("input", debouncedSearch)
);

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

  
 * // Main search input: only on Enter
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    applySearch();
  }
});

// Filters: still update instantly
[categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("input", debounce(applySearch, 800));
});
// another way is to use a single debounced function for all inputs
// Instead of listening to "input", listen to "keydown"
[input, categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      applySearch(); // run your search only when Enter is pressed
    }
  });
});

// Initial message
results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Press Enter after typing to see results.</p>";
 */
// clear search buttton code delete recently
  /**<button id="clearSearchBtn" class="clear-search-btn">
  ✖ Clear
</button>
// css
.clear-search-btn {
  margin-left: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font-size: 14px;
}
// js
function clearSearch() {
  // 1️⃣ Clear inputs
  input.value = "";

  if (categoryFilter) categoryFilter.value = "";
  if (stateFilter) stateFilter.value = "";
  if (districtFilter) districtFilter.value = "";

  // 2️⃣ Remove saved search state
  localStorage.removeItem(SEARCH_STATE_KEY);

  // 3️⃣ Reset results UI
  results.innerHTML = `
    <p style="text-align:center;color:#64748b;">
      Start typing or use voice search to see results.
    </p>
  `;

  // 4️⃣ Hide loader if visible
  hideSearchLoader();
}
//CONNECT BUTTON TO LOGIC
document
  .getElementById("clearSearchBtn")
  .addEventListener("click", clearSearch);
 */
/**
 * // english-hindi toggle buttons
document.addEventListener('DOMContentLoaded', function () {
  var btnEn = document.getElementById('btn-en');
  var btnHi = document.getElementById('btn-hi');

  // Page does not have language toggle → exit safely
  if (!btnEn || !btnHi) return;

  btnEn.addEventListener('click', function () {
    toggleLang('en');
  });

  btnHi.addEventListener('click', function () {
    toggleLang('hi');
  });
});

function toggleLang(lang) {
  var en = document.getElementById('policy-en');
  var hi = document.getElementById('policy-hi');

  var btnEn = document.getElementById('btn-en');
  var btnHi = document.getElementById('btn-hi');

  // 🔒 HARD GUARD — prevents crashes on other pages
  if (!en || !hi || !btnEn || !btnHi) return;

  if (lang === 'en') {
    en.style.display = 'block';
    hi.style.display = 'none';
    btnEn.classList.add('active');
    btnHi.classList.remove('active');
  } else {
    hi.style.display = 'block';
    en.style.display = 'none';
    btnHi.classList.add('active');
    btnEn.classList.remove('active');
  }
}

 */
// quiz total , attempted, correct and wrong detail logic .
// <div id="quizSummary" class="quiz-summary hidden"></div> 
//let currentQuizResults = [];
//const QUIZ_STATE_KEY = "brg_quiz_state";
// quiz functions attampted, correct , wrong functions
/*function getQuizState() {
  return JSON.parse(localStorage.getItem(QUIZ_STATE_KEY)) || {
    score: 0,
    attempted: {}
  };
}
function calculateQuizStats(quizResults) {
  const state = getQuizState();
  const attemptedIds = state.attempted || {};

  let attempted = 0;
  let correct = 0;
  let wrong = 0;

  quizResults.forEach(q => {
    if (attemptedIds[q.id]) {
      attempted++;
      attemptedIds[q.id].correct ? correct++ : wrong++;
    }
  });

  return {
    total: quizResults.length,
    attempted,
    correct,
    wrong
  };
}
function renderQuizSummary(quizResults) {
  const summaryBox = document.getElementById("quizSummary");

  if (!quizResults.length) {
    summaryBox.classList.add("hidden");
    return;
  }

  const stats = calculateQuizStats(quizResults);

  summaryBox.innerHTML = `
    <span>🧠 Total Quiz: <strong>${stats.total}</strong></span>
    <span>✅ Attempted: <strong>${stats.attempted}</strong></span>
    <span class="correct">🟢 Correct: <strong>${stats.correct}</strong></span>
    <span class="wrong">🔴 Wrong: <strong>${stats.wrong}</strong></span>
  `;

  summaryBox.classList.remove("hidden");
}
function saveQuizAttempt(quizId, selected, correct) {
  const state = getQuizState();

  state.attempted[quizId] = { selected, correct };

  if (correct) state.score += 108;

  localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
}

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".quiz-option");
  if (!btn) return;

    const card = btn.closest(".quiz-card");
  const quizId = card.dataset.quizId;

  if (!quizId) {
    console.error("Quiz ID missing");
    return;
  }
  const selected = btn.dataset.answer;
  const correctAnswer = btn.dataset.correct;

  const isCorrect = selected === correctAnswer;

  // 🔒 prevent double attempt
  const saved = getQuizState();
  if (saved.attempted[quizId]) return;

  // 🎯 show feedback
  const feedback = card.querySelector(".quiz-feedback");

  if (isCorrect) {
    feedback.innerHTML = `<span class="correct">108</span>`;
  } else {
    const emoji = SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)];
    feedback.innerHTML = `<span class="wrong">108 ${emoji}</span>`;
  }

  // 🔕 disable all options
  card.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);

  // 💾 SAVE ATTEMPT
  saveQuizAttempt(quizId, selected, isCorrect);

  // 🔄 UPDATE SCORE UI
  document.getElementById("scoreValue").innerText =
    getQuizState().score;

  // 🔄 UPDATE SUMMARY (THIS WAS MISSING)
  if (currentQuizResults.length) {
    renderQuizSummary(currentQuizResults);
  }
}); */


    // kidsQuizResults already filtered + shuffled
/*currentQuizResults = QuizResults;
renderQuizSummary(currentQuizResults);
if (currentQuizResults.length) {
  renderQuizSummary(currentQuizResults);
}*/
/*.quiz-summary {
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 14px;
  font-weight: 600;
}

.quiz-summary span {
  white-space: nowrap;
}

.quiz-summary .correct {
  color: green;
}

.quiz-summary .wrong {
  color: red;
}

.hidden {
  display: none;
}
*/

function preventScreenshots() {
  // Desktop: detect PrintScreen key
  document.addEventListener("keyup", (e) => {
    if (e.key === "PrintScreen") {
      blurScreen();
      showToast("Screenshots are disabled on this page.");
    }
  });

  // Desktop: detect copy attempts (Ctrl+C)
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    showToast("Copying content is restricted on this page.");
  });

  // Desktop + Mobile: disable right-click / long-press context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Mobile: detect long-press (common before screenshot/copy)
  document.addEventListener("touchstart", () => {
    this.touchTimer = setTimeout(() => {
      blurScreen();
      showToast("Screenshots are disabled on this page.");
    }, 1000); // if finger held for >1s
  });

  document.addEventListener("touchend", () => {
    clearTimeout(this.touchTimer);
  });
}

// Helper: blur screen for 15 seconds
function blurScreen() {
  document.body.style.filter = "blur(15px)";
  setTimeout(() => {
    document.body.style.filter = "none";
  }, 15000);
}

// Example toast function (replace with your own UI)
function showToast(msg) {
  console.log(msg); // or show a styled div
}

// Call once when page loads
preventScreenshots();


//this is backend account manage code of controller 
/*exports.updateAccount = async (req, res) => {
  const data = req.body;

  const acc = await Account.findOneAndUpdate(
    { userId: req.user._id },
    {
      ...data,
      phone: req.user.phone // 🔥 NEVER trust frontend phone
    },
    { new: true, upsert: true }
  );

  res.json(acc);
};
exports.updateAccount = async (req, res) => {

  const data = req.body;

  let acc = await Account.findOne({ userId: req.user._id });

  if (!acc) {
    acc = await Account.create({
      userId: req.user._id,
      phone: req.user.phone
    });
  }

  // 🔐 BLOCK EMAIL CHANGE IF VERIFIED
  if (acc.emailVerified && data.email && data.email !== acc.email) {
    return res.status(400).json({
      message: "Verified email cannot be changed"
    });
  }

  Object.assign(acc, {
    ...data,
    phone: req.user.phone
  });

  await acc.save();

  res.json(acc);
};*/

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
let peerConnection;
const socket = io("https://api.buildskil.com");
socket.on("offer", async ({ offer, roomId }) => {

  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer", { roomId, answer });
});

socket.on("ice-candidate", async ({ candidate }) => {
  if (!peerConnection) return;

  try {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  } catch (e) {
    console.error(e);
  }
});
socket.on("answer", async ({ answer }) => {
  if (!peerConnection) return;

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
});
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
  toast.style.bottom = "20px";
  toast.style.right = "20px";
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
      // after "Permission granted"
    startLiveBroadcast(p.ownerId);
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
async function startLiveBroadcast(ownerId) {

  const video = document.getElementById("cameraStream");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  video.srcObject = stream;

  peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        roomId: ownerId,
        candidate: event.candidate
      });
    }
  };

  socket.emit("join-room", ownerId);

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", { roomId: ownerId, offer });

  console.log("LIVE STARTED");
}
function watchLive(ownerId) {

  if (peerConnection) {
    peerConnection.close();
  }

  const video = document.getElementById("cameraStream");

  peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  peerConnection.ontrack = (event) => {
    console.log("Receiving live stream...");
    video.srcObject = event.streams[0]; // ✅ SAME ELEMENT
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        roomId: ownerId,
        candidate: event.candidate
      });
    }
  };

  socket.emit("join-room", ownerId);

}
async function handleLiveClick(ownerId) {

  try {
    const res = await fetch(`${API_BASE}/live-status?owner=${ownerId}`, {
      headers: authHeaders()
    });

    const data = await res.json();

    if (data.isLive) {
      watchLive(ownerId); // 👈 THIS WAS MISSING
    } else if (data.endedAt) {
      const date = new Date(data.endedAt).toLocaleString();
      showToast(`Session ended at ${date}`);
    } else {
      showToast("User is not live");
    }

  } catch (err) {
    console.error(err);
    showToast("Error checking live");
  }
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
function resetConnection() {
  if (peerConnection) {
    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.close();
    peerConnection = null;
  }
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











//created pad.js code
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("blueprintCanvas");
  const ctx = canvas.getContext("2d");
  let offsetX = 0,
   offsetY = 0;
  let scale = 1;
  let isDragging = false;
  let startX, startY;
  let currentTool = null;
  let drawing = false;
  let shapes = [];
  let previewShape = null;
  let lastTouchDistance = null;
  let isBoxDragging = false;
  let selectedShape = null;
  let boxStartX, boxStartY;
  let movingShape = null;
  let stretchingShape = null;
  let stretchAnchor = null;
  
  const dimensionInput = document.getElementById("dimensionInput");
  const angleInput = document.getElementById("angleInput");
  const exportOptions = document.getElementById("exportOptions");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
 function resizeCanvas() {
  const toolbarHeight = document.getElementById("toolbar").offsetHeight;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = (window.innerHeight - toolbarHeight) + "px";

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  redrawShapes();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // initial call

  /*function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawShapes();
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();*/

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "#ddd";
    for (let x = -2000; x < 2000; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, -2000);
      ctx.lineTo(x, 2000);
      ctx.stroke();
    }
    for (let y = -2000; y < 2000; y += 50) {
      ctx.beginPath();
      ctx.moveTo(-2000, y);
      ctx.lineTo(2000, y);
      ctx.stroke();
    }

    ctx.restore();
  }
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      shapes.forEach((shape) => (shape.selected = true));
      exportOptions.style.display = "block"; // show buttons
      redrawShapes();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      shapes.forEach((shape) => (shape.selected = false));
      //exportOptions.style.display = "none"; // hide buttons
      redrawShapes();
    }
  });
  // Download button
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "blueprint.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Copy button
  copyBtn.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        alert("Canvas copied to clipboard!");
      });
    });
  });
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offsetX) / scale;
    const y = (e.clientY - rect.top - offsetY) / scale;
    return { x, y };
  }
  document.getElementById("eraseBtn").addEventListener("click", () => {
    currentTool = "erase";
  });
  function hitTest(shape, x, y) {
    if (shape.type === "wall") {
      // distance from point to line segment
      const dx = shape.x2 - shape.x1;
      const dy = shape.y2 - shape.y1;
      const lengthSq = dx * dx + dy * dy;
      let t = ((x - shape.x1) * dx + (y - shape.y1) * dy) / lengthSq;
      t = Math.max(0, Math.min(1, t));
      const projX = shape.x1 + t * dx;
      const projY = shape.y1 + t * dy;
      const dist = Math.hypot(x - projX, y - projY);
      return dist < 5; // tolerance
    } else if (shape.type === "room") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.w &&
        y >= shape.y &&
        y <= shape.y + shape.h
      );
    } else if (shape.type === "circle") {
      const dist = Math.hypot(x - shape.x, y - shape.y);
      return dist <= shape.r;
    } else if (shape.type === "arc") {
      const dist = Math.hypot(x - shape.x, y - shape.y);
      return dist <= shape.r + 5 && dist >= shape.r - 5;
    } else if (shape.type === "pillar") {
  const dist = Math.hypot(x - shape.x, y - shape.y);
  return dist <= (shape.r || 10);
} else if (shape.type === "pillarSquare") {
  const size = shape.size || 20;
  return (
    x >= shape.x - size/2 &&
    x <= shape.x + size/2 &&
    y >= shape.y - size/2 &&
    y <= shape.y + size/2
  );
}else if (shape.type === "polygon") {
    // point-in-polygon test
    let inside = false;
    for (let i = 0, j = shape.sides - 1; i < shape.sides; j = i++) {
      const angleI = (i * 2 * Math.PI) / shape.sides - Math.PI / 2;
      const angleJ = (j * 2 * Math.PI) / shape.sides - Math.PI / 2;
      const xi = shape.x + shape.r * Math.cos(angleI);
      const yi = shape.y + shape.r * Math.sin(angleI);
      const xj = shape.x + shape.r * Math.cos(angleJ);
      const yj = shape.y + shape.r * Math.sin(angleJ);

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

    return false;
  }
  function redrawShapes() {
    drawGrid();
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillStyle = "red";
    shapes.forEach((shape) => {
      if (shape.selected) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
      }

      if (shape.type === "wall") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        if (shape.dimension) {
          const midX = (shape.x1 + shape.x2) / 2;
          const midY = (shape.y1 + shape.y2) / 2;
          ctx.fillText(shape.dimension, midX + 5, midY - 5);
        }
      } else if (shape.type === "room") {
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === "arc") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, shape.startAngle, shape.endAngle);
        ctx.stroke();
        if (shape.angle) {
          ctx.fillText(shape.angle + "°", shape.x + shape.r + 10, shape.y);
        }
     } else if (shape.type === "pillar") {
  ctx.beginPath();
  ctx.arc(shape.x, shape.y, 10, 0, Math.PI * 2); // circle pillar
  ctx.fillStyle = "brown"; // pillar fill color
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
} else if (shape.type === "pillarSquare") {
  ctx.fillStyle = "gray";
  ctx.fillRect(shape.x - 10, shape.y - 10, 20, 20); // 20x20 square pillar
  ctx.strokeRect(shape.x - 10, shape.y - 10, 20, 20);
} else if (shape.type === "polygon") {
  ctx.beginPath();
  for (let i = 0; i < shape.sides; i++) {
    const angle = (i * 2 * Math.PI) / shape.sides - Math.PI / 2; // start from top
    const px = shape.x + shape.r * Math.cos(angle);
    const py = shape.y + shape.r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}
    });
    // Draw bounding box if any shapes are selected
    const selectedShapes = shapes.filter((s) => s.selected);
    if (selectedShapes.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      selectedShapes.forEach((s) => {
        if (s.type === "wall") {
          minX = Math.min(minX, s.x1, s.x2);
          minY = Math.min(minY, s.y1, s.y2);
          maxX = Math.max(maxX, s.x1, s.x2);
          maxY = Math.max(maxY, s.y1, s.y2);
        } else if (s.type === "room") {
          minX = Math.min(minX, s.x);
          minY = Math.min(minY, s.y);
          maxX = Math.max(maxX, s.x + s.w);
          maxY = Math.max(maxY, s.y + s.h);
        } else if (s.type === "circle" || s.type === "arc") {
          minX = Math.min(minX, s.x - s.r);
          minY = Math.min(minY, s.y - s.r);
          maxX = Math.max(maxX, s.x + s.r);
          maxY = Math.max(maxY, s.y + s.r);
      } else if (s.type === "pillar") {
  minX = Math.min(minX, s.x - 10);
  minY = Math.min(minY, s.y - 10);
  maxX = Math.max(maxX, s.x + 10);
  maxY = Math.max(maxY, s.y + 10);
} else if (s.type === "pillarSquare") {
  minX = Math.min(minX, s.x - 10);
  minY = Math.min(minY, s.y - 10);
  maxX = Math.max(maxX, s.x + 10);
  maxY = Math.max(maxY, s.y + 10);
}
      });

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]); // dashed outline
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.setLineDash([]); // reset
    }

    // Draw preview shape if exists
    if (previewShape) {
      ctx.strokeStyle = "blue";
      if (previewShape.type === "wall") {
        ctx.beginPath();
        ctx.moveTo(previewShape.x1, previewShape.y1);
        ctx.lineTo(previewShape.x2, previewShape.y2);
        ctx.stroke();
      } else if (previewShape.type === "room") {
        ctx.strokeRect(
          previewShape.x,
          previewShape.y,
          previewShape.w,
          previewShape.h,
        );
      } else if (previewShape.type === "circle") {
        ctx.beginPath();
        ctx.arc(previewShape.x, previewShape.y, previewShape.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (previewShape.type === "arc") {
        ctx.beginPath();
        ctx.arc(
          previewShape.x,
          previewShape.y,
          previewShape.r,
          previewShape.startAngle,
          previewShape.endAngle,
        );
        ctx.stroke();
      }  else if (previewShape.type === "pillar") {
  ctx.beginPath();
  ctx.arc(previewShape.x, previewShape.y, 10, 0, Math.PI * 2); // circle pillar
  ctx.fillStyle = "brown";
  ctx.fill();
  ctx.stroke();
}  else if (previewShape.type === "pillarSquare") {
  ctx.fillStyle = "gray";
  ctx.fillRect(previewShape.x - 10, previewShape.y - 10, 20, 20);
  ctx.strokeRect(previewShape.x - 10, previewShape.y - 10, 20, 20);
} else if (previewShape.type === "polygon"){
  ctx.beginPath();
  for (let i = 0; i < previewShape.sides; i++) {
    const angle = (i * 2 * Math.PI) / previewShape.sides - Math.PI / 2;
    const px = previewShape.x + previewShape.r * Math.cos(angle);
    const py = previewShape.y + previewShape.r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}
    }

    ctx.restore();
  }

  // Mouse events
  // Mouse events
  canvas.addEventListener("mousedown", (e) => {
    const mouseX = (e.offsetX - offsetX) / scale;
    const mouseY = (e.offsetY - offsetY) / scale;

    const selectedShapes = shapes.filter((s) => s.selected);
    if (selectedShapes.length > 0) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      selectedShapes.forEach((s) => {
        if (s.type === "wall") {
          minX = Math.min(minX, s.x1, s.x2);
          minY = Math.min(minY, s.y1, s.y2);
          maxX = Math.max(maxX, s.x1, s.x2);
          maxY = Math.max(maxY, s.y1, s.y2);
        } else if (s.type === "room") {
          minX = Math.min(minX, s.x);
          minY = Math.min(minY, s.y);
          maxX = Math.max(maxX, s.x + s.w);
          maxY = Math.max(maxY, s.y + s.h);
        } else if (s.type === "circle" || s.type === "arc") {
          minX = Math.min(minX, s.x - s.r);
          minY = Math.min(minY, s.y - s.r);
          maxX = Math.max(maxX, s.x + s.r);
          maxY = Math.max(maxY, s.y + s.r);
        } else if (s.type === "pillar") {
          minX = Math.min(minX, s.x - 10);
          minY = Math.min(minY, s.y - 10);
          maxX = Math.max(maxX, s.x + 10);
          maxY = Math.max(maxY, s.y + 10);
        } else if (s.type === "pillarSquare") {
          minX = Math.min(minX, s.x - 10);
          minY = Math.min(minY, s.y - 10);
          maxX = Math.max(maxX, s.x + 10);
          maxY = Math.max(maxY, s.y + 10);
        }
      });

      if (
        mouseX >= minX &&
        mouseX <= maxX &&
        mouseY >= minY &&
        mouseY <= maxY
      ) {
        isBoxDragging = true;
        boxStartX = mouseX;
        boxStartY = mouseY;
        return; // prevent starting a new drawing
      }
    }
    const { x, y } = getCanvasCoords(e);
    if (currentTool) {
      drawing = true;
      startX = x;
      startY = y;
    } else {
      isDragging = true;
      //startX = e.clientX - offsetX;
      //startY = e.clientY - offsetY;
      startX = e.clientX;
      startY = e.clientY;
    }
    if (currentTool === "stretch") {
    const { x, y } = getCanvasCoords(e);
    stretchingShape = shapes.find(s => hitTest(s, x, y));
    if (stretchingShape) {
      stretchAnchor = { x, y }; // anchor point
    }
  }
 if (currentTool === "move") {
    const { x, y } = getCanvasCoords(e);
    // find first selected shape under cursor
    movingShape = shapes.find(s => hitTest(s, x, y));
  }
    if (currentTool === "erase") {
      // find shape under cursor
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (hitTest(shapes[i], x, y)) {
          shapes.splice(i, 1); // remove shape
          redrawShapes();
          break;
        }
      }
      return; // skip drawing logic
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    isBoxDragging = false;
    const { x, y } = getCanvasCoords(e);
    if (currentTool === "move") {
    movingShape = null; // stop moving
  }
   if (currentTool === "stretch") {
    stretchingShape = null;
    stretchAnchor = null;
  }
    if (drawing && currentTool === "wall") {
      const newWall = { type: "wall", x1: startX, y1: startY, x2: x, y2: y };
      shapes.push(newWall);

      // Position input box at midpoint
      const midX = (newWall.x1 + newWall.x2) / 2;
      const midY = (newWall.y1 + newWall.y2) / 2;
      dimensionInput.style.left = midX + canvas.offsetLeft + "px";
      dimensionInput.style.top = midY + canvas.offsetTop + "px";
      dimensionInput.style.display = "block";
      dimensionInput.value = "";
      dimensionInput.focus();
      // Save dimension on Enter
      dimensionInput.onkeydown = (ev) => {
        if (ev.key === "Enter") {
          newWall.dimension = dimensionInput.value;
          dimensionInput.style.display = "none";
          redrawShapes();
        }
      };
    }
    if (drawing && currentTool === "room") {
      shapes.push({
        type: "room",
        x: startX,
        y: startY,
        w: x - startX,
        h: y - startY,
      });
    }
    if (drawing && currentTool === "circle") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "circle", x: startX, y: startY, r });
    }
    if (drawing && currentTool === "arc") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      const newArc = {
        type: "arc",
        x: startX,
        y: startY,
        r,
        startAngle: 0,
        endAngle: Math.atan2(dy, dx),
      };
      shapes.push(newArc);

      // Floating angle input
      angleInput.style.left =
        newArc.x + canvas.offsetLeft + newArc.r + 10 + "px";
      angleInput.style.top = newArc.y + canvas.offsetTop + "px";
      angleInput.style.display = "block";
      angleInput.value = "";
      angleInput.focus();
      angleInput.onkeydown = (ev) => {
        if (ev.key === "Enter") {
          newArc.angle = parseFloat(angleInput.value);
          angleInput.style.display = "none";
          redrawShapes();
        }
      };
    }if (drawing && currentTool === "polygon") {
  const dx = x - startX;
  const dy = y - startY;
  const r = Math.sqrt(dx * dx + dy * dy);
  const sides = parseInt(document.getElementById("polygonSides").value, 10);

  shapes.push({ type: "polygon", x: startX, y: startY, r, sides });
}

    if (drawing && currentTool === "pillar") {
  const dx = x - startX;
  const dy = y - startY;
  const r = Math.sqrt(dx * dx + dy * dy);
  shapes.push({ type: "pillar", x: startX, y: startY, r: r || 10 }); // default radius 10
} else if (drawing && currentTool === "pillarSquare") {
  shapes.push({ type: "pillarSquare", x: startX, y: startY, size: 20 }); // default 20x20
}

    drawing = false;
    previewShape = null;
    isDragging = false;
    redrawShapes();
  });

  canvas.addEventListener("mousemove", (e) => {
    const mouseX = (e.offsetX - offsetX) / scale;
    const mouseY = (e.offsetY - offsetY) / scale;

    if (isBoxDragging) {
      const dx = mouseX - boxStartX;
      const dy = mouseY - boxStartY;

      shapes.forEach((s) => {
        if (s.selected) {
          if (s.type === "wall") {
            s.x1 += dx;
            s.y1 += dy;
            s.x2 += dx;
            s.y2 += dy;
          } else if (s.type === "room") {
            s.x += dx;
            s.y += dy;
          } else if (s.type === "circle" || s.type === "arc") {
            s.x += dx;
            s.y += dy;
          } else if (s.type === "pillar" || s.type === "pillarSquare") {
            s.x += dx;
            s.y += dy;
          }else if (s.type === "polygon"){
            s.x += dx;
            s.y += dy;
          }
        }
      });

      boxStartX = mouseX;
      boxStartY = mouseY;
      redrawShapes();
      return;
    }
    const { x, y } = getCanvasCoords(e);
    if (drawing) {
      if (currentTool === "wall") {
        previewShape = { type: "wall", x1: startX, y1: startY, x2: x, y2: y };
      } else if (currentTool === "room") {
        previewShape = {
          type: "room",
          x: startX,
          y: startY,
          w: x - startX,
          h: y - startY,
        };
      } else if (currentTool === "circle") {
        const dx = x - startX;
        const dy = y - startY;
        const r = Math.sqrt(dx * dx + dy * dy);
        previewShape = { type: "circle", x: startX, y: startY, r };
      } else if (currentTool === "arc") {
        const dx = x - startX;
        const dy = y - startY;
        const r = Math.sqrt(dx * dx + dy * dy);
        previewShape = {
          type: "arc",
          x: startX,
          y: startY,
          r,
          startAngle: 0,
          endAngle: Math.atan2(dy, dx),
        };
      } else if (currentTool === "pillar") {
        const dx = x - startX;
        const dy = y - startY;
        const r = Math.sqrt(dx * dx + dy * dy);
        previewShape = { type: "pillar", x: startX, y: startY, r };
      } else if (currentTool === "pillarSquare") {
        const dx = x - startX;
        const dy = y - startY;
        const r = Math.sqrt(dx * dx + dy * dy);
        previewShape = { type: "pillarSquare", x: startX, y: startY, r };
      }else if (currentTool === "polygon") {
  const dx = x - startX;
  const dy = y - startY;
  const r = Math.sqrt(dx * dx + dy * dy);
  const sides = parseInt(document.getElementById("polygonSides").value, 10);

  previewShape = { type: "polygon", x: startX, y: startY, r, sides };
}

      redrawShapes();
    }
    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      offsetX += dx;
      offsetY += dy;
      startX = e.clientX;
      startY = e.clientY;
      redrawShapes();
    }
    if (currentTool === "stretch" && stretchingShape && stretchAnchor) {
    const { x, y } = getCanvasCoords(e);

    if (stretchingShape.type === "wall") {
      // stretch one endpoint, keep other fixed
      stretchingShape.x2 = x;
      stretchingShape.y2 = y;
    } else if (stretchingShape.type === "room") {
      // stretch width/height
      stretchingShape.w = x - stretchingShape.x;
      stretchingShape.h = y - stretchingShape.y;
    } else if (stretchingShape.type === "circle" || stretchingShape.type === "pillar") {
      // stretch radius
      const dx = x - stretchingShape.x;
      const dy = y - stretchingShape.y;
      stretchingShape.r = Math.sqrt(dx*dx + dy*dy);
    } else if (stretchingShape.type === "arc") {
      // stretch radius or end angle
      const dx = x - stretchingShape.x;
      const dy = y - stretchingShape.y;
      stretchingShape.r = Math.sqrt(dx*dx + dy*dy);
      stretchingShape.endAngle = Math.atan2(dy, dx);
    } else if (stretchingShape.type === "pillarSquare") {
      // stretch size
      stretchingShape.size = Math.abs(x - stretchingShape.x) * 2;
    } else if (stretchingShape.type === "polygon") {
  const dx = x - stretchingShape.x;
  const dy = y - stretchingShape.y;
  stretchingShape.r = Math.sqrt(dx * dx + dy * dy);  // update radius
}

    redrawShapes();
  }
if (currentTool === "move" && movingShape) {
  const { x, y } = getCanvasCoords(e);

  if (movingShape.type === "circle" || movingShape.type === "pillar") {
    movingShape.x = x;
    movingShape.y = y;
  } else if (movingShape.type === "room" || movingShape.type === "pillarSquare") {
    movingShape.x = x;
    movingShape.y = y;
  } else if (movingShape.type === "wall") {
    const dx = x - movingShape.x1;
    const dy = y - movingShape.y1;
    movingShape.x2 += dx;
    movingShape.y2 += dy;
    movingShape.x1 = x;
    movingShape.y1 = y;
  } else if (movingShape.type === "arc") {
    movingShape.x = x;
    movingShape.y = y;
  } else if (movingShape.type === "polygon") {
    movingShape.x = x;
    movingShape.y = y;   // ✅ polygon move fix
  }

  redrawShapes();
}
  });
  // Touch support
  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    if (currentTool) {
      drawing = true;
      startX = x;
      startY = y;
    } else {
      isDragging = true;
      startX = x - offsetX;
      startY = y - offsetY;
    }
  });
  canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      // Get positions of both fingers
      const rect = canvas.getBoundingClientRect();
      const x1 = e.touches[0].clientX - rect.left;
      const y1 = e.touches[0].clientY - rect.top;
      const x2 = e.touches[1].clientX - rect.left;
      const y2 = e.touches[1].clientY - rect.top;

      // Midpoint between fingers
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Distance between fingers
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastTouchDistance) {
        const zoom = distance / lastTouchDistance; // ratio
        scale *= zoom;

        // Convert midpoint to world coords
        const worldX = (midX - offsetX) / lastTouchDistance;
        const worldY = (midY - offsetY) / lastTouchDistance;

        // Adjust offset so midpoint stays fixed
        offsetX = midX - worldX * scale;
        offsetY = midY - worldY * scale;

        redrawShapes();
      }

      lastTouchDistance = distance;
    }
  });

  canvas.addEventListener("touchend", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (drawing && currentTool === "wall") {
      shapes.push({ type: "wall", x1: startX, y1: startY, x2: x, y2: y });
    }
    if (drawing && currentTool === "room") {
      shapes.push({
        type: "room",
        x: startX,
        y: startY,
        w: x - startX,
        h: y - startY,
      });
    }
    if (drawing && currentTool === "circle") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "circle", x: startX, y: startY, r });
    }
    if (drawing && currentTool === "arc") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({
        type: "arc",
        x: startX,
        y: startY,
        r,
        startAngle: 0,
        endAngle: Math.atan2(dy, dx),
      });
    }
    if (drawing && currentTool === "pillar") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "pillar", x: startX, y: startY, r });
    }
    if (drawing && currentTool === "pillarSquare") {
      const dx = x - startX;
      const dy = y - startY;
      const r = Math.sqrt(dx * dx + dy * dy);
      shapes.push({ type: "pillarSquare", x: startX, y: startY, r });
    }

    drawing = false;
    isDragging = false;
    redrawShapes();
  });

  // Zoom logic
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    // Mouse position relative to canvas
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Convert to world coordinates
    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    // Zoom factor
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;

    // Adjust offset so the world point stays under the cursor
    offsetX = mouseX - worldX * scale;
    offsetY = mouseY - worldY * scale;

    redrawShapes();
  });

  // Toolbar logic
  const startBtn = document.getElementById("startBtn");
  const buildingType = document.getElementById("buildingType");
  const landArea = document.getElementById("landArea");
  const toolbar = document.getElementById("toolbar");

  startBtn.addEventListener("click", () => {
    const type = buildingType.value;
    const area = landArea.value;

    toolbar.innerHTML = `
      <span>Blueprint: ${type.toUpperCase()} | Land Area: ${area} sq ft</span>
      <button id="addWallBtn">Add Wall</button>
      <button id="pillarBtn">Add Pillar</button>
      <button id="pillarSquareBtn">Sqpillar</button>
      <button id="addRoomBtn">Add Room</button>
      <button id="addCircleBtn">Add Circle</button>
      <button id="addArcBtn">Add Arc</button>
      <button id="stretchBtn">Stretch</button>
      <input id="polygonSides" type="number" min="3" max="12" value="5" style="display:none;"/>
      <button id="polygonBtn">Polygon</button>
      <button id="moveBtn">Move</button>
      <button id="undoBtn">Undo</button>
      <button id="redoBtn">Redo</button>
    `;
    const polygonBtn = document.getElementById("polygonBtn");
const polygonSides = document.getElementById("polygonSides");

polygonBtn.addEventListener("click", () => {
  currentTool = "polygon";
  polygonSides.style.display = "inline";
  polygonSides.focus();
});

polygonSides.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    polygonSides.style.display = "none";
  }
});


    document.getElementById("addWallBtn").addEventListener("click", () => {
      currentTool = "wall";
    });
    document.getElementById("pillarBtn").addEventListener("click", () => {
      currentTool = "pillar";
    });
    document.getElementById("pillarSquareBtn").addEventListener("click", () => {
      currentTool = "pillarSquare";
    });
    document.getElementById("addRoomBtn").addEventListener("click", () => {
      currentTool = "room";
    });
    document.getElementById("addCircleBtn").addEventListener("click", () => {
      currentTool = "circle";
    });
    document.getElementById("addArcBtn").addEventListener("click", () => {
      currentTool = "arc";
    });
    document.getElementById("stretchBtn").addEventListener("click", () => {
  currentTool = "stretch";
});
document.getElementById("polygonBtn").addEventListener("click", () => {
  currentTool = "polygon";
});
    document.getElementById("moveBtn").addEventListener("click", () => {
  currentTool = "move";
});
    document.getElementById("undoBtn").addEventListener("click", () => {
      shapes.pop();
      redrawShapes();
    });
    document.getElementById("redoBtn").addEventListener("click", () => {
      // TODO: implement redo stack
      currentTool = null; //disable drawing when redo is clicked
    });
  });
});








const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const categoryFilter = document.getElementById("categoryFilter");
const roleFilter = document.getElementById("role");
const stateFilter = document.getElementById("stateFilter");
const stateList   = document.getElementById("stateList");
const districtFilter = document.getElementById("districtFilter");
const districtList   = document.getElementById("districtList");
const PAGE_SIZE = 20;
let currentPage = 1;
let lastSearchResults = [];
const SERVER_BASE = "https://api.buildskil.com";
const PROFILE_API = "https://api.buildskil.com/api/profiles/public";
let API_PROFILES_CACHE = [];
const states = [
  "Haryana",
  "Punjab",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Bihar",
  "Delhi",
  "Karanataka",
  "Tamil Nadu",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "chhattisgrah",
  "Assam",
  "Jharkhand",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Uttarakhand",
  "Goa",
  "Kerala",
  "Telagana",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
  "Lakshadweep",
  "Puducherry",
  "Ladakh",
  "Andaman & Nicobar", "Dadra & Nagar Haveli and Daman & Diu",
];
const districts = {
  // Haryana (22)
  Haryana: [ "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar",
  "Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal",
  "Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar",],
  // Uttar Pradesh (75)
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh",
  "Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti",
  "Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah",
  "Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad",
  "Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun",
  "Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi",
  "Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri",
  "Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh",
  "Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur",
  "Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi",],

  // Delhi (11)
  Delhi: ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi",
  "North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi",],

  // Bihar (38)
  Bihar: ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga",
  "East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj",
  "Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia",
  "Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul",
  "Vaishali","West Champaran",],

  // Odisha (30)
  Odisha: ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal",
  "Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
  "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada",
  "Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh",],

  // Chandigarh (1)
  Chandigarh:["Chandigarh",],

  // Punjab (23)
  Punjab: ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur",
  "Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot",
  "Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"],

  // Gujarat (33)
  Gujarat: ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur",
  "Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch",
  "Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha",
  "Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  // Rajasthan (50)
  Rajasthan: ["Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur",
  "Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman",
  "Dungarpur","Gangapur City","Hanumangarh","Jaipur","Jaipur Rural","Jaisalmer","Jalore","Jhalawar",
  "Jhunjhunu","Jodhpur","Jodhpur Rural","Karauli","Kekri","Khairthal-Tijara","Kota","Kotputli-Behror",
  "Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore",
  "Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur",],

  // Madhya Pradesh (55)
  "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind",
  "Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori",
  "Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone",
  "Maihar","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen",
  "Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur",
  "Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha",],

  // Maharashtra (36)
  Maharashtra: ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur",
  "Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City",
  "Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani",
  "Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal",],

  // Karnataka (31)
  Karnataka: ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar",
  "Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad",
  "Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru",
  "Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayanagara",
  "Vijayapura","Yadgir"],

  // Tamil Nadu (38)
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul",
  "Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai",
  "Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram",
  "Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
  "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur",
  "Vellore","Viluppuram","Virudhunagar"],

  // West Bengal (23)
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling",
  "Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda",
  "Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur",
  "Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],

  // Andhra Pradesh (26)
  "Andhra Pradesh": ["Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor",
  "East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool",
  "Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","SPSR Nellore",
  "Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],

  // Telangana (33)
  Telangana: ["Adilabad","Bhadradri Kothagudem","Hanamkonda","Hyderabad","Jagtial","Jangaon",
  "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
  "Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal–Malkajgiri",
  "Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
  "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad",
  "Wanaparthy","Warangal","Yadadri Bhuvanagiri"],
  // Kerala (14)
  Kerala: ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam",
  "Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram",
  "Thrissur","Wayanad"],

  // Himachal Pradesh (12)
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti",
  "Mandi","Shimla","Sirmaur","Solan","Una"],

  // Uttarakhand (13)
  Uttarakhand: ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital",
  "Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],

  // Jharkhand (24)
  Jharkhand: ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa",
  "Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar",
  "Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"],

  // Chhattisgarh (33)
  Chhattisgarh: ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur",
  "Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa",
  "Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund",
  "Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli",
  "Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh",
  "Sukma","Surajpur","Surguja"],

  // Assam (35)
  Assam: ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang",
  "Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat",
  "Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong",
  "Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari",
  "Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],

  // Arunachal Pradesh (26)
  "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle",
  "Kra Daadi","Kurung Kumey","Leparada","Lohit","Longding","Lower Dibang Valley",
  "Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare",
  "Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri",
  "West Kameng","West Siang","Keyi Panyor",],

  // Nagaland (16)
  Nagaland: ["Chümoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
  "Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyü","Tuensang","Wokha","Zunheboto"],

  // Manipur (16)
  Manipur: [  "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam",
  "Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong",
  "Tengnoupal","Thoubal","Ukhrul",],

  // Meghalaya (12)
  Meghalaya: ["East Garo Hills","East Jaintia Hills","East Khasi Hills","Mairang",
  "North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills",
  "South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills",],

  // Mizoram (11)
  Mizoram: ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
  "Lunglei","Mamit","Saiha","Saitual","Serchhip"],

  // Tripura (8)
  Tripura: ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura",
  "Unakoti","West Tripura"],

  // Goa (2)
  Goa: ["North Goa","South Goa"],

  // Sikkim (6)
  Sikkim: ["Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng"],

  // Jammu & Kashmir (20)
  "Jammu & Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu",
  "Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri",
  "Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],

  // Ladakh (2)
  Ladakh: ["Kargil","Leh"],

  // Andaman & Nicobar (3)
  "Andaman & Nicobar": ["Nicobar","North and Middle Andaman","South Andaman"],

  // Dadra & Nagar Haveli and Daman & Diu (3)
  "Dadra & Nagar Haveli and Daman & Diu": ["Dadra and Nagar Haveli","Daman","Diu"],

  // Lakshadweep (1)
  Lakshadweep: ["Lakshadweep"],

  // Puducherry (4)
  Puducherry: ["Karaikal","Mahe","Puducherry","Yanam"],
  };
// Render states
function renderStates(filter = "") {
  stateList.innerHTML = "";
  states
    .filter(s => s.toLowerCase().includes(filter.toLowerCase()))
    .forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      li.addEventListener("click", () => {
        stateFilter.value = s;
        stateList.innerHTML = "";
        renderDistricts(s); // 🔥 show districts for selected state
      });
      stateList.appendChild(li);
    });
}

// Render districts for selected state
// Render districts for selected state
function renderDistricts(state, filter = "") {
  districtList.innerHTML = "";

  // use a different name here
  const districtArray = districts[state] || [];

  districtArray
    .filter(d => d.toLowerCase().includes(filter.toLowerCase()))
    .forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      li.addEventListener("click", () => {
        districtFilter.value = d;
        districtList.innerHTML = "";
      });
      districtList.appendChild(li);
    });
}
// Initial render
renderStates();

// Filter as you type
stateFilter.addEventListener("input", e => {
  renderStates(e.target.value);
});

districtFilter.addEventListener("input", e => {
  const selectedState = stateFilter.value;
  if (selectedState) {
    renderDistricts(selectedState, e.target.value);
  }
});
function getSearchStateKey() {
  const user = JSON.parse(localStorage.getItem("cb_login_user"));

  // guest mode
  if (!user) return "brg_search_state_guest";

  // per-user search state
  return `brg_search_state_${user.phone}`;
}

function saveSearchState() {
  const state = {
    query: input?.value,
    category: categoryFilter?.value || "",
    role: roleFilter?.value || "",
    state: stateFilter?.value || "",
    district: districtFilter?.value || "",
  };

  localStorage.setItem(getSearchStateKey(), JSON.stringify(state));
}
function restoreSearchState() {
  const saved = localStorage.getItem(getSearchStateKey());
  if (!saved) return;

  const state = JSON.parse(saved);

  if (state.query) input.value = state.query;
  if (categoryFilter && state.category) categoryFilter.value = state.category;
  if (roleFilter && state.role) roleFilter.value = state.role;
  if (stateFilter && state.state) stateFilter.value = state.state;
  if (districtFilter && state.district) districtFilter.value = state.district;

  // Trigger search after restoring
  setTimeout(() => {
    applySearch();
  }, 10);
  
setupSearchableSelect("stateFilter", "stateList", states);
setupSearchableSelect("districtFilter", "districtList", districts);
}

function setupSearchableSelect(inputId, listId, data) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) {
    console.error("Missing input or list:", inputId, listId);
    return;
  }
  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";
    if (!value) {
      list.style.display = "none";
      return;
    }
  // ✅ ensure data is an array
  const filtered = Array.isArray(data)
    ? data.filter(item => item.toLowerCase().includes(value))
    : [];
   console.log("Filtered:", filtered);
    if (!filtered.length) {
      list.style.display = "none";
      return;
    }

    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.onclick = () => {
        input.value = item;
        list.style.display = "none";
        if (typeof applySearch === "function") {
          applySearch();
        }
      };
      list.appendChild(li);
    });
  console.log("List children:", list.children.length);
    list.style.display = filtered.length ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-select")) {
      list.style.display = "none";
    }
  });
}
// Define categories for each role
  const categories = {
    contractor: [
      "Plumbing",
      "Electrician",
      "Carpentry",
      "Masonry",
      "Painting",
      "Roofing",
      "Flooring",
      "HVAC",
      "Landscaping",
      "Demolition",
      "Structural",
      "Marble & Tiles",
      "POP",
      "Glass",
    ],
    technician: [
      "Electrical Technician",
      "Plumbing Technician",
      "HVAC Technician",
      "Carpentry Technician",
      "Raj Mistry",
      "Marble",
      "Painter",
      "POP",
      "weilding",
      "Glass",
    ],
    supplier: [
      "Cement Supplier",
      "Steel Supplier",
      "Sand Supplier",
      "Equipment Supplier",
      "Tiles Supplier",
    ],
    architecture: [
      "Interior",
      "Exterior ",
      "Exterior & Interior",
      "Landscape Architecture",
      "Urban Architecture",
      "Naval Architecture",
      "Sustainable Architecture",
    ],
    mechanic: [
      "General Car Mechanic",
      "Engine Specialist",
      "Transmission Mechanic",
      "Brake Specialist",
      "Tyre/Wheel Mechanic",
      "Auto Electrician",
      "AC Mechanic",
      "Motorcycle Mechanic",
      "Diesel Mechanic",
      "Heavy Equipment Mechanic",
      "Marine Mechanic",
      "Aircraft Mechanic",
      "Industrial Mechanic",
    ],
    client:[
      "require Painter",
      "PLumber",
      "Havc",
      "Raj Mistry",
      "Technician",
      "Machanic",
      "Carpenter",
      "renovation",
      "Marble&Tiles",
      "Electrician",
      "Glass",
    ]
  };

  // Update category dropdown when role changes
  categoryFilter.addEventListener("change", () => {
    const category = categoryFilter.value;
    roleFilter.innerHTML = '<option value="">-- Select Role --</option>';

    if (categories[category]) {
      categories[category].forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;
        roleFilter.appendChild(option);
      });
    }
  });
function speakText(text) {
  if (!window.speechSynthesis) {
    alert("Voice not supported on this device");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // good for Indian users
  utterance.rate = 0.7; // slower for kids
  utterance.pitch = 1.1; // friendly tone

  window.speechSynthesis.cancel(); // stop previous
  window.speechSynthesis.speak(utterance);
}
function normalizeText(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .normalize("NFKD") // ✅ mobile unicode fix
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\u00A0/g, " ") // non-breaking space
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return Infinity;

  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}
// notification updates (could come from API or JSON file)
const updates = [
  "🚀 New feature launched: search engine",
  "📢 Scheduled maintenance on March 1st",
  "🎨 Updated design guidelines available",
  "🔧 full Profile click comming",
];

const notificationList = document.getElementById("notificationList");

// Inject updates dynamically
updates.forEach((update) => {
  const li = document.createElement("li");
  li.textContent = update;
  notificationList.appendChild(li);
});
/* ---------------- SEARCH FUNCTIONS ---------------- */
function searchTheory(query) {
  return THEORY_DATA.filter((item) =>
    (item.question + " " + item.keywords).toLowerCase().includes(query),
  );
}
function searchDesigns(query) {
  return DESIGN_DATA.filter((d) =>
    (d.title + " " + d.keywords + " " + d.area_sqft + " " + d.area_gaz)
      .toLowerCase()
      .includes(query),
  );
}
function searchMedia(query) {
  return MEDIA_DATA.filter((item) =>
    (item.title + " " + item.keywords).toLowerCase().includes(query),
  );
}
function searchMathFormulas(query) {
  return MATH_FORMULAS.filter((f) =>
    (f.name + " " + f.formula + " " + f.keywords).toLowerCase().includes(query),
  );
}
function searchKids(query) {
  return KIDS_DATA.filter((item) => {
    const ql = query.toLowerCase();

    const textMatch = (
      item.title +
      " " +
      item.keywords +
      " " +
      (item.color || "") +
      " " +
      (item.taste || "") +
      " " +
      (item.season || "") +
      " " +
      (item.weather || "") +
      " " +
      (item.tags || []).join(" ")
    )
      .toLowerCase()
      .includes(ql);

    // number search → age group
    if (/^\d+$/.test(ql) && item.ageGroup) {
      return item.ageGroup.includes(Number(ql));
    }

    return textMatch;
  });
}
function searchQuiz(query) {
  const q = query.toLowerCase();

  // Filter results based on query
  const results = QUIZ_DATA.filter((item) => {
    const text = (
      (item.question || "") +
      " " +
      (item.keywords || "") +
      " " +
      (item.quizType || "") +
      " " +
      (item.category || "") +
      " " +
      (item.type || "")
    ).toLowerCase();

    return text.includes(q);
  });

  // Shuffle the filtered results before returning
  return shuffleArray(results);
}
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const SAD_EMOJIS = ["😢", "😞", "😔", "😭", "😕", "☹️"];
function checkQuizAnswer(button, selected, correct) {
  const card = button.closest(".quiz-card");
  const feedback = card.querySelector(".quiz-feedback");

  if (selected === correct) {
    feedback.innerHTML = `<span class="correct">108</span>`;
  } else {
    const emoji = SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)];
    feedback.innerHTML = `<span class="wrong">108 ${emoji}</span>`;
  }

  // Disable all buttons after one click
  card.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.disabled = true;
  });
}
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("quiz-option")) return;

  const button = e.target;
  const selected = button.dataset.answer;
  const correct = button.dataset.correct;

  checkQuizAnswer(button, selected, correct);
});
function showSearchLoader() {
  document.getElementById("searchLoader").classList.remove("hidden");
}

//function hideSearchLoader() {
//  document.getElementById("searchLoader").classList.add("hidden");
//}
function hideSearchLoader() {
  const loader = document.getElementById("searchLoader");
  if (!loader) return;
  loader.classList.add("hidden");
}

function openDesignModal(image, title, sqft, gaz, type) {
  document.getElementById("designModalImage").src = image;
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalArea").innerText =
    `Area: ${sqft} sq ft / ${gaz} gaz`;
  document.getElementById("modalType").innerText = `Type: ${type}`;

  const download = document.getElementById("modalDownload");
  download.href = image;

  document.getElementById("designModal").classList.add("show");
}
function openTheoryModal(image) {
  if (!image) return;
  document.getElementById("modalImage").src = image;
  document.getElementById("designTheoryModal").classList.add("show");
}
function openMediaModal(src, type) {
  const img = document.getElementById("mediaImage");
  const video = document.getElementById("mediaVideo");

  img.style.display = "none";
  video.style.display = "none";

  if (type === "image") {
    img.src = src;
    img.style.display = "block";
  } else {
    video.src = src;
    video.style.display = "block";
  }

  document.getElementById("mediaModal").classList.add("show");
}
function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalPhoto");

  img.src = src;
  modal.classList.add("show");
}

function closeDesignModal() {
  document.getElementById("designModal").classList.remove("show");
  document.getElementById("designTheoryModal").classList.remove("show");
  document.getElementById("mediaModal").classList.remove("show");
  document.getElementById("imageModal").classList.remove("show");
  document.getElementById("mediaVideo").pause();
}
function cleanPhone(phone) {
  return phone.replace(/[^0-9]/g, "");
}
function openProfile(id) {
  window.location.href = `profile-details.html?id=${id}`;
}
function isMathExpression(input) {
  return /^[0-9+\-*/().%\s^,a-zA-Z]+$/.test(input) && /[\d]/.test(input); // must contain at least one number
}
function clearSearchAll() {
  if (window.recognition) {
    try {
      recognition.abort();
    } catch (e) {}
  }

  input.value = "";
  categoryFilter.value = "";
  roleFilter.value = "";
  stateFilter.value = "";
  districtFilter.value = "";

  document.getElementById("calcResult")?.classList.add("hidden");

  results.innerHTML =
    "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

  localStorage.removeItem(getSearchStateKey());

  hideSearchLoader();
  toggleClearButton(); // ✅ HIDE CLEAR BUTTON
}

// clear button logic function
function toggleClearButton() {
  const clearBtn = document.getElementById("clearSearchBtn");
  if (!clearBtn) return;

  if (input.value.trim().length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
}
// below is pagination code of which show how manges with data
function renderPage() {
  const pagination = document.getElementById("pagination");

  // 🚫 NO RESULTS
  if (!lastSearchResults.length) {
    results.innerHTML =
      "<p style='text-align:center;color:#64748b;'>No results found</p>";
    pagination?.classList.add("hidden");
    return;
  }

  const totalPages = Math.ceil(lastSearchResults.length / PAGE_SIZE);

  // 🚫 ONLY ONE PAGE → HIDE PAGINATION
  if (totalPages <= 1) {
    pagination?.classList.add("hidden");
  }

  // 🚫 PAGE OUT OF RANGE (from old search)
  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const pageItems = lastSearchResults.slice(start, end);

  render(pageItems);

  // ✅ SHOW PAGINATION ONLY IF NEEDED
  if (totalPages > 1) {
    renderPagination(totalPages);
  }
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

  pagination.classList.remove("hidden");
  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">⬅ Prev</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next ➡</button>
  `;
}

function resetPagination() {
  lastSearchResults = [];
  currentPage = 1;

  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.classList.add("hidden");
    pagination.innerHTML = "";
  }
}

function nextPage() {
  const totalPages = Math.ceil(lastSearchResults.length / PAGE_SIZE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
}
async function fetchPublishedProfiles() {
  try {
    const res = await fetch(PROFILE_API);
    const data = await res.json();

    // 🔥 NORMALIZE DATA TO MATCH YOUR CURRENT RENDER FORMAT api cards
    API_PROFILES_CACHE = data.map((p) => ({
      id: p._id,
      profileUrl: `profile-details.html?id=${p._id}`,
      name: p.name,
      role: p.role,
      rating: p.rating,
      experience: p.experience,
      category: p.category || "contractor",
      image: p.mediaType === "image" ? SERVER_BASE + p.media : "",

      video: p.mediaType === "video" ? SERVER_BASE + p.media : "",
      languages: p.languages,
      phone: p.phone,
      description: p.description,
      location: p.location,
      state: p.state,
      district: p.district,

      source: "api",
    }));
  } catch (e) {
    console.error("Profile API error", e);
  }
}
//fetchPublishedProfiles();
// all card code if all type of data set render code ui from below code
function render(items) {
  results.innerHTML = "";
  if (!items.length) {
    results.innerHTML = "<p>No results found.</p>";
    return;
  }

  items.forEach((item) => {
    /* DESIGN RESULT */
    // DESIGN RESULT
    if (item.category === "design") {
      results.innerHTML += `
    <div class="card design-card">
      <img 
        src="${item.image}" 
        alt="${item.title}" 
        class="design-img"
        onclick="openDesignModal('${item.image}', '${item.title}', '${item.area_sqft}', '${item.area_gaz}', '${item.type}')"
      >

      <div class="design-info">
        <h3>${item.title}</h3>
        <p><strong>Area:</strong> ${item.area_sqft} sq ft / ${item.area_gaz} gaz</p>
        <p><strong>Type:</strong> ${item.type}</p>

        <a 
          href="${item.image}" 
          download 
          class="download-btn"
        >
          ⬇ Download Blueprint
        </a>
      </div>
    </div>
  `;
      return;
    }
    // quiz card
    if (item.type === "quiz") {
      results.innerHTML += `
    <div class="card quiz-card" data-quiz-id="${item.id}">
      <h3>${item.question}</h3>
<div class="quiz-voice">
        <button onclick="speakText('Question: ${item.question}')">🔊 Question</button>
        ${
          item.hint
            ? `<button onclick="speakText('Hint: ${item.hint}')">💡 Hint</button>`
            : ""
        }
      </div>
      <div class="quiz-options">
        ${item.options
          .map(
            (opt) => `
         <button class="quiz-option"
  data-answer="${opt}"
  data-correct="${item.correctAnswer}">
  ${opt}
</button>
        `,
          )
          .join("")}
      </div>

      <div class="quiz-feedback"></div>
    </div>
  `;
      return;
    }
    // 🧒 KIDS ALPHABET CARD
    if (item.category === "kids") {
      results.innerHTML += `
    <div class="card kids-card">
      <div class="kids-3d-box">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <h3>${item.title}</h3>
    </div>
  `;
      return;
    }

    // THEORY ANSWER
    // THEORY ANSWER
    if (item.answer) {
      results.innerHTML += `
    <div class="card">
      <div class="badge contractor">ANSWER</div>
      <h3>${item.question.toUpperCase()}</h3>

      ${
        item.image
          ? `
        <img 
          src="${item.image}" 
          class="design-img"
          onclick="openTheoryModal('${item.image}')"
        >
      `
          : ""
      }

      <div>${item.answer}</div>
    </div>
  `;
      return;
    }
    // MEDIA RESULT
    if (item.mediaType) {
      results.innerHTML += `
    <div class="card media-card">
      <h3>${item.title}</h3>

      ${
        item.mediaType === "image"
          ? `<img src="${item.src}" class="media-img" onclick="openMediaModal('${item.src}', 'image')">`
          : `<video controls class="media-video">
               <source src="${item.src}" type="video/mp4">
             </video>`
      }
    </div>
  `;
      return;
    }
    // MATH FORMULA RESULT
    if (item.category === "math") {
      results.innerHTML += `
    <div class="card math-card">
    <h4>${item.group}</h4>
      <h3>${item.name}</h3>

      <div class="formula-box">${item.formula}</div>

      <img
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        class="formula-img"
        onclick="openImageModal('${item.image}')"
      >

      <p class="formula-desc">${item.explanation}</p>
    </div>
  `;
      return;
    }

    // CONTRACTOR / MATERIAL
    const phoneClean = item.phone ? cleanPhone(item.phone) : "";
    results.innerHTML += `
     <div class="card" onclick="openProfile('${item._id || item.id}')">
       <div class="card">
         ${
           item.image || item.video
             ? `
<div class="card-header">
  ${
    item.video
      ? `<video src="${item.video}" muted loop autoplay playsinline></video>`
      : `<img src="${item.image}" alt="${item.name}">`
  }
  <div>
    <h3>${item.name}</h3>
    <p>${item.role || item.type}</p>
  </div>
</div>`
             : ""
         }

        <div class="badge ${item.category}">
          ${item.category.toUpperCase()}, ${item.role ? `(${item.role})` : ""}  ${item.type ? `(${item.type})` : ""}
          
        </div>

        ${item.rating ? `<div class="rating">⭐ ${item.rating}</div>` : ""}
        ${item.experience ? `<div class="experience">${item.experience} years</div>` : ""}
        <p>${item.state}, ${item.district}, ${item.location}</p>
            <p>${item.description}</p>
        ${
          item.phone
            ? `
        <div class="contact-actions">
  <a href="tel:${phoneClean}" class="btn call-btn">
    <!-- Call Icon -->
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2
      1 .3 2.1.5 3.2.5.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2
      C10.1 21.2 2.8 13.9 2.8 4.4c0-.7.5-1.2 1.2-1.2h3.6
      c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.5 3.2.1.4 0 .9-.3 1.2L6.6 10.8z"/>
    </svg>
    Call
  </a>

  <a href="https://wa.me/${phoneClean}" target="_blank" class="btn whatsapp-btn">
    <!-- WhatsApp Icon -->
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 3.6 17.8L2 22l4.3-1.6
      A11 11 0 1 0 20.5 3.5z"/>
    </svg>
    WhatsApp
  </a>
</div>
        `
            : ""
        }

    ${item.email ? `<p>✉️ ${item.email}</p>` : ""}
  </div>
`;
  });
}
// debouncing function code to limit search frequency code.
function debounce(fn, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
// backend common filter code .
function applyCommonFilters(item, q, category, role, state, district) {
  // 🔎 TEXT TOKEN MATCH
  const searchableText = Object.values(item).join(" ").toLowerCase();

  const tokenMatch = !q || searchableText.includes(q);

  // 🎯 CATEGORY FILTER
  const categoryMatch = !category || item.category?.toLowerCase() === category;

  // 📍 ROLE FILTER
  const roleMatch = !role || item.role?.toLowerCase() === role;

  // 📍 STATE FILTER
  const stateMatch = !state || item.state?.toLowerCase() === state;

  // 📍 DISTRICT FILTER
  const districtMatch =
    !district || item.district?.toLowerCase().includes(district);

  return tokenMatch && categoryMatch && roleMatch && stateMatch && districtMatch;
}
function applySearch() {
  showSearchLoader(); // 🔄 start loader
  setTimeout(() => {
    saveSearchState(); // 💾 SAVE BEFORE SEARCH
    const q = input.value.toLowerCase().trim();
    const category = categoryFilter.value.toLowerCase();
    const role = roleFilter.value.toLowerCase();
    const state = stateFilter.value.toLowerCase();
    const district = districtFilter.value.toLowerCase();

    // 🚫 Prevent heavy search for very short input
    if (q.length === 1 && !isMathExpression(q)) {
      results.innerHTML =
        "<p style='text-align:center;color:#94a3b8;'>Type at least 2 characters to search</p>";
      hideSearchLoader();
      return;
    }

    // 🟡 EMPTY SEARCH STATE
    if (!q && !category && !role && !state && !district) {
      resetPagination();
      results.innerHTML =
        "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
      hideSearchLoader();
      return;
    }

    const queryTokens = normalizeText(q)
      .split(" ")
      .filter((t) => t.length >= 2);

    // 🔹 Unified search function
    function searchProfiles(queryTokens, category, role, state, district) {
      const combinedData = [...SEARCH_DATA, ...API_PROFILES_CACHE];

      const dataResults = shuffleArray(
        combinedData.filter((item) => {
          // Apply common filters first
          if (!applyCommonFilters(item, q, category, role, state, district)) {
            return false;
          }
          // Build searchable text
          const searchableText = normalizeText(
            [
              item.name,
              item.type,
              item.category,
              item.role,
              item.state,
              item.district,
              item.location,
              item.city,
              item.village,
              item.description,
            ]
              .filter(Boolean)
              .join(" "),
          );

          // Token match with typo tolerance
          const tokenMatch = queryTokens.every((token) => {
            if (searchableText.includes(token)) return true;

            if (token.length >= 4) {
              return searchableText.split(" ").some((word) => {
                const dist = levenshtein(word, token);
                if (word.length > 8) return dist <= 3;
                return dist <= 2;
              });
            }

            return false;
          });

          // Filters
          const categoryMatch =
            !category || item.category?.toLowerCase() === category;
          const roleMatch = !role || item.role?.toLowerCase() === role;
          const stateMatch = !state || item.state?.toLowerCase() === state;
          const districtMatch =
            !district || item.district?.toLowerCase().includes(district);

          return tokenMatch && categoryMatch && roleMatch && stateMatch && districtMatch;
        }),
      ).slice(0, 50);

      return dataResults;
    }

    // 🔹 Run search
    const dataResults = searchProfiles(queryTokens, category, role, state, district);

    // 🔹 Other data sources
    const theoryResults = q ? searchTheory(q) : [];
    const designResults = q ? searchDesigns(q) : [];
    const mediaResults = q ? searchMedia(q) : [];
    const mathResults = q ? searchMathFormulas(q) : [];
    const kidsResults = q ? searchKids(q) : [];
    const QuizResults = q ? searchQuiz(q) : [];

    // 🔴 Clear old pagination
    resetPagination();

    // 🔹 Merge results
    lastSearchResults = [
      ...theoryResults,
      ...designResults,
      ...mediaResults,
      ...dataResults,
      ...mathResults,
      ...kidsResults,
      ...QuizResults,
    ];

    // 🔁 Reset to first page
    currentPage = 1;

    // 📄 Render first page
    renderPage();

    hideSearchLoader();
  }, 300);
}

/* ---------------- EVENTS ---------------- */
const debouncedSearch = debounce(applySearch, 800);

let isComposing = false;

input.addEventListener("compositionstart", () => {
  isComposing = true;
});
input.addEventListener("compositionend", () => {
  isComposing = false;
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isComposing) {
    e.preventDefault(); // stop form submit / keyboard close
    debouncedSearch.cancel?.(); // safety
    applySearch();
    fetchPublishedProfiles();
    toggleClearButton(); // ✅ ONLY trigger
  }
});

// Filters: still update instantly
[categoryFilter,roleFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("input", debounce(applySearch, 800));
});

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

/// 🎤 VOICE SEARCH
const voiceBtn = document.getElementById("voiceBtn");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  voiceBtn.onclick = () => {
    recognition.start();
  };

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    toggleClearButton(); // ✅ REQUIRED
    applySearch();
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.innerText = "❌";
}

const filterToggle = document.getElementById("filterToggle");
const filterBox = document.getElementById("filterBox");

filterToggle.addEventListener("click", () => {
  filterBox.classList.toggle("show");
});

// 4️⃣ event bindings (LAST)
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("clearSearchBtn")
    ?.addEventListener("click", clearSearchAll);

  toggleClearButton(); // initial state
});

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ load profiles first
  await fetchPublishedProfiles();

  // 2️⃣ restore previous search
  restoreSearchState();
});
