
const API_BASE = "https://api.buildskil.com/api/progress"; // change if deployed
let CURRENT_ROLE = null;
let CURRENT_PHONE = null;
function authHeaders(isFormData = false) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
async function api(url, options = {}){
  const res = await fetch(API_BASE + url, {
    headers: authHeaders(),
    ...options
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if(!res.ok){
    throw new Error(data.message || "Server error");
  }

  return data;
}
// Role stages
const roleStages = {
  contractor: ["Survey","Material","Work","Finish"],
  plumber: ["Pipes","Fitting","Test","Done"],
  carpenter: ["Cut","Build","Assemble","Polish"]
};

const STORAGE_KEY = "channels";

// Storage
function loadChannels(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
function saveChannels(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Screen control
const screens = {
  home: document.getElementById("homeScreen"),
  creator: document.getElementById("creatorScreen"),
  client: document.getElementById("clientScreen")
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  },2000);
}
// Navigation
//document.getElementById("goCreator").onclick = () => showScreen("creator");
document.getElementById("goCreator").onclick = () => {
  showScreen("creator");

  const updaterInput = document.getElementById("updaterPhoneCreate");
  if(updaterInput && CURRENT_PHONE){
    updaterInput.value = CURRENT_PHONE;
  }
};
document.getElementById("goClient").onclick = () => {
  showScreen("client");

  // ensure phone is filled
  if(CURRENT_PHONE){
    document.getElementById("clientPhoneView").value = CURRENT_PHONE;
  }
};

document.getElementById("backFromCreator").onclick = () => showScreen("home");
document.getElementById("backFromClient").onclick = () => showScreen("home");

// Create channel
document.getElementById("createChannelBtn").onclick = async () => {
  const role = document.getElementById("createRole").value;
  const clientPhone = document.getElementById("clientPhoneCreate").value.trim();
  const updaterPhone = document.getElementById("updaterPhoneCreate").value.trim();

  if(!role || !clientPhone || !updaterPhone){
    showToast("Fill all fields");
    return;
  }

  try{
    await api("/create", {
      method:"POST",
      body: JSON.stringify({ role, clientPhone, updaterPhone })
    });

    showToast("Channel created");

    // reset
    document.getElementById("createRole").value = "";
    document.getElementById("clientPhoneCreate").value = "";
    document.getElementById("updaterPhoneCreate").value = "";

    fetchMyChannels(); // reload

  }catch(err){
    showToast(err.message);
  }
};
async function fetchMyChannels(){
  try{
    const channels = await api("/my");

    renderChannels(channels);

  }catch(err){
    showToast(err.message);
  }
}
async function fetchMyAccount(){ 
  try{
    const res = await fetch("https://api.buildskil.com/api/account/me", {
      headers: authHeaders()
    });

    const account = await res.json();

    console.log("ACCOUNT:", account);

    CURRENT_ROLE = (account.role || "").toLowerCase();
     CURRENT_PHONE = account.phone || "";
   /* if(CURRENT_ROLE === "client"){
      showScreen("client");
    } else {
      showScreen("creator");
    }*/
    applyRoleUI(account);
  }catch(err){
    console.error(err);
  }
}
function applyRoleUI(account){
  const creatorBtn = document.getElementById("goCreator");
  const clientBtn = document.getElementById("goClient");

  // reset
  creatorBtn.style.display = "none";
  clientBtn.style.display = "none";

  if(CURRENT_ROLE === "client"){
    clientBtn.style.display = "block";

    // ✅ auto-fill phone
    document.getElementById("clientPhoneView").value = CURRENT_PHONE;

    // ✅ OPTIONAL: auto-fetch immediately
    renderClientFromAccount();

  } else {
    creatorBtn.style.display = "block";
  }
// ✅ ALWAYS set updater phone (important)
  const updaterInput = document.getElementById("updaterPhoneCreate");
  if(updaterInput){
    updaterInput.value = CURRENT_PHONE;
    updaterInput.readOnly = true; // prevent manual change (recommended)
  }
  // always stay on home
  showScreen("home");
}
async function renderClientFromAccount(){
  if(!CURRENT_PHONE) return;

  try{
    const data = await api(`/client/${CURRENT_PHONE}`); // ✅ use api()

    renderClientList(data);

  }catch(err){
    console.error(err);
    showToast(err.message || "Failed to load progress");
  }
}
function renderChannels(data){
  const container = document.getElementById("channelsContainer");
  container.innerHTML = "";

  data.forEach(ch => {

    const card = document.createElement("div");
    card.className = "channelCard";

    const header = document.createElement("div");
    header.className = "channelHeader";
    header.innerHTML = `
      <span>${ch.clientPhone} (${ch.role})</span>
      <span>▼</span>
    `;

    const body = document.createElement("div");
    body.className = "channelBody";

    const last = Math.max(-1, ...ch.completed);

    roleStages[ch.role].forEach((s,i)=>{
      const isCompleted = ch.completed.includes(i);
      const prevDone = i === 0 || ch.completed.includes(i-1);
      const canToggle = prevDone && (i <= last + 1);

      const div = document.createElement("div");
      div.className = "stage " + (isCompleted ? "completed":"");

      div.innerHTML = `
        <span>${s}</span>
        <button ${!canToggle ? "disabled":""}>
          ${!canToggle ? "🔒" : isCompleted ? "Done":"Mark"}
        </button>
      `;

      if(canToggle){
        div.querySelector("button").onclick = async ()=>{
          try{
            await api(`/${ch._id}/stage`, {
              method:"PATCH",
              body: JSON.stringify({ stageIndex: i })
            });

            fetchMyChannels(); // refresh

          }catch(err){
            showToast(err.message);
          }
        };
      }

      body.appendChild(div);
    });

    // logs
    if(ch.logs?.length){
      const logTitle = document.createElement("h4");
      logTitle.textContent = "Updates";
      body.appendChild(logTitle);

      ch.logs.slice().reverse().forEach(log=>{
        const div = document.createElement("div");
        div.className = "stageLog";
        div.innerHTML = `
          <div>• ${log.text}</div>
          <small>${log.time}</small>
        `;
        body.appendChild(div);
      });
    }

    header.onclick = ()=> card.classList.toggle("active");

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });
}
function renderClientList(list){
  const container = document.getElementById("clientChannelsContainer");

  list.forEach(ch => {

    const existing = container.querySelector(`[data-id="${ch._id}"]`);
    if(existing) existing.remove();

    const card = document.createElement("div");
    card.className = "channelCard active";
    card.dataset.id = ch._id;

    const total = roleStages[ch.role].length;
    const percent = Math.round((ch.completed.length/total)*100);

    const header = document.createElement("div");
    header.className = "channelHeader";
    header.innerHTML = `
      <span>${ch.clientPhone} • ${ch.role}</span>
      <span>${percent}% ▼</span>
    `;

    const body = document.createElement("div");
    body.className = "channelBody";

    roleStages[ch.role].forEach((s,i)=>{
      const done = ch.completed.includes(i);

      const div = document.createElement("div");
      div.className = "stage " + (done ? "completed":"");
      div.innerHTML = `
        <span>${s}</span>
        <span>${done ? "Done":"Pending"}</span>
      `;
      body.appendChild(div);
    });

    // logs
    if(ch.logs?.length){
      ch.logs.slice().reverse().forEach(log=>{
        const div = document.createElement("div");
        div.className = "stageLog";
        div.innerHTML = `
          <div>• ${log.text}</div>
          <small>${log.time}</small>
        `;
        body.appendChild(div);
      });
    }

    header.onclick = ()=> card.classList.toggle("active");

    card.appendChild(header);
    card.appendChild(body);

    container.prepend(card);
  });
}
// Client view
document.getElementById("clientViewBtn").onclick = async () => {
  const phone = document.getElementById("clientPhoneView").value.trim();

  if(!phone){
    showToast("Enter phone");
    return;
  }

  try{
    const channels = await fetch(`${API_BASE}/client/${phone}`,{
      headers: authHeaders()
    });
    const data = await channels.json();

    renderClientList(data);

  }catch(err){
    showToast("Error loading");
  }
};
/*async function init(){
  await fetchMyAccount();

  if(CURRENT_ROLE !== "client"){
    fetchMyChannels();
  }
}
*/
//init();
fetchMyChannels();
fetchMyAccount();

/****
 * 
const API_BASE = "https://api.buildskil.com/api/progress"; // change if deployed
function authHeaders(isFormData = false) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
async function api(url, options = {}){
  const res = await fetch(API_BASE + url, {
    headers: authHeaders(),
    ...options
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if(!res.ok){
    throw new Error(data.message || "Server error");
  }

  return data;
}
// Role stages
const roleStages = {
  contractor: ["Survey","Material","Work","Finish"],
  plumber: ["Pipes","Fitting","Test","Done"],
  carpenter: ["Cut","Build","Assemble","Polish"]
};

const STORAGE_KEY = "channels";

// Storage
function loadChannels(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
function saveChannels(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Screen control
const screens = {
  home: document.getElementById("homeScreen"),
  creator: document.getElementById("creatorScreen"),
  client: document.getElementById("clientScreen")
};

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  },2000);
}
// Navigation
document.getElementById("goCreator").onclick = () => showScreen("creator");
document.getElementById("goClient").onclick = () => showScreen("client");

document.getElementById("backFromCreator").onclick = () => showScreen("home");
document.getElementById("backFromClient").onclick = () => showScreen("home");

// Create channel
document.getElementById("createChannelBtn").onclick = async () => {
  const role = document.getElementById("createRole").value;
  const clientPhone = document.getElementById("clientPhoneCreate").value.trim();
  const updaterPhone = document.getElementById("updaterPhoneCreate").value.trim();

  if(!role || !clientPhone || !updaterPhone){
    showToast("Fill all fields");
    return;
  }

  try{
    await api("/create", {
      method:"POST",
      body: JSON.stringify({ role, clientPhone, updaterPhone })
    });

    showToast("Channel created");

    // reset
    document.getElementById("createRole").value = "";
    document.getElementById("clientPhoneCreate").value = "";
    document.getElementById("updaterPhoneCreate").value = "";

    fetchMyChannels(); // reload

  }catch(err){
    showToast(err.message);
  }
};
async function fetchMyChannels(){
  try{
    const channels = await api("/my");

    renderChannels(channels);

  }catch(err){
    showToast(err.message);
  }
}
function renderChannels(data){
  const container = document.getElementById("channelsContainer");
  container.innerHTML = "";

  data.forEach(ch => {

    const card = document.createElement("div");
    card.className = "channelCard";

    const header = document.createElement("div");
    header.className = "channelHeader";
    header.innerHTML = `
      <span>${ch.clientPhone} (${ch.role})</span>
      <span>▼</span>
    `;

    const body = document.createElement("div");
    body.className = "channelBody";

    const last = Math.max(-1, ...ch.completed);

    roleStages[ch.role].forEach((s,i)=>{
      const isCompleted = ch.completed.includes(i);
      const prevDone = i === 0 || ch.completed.includes(i-1);
      const canToggle = prevDone && (i <= last + 1);

      const div = document.createElement("div");
      div.className = "stage " + (isCompleted ? "completed":"");

      div.innerHTML = `
        <span>${s}</span>
        <button ${!canToggle ? "disabled":""}>
          ${!canToggle ? "🔒" : isCompleted ? "Done":"Mark"}
        </button>
      `;

      if(canToggle){
        div.querySelector("button").onclick = async ()=>{
          try{
            await api(`/${ch._id}/stage`, {
              method:"PATCH",
              body: JSON.stringify({ stageIndex: i })
            });

            fetchMyChannels(); // refresh

          }catch(err){
            showToast(err.message);
          }
        };
      }

      body.appendChild(div);
    });

    // logs
    if(ch.logs?.length){
      const logTitle = document.createElement("h4");
      logTitle.textContent = "Updates";
      body.appendChild(logTitle);

      ch.logs.slice().reverse().forEach(log=>{
        const div = document.createElement("div");
        div.className = "stageLog";
        div.innerHTML = `
          <div>• ${log.text}</div>
          <small>${log.time}</small>
        `;
        body.appendChild(div);
      });
    }

    header.onclick = ()=> card.classList.toggle("active");

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });
}
function renderClientList(list){
  const container = document.getElementById("clientChannelsContainer");

  list.forEach(ch => {

    const existing = container.querySelector(`[data-id="${ch._id}"]`);
    if(existing) existing.remove();

    const card = document.createElement("div");
    card.className = "channelCard active";
    card.dataset.id = ch._id;

    const total = roleStages[ch.role].length;
    const percent = Math.round((ch.completed.length/total)*100);

    const header = document.createElement("div");
    header.className = "channelHeader";
    header.innerHTML = `
      <span>${ch.clientPhone} • ${ch.role}</span>
      <span>${percent}% ▼</span>
    `;

    const body = document.createElement("div");
    body.className = "channelBody";

    roleStages[ch.role].forEach((s,i)=>{
      const done = ch.completed.includes(i);

      const div = document.createElement("div");
      div.className = "stage " + (done ? "completed":"");
      div.innerHTML = `
        <span>${s}</span>
        <span>${done ? "Done":"Pending"}</span>
      `;
      body.appendChild(div);
    });

    // logs
    if(ch.logs?.length){
      ch.logs.slice().reverse().forEach(log=>{
        const div = document.createElement("div");
        div.className = "stageLog";
        div.innerHTML = `
          <div>• ${log.text}</div>
          <small>${log.time}</small>
        `;
        body.appendChild(div);
      });
    }

    header.onclick = ()=> card.classList.toggle("active");

    card.appendChild(header);
    card.appendChild(body);

    container.prepend(card);
  });
}
// Client view
document.getElementById("clientViewBtn").onclick = async () => {
  const phone = document.getElementById("clientPhoneView").value.trim();

  if(!phone){
    showToast("Enter phone");
    return;
  }

  try{
    const channels = await fetch(`${API_BASE}/client/${phone}`);
    const data = await channels.json();

    renderClientList(data);

  }catch(err){
    showToast("Error loading");
  }
};
async function checkUserRole(){
  try{
    const res = await api("/me", {
      method:"GET",
      headers: authHeaders(),
    });

    const user = await res.json();

    const creatorBtn = document.getElementById("goCreator");
    const clientBtn = document.getElementById("goClient");

    // ✅ Role logic
    if(user.role === "client"){
      creatorBtn.style.display = "none";
      clientBtn.style.display = "block";
    } else {
      creatorBtn.style.display = "block";
      clientBtn.style.display = "none";
    }

  }catch(err){
    console.error(err);
    showToast("Failed to load account");
  }
}
fetchMyChannels();
checkUserRole();
 */