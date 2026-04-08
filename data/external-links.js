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
let currentRate = 150; // default helper rate
let warnings = 0;
let lastPresenceTime = Date.now();
let genuineEarnings = 0;
let isAbsent = false;
let absenceStart = null;
let accumulatedTime = 0; // total time before pause
let totalHoursWorked = 0;
let totalEarningsToday = 0;
let sessionId = null;
const API_BASE = "http://localhost:5000/api/work"; // change if using domain
const SERVER_BASE = "http://localhost:5000";
const socket = io("http://localhost:5000");
let isLiveStarted = false;
let localStream = null;
let activeStreams = [];
let peerConnection;
const loggedInUser = JSON.parse(localStorage.getItem("cb_login_user"));
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
    await startCamera(); // 🔴 IMPORTANT
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
  stopAllMedia();
  stopAudioCapture();
   stopTimer();
   // 🔴 stop WebRTC properly
  if (peerConnection) {

    peerConnection.getSenders().forEach(sender => {
      if (sender.track) sender.track.stop();
    });

    peerConnection.close();
    peerConnection = null;
  }

  isLiveStarted = false;
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
    alert(`Session ended. Earnings: ₹${data.earnings.toFixed(2)} for ${data.duration.toFixed(2)} hours`);
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
     document.getElementById("addMemberBtn").style.display = "none";
  document.getElementById("permissionSection").style.display = "none";
  console.log(document.getElementById("permissionSection"));
if (!isLiveStarted) {

  // 🔴 try to recover automatically
  if (!localStream) {

    console.log("Camera not ready → starting now");

    await startCamera(); // auto start

  }

  if (!localStream) {
    showToast("Camera permission required");
    return;
  }

  startLiveBroadcast(loggedInUser.id);
  isLiveStarted = true;
}
  console.log("localStream:", localStream);
  // hide permission UI
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
     handleLiveClick(p.ownerId);
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
async function handleLiveClick(ownerId) {

  try {

    const res = await fetch(`${API_BASE}/live-status?owner=${ownerId}`, {
      headers: authHeaders()
    });

    const data = await res.json();

    // 🟢 If live → start watching
    if (data.isLive) {
      watchLive(ownerId);
      return;
    }

    // 🔴 If not live → show message
    if (data.endedAt) {

      const date = new Date(data.endedAt).toLocaleString();

      showToast(`Session ended at ${date}`);

    } else {
      showToast("No active session");
    }

  } catch (err) {
    console.error(err);
    showToast("Error checking live status");
  }

}
function startLiveBroadcast(ownerId) {

  const roomId = ownerId;

  socket.emit("join-room", roomId);

  peerConnection = new RTCPeerConnection();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // ICE
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        roomId,
        candidate: event.candidate
      });
    }
  };

  // 🔴 IMPORTANT (missing earlier)
  socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  });

  peerConnection.createOffer()
    .then(offer => {
      peerConnection.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

}
async function startLiveStreamForUser(ownerId) {

  const roomId = ownerId;

  socket.emit("join-room", roomId);

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  document.getElementById("cameraStream").srcObject = localStream;

  peerConnection = new RTCPeerConnection();

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("offer", { roomId, offer });

}

function watchLive(ownerId) {

  const video = document.getElementById("cameraStream"); // 👈 SAME ID

  const roomId = ownerId;

  socket.emit("join-room", roomId);

  peerConnection = new RTCPeerConnection();

  peerConnection.ontrack = (event) => {

    video.srcObject = event.streams[0]; // 👈 replace with live stream

  };

  socket.on("offer", async (offer) => {

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", { roomId, answer });

  });

  socket.on("ice-candidate", (candidate) => {
    peerConnection.addIceCandidate(candidate);
  });

}
async function startCamera() {

  const video = document.getElementById("cameraStream");

  // stop old streams first
  activeStreams.forEach(stream => {
    stream.getTracks().forEach(t => t.stop());
  });
  activeStreams = [];

  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  });

  activeStreams.push(localStream);

  video.srcObject = localStream;

}
function stopAllMedia() {

  console.log("Stopping ALL media...");

  // 🔴 stop all tracked streams
  activeStreams.forEach(stream => {
    stream.getTracks().forEach(track => track.stop());
  });

  activeStreams = [];

  // 🔴 stop localStream
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  // 🔴 stop video element
  const video = document.getElementById("cameraStream");
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  // 🔴 stop WebRTC senders (MOST IMPORTANT)
  if (peerConnection) {
    peerConnection.getSenders().forEach(sender => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    peerConnection.close();
    peerConnection = null;
  }

  console.log("All media stopped ✅");
}
function stopCamera() {

  const video = document.getElementById("cameraStream");

  // ✅ Stop video element stream
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }

  // ✅ Stop global stream (VERY IMPORTANT)
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  console.log("Camera fully stopped");
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
setInterval(captureSnapshot, 120000);
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
