(() => {
  //"use strict";
  //const SERVER_BASE = 'http://localhost:5000';
  const SERVER_BASE = "https://api.buildskil.com";
  const API_BASE = `${SERVER_BASE}/api/live`;
  const AUTH_KEY = "cb_token";
  const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

  const $ = (id) => document.getElementById(id);
  const els = {
    connectionDot: $("connectionDot"),
    connectionText: $("connectionText"),
    startLiveBtn: $("startLiveBtn"),
    stopLiveBtn: $("stopLiveBtn"),
    ownerLiveBadge: $("ownerLiveBadge"),
    ownerAudioLabel: $("ownerAudioLabel"),
    localVideo: $("localVideo"),
    switchCameraBtn: $("switchCameraBtn"),
    localEmpty: $("localEmpty"),
    sessionLabel: $("sessionLabel"),
    micBtn: $("micBtn"),
    shareBtn: $("shareBtn"),
    shareModal: $("shareModal"),
    closeShareModalBtn: $("closeShareModalBtn"),
    cancelShareBtn: $("cancelShareBtn"),
    shareForm: $("shareForm"),
    sharePhone: $("sharePhone"),
    shareError: $("shareError"),
    sendShareBtn: $("sendShareBtn"),
    refreshSharedBtn: $("refreshSharedBtn"),
    sharedList: $("sharedList"),
    sharedCount: $("sharedCount"),
    remoteVideo: $("remoteVideo"),
    remoteEmpty: $("remoteEmpty"),
    viewerLabel: $("viewerLabel"),
    remoteLiveBadge: $("remoteLiveBadge"),
    leaveViewerBtn: $("leaveViewerBtn"),
    toast: $("toast"),
    ownerSharesList: $("ownerSharesList"),
    ownerSharesCount: $("ownerSharesCount"),
    refreshOwnerSharesBtn: $("refreshOwnerSharesBtn"),
    liveHistoryList: $("liveHistoryList"),
    liveHistoryCount: $("liveHistoryCount"),
    refreshLiveHistoryBtn: $("refreshLiveHistoryBtn"),
    ownerRemoteViewers: $('ownerRemoteViewers'),
    viewerSelfVideo: $('viewerSelfVideo'),
    viewerMicBtn: $("viewerMicBtn"),
    viewerSwitchCameraBtn: $("viewerSwitchCameraBtn"),
  };

  let socket = null;
  let socketConnectPromise = null;
  let toastTimer = null;
  let localStream = null;
  let activeSessionId = null;
  let isLiveOwner = false;
  let isMicEnabled = true;
  let viewingSessionId = null;
  let viewerOwnerSocketId = null;
  const ownerPeers = new Map(); // viewer socket id -> RTCPeerConnection
  let viewerPeer = null;
// Camera/microphone belonging to the person watching another user's live.
let viewerLocalStream = null;
let currentFacingMode = 'user';
let cameraSwitchInProgress = false;
let viewerFacingMode = "user";
let viewerCameraSwitchInProgress = false;
let ownerHeartbeatTimer = null;
let ownerHeartbeatInProgress = false;

const OWNER_HEARTBEAT_INTERVAL_MS = 20_000;
// One remote video tile per connected shared user.
const ownerViewerTiles = new Map();
  function getToken() {
    return localStorage.getItem(AUTH_KEY);
  }

  async function api(path, options = {}) {
    const token = getToken();
    if (!token)
      throw new Error("Please log in to BuildSkil before using Live.");

    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const raw = await response.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { message: raw };
    }

    if (response.status === 401)
      throw new Error("Your session has expired. Please log in again.");
    if (!response.ok)
      throw new Error(
        data?.message || data?.error || `Request failed (${response.status}).`,
      );
    return data;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("visible"), 3500);
  }

  function setConnection(connected, text) {
    els.connectionDot.classList.toggle("connected", connected);
    els.connectionText.textContent = text;
  }

  function setOwnerLiveUI(live) {
    els.ownerLiveBadge.classList.toggle("on", live);
    els.ownerLiveBadge.innerHTML = `<span></span> ${live ? "LIVE" : "OFFLINE"}`;
    els.startLiveBtn.disabled = live;
    els.stopLiveBtn.disabled = !live;
    els.shareBtn.disabled = !live;
    els.micBtn.disabled = !live;
    els.localVideo.classList.toggle("visible", live && !!localStream);
    els.localEmpty.hidden = live && !!localStream;
    els.sessionLabel.textContent =
      live && activeSessionId
        ? `Session ${activeSessionId}`
        : "No active live session";
    els.ownerAudioLabel.textContent = live
      ? isMicEnabled
        ? "Microphone on"
        : "Microphone muted"
      : "Microphone off";

      updateCameraSwitchButton();
  }

  function setViewerUI(watching, label = "") {
    els.remoteVideo.classList.toggle("visible", watching);
    els.remoteEmpty.hidden = watching;
    els.leaveViewerBtn.disabled = !watching;
    els.viewerLabel.textContent =
      label ||
      (watching ? "Connecting to live stream…" : "Not watching a stream");
    els.remoteLiveBadge.textContent = watching ? "LIVE VIEW" : "VIEWER";
  }

  function openShareModal() {
    if (!activeSessionId || !isLiveOwner) return;
    els.shareError.textContent = "";
    els.sharePhone.value = "";
    els.shareModal.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(() => els.sharePhone.focus(), 0);
  }

  function closeShareModal() {
    els.shareModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function closePeer(peer) {
    if (!peer) return;
    peer.onicecandidate = null;
    peer.ontrack = null;
    peer.onconnectionstatechange = null;
    try {
      peer.close();
    } catch (_) {}
  }
function registerLiveOwnerSocket() {
  if (
    socket?.connected &&
    isLiveOwner &&
    activeSessionId
  ) {
    socket.emit("live:owner-started", {
      sessionId: activeSessionId,
    });
  }
}

async function sendOwnerHeartbeat(sessionId = activeSessionId) {
  if (!sessionId || ownerHeartbeatInProgress || !isLiveOwner) {
    return;
  }

  ownerHeartbeatInProgress = true;

  try {
    await api(
      `/session/${encodeURIComponent(sessionId)}/heartbeat`,
      { method: "POST" }
    );
  } catch (error) {
    // A temporary network failure should not instantly end the live.
    console.warn("[Live] Heartbeat failed; it will retry:", error);
  } finally {
    ownerHeartbeatInProgress = false;
  }
}

function startOwnerHeartbeat(sessionId) {
  stopOwnerHeartbeat();

  // Send immediately, then renew the lease every 20 seconds.
  void sendOwnerHeartbeat(sessionId);

  ownerHeartbeatTimer = setInterval(() => {
    if (
      isLiveOwner &&
      activeSessionId === sessionId
    ) {
      void sendOwnerHeartbeat(sessionId);
    }
  }, OWNER_HEARTBEAT_INTERVAL_MS);
}

function stopOwnerHeartbeat() {
  if (ownerHeartbeatTimer !== null) {
    clearInterval(ownerHeartbeatTimer);
    ownerHeartbeatTimer = null;
  }

  ownerHeartbeatInProgress = false;
}
  async function toggleVideoFullscreen(frameId, videoId) {
  const frame = $(frameId);
  const video = $(videoId);

  if (!frame || !video) {
    showToast('Video frame not found.');
    return;
  }

  const currentFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement;

  try {
    if (currentFullscreen) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }

      if (currentFullscreen === frame) return;
    }

    if (typeof frame.requestFullscreen === 'function') {
      await frame.requestFullscreen();
      return;
    }

    // Fallback for iPhone Safari, which may only support
    // native full screen on the video element.
    if (typeof video.webkitEnterFullscreen === 'function') {
      video.webkitEnterFullscreen();
      return;
    }

    showToast('Full screen is not supported by this browser.');
  } catch (error) {
    console.error('[Live] Full-screen error:', error);
    showToast('Unable to open full screen.');
  }
}
/** //buy sover of hull screen button
async function toggleVideoFullscreen(targetId, videoId) {
  const target = document.getElementById(targetId);
  const video = document.getElementById(videoId);

  if (!target || !video) {
    console.error('[Fullscreen] Missing element:', { targetId, videoId });
    showToast('Unable to find the shared video.');
    return;
  }

  try {
    // Exit fullscreen if already active.
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement
    ) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      return;
    }

    // iOS Safari uses a native video fullscreen API.
    if (typeof video.webkitEnterFullscreen === 'function') {
      video.webkitEnterFullscreen();
      return;
    }

    // Android Chrome and other browsers.
    if (typeof target.requestFullscreen === 'function') {
      await target.requestFullscreen();
      return;
    }

    if (typeof video.requestFullscreen === 'function') {
      await video.requestFullscreen();
      return;
    }

    // Fallback for browsers without a fullscreen API.
    target.classList.toggle('mobile-fullscreen');
  } catch (error) {
    console.error('[Fullscreen] Failed:', error);

    // Try the video element if the container request failed.
    try {
      if (typeof video.requestFullscreen === 'function') {
        await video.requestFullscreen();
        return;
      }

      target.classList.toggle('mobile-fullscreen');
    } catch (fallbackError) {
      console.error('[Fullscreen] Fallback failed:', fallbackError);
      showToast('Unable to open shared video full screen.');
    }
  }
}
 */
