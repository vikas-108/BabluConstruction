/*
 * BuildSkil Live screen
 * Expected backend contract (implement and enforce authorization server-side):
 *   POST   /api/live/session/start             -> { sessionId, ... }
 *   POST   /api/live/session/:id/stop          -> { success: true }
 *   POST   /api/live/session/:id/share         body { phone } -> { success: true, ... }
 *   GET    /api/live/shared                    -> { sessions: [{ sessionId, ownerName, ownerPhone, live, sharedAt }] }
 *
 * Socket.IO events, with server-side authorization on every event:
 *   live:viewer-joined { sessionId, viewerSocketId } -> live owner
 *   live:join          { sessionId }                 -> viewer asks to join an authorized session
 *   live:offer/answer  { sessionId, to, offer|answer }
 *   live:ice           { sessionId, to, candidate }
 *   live:leave         { sessionId }
 *   live:end            { sessionId }
 *   live:ended          { sessionId }
 *   live:error          { message }
 *
 * Do not trust phone numbers, user IDs, session IDs, or socket IDs sent by a browser.
 * Verify the JWT, session owner, and explicit share permission on the backend.
 */
(() => {
  'use strict';
   const SERVER_BASE = 'http://localhost:5000';
  //const SERVER_BASE = 'https://api.buildskil.com';
  const API_BASE = `${SERVER_BASE}/api/live`;
  const AUTH_KEY = 'cb_token';
  const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
  ];

  const $ = id => document.getElementById(id);
  const els = {
    connectionDot: $('connectionDot'), connectionText: $('connectionText'),
    startLiveBtn: $('startLiveBtn'), stopLiveBtn: $('stopLiveBtn'),
    ownerLiveBadge: $('ownerLiveBadge'), ownerAudioLabel: $('ownerAudioLabel'),
    localVideo: $('localVideo'), localEmpty: $('localEmpty'), sessionLabel: $('sessionLabel'),
    micBtn: $('micBtn'), shareBtn: $('shareBtn'), shareModal: $('shareModal'),
    closeShareModalBtn: $('closeShareModalBtn'), cancelShareBtn: $('cancelShareBtn'),
    shareForm: $('shareForm'), sharePhone: $('sharePhone'), shareError: $('shareError'),
    sendShareBtn: $('sendShareBtn'), refreshSharedBtn: $('refreshSharedBtn'),
    sharedList: $('sharedList'), sharedCount: $('sharedCount'),
    remoteVideo: $('remoteVideo'), remoteEmpty: $('remoteEmpty'), viewerLabel: $('viewerLabel'),
    remoteLiveBadge: $('remoteLiveBadge'), leaveViewerBtn: $('leaveViewerBtn'), toast: $('toast'),
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

  function getToken() {
    return localStorage.getItem(AUTH_KEY);
  }

  async function api(path, options = {}) {
    const token = getToken();
    if (!token) throw new Error('Please log in to BuildSkil before using Live.');

    const headers = { Authorization: `Bearer ${token}`, ...(options.headers || {}) };
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const raw = await response.text();
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch { data = { message: raw }; }

    if (response.status === 401) throw new Error('Your session has expired. Please log in again.');
    if (!response.ok) throw new Error(data?.message || data?.error || `Request failed (${response.status}).`);
    return data;
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('visible'), 3500);
  }

  function setConnection(connected, text) {
    els.connectionDot.classList.toggle('connected', connected);
    els.connectionText.textContent = text;
  }

  function setOwnerLiveUI(live) {
    els.ownerLiveBadge.classList.toggle('on', live);
    els.ownerLiveBadge.innerHTML = `<span></span> ${live ? 'LIVE' : 'OFFLINE'}`;
    els.startLiveBtn.disabled = live;
    els.stopLiveBtn.disabled = !live;
    els.shareBtn.disabled = !live;
    els.micBtn.disabled = !live;
    els.localVideo.classList.toggle('visible', live && !!localStream);
    els.localEmpty.hidden = live && !!localStream;
    els.sessionLabel.textContent = live && activeSessionId
      ? `Session ${activeSessionId}` : 'No active live session';
    els.ownerAudioLabel.textContent = live ? (isMicEnabled ? 'Microphone on' : 'Microphone muted') : 'Microphone off';
  }

  function setViewerUI(watching, label = '') {
    els.remoteVideo.classList.toggle('visible', watching);
    els.remoteEmpty.hidden = watching;
    els.leaveViewerBtn.disabled = !watching;
    els.viewerLabel.textContent = label || (watching ? 'Connecting to live stream…' : 'Not watching a stream');
    els.remoteLiveBadge.textContent = watching ? 'LIVE VIEW' : 'VIEWER';
  }

  function openShareModal() {
    if (!activeSessionId || !isLiveOwner) return;
    els.shareError.textContent = '';
    els.sharePhone.value = '';
    els.shareModal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => els.sharePhone.focus(), 0);
  }

  function closeShareModal() {
    els.shareModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function closePeer(peer) {
    if (!peer) return;
    peer.onicecandidate = null;
    peer.ontrack = null;
    peer.onconnectionstatechange = null;
    try { peer.close(); } catch (_) {}
  }

  function ensureSocket() {
    if (!getToken()) throw new Error('Please log in to BuildSkil before using Live.');
    if (socket?.connected) return Promise.resolve(socket);
    if (socketConnectPromise) return socketConnectPromise;

    if (socket) {
      try { socket.disconnect(); } catch (_) {}
      socket = null;
    }

    if (typeof window.io !== 'function') {
      throw new Error('Socket.IO client did not load. Check your internet connection and Socket.IO server setup.');
    }

    socketConnectPromise = new Promise((resolve, reject) => {
      const nextSocket = window.io(SERVER_BASE, {
        auth: { token: getToken() },
        transports: ['websocket', 'polling'],
        reconnection: true,
      });
      socket = nextSocket;
      let settled = false;

      nextSocket.on('connect', () => {
        setConnection(true, 'Connected');
        if (!settled) { settled = true; socketConnectPromise = null; resolve(nextSocket); }
      });
      nextSocket.on('disconnect', () => setConnection(false, 'Disconnected'));
      nextSocket.on('connect_error', error => {
        setConnection(false, 'Connection error');
        if (!settled) { settled = true; socketConnectPromise = null; reject(new Error(error?.message || 'Could not connect to live signaling.')); }
      });

      // Persisted notifications are also sent in real time by the backend.
      nextSocket.on('notification:new', notification => {
        showToast(notification?.message || notification?.title || 'You have a new notification.');
        if (['live_shared', 'live_ended'].includes(notification?.type)) {
          void loadSharedStreams();
        }
      });

      // Owner receives a request when an authorized viewer enters their live session.
      nextSocket.on('live:viewer-joined', payload => {
        if (!isLiveOwner || payload?.sessionId !== activeSessionId || !payload?.viewerSocketId) return;
        void offerToViewer(payload.viewerSocketId, payload.sessionId);
      });

      // Viewer receives an offer only after backend has authorized the live:join request.
      nextSocket.on('live:offer', payload => { void handleOffer(payload); });
      nextSocket.on('live:answer', payload => { void handleAnswer(payload); });
      nextSocket.on('live:ice', payload => { void handleIce(payload); });
      nextSocket.on('live:ended', payload => {
        if (payload?.sessionId && payload.sessionId === viewingSessionId) {
          stopViewing(false);
          showToast('The live session has ended.');
        }
      });
      nextSocket.on('live:error', payload => showToast(payload?.message || 'Live access was denied.'));
    });
    return socketConnectPromise;
  }

  async function startLive() {
    if (isLiveOwner) return;
    els.startLiveBtn.disabled = true;

    try {
      if (!window.isSecureContext && location.hostname !== 'localhost') {
        throw new Error('Camera access requires HTTPS. Open this page on a secure HTTPS website.');
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('This browser does not support camera and microphone access.');
      }
      if (!getToken()) throw new Error('Please log in to BuildSkil before starting live.');

      // Ask for user consent explicitly; the stream is not started on page load.
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      els.localVideo.srcObject = localStream;
      isMicEnabled = true;

      const data = await api('/session/start', { method: 'POST', body: JSON.stringify({ hasVideo: true, hasAudio: true }) });
      activeSessionId = data?.sessionId || data?.session?._id || data?._id;
      if (!activeSessionId) throw new Error('The server did not return a live session ID.');

      await ensureSocket();
      isLiveOwner = true;
      setOwnerLiveUI(true);
      await loadSharedStreams();
      showToast('Live camera started. Share access with a registered user.');
    } catch (error) {
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      localStream = null;
      els.localVideo.srcObject = null;
      activeSessionId = null;
      isLiveOwner = false;
      setOwnerLiveUI(false);
      els.startLiveBtn.disabled = false;
      console.error('[Live] Start failed:', error);
      showToast(error?.message || 'Could not start live.');
    }
  }

  async function stopLive() {
    if (!isLiveOwner && !activeSessionId) return;
    const endedSessionId = activeSessionId;

    try {
      if (socket?.connected && endedSessionId) {
        socket.emit('live:end', { sessionId: endedSessionId });
      }
      for (const peer of ownerPeers.values()) closePeer(peer);
      ownerPeers.clear();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      localStream = null;
      els.localVideo.srcObject = null;
      isLiveOwner = false;
      activeSessionId = null;
      setOwnerLiveUI(false);

      if (endedSessionId) {
        await api(`/session/${encodeURIComponent(endedSessionId)}/stop`, { method: 'POST' });
      }
      await loadSharedStreams();
      showToast('Live session stopped.');
    } catch (error) {
      console.error('[Live] Stop failed:', error);
      showToast(error?.message || 'Live stopped locally, but the server could not be updated.');
    } finally {
      els.startLiveBtn.disabled = false;
    }
  }

  async function shareLive(event) {
    event.preventDefault();
    els.shareError.textContent = '';
    const phone = els.sharePhone.value.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phone)) {
      els.shareError.textContent = 'Enter a valid 10-digit phone number.';
      return;
    }
    if (!activeSessionId) {
      els.shareError.textContent = 'Start a live session before sharing.';
      return;
    }

    els.sendShareBtn.disabled = true;
    els.sendShareBtn.textContent = 'Sending…';
    try {
      await api(`/session/${encodeURIComponent(activeSessionId)}/share`, {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      closeShareModal();
      showToast('Live access granted. The user can find it in Shared Live.');
      await loadSharedStreams();
    } catch (error) {
      els.shareError.textContent = error?.message || 'Could not share this live session.';
    } finally {
      els.sendShareBtn.disabled = false;
      els.sendShareBtn.textContent = 'Send access';
    }
  }

  async function loadSharedStreams() {
    els.refreshSharedBtn.disabled = true;
    try {
      const data = await api('/shared');
      const sessions = Array.isArray(data) ? data : (Array.isArray(data?.sessions) ? data.sessions : []);
      renderSharedStreams(sessions);
    } catch (error) {
      console.warn('[Live] Could not load shared streams:', error);
      els.sharedList.replaceChildren();
      const placeholder = document.createElement('div');
      placeholder.className = 'list-placeholder';
      placeholder.textContent = getToken()
        ? (error?.message || 'Could not load streams shared with your account. Check the backend /api/live/shared endpoint.')
        : 'Please log in to see live streams shared with your account.';
      els.sharedList.appendChild(placeholder);
      els.sharedCount.textContent = '— streams';
    } finally {
      els.refreshSharedBtn.disabled = false;
    }
  }

  function renderSharedStreams(sessions) {
    els.sharedList.replaceChildren();
    els.sharedCount.textContent = `${sessions.length} ${sessions.length === 1 ? 'stream' : 'streams'}`;

    if (!sessions.length) {
      const placeholder = document.createElement('div');
      placeholder.className = 'list-placeholder';
      placeholder.textContent = 'No live sessions have been shared with you yet.';
      els.sharedList.appendChild(placeholder);
      return;
    }

    sessions.forEach(item => {
      const sessionId = String(item.sessionId || item._id || item.id || '');
      if (!sessionId) return;

      const row = document.createElement('article');
      row.className = 'shared-item';
      const main = document.createElement('div');
      main.className = 'shared-item-main';
      const title = document.createElement('p');
      title.className = 'shared-item-title';
      title.textContent = item.ownerName || item.name || 'BuildSkil user';
      const meta = document.createElement('p');
      meta.className = 'shared-item-meta';
      const phoneTail = item.ownerPhone ? ` · ${String(item.ownerPhone).slice(-4).padStart(String(item.ownerPhone).length, '•')}` : '';
      const when = item.sharedAt ? ` · Shared ${new Date(item.sharedAt).toLocaleString()}` : '';
      meta.textContent = `Session ${sessionId}${phoneTail}${when}`;
      main.append(title, meta);

      const actions = document.createElement('div');
      actions.className = 'shared-item-actions';
      const state = document.createElement('span');
      state.className = 'small-live-status';
      state.textContent = item.live === false || item.status === 'ended' ? 'ENDED' : 'LIVE ACCESS';
      const watch = document.createElement('button');
      watch.type = 'button';
      watch.className = 'button button-primary';
      watch.textContent = 'Watch live';
      watch.disabled = item.live === false || item.status === 'ended';
      watch.addEventListener('click', () => startViewing(sessionId, item.ownerName || item.name || 'BuildSkil user'));
      actions.append(state, watch);
      row.append(main, actions);
      els.sharedList.appendChild(row);
    });

    if (!els.sharedList.childElementCount) {
      const placeholder = document.createElement('div');
      placeholder.className = 'list-placeholder';
      placeholder.textContent = 'No valid shared streams were returned by the server.';
      els.sharedList.appendChild(placeholder);
    }
  }

  async function startViewing(sessionId, ownerName) {
    if (isLiveOwner && sessionId === activeSessionId) {
      showToast('You cannot watch your own camera as a shared stream on this screen.');
      return;
    }
    await stopViewing(true);
    try {
      await ensureSocket();
      viewingSessionId = sessionId;
      setViewerUI(true, `Connecting to ${ownerName}…`);
      els.remoteVideo.srcObject = null;
      socket.emit('live:join', { sessionId });
      showToast('Requesting authorized live stream…');
    } catch (error) {
      viewingSessionId = null;
      setViewerUI(false);
      showToast(error?.message || 'Could not connect to this live stream.');
    }
  }

  async function offerToViewer(viewerSocketId, sessionId) {
    if (!localStream || !socket?.connected || sessionId !== activeSessionId) return;
    const existing = ownerPeers.get(viewerSocketId);
    closePeer(existing);

    const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    ownerPeers.set(viewerSocketId, peer);
    localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
    peer.onicecandidate = event => {
      if (event.candidate && socket?.connected) {
        socket.emit('live:ice', { sessionId, to: viewerSocketId, candidate: event.candidate });
      }
    };
    peer.onconnectionstatechange = () => {
      if (['failed', 'closed', 'disconnected'].includes(peer.connectionState)) {
        // Keep disconnected peers available for a potential transient reconnect; remove failed/closed ones.
        if (['failed', 'closed'].includes(peer.connectionState)) {
          closePeer(peer);
          if (ownerPeers.get(viewerSocketId) === peer) ownerPeers.delete(viewerSocketId);
        }
      }
    };

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('live:offer', { sessionId, to: viewerSocketId, offer: peer.localDescription });
    } catch (error) {
      console.error('[Live] Offer failed:', error);
      showToast('Could not connect to the viewer.');
    }
  }

  async function handleOffer(payload) {
    if (!payload || payload.sessionId !== viewingSessionId || !payload.offer || !payload.from) return;
    try {
      closePeer(viewerPeer);
      viewerOwnerSocketId = payload.from;
      viewerPeer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      const thisPeer = viewerPeer;
      thisPeer.ontrack = event => {
        const stream = event.streams?.[0];
        if (stream) {
          els.remoteVideo.srcObject = stream;
          els.remoteVideo.classList.add('visible');
          els.remoteEmpty.hidden = true;
          els.viewerLabel.textContent = 'Connected · Live audio enabled';
          const playAttempt = els.remoteVideo.play();
          if (playAttempt?.catch) playAttempt.catch(() => showToast('Tap Play on the video to enable audio.'));
        }
      };
      thisPeer.onicecandidate = event => {
        if (event.candidate && socket?.connected) {
          socket.emit('live:ice', { sessionId: viewingSessionId, to: viewerOwnerSocketId, candidate: event.candidate });
        }
      };
      thisPeer.onconnectionstatechange = () => {
        if (thisPeer.connectionState === 'connected') {
          els.viewerLabel.textContent = 'Connected · Live audio enabled';
        } else if (['failed', 'disconnected'].includes(thisPeer.connectionState)) {
          els.viewerLabel.textContent = 'Connection interrupted';
        }
      };
      await thisPeer.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await thisPeer.createAnswer();
      await thisPeer.setLocalDescription(answer);
      socket.emit('live:answer', { sessionId: viewingSessionId, to: viewerOwnerSocketId, answer: thisPeer.localDescription });
    } catch (error) {
      console.error('[Live] Offer handling failed:', error);
      showToast('Could not open the shared live stream.');
    }
  }

  async function handleAnswer(payload) {
    if (!payload?.from || !payload.answer || !payload.sessionId) return;
    const peer = ownerPeers.get(payload.from);
    if (!peer || payload.sessionId !== activeSessionId) return;
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(payload.answer));
    } catch (error) {
      console.error('[Live] Answer handling failed:', error);
    }
  }

  async function handleIce(payload) {
    if (!payload?.candidate || !payload.sessionId) return;
    try {
      if (isLiveOwner && payload.sessionId === activeSessionId && payload.from) {
        const peer = ownerPeers.get(payload.from);
        if (peer) await peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } else if (payload.sessionId === viewingSessionId && viewerPeer) {
        await viewerPeer.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    } catch (error) {
      console.warn('[Live] ICE candidate could not be added:', error);
    }
  }

  async function stopViewing(sendLeave = true) {
    const leavingSessionId = viewingSessionId;
    if (sendLeave && leavingSessionId && socket?.connected) {
      socket.emit('live:leave', { sessionId: leavingSessionId });
    }
    closePeer(viewerPeer);
    viewerPeer = null;
    viewerOwnerSocketId = null;
    viewingSessionId = null;
    els.remoteVideo.pause();
    els.remoteVideo.srcObject = null;
    setViewerUI(false);
  }

  function toggleMicrophone() {
    if (!localStream) return;
    isMicEnabled = !isMicEnabled;
    localStream.getAudioTracks().forEach(track => { track.enabled = isMicEnabled; });
    els.micBtn.textContent = isMicEnabled ? 'Mute microphone' : 'Unmute microphone';
    els.ownerAudioLabel.textContent = isMicEnabled ? 'Microphone on' : 'Microphone muted';
    showToast(isMicEnabled ? 'Microphone unmuted.' : 'Microphone muted.');
  }

  els.startLiveBtn.addEventListener('click', startLive);
  els.stopLiveBtn.addEventListener('click', stopLive);
  els.shareBtn.addEventListener('click', openShareModal);
  els.closeShareModalBtn.addEventListener('click', closeShareModal);
  els.cancelShareBtn.addEventListener('click', closeShareModal);
  els.shareModal.addEventListener('click', event => { if (event.target === els.shareModal) closeShareModal(); });
  els.shareForm.addEventListener('submit', shareLive);
  els.sharePhone.addEventListener('input', () => {
    const digits = els.sharePhone.value.replace(/\D/g, '').slice(0, 10);
    els.sharePhone.value = digits;
    if (els.shareError.textContent) els.shareError.textContent = '';
  });
  els.refreshSharedBtn.addEventListener('click', loadSharedStreams);
  els.leaveViewerBtn.addEventListener('click', () => stopViewing(true));
  els.micBtn.addEventListener('click', toggleMicrophone);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !els.shareModal.hidden) closeShareModal(); });
  window.addEventListener('beforeunload', () => {
    if (socket?.connected && activeSessionId && isLiveOwner) socket.emit('live:end', { sessionId: activeSessionId });
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    for (const peer of ownerPeers.values()) closePeer(peer);
    closePeer(viewerPeer);
  });

  setOwnerLiveUI(false);
  setViewerUI(false);
  setConnection(false, getToken() ? 'Connecting…' : 'Sign in required');
  void loadSharedStreams();
  // Connect on page load so share/ended notifications arrive even before the user clicks Watch Live.
  if (getToken()) {
    void Promise.resolve().then(() => ensureSocket()).catch(error => {
      console.warn('[Live] Initial signaling connection failed:', error);
      setConnection(false, 'Realtime unavailable');
    });
  }
})();