function getOwnerViewerTile(viewerSocketId) {
  const key = String(viewerSocketId);

  const existing = ownerViewerTiles.get(key);
  if (existing) return existing;

  const tile = document.createElement('div');
  tile.className = 'owner-viewer-tile';

  const video = document.createElement('video');
  video.className = 'owner-viewer-video';
  video.autoplay = true;
  video.playsInline = true;
  video.muted = false;
  video.controls = false;
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-label', "Shared user's camera");

  // A tap retries playback if the browser blocks incoming audio.
  video.addEventListener('click', () => {
    video.play().catch(error => {
      console.warn('[Live] Viewer audio playback is blocked:', error);
    });
  });

  const label = document.createElement('span');
  label.className = 'owner-viewer-label';
  label.textContent = 'SHARED USER';

  tile.append(video, label);
  els.ownerRemoteViewers.appendChild(tile);

  const result = { tile, video };
  ownerViewerTiles.set(key, result);

  return result;
}

function attachOwnerViewerTrack(viewerSocketId, event) {
  const item = getOwnerViewerTile(viewerSocketId);

  let stream = item.video.srcObject;

  if (event.streams?.[0]) {
    stream = event.streams[0];
  } else {
    if (!(stream instanceof MediaStream)) {
      stream = new MediaStream();
    }

    if (
      event.track &&
      !stream.getTracks().some(track => track.id === event.track.id)
    ) {
      stream.addTrack(event.track);
    }
  }

  if (item.video.srcObject !== stream) {
    item.video.srcObject = stream;
  }

  item.video.play().catch(error => {
    console.warn('[Live] Could not autoplay shared-user video/audio:', error);
    showToast('Shared user connected. Tap their video to enable audio.');
  });
}

function removeOwnerViewerTile(viewerSocketId) {
  const key = String(viewerSocketId);
  const item = ownerViewerTiles.get(key);

  if (!item) return;

  item.video.pause();
  item.video.srcObject = null;
  item.tile.remove();

  ownerViewerTiles.delete(key);
}

function clearOwnerViewerTiles() {
  for (const viewerSocketId of ownerViewerTiles.keys()) {
    removeOwnerViewerTile(viewerSocketId);
  }
}

  function ensureSocket() {
    if (!getToken())
      throw new Error("Please log in to BuildSkil before using Live.");
    if (socket?.connected) return Promise.resolve(socket);
    if (socketConnectPromise) return socketConnectPromise;

    if (socket) {
      try {
        socket.disconnect();
      } catch (_) {}
      socket = null;
    }

    if (typeof window.io !== "function") {
      throw new Error(
        "Socket.IO client did not load. Check your internet connection and Socket.IO server setup.",
      );
    }

    socketConnectPromise = new Promise((resolve, reject) => {
      const nextSocket = window.io(`${SERVER_BASE}/live`, {
        auth: { token: getToken() },
        transports: ["websocket", "polling"],
        reconnection: true,
      });
      socket = nextSocket;
      let settled = false;

      nextSocket.on("connect", () => {
        setConnection(true, "Connected");
         registerLiveOwnerSocket();
        if (!settled) {
          settled = true;
          socketConnectPromise = null;
          resolve(nextSocket);
        }
      });
      nextSocket.on("disconnect", () => setConnection(false, "Disconnected"));
      nextSocket.on("connect_error", (error) => {
        setConnection(false, "Connection error");
        if (!settled) {
          settled = true;
          socketConnectPromise = null;
          reject(
            new Error(error?.message || "Could not connect to live signaling."),
          );
        }
      });

      // Persisted notifications are also sent in real time by the backend.
      nextSocket.on("notification:new", (notification) => {
        showToast(
          notification?.message ||
            notification?.title ||
            "You have a new notification.",
        );
        if (["live_shared", "live_ended"].includes(notification?.type)) {
          void loadSharedStreams();
        }
      });

      // Owner receives a request when an authorized viewer enters their live session.
      nextSocket.on("live:viewer-joined", (payload) => {
        if (
          !isLiveOwner ||
          payload?.sessionId !== activeSessionId ||
          !payload?.viewerSocketId
        )
          return;
        void offerToViewer(payload.viewerSocketId, payload.sessionId);
      });
       
      nextSocket.on('live:viewer-left', payload => {
  if (
    !payload?.viewerSocketId ||
    payload.sessionId !== activeSessionId
  ) {
    return;
  }

  const viewerSocketId = String(payload.viewerSocketId);
  const peer = ownerPeers.get(viewerSocketId);

  if (peer) {
    closePeer(peer);
    ownerPeers.delete(viewerSocketId);
  }

  removeOwnerViewerTile(viewerSocketId);
});

      // Viewer receives an offer only after backend has authorized the live:join request.
      nextSocket.on("live:offer", (payload) => {
        void handleOffer(payload);
      });
      nextSocket.on("live:answer", (payload) => {
        void handleAnswer(payload);
      });
      nextSocket.on("live:ice", (payload) => {
        void handleIce(payload);
      });
      nextSocket.on("live:ended", (payload) => {
        if (payload?.sessionId && payload.sessionId === viewingSessionId) {
          stopViewing(false);
          showToast("The live session has ended.");
        }
      });
      nextSocket.on('live:access-revoked', payload => {
  if (payload?.sessionId === viewingSessionId) {
    void stopViewing(false);
    showToast('The session owner removed your live access.');
  }

  void loadSharedStreams();
});
      nextSocket.on("live:error", (payload) =>
        showToast(payload?.message || "Live access was denied."),
      );
    });
    return socketConnectPromise;
  }

  async function startLive() {
    if (isLiveOwner) return;
    els.startLiveBtn.disabled = true;
   let createdSessionId = null;
    try {
      if (!window.isSecureContext && location.hostname !== "localhost") {
        throw new Error(
          "Camera access requires HTTPS. Open this page on a secure HTTPS website.",
        );
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "This browser does not support camera and microphone access.",
        );
      }
      if (!getToken())
        throw new Error("Please log in to BuildSkil before starting live.");

      // Ask for user consent explicitly; the stream is not started on page load.
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      els.localVideo.srcObject = localStream;
      isMicEnabled = true;

      const data = await api("/session/start", {
        method: "POST",
        body: JSON.stringify({ hasVideo: true, hasAudio: true }),
      });
      activeSessionId = data?.sessionId || data?.session?._id || data?._id;
      if (!activeSessionId)
        throw new Error("The server did not return a live session ID.");
       createdSessionId = activeSessionId;
      await ensureSocket();
      isLiveOwner = true;
      setOwnerLiveUI(true);
      registerLiveOwnerSocket();
startOwnerHeartbeat(activeSessionId);
      //await loadSharedStreams();
      await Promise.all([
  loadSharedStreams(),
  loadOwnerShares(activeSessionId),
  loadLiveHistory(),
]);
      showToast("Live camera started. Share access with a registered user.");
    } catch (error) {
      stopOwnerHeartbeat();

if (createdSessionId) {
  try {
    await api(
      `/session/${encodeURIComponent(createdSessionId)}/stop`,
      { method: "POST" }
    );
  } catch (cleanupError) {
    console.warn(
      "[Live] Could not clean up the failed start; server cleanup will recover it:",
      cleanupError
    );
  }
}
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
      els.localVideo.srcObject = null;
      activeSessionId = null;
      isLiveOwner = false;
      setOwnerLiveUI(false);
      els.startLiveBtn.disabled = false;
      console.error("[Live] Start failed:", error);
      showToast(error?.message || "Could not start live.");
    }
  }

  async function stopLive() {
    stopOwnerHeartbeat();
    if (!isLiveOwner && !activeSessionId) return;
    const endedSessionId = activeSessionId;

    try {
      if (socket?.connected && endedSessionId) {
        socket.emit("live:end", { sessionId: endedSessionId });
      }
      for (const [viewerSocketId, peer] of ownerPeers.entries()) {
  closePeer(peer);
  removeOwnerViewerTile(viewerSocketId);
}

ownerPeers.clear();
clearOwnerViewerTiles();
     // for (const peer of ownerPeers.values()) closePeer(peer);  ownerPeers.clear();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
      els.localVideo.srcObject = null;
      isLiveOwner = false;
      activeSessionId = null;
      setOwnerLiveUI(false);

      if (endedSessionId) {
        await api(`/session/${encodeURIComponent(endedSessionId)}/stop`, {
          method: "POST",
        });
      }
      //await loadSharedStreams();
      await Promise.all([
  loadSharedStreams(),
  loadOwnerShares(null),
  loadLiveHistory(),
]);
      showToast("Live session stopped.");
    } catch (error) {
      console.error("[Live] Stop failed:", error);
      showToast(
        error?.message ||
          "Live stopped locally, but the server could not be updated.",
      );
    } finally {
      els.startLiveBtn.disabled = false;
    }
  }

  async function shareLive(event) {
    event.preventDefault();
    els.shareError.textContent = "";
    const phone = els.sharePhone.value.replace(/\D/g, "");
    if (!/^\d{10}$/.test(phone)) {
      els.shareError.textContent = "Enter a valid 10-digit phone number.";
      return;
    }
    if (!activeSessionId) {
      els.shareError.textContent = "Start a live session before sharing.";
      return;
    }

    els.sendShareBtn.disabled = true;
    els.sendShareBtn.textContent = "Sending…";
    try {
      await api(`/session/${encodeURIComponent(activeSessionId)}/share`, {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      closeShareModal();
      showToast("Live access granted. The user can find it in Shared Live.");
      //await loadSharedStreams();
      await Promise.all([
  loadSharedStreams(),
  loadOwnerShares(activeSessionId),
  loadLiveHistory(),
]);
    } catch (error) {
      els.shareError.textContent =
        error?.message || "Could not share this live session.";
    } finally {
      els.sendShareBtn.disabled = false;
      els.sendShareBtn.textContent = "Send access";
    }
  }

  async function loadSharedStreams() {
    els.refreshSharedBtn.disabled = true;
    try {
      const data = await api("/shared");
      const sessions = Array.isArray(data)
        ? data
        : Array.isArray(data?.sessions)
          ? data.sessions
          : [];
      renderSharedStreams(sessions);
    } catch (error) {
      console.warn("[Live] Could not load shared streams:", error);
      els.sharedList.replaceChildren();
      const placeholder = document.createElement("div");
      placeholder.className = "list-placeholder";
      placeholder.textContent = getToken()
        ? error?.message ||
          "Could not load streams shared with your account. Check the backend /api/live/shared endpoint."
        : "Please log in to see live streams shared with your account.";
      els.sharedList.appendChild(placeholder);
      els.sharedCount.textContent = "— streams";
    } finally {
      els.refreshSharedBtn.disabled = false;
    }
  }

  async function loadOwnerShares(sessionId = activeSessionId) {
    if (!sessionId || !isLiveOwner) {
      renderOwnerShares([]);
      return;
    }

    els.ownerSharesList.replaceChildren();

    const loading = document.createElement("div");
    loading.className = "list-placeholder";
    loading.textContent = "Loading shared users...";
    els.ownerSharesList.appendChild(loading);

    try {
      const data = await api(
        `/session/${encodeURIComponent(sessionId)}/shares`,
      );

      renderOwnerShares(
        Array.isArray(data?.shares) ? data.shares : [],
        sessionId,
      );
    } catch (error) {
      const message = document.createElement("div");
      message.className = "list-placeholder";
      message.textContent = error.message || "Could not load shared users.";
      els.ownerSharesList.replaceChildren(message);
    }
  }

  function renderOwnerShares(shares, sessionId = activeSessionId) {
    els.ownerSharesList.replaceChildren();
    els.ownerSharesCount.textContent = `${shares.length} ${shares.length === 1 ? "user" : "users"}`;

    if (!shares.length) {
      const empty = document.createElement("div");
      empty.className = "list-placeholder";
      empty.textContent = isLiveOwner
        ? "You have not shared this session with anyone yet."
        : "Start a live session to manage shared users.";
      els.ownerSharesList.appendChild(empty);
      return;
    }

    shares.forEach((user) => {
      const userId = String(user.userId || "");
      if (!userId) return;

      const row = document.createElement("article");
      row.className = "shared-item";

      const main = document.createElement("div");
      main.className = "shared-item-main";

      const title = document.createElement("p");
      title.className = "shared-item-title";
      title.textContent = user.name || "BuildSkil user";

      const meta = document.createElement("p");
      meta.className = "shared-item-meta";

      const phone = user.phone ? `Phone: ${user.phone}` : "Registered user";

      const sharedAt = user.sharedAt
        ? ` · Shared ${new Date(user.sharedAt).toLocaleString()}`
        : "";

      meta.textContent = phone + sharedAt;
      main.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "shared-item-actions";

      const status = document.createElement("span");
      status.className = "small-live-status";
      status.textContent = "ACCESS GRANTED";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "icon-button remove-share-button";
      removeBtn.title = "Remove live access";
      removeBtn.setAttribute(
        "aria-label",
        `Remove live access for ${user.name || "this user"}`,
      );

      // Inline icon: no additional icon library required.
      removeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <path d="M3 6h18"></path>
        <path d="M8 6V4h8v2"></path>
        <path d="m19 6-1 14H6L5 6"></path>
        <path d="M10 11v5M14 11v5"></path>
      </svg>
    `;

      removeBtn.disabled = !isLiveOwner || sessionId !== activeSessionId;

      removeBtn.addEventListener("click", () => {
        void removeSharedUser(
          sessionId,
          userId,
          user.name || "this user",
          removeBtn,
        );
      });

      actions.append(status, removeBtn);
      row.append(main, actions);
      els.ownerSharesList.appendChild(row);
    });
  }

  async function removeSharedUser(sessionId, userId, button) {
    if (!sessionId || !userId || !isLiveOwner) return;

    if (!confirm(`Remove live access `)) return;

    button.disabled = true;

    try {
      await api(
        `/session/${encodeURIComponent(sessionId)}/share/${encodeURIComponent(userId)}`,
        { method: "DELETE" },
      );

      showToast(`Live access removed.`);

      await Promise.all([loadOwnerShares(sessionId), loadLiveHistory()]);
    } catch (error) {
      button.disabled = false;
      showToast(error.message || "Could not remove live access.");
    }
  }

  async function loadLiveHistory() {
    try {
      const data = await api("/history");

      const sessions = Array.isArray(data?.sessions) ? data.sessions : [];

      renderLiveHistory(sessions);
    } catch (error) {
      els.liveHistoryList.replaceChildren();

      const placeholder = document.createElement("div");
      placeholder.className = "list-placeholder";
      placeholder.textContent = getToken()
        ? error.message || "Could not load live history."
        : "Sign in to view your live history.";

      els.liveHistoryList.appendChild(placeholder);
      els.liveHistoryCount.textContent = "— sessions";
    }
  }

  function renderLiveHistory(sessions) {
    els.liveHistoryList.replaceChildren();

    els.liveHistoryCount.textContent = `${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}`;

    if (!sessions.length) {
      const empty = document.createElement("div");
      empty.className = "list-placeholder";
      empty.textContent = "No live history found.";
      els.liveHistoryList.appendChild(empty);
      return;
    }

    sessions.forEach((session) => {
      const sessionId = String(session.sessionId || session._id || "");
      if (!sessionId) return;

      const row = document.createElement("article");
      row.className = "shared-item";

      const main = document.createElement("div");
      main.className = "shared-item-main";

      const title = document.createElement("p");
      title.className = "shared-item-title";
      title.textContent = `Live session · ${sessionId}`;

      const names = (session.shares || [])
        .map((user) => user.name || user.phone)
        .filter(Boolean);

      const startedAt = session.startedAt
        ? new Date(session.startedAt).toLocaleString()
        : "Time unavailable";

      const meta = document.createElement("p");
      meta.className = "shared-item-meta";
      meta.textContent = `Started: ${startedAt} · Shared with: ${names.length ? names.join(", ") : "Nobody"}`;

      main.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "shared-item-actions";

      const status = document.createElement("span");
      status.className = "small-live-status";
      status.textContent = session.status === "live" ? "LIVE" : "ENDED";

      actions.appendChild(status);

      // Active history cannot be deleted until the session is stopped.
      if (session.status !== "live") {
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "icon-button history-delete-button";
        deleteBtn.title = "Delete history";
        deleteBtn.setAttribute("aria-label", "Delete live history");

        deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="m19 6-1 14H6L5 6"></path>
          <path d="M10 11v5M14 11v5"></path>
        </svg>
      `;

        deleteBtn.addEventListener("click", () => {
          void deleteLiveHistory(sessionId, deleteBtn);
        });

        actions.appendChild(deleteBtn);
      }

      row.append(main, actions);
      els.liveHistoryList.appendChild(row);
    });
  }

  async function deleteLiveHistory(sessionId, button) {
    if (
      !confirm("Permanently delete this ended live session from your history?")
    ) {
      return;
    }

    button.disabled = true;

    try {
      await api(`/history/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });

      showToast("Live history deleted.");
      await loadLiveHistory();
    } catch (error) {
      button.disabled = false;
      showToast(error.message || "Could not delete live history.");
    }
  }

  function renderSharedStreams(sessions) {
    els.sharedList.replaceChildren();
    els.sharedCount.textContent = `${sessions.length} ${sessions.length === 1 ? "stream" : "streams"}`;

    if (!sessions.length) {
      const placeholder = document.createElement("div");
      placeholder.className = "list-placeholder";
      placeholder.textContent =
        "No live sessions have been shared with you yet.";
      els.sharedList.appendChild(placeholder);
      return;
    }

    sessions.forEach((item) => {
      const sessionId = String(item.sessionId || item._id || item.id || "");
      if (!sessionId) return;

      const row = document.createElement("article");
      row.className = "shared-item";
      const main = document.createElement("div");
      main.className = "shared-item-main";
      const title = document.createElement("p");
      title.className = "shared-item-title";
      title.textContent = item.ownerName || item.name || "BuildSkil user";
      const meta = document.createElement("p");
      meta.className = "shared-item-meta";
      const phoneTail = item.ownerPhone
        ? ` · ${String(item.ownerPhone).slice(-4).padStart(String(item.ownerPhone).length, "•")}`
        : "";
      const when = item.sharedAt
        ? ` · Shared ${new Date(item.sharedAt).toLocaleString()}`
        : "";
      meta.textContent = `Session ${sessionId}${phoneTail}${when}`;
      main.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "shared-item-actions";
      const state = document.createElement("span");
      state.className = "small-live-status";
      state.textContent =
        item.live === false || item.status === "ended"
          ? "ENDED"
          : "LIVE ACCESS";
      const watch = document.createElement("button");
      watch.type = "button";
      watch.className = "button button-primary";
      watch.textContent = "Watch live";
      watch.disabled = item.live === false || item.status === "ended";
      watch.addEventListener("click", () =>
        startViewing(
          sessionId,
          item.ownerName || item.name || "BuildSkil user",
        ),
      );
      actions.append(state, watch);
      row.append(main, actions);
      els.sharedList.appendChild(row);
    });

    if (!els.sharedList.childElementCount) {
      const placeholder = document.createElement("div");
      placeholder.className = "list-placeholder";
      placeholder.textContent =
        "No valid shared streams were returned by the server.";
      els.sharedList.appendChild(placeholder);
    }
  }
  async function startViewing(sessionId, ownerName) {
  if (isLiveOwner && sessionId === activeSessionId) {
    showToast('You cannot watch your own camera as a shared stream.');
    return;
  }

  try {
    await stopViewing(true);
    await ensureSocket();

    viewingSessionId = String(sessionId);
    setViewerUI(true, `Preparing to connect to ${ownerName}…`);
    els.remoteVideo.srcObject = null;

    // Explicitly request permission to share the viewer's camera/mic.
    if (
      navigator.mediaDevices?.getUserMedia &&
      (window.isSecureContext || location.hostname === 'localhost')
    ) {
      try {
        viewerLocalStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        els.viewerSelfVideo.srcObject = viewerLocalStream;
        viewerFacingMode = "user";
        updateViewerMediaButtons();
        els.viewerSelfVideo.classList.add('visible');

        // Self-preview is muted to prevent audio feedback.
        await els.viewerSelfVideo.play().catch(() => {});
      } catch (mediaError) {
        viewerLocalStream = null;
        els.viewerSelfVideo.srcObject = null;
        els.viewerSelfVideo.classList.remove('visible');

        console.info(
          '[Live] Viewer chose watch-only mode or camera/microphone is unavailable:',
          mediaError
        );
      }
    }

    // Only send the join request after camera permission has been resolved.
    // The owner creates the offer in response to this authorized join.
    updateViewerMediaButtons();
    socket.emit('live:join', { sessionId: viewingSessionId });

    if (viewerLocalStream) {
      showToast('Joining live. Your camera and microphone are enabled for this session.');
    } else {
      showToast('Joining in watch-only mode. Your camera is not being shared.');
    }
  } catch (error) {
    console.error('[Live] Join failed:', error);

    if (viewerLocalStream) {
      viewerLocalStream.getTracks().forEach(track => track.stop());
      viewerLocalStream = null;
    }

    els.viewerSelfVideo.pause();
    els.viewerSelfVideo.srcObject = null;
    els.viewerSelfVideo.classList.remove('visible');

    viewingSessionId = null;
    setViewerUI(false);

    showToast(error?.message || 'Could not connect to this live stream.');
  }
}
/*
  async function startViewing(sessionId, ownerName) {
    if (isLiveOwner && sessionId === activeSessionId) {
      showToast(
        "You cannot watch your own camera as a shared stream on this screen.",
      );
      return;
    }
    await stopViewing(true);
    try {
      await ensureSocket();
      viewingSessionId = sessionId;
      setViewerUI(true, `Connecting to ${ownerName}…`);
      els.remoteVideo.srcObject = null;
      socket.emit("live:join", { sessionId });
      showToast("Requesting authorized live stream…");
    } catch (error) {
      viewingSessionId = null;
      setViewerUI(false);
      showToast(error?.message || "Could not connect to this live stream.");
    }
  }*/

    async function offerToViewer(viewerSocketId, sessionId) {
  if (!localStream || !socket?.connected || sessionId !== activeSessionId) {
    return;
  }

  const key = String(viewerSocketId);

  const existing = ownerPeers.get(key);
  if (existing) closePeer(existing);

  removeOwnerViewerTile(key);

  const peer = new RTCPeerConnection({
    iceServers: ICE_SERVERS,
  });

  ownerPeers.set(key, peer);

  // Send the owner's camera and microphone to the viewer.
  localStream.getTracks().forEach(track => {
    peer.addTrack(track, localStream);
  });

  // Receive the viewer's camera and microphone when they answer.
  peer.ontrack = event => {
    if (sessionId !== activeSessionId) return;

    attachOwnerViewerTrack(key, event);
  };

  peer.onicecandidate = event => {
    if (event.candidate && socket?.connected) {
      socket.emit('live:ice', {
        sessionId,
        to: viewerSocketId,
        candidate: event.candidate,
      });
    }
  };

  peer.onconnectionstatechange = () => {
    if (peer.connectionState === 'connected') {
      console.log('[Live] Connected to shared user:', key);
    }

    if (['failed', 'closed'].includes(peer.connectionState)) {
      closePeer(peer);

      if (ownerPeers.get(key) === peer) {
        ownerPeers.delete(key);
      }

      removeOwnerViewerTile(key);
    }
  };

  try {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit('live:offer', {
      sessionId,
      to: viewerSocketId,
      offer: peer.localDescription,
    });
  } catch (error) {
    console.error('[Live] Offer failed:', error);
    closePeer(peer);
    ownerPeers.delete(key);
    removeOwnerViewerTile(key);
    showToast('Could not connect to the shared user.');
  }
}
/*
  async function offerToViewer(viewerSocketId, sessionId) {
    if (!localStream || !socket?.connected || sessionId !== activeSessionId)
      return;
    const existing = ownerPeers.get(viewerSocketId);
    closePeer(existing);

    const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    ownerPeers.set(viewerSocketId, peer);
    localStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream));
    peer.onicecandidate = (event) => {
      if (event.candidate && socket?.connected) {
        socket.emit("live:ice", {
          sessionId,
          to: viewerSocketId,
          candidate: event.candidate,
        });
      }
    };
    peer.onconnectionstatechange = () => {
      if (["failed", "closed", "disconnected"].includes(peer.connectionState)) {
        // Keep disconnected peers available for a potential transient reconnect; remove failed/closed ones.
        if (["failed", "closed"].includes(peer.connectionState)) {
          closePeer(peer);
          if (ownerPeers.get(viewerSocketId) === peer)
            ownerPeers.delete(viewerSocketId);
        }
      }
    };

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("live:offer", {
        sessionId,
        to: viewerSocketId,
        offer: peer.localDescription,
      });
    } catch (error) {
      console.error("[Live] Offer failed:", error);
      showToast("Could not connect to the viewer.");
    }
  }*/

    async function handleOffer(payload) {
  if (
    !payload ||
    payload.sessionId !== viewingSessionId ||
    !payload.offer ||
    !payload.from
  ) {
    return;
  }

  try {
    closePeer(viewerPeer);

    viewerOwnerSocketId = payload.from;

    const peer = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });

    viewerPeer = peer;

    peer.ontrack = event => {
      if (peer !== viewerPeer) return;

      let stream = els.remoteVideo.srcObject;

      if (event.streams?.[0]) {
        stream = event.streams[0];
      } else {
        if (!(stream instanceof MediaStream)) {
          stream = new MediaStream();
        }

        if (
          event.track &&
          !stream.getTracks().some(track => track.id === event.track.id)
        ) {
          stream.addTrack(event.track);
        }
      }

      els.remoteVideo.srcObject = stream;
      els.remoteVideo.classList.add('visible');
      els.remoteEmpty.hidden = true;

      const playAttempt = els.remoteVideo.play();

      if (playAttempt?.catch) {
        playAttempt.catch(error => {
          console.warn('[Live] Remote playback needs user interaction:', error);
          showToast('Live connected. Tap Play to enable video/audio.');
        });
      }
    };

    peer.onicecandidate = event => {
      if (event.candidate && socket?.connected) {
        socket.emit('live:ice', {
          sessionId: viewingSessionId,
          to: viewerOwnerSocketId,
          candidate: event.candidate,
        });
      }
    };

    peer.onconnectionstatechange = () => {
      if (peer !== viewerPeer) return;

      if (peer.connectionState === 'connected') {
        els.viewerLabel.textContent = viewerLocalStream
          ? 'Connected · Two-way video/audio enabled'
          : 'Connected · Watch-only mode';
      } else if (
        ['failed', 'disconnected'].includes(peer.connectionState)
      ) {
        els.viewerLabel.textContent = 'Connection interrupted';
      }
    };

    // 1. Accept the owner's offer.
    await peer.setRemoteDescription(
      new RTCSessionDescription(payload.offer)
    );

    // 2. Add the viewer's own camera and microphone tracks.
    // The answer can then carry media in both directions.
    if (viewerLocalStream) {
      viewerLocalStream.getTracks().forEach(track => {
        const alreadyAdded = peer
          .getSenders()
          .some(sender => sender.track?.id === track.id);

        if (!alreadyAdded) {
          peer.addTrack(track, viewerLocalStream);
        }
      });
    }

    // 3. Return an answer to the owner.
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit('live:answer', {
      sessionId: viewingSessionId,
      to: viewerOwnerSocketId,
      answer: peer.localDescription,
    });
  } catch (error) {
    console.error('[Live] Offer handling failed:', error);
    showToast('Could not open the shared live stream.');
  }
}
 /* async function handleOffer(payload) {
    if (
      !payload ||
      payload.sessionId !== viewingSessionId ||
      !payload.offer ||
      !payload.from
    )
      return;
    try {
      closePeer(viewerPeer);
      viewerOwnerSocketId = payload.from;
      viewerPeer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      const thisPeer = viewerPeer;
      thisPeer.ontrack = (event) => {
        const stream = event.streams?.[0];
        if (stream) {
          els.remoteVideo.srcObject = stream;
          els.remoteVideo.classList.add("visible");
          els.remoteEmpty.hidden = true;
          els.viewerLabel.textContent = "Connected · Live audio enabled";
          const playAttempt = els.remoteVideo.play();
          if (playAttempt?.catch)
            playAttempt.catch(() =>
              showToast("Tap Play on the video to enable audio."),
            );
        }
      };
      thisPeer.onicecandidate = (event) => {
        if (event.candidate && socket?.connected) {
          socket.emit("live:ice", {
            sessionId: viewingSessionId,
            to: viewerOwnerSocketId,
            candidate: event.candidate,
          });
        }
      };
      thisPeer.onconnectionstatechange = () => {
        if (thisPeer.connectionState === "connected") {
          els.viewerLabel.textContent = "Connected · Live audio enabled";
        } else if (
          ["failed", "disconnected"].includes(thisPeer.connectionState)
        ) {
          els.viewerLabel.textContent = "Connection interrupted";
        }
      };
      await thisPeer.setRemoteDescription(
        new RTCSessionDescription(payload.offer),
      );
      const answer = await thisPeer.createAnswer();
      await thisPeer.setLocalDescription(answer);
      socket.emit("live:answer", {
        sessionId: viewingSessionId,
        to: viewerOwnerSocketId,
        answer: thisPeer.localDescription,
      });
    } catch (error) {
      console.error("[Live] Offer handling failed:", error);
      showToast("Could not open the shared live stream.");
    }
  }*/

  async function handleAnswer(payload) {
    if (!payload?.from || !payload.answer || !payload.sessionId) return;
    const peer = ownerPeers.get(payload.from);
    if (!peer || payload.sessionId !== activeSessionId) return;
    try {
      await peer.setRemoteDescription(
        new RTCSessionDescription(payload.answer),
      );
    } catch (error) {
      console.error("[Live] Answer handling failed:", error);
    }
  }

  async function handleIce(payload) {
    if (!payload?.candidate || !payload.sessionId) return;
    try {
      if (
        isLiveOwner &&
        payload.sessionId === activeSessionId &&
        payload.from
      ) {
        const peer = ownerPeers.get(payload.from);
        if (peer)
          await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } else if (payload.sessionId === viewingSessionId && viewerPeer) {
        await viewerPeer.addIceCandidate(
          new RTCIceCandidate(payload.candidate),
        );
      }
    } catch (error) {
      console.warn("[Live] ICE candidate could not be added:", error);
    }
  }

  async function stopViewing(sendLeave = true) {
  const leavingSessionId = viewingSessionId;

  if (sendLeave && leavingSessionId && socket?.connected) {
    socket.emit('live:leave', {
      sessionId: leavingSessionId,
    });
  }

  closePeer(viewerPeer);
  viewerPeer = null;
  viewerOwnerSocketId = null;
  viewingSessionId = null;

  els.remoteVideo.pause();
  els.remoteVideo.srcObject = null;

  // Stop the recipient's camera and mic when they leave.
  if (viewerLocalStream) {
    viewerLocalStream.getTracks().forEach(track => track.stop());
    viewerLocalStream = null;
  }

  els.viewerSelfVideo.pause();
  els.viewerSelfVideo.srcObject = null;
  els.viewerSelfVideo.classList.remove('visible');

  setViewerUI(false);
  updateViewerMediaButtons();
}
  /*async function stopViewing(sendLeave = true) {
    const leavingSessionId = viewingSessionId;
    if (sendLeave && leavingSessionId && socket?.connected) {
      socket.emit("live:leave", { sessionId: leavingSessionId });
    }
    closePeer(viewerPeer);
    viewerPeer = null;
    viewerOwnerSocketId = null;
    viewingSessionId = null;
    els.remoteVideo.pause();
    els.remoteVideo.srcObject = null;
    setViewerUI(false);
  }
*/
  function toggleMicrophone() {
    if (!localStream) return;
    isMicEnabled = !isMicEnabled;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isMicEnabled;
    });
    els.micBtn.textContent = isMicEnabled
      ? "Mute microphone"
      : "Unmute microphone";
    els.ownerAudioLabel.textContent = isMicEnabled
      ? "Microphone on"
      : "Microphone muted";
    showToast(isMicEnabled ? "Microphone unmuted." : "Microphone muted.");
  }

  els.startLiveBtn.addEventListener("click", startLive);
  els.stopLiveBtn.addEventListener("click", stopLive);
  els.shareBtn.addEventListener("click", openShareModal);
  els.closeShareModalBtn.addEventListener("click", closeShareModal);
  els.cancelShareBtn.addEventListener("click", closeShareModal);
  els.shareModal.addEventListener("click", (event) => {
    if (event.target === els.shareModal) closeShareModal();
  });
  els.shareForm.addEventListener("submit", shareLive);
  els.sharePhone.addEventListener("input", () => {
    const digits = els.sharePhone.value.replace(/\D/g, "").slice(0, 10);
    els.sharePhone.value = digits;
    if (els.shareError.textContent) els.shareError.textContent = "";
  });
  els.refreshSharedBtn.addEventListener("click", loadSharedStreams);
  els.leaveViewerBtn.addEventListener("click", () => stopViewing(true));
  els.micBtn.addEventListener("click", toggleMicrophone);
  els.refreshOwnerSharesBtn.addEventListener('click', () => {
  void loadOwnerShares();
});

els.refreshLiveHistoryBtn.addEventListener('click', () => {
  void loadLiveHistory();
});
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.shareModal.hidden) closeShareModal();
  });
  window.addEventListener("beforeunload", () => {
    stopOwnerHeartbeat();
    if (socket?.connected && activeSessionId && isLiveOwner)
      socket.emit("live:end", { sessionId: activeSessionId });
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    for (const peer of ownerPeers.values()) closePeer(peer);
    closePeer(viewerPeer);
  });

  setOwnerLiveUI(false);
  setViewerUI(false);
  setConnection(false, getToken() ? "Connecting…" : "Sign in required");
  void loadSharedStreams();
  // Connect on page load so share/ended notifications arrive even before the user clicks Watch Live.
  if (getToken()) {
    void Promise.resolve()
      .then(() => ensureSocket())
      .catch((error) => {
        console.warn("[Live] Initial signaling connection failed:", error);
        setConnection(false, "Realtime unavailable");
      });
  }
document
  .querySelectorAll('[data-fullscreen-target]')
  .forEach(button => {
    button.addEventListener('click', () => {
      void toggleVideoFullscreen(
        button.dataset.fullscreenTarget,
        button.dataset.fullscreenVideo
      );
    });
  });

function getCurrentVideoTrack() {
  return localStream?.getVideoTracks()?.[0] || null;
}
// these owner only
function updateCameraSwitchButton() {
  const btn = els.switchCameraBtn;
  if (!btn) return;

  const supported =
    !!navigator.mediaDevices?.getUserMedia &&
    !!navigator.mediaDevices?.enumerateDevices;

  const hasVideoTrack =
    !!localStream?.getVideoTracks()?.[0];

  btn.disabled =
    !isLiveOwner ||
    !activeSessionId ||
    !hasVideoTrack ||
    cameraSwitchInProgress ||
    !supported;
}


//shared view 

function updateViewerMediaButtons() {
  const audioTracks = viewerLocalStream?.getAudioTracks() || [];
  const videoTrack = viewerLocalStream?.getVideoTracks()?.[0];

  if (els.viewerMicBtn) {
    const micEnabled =
      audioTracks.length > 0 &&
      audioTracks.every(track => track.enabled);

    els.viewerMicBtn.disabled = !viewingSessionId || !audioTracks.length;
    els.viewerMicBtn.textContent = micEnabled
      ? "Mute microphone"
      : "Unmute microphone";
  }

  if (els.viewerSwitchCameraBtn) {
    const supported =
      !!navigator.mediaDevices?.getUserMedia &&
      !!navigator.mediaDevices?.enumerateDevices;

    els.viewerSwitchCameraBtn.disabled =
      !viewingSessionId ||
      !videoTrack ||
      viewerCameraSwitchInProgress ||
      !supported;
  }
}

function toggleViewerMicrophone() {
  const audioTracks = viewerLocalStream?.getAudioTracks() || [];

  if (!audioTracks.length) {
    showToast("Your microphone is not available.");
    updateViewerMediaButtons();
    return;
  }

  // If any audio track is muted, enable all tracks; otherwise mute all.
  const shouldEnable = audioTracks.some(track => !track.enabled);

  audioTracks.forEach(track => {
    track.enabled = shouldEnable;
  });

  updateViewerMediaButtons();

  showToast(
    shouldEnable
      ? "Your microphone is unmuted."
      : "Your microphone is muted."
  );
}


function getViewerVideoTrack() {
  return viewerLocalStream?.getVideoTracks()?.[0] || null;
}

async function switchViewerCamera() {
  if (
    viewerCameraSwitchInProgress ||
    !viewingSessionId ||
    !viewerLocalStream
  ) {
    return;
  }

  const oldTrack = getViewerVideoTrack();

  if (!oldTrack) {
    showToast("Your camera is not active.");
    return;
  }

  const oldDeviceId = oldTrack.getSettings?.().deviceId;
  const nextFacingMode =
    viewerFacingMode === "user" ? "environment" : "user";

  let replacementStream = null;
  let cameraReleased = false;
  let videoSenders = [];

  viewerCameraSwitchInProgress = true;
  updateViewerMediaButtons();

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(
      device => device.kind === "videoinput"
    );

    const alternate = cameras.find(
      device =>
        device.deviceId &&
        device.deviceId !== oldDeviceId
    );

    if (!alternate) {
      showToast("No alternate camera is available.");
      return;
    }

    // Keep the sender references so we can replace their tracks.
    if (viewerPeer) {
      videoSenders = viewerPeer
        .getSenders()
        .filter(sender => sender.track?.kind === "video");
    }

    // Detach outgoing video before releasing the current camera.
    await Promise.allSettled(
      videoSenders.map(sender => sender.replaceTrack(null))
    );

    viewerLocalStream.removeTrack(oldTrack);
    oldTrack.stop();
    cameraReleased = true;

    await new Promise(resolve => setTimeout(resolve, 300));

    // Prefer switching to the opposite front/back facing mode.
    try {
      replacementStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: nextFacingMode } },
        audio: false
      });
    } catch {
      // Fall back to the alternate physical camera.
      replacementStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: alternate.deviceId } },
        audio: false
      });
    }

    const newTrack = replacementStream.getVideoTracks()[0];

    if (!newTrack) {
      throw new Error("The selected camera returned no video track.");
    }

    viewerLocalStream.addTrack(newTrack);
    els.viewerSelfVideo.srcObject = viewerLocalStream;

    await els.viewerSelfVideo.play().catch(() => {});

    // Update the viewer's outgoing video sent to the owner.
    await Promise.allSettled(
      videoSenders.map(sender => sender.replaceTrack(newTrack))
    );

    viewerFacingMode = nextFacingMode;

    showToast(
      viewerFacingMode === "environment"
        ? "Switched to back camera."
        : "Switched to front camera."
    );

  } catch (error) {
    console.error("[Live] Viewer camera switch failed:", error);

    // Attempt to restore the previous camera if the new one failed.
    if (cameraReleased && !getViewerVideoTrack()) {
      try {
        const constraints = oldDeviceId
          ? { deviceId: { exact: oldDeviceId } }
          : { facingMode: { ideal: viewerFacingMode } };

        const restoredStream = await navigator.mediaDevices.getUserMedia({
          video: constraints,
          audio: false
        });

        const restoredTrack = restoredStream.getVideoTracks()[0];

        if (!restoredTrack) {
          throw new Error("Could not restore the previous camera.");
        }

        viewerLocalStream.addTrack(restoredTrack);
        els.viewerSelfVideo.srcObject = viewerLocalStream;

        await Promise.allSettled(
          videoSenders.map(sender => sender.replaceTrack(restoredTrack))
        );

        await els.viewerSelfVideo.play().catch(() => {});

        showToast("Camera switch failed. Previous camera restored.");
      } catch (restoreError) {
        console.error(
          "[Live] Could not restore viewer camera:",
          restoreError
        );

        showToast("Camera unavailable. Please rejoin the live session.");
      }
    } else {
      showToast(error?.message || "Unable to switch camera.");
    }
  } finally {
    if (replacementStream) {
      replacementStream.getTracks().forEach(track => {
        const isInViewerStream =
          viewerLocalStream?.getTracks().some(
            currentTrack => currentTrack.id === track.id
          );

        if (!isInViewerStream) {
          track.stop();
        }
      });
    }

    viewerCameraSwitchInProgress = false;
    updateViewerMediaButtons();
  }
}


async function switchLiveCamera() {
  if (
    cameraSwitchInProgress ||
    !isLiveOwner ||
    !activeSessionId ||
    !localStream
  ) {
    return;
  }

  const oldTrack = getCurrentVideoTrack();

  if (!oldTrack) {
    showToast("Camera is not active. Please restart your live session.");
    return;
  }

  const oldDeviceId = oldTrack.getSettings?.().deviceId;
  const nextFacingMode =
    currentFacingMode === "user" ? "environment" : "user";

  let replacementStream = null;
  let cameraReleased = false;

  cameraSwitchInProgress = true;
  updateCameraSwitchButton();

  try {
    // Find a camera different from the current one.
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(
      device => device.kind === "videoinput"
    );

    const alternate = cameras.find(
      camera =>
        camera.deviceId &&
        camera.deviceId !== oldDeviceId
    );

    if (!alternate) {
      showToast("No alternate camera is available.");
      return;
    }

    // Save the viewer connections' outgoing video senders.
    const videoSenders = [];

    for (const peer of ownerPeers.values()) {
      const sender = peer
        .getSenders()
        .find(item => item.track?.kind === "video");

      if (sender) videoSenders.push(sender);
    }

    // Release the current camera before requesting another one.
    localStream.removeTrack(oldTrack);
    oldTrack.stop();
    cameraReleased = true;

    // Allow the browser time to release the camera hardware.
    await new Promise(resolve => setTimeout(resolve, 300));

    // Open the alternate physical camera.
    replacementStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: alternate.deviceId }
        },
        audio: false
      });

    const newTrack = replacementStream.getVideoTracks()[0];

    if (!newTrack) {
      throw new Error("The alternate camera returned no video track.");
    }

    // Update local preview and stream.
    localStream.addTrack(newTrack);
    els.localVideo.srcObject = localStream;

    // Replace the old outgoing video for connected viewers.
    const results = await Promise.allSettled(
      videoSenders.map(sender => sender.replaceTrack(newTrack))
    );

    const failures = results.filter(
      result => result.status === "rejected"
    );

    if (failures.length) {
      console.error(
        "[Live] Some viewer video tracks could not be replaced:",
        failures
      );
      showToast("Camera switched, but some viewers may need to reconnect.");
    } else {
      showToast(
        nextFacingMode === "environment"
          ? "Switched camera."
          : "Switched camera."
      );
    }

    currentFacingMode = nextFacingMode;

  } catch (error) {
    console.error("[Live] Camera switch failed:", error);

    // If the new camera failed, try to restore the previous camera.
    if (cameraReleased && !getCurrentVideoTrack()) {
      try {
        const constraints = oldDeviceId
          ? { deviceId: { exact: oldDeviceId } }
          : { facingMode: { ideal: currentFacingMode } };

        const restoredStream =
          await navigator.mediaDevices.getUserMedia({
            video: constraints,
            audio: false
          });

        const restoredTrack = restoredStream.getVideoTracks()[0];

        if (!restoredTrack) {
          throw new Error("Could not restore the previous camera.");
        }

        localStream.addTrack(restoredTrack);
        els.localVideo.srcObject = localStream;

        const restoreSenders = [];

        for (const peer of ownerPeers.values()) {
          const sender = peer
            .getSenders()
            .find(item => item.track?.kind === "video");

          if (sender) restoreSenders.push(sender);
        }

        await Promise.allSettled(
          restoreSenders.map(sender =>
            sender.replaceTrack(restoredTrack)
          )
        );

        showToast("Camera switch failed. Previous camera restored.");
      } catch (restoreError) {
        console.error(
          "[Live] Previous camera restoration failed:",
          restoreError
        );

        showToast(
          "Camera switch failed. Please stop and restart your live session."
        );
      }
    } else {
      showToast(
        error?.message || "Unable to switch camera."
      );
    }
  } finally {
    // Stop temporary tracks only if they are not being used by localStream.
    if (replacementStream) {
      replacementStream.getTracks().forEach(track => {
        const isInLocalStream =
          localStream?.getTracks().some(
            currentTrack => currentTrack.id === track.id
          );

        if (!isInLocalStream) {
          track.stop();
        }
      });
    }

    cameraSwitchInProgress = false;
    updateCameraSwitchButton();
  }
}


els.switchCameraBtn?.addEventListener("click", () => {
  void switchLiveCamera();
});
els.viewerMicBtn?.addEventListener("click", toggleViewerMicrophone);

els.viewerSwitchCameraBtn?.addEventListener("click", () => {
  void switchViewerCamera();
});

  void loadSharedStreams();
void loadLiveHistory();
updateCameraSwitchButton();
if (viewerLocalStream) {
  viewerLocalStream.getTracks().forEach(track => track.stop());
}
clearOwnerViewerTiles();
})();
