// Mock data representing active login sessions
const initialSessions = [
{
    id:1,
    device:"Windows Desktop",
    browser:"Google Chrome 138",
    os:"Windows 11",
    location:"Karnal, Haryana, India",
    ip:"103.21.120.52",
    loginTime:"22 Jul 2026 • 09:35 AM",
    logoutTime:null,
    status:"Online",
    isCurrent:true
},
{
    id:2,
    device:"Samsung Galaxy S24",
    browser:"Chrome Mobile",
    os:"Android 15",
    location:"Delhi, India",
    ip:"49.37.215.121",
    loginTime:"20 Jul 2026 • 05:18 PM",
    logoutTime:"20 Jul 2026 • 08:42 PM",
    status:"Logged Out",
    isCurrent:false
},
{
    id:3,
    device:"MacBook Pro",
    browser:"Safari",
    os:"macOS Sequoia",
    location:"Mumbai, India",
    ip:"182.71.55.18",
    loginTime:"18 Jul 2026 • 11:15 AM",
    logoutTime:null,
    status:"Online",
    isCurrent:false
}
];

const listContainer = document.getElementById('session-list');

// Function to render active sessions onto the screen
function renderSessions(sessions) {
    listContainer.innerHTML = '';
    
    if (sessions.length === 0) {
        listContainer.innerHTML = '<p class="session-meta">No active secondary sessions found.</p>';
        return;
    }

    sessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'session-item';

       item.innerHTML = `
<div class="session-card">

    <div class="top-row">

        <div class="device-name">
            💻 ${session.device}

            ${
                session.isCurrent
                ? `<span class="badge">Current Device</span>`
                : ""
            }

        </div>

        <span class="${session.status==="Online"?"online":"offline"}">

            ${session.status}

        </span>

    </div>

    <div class="details">

        <div><strong>🌐 Browser:</strong> ${session.browser}</div>

        <div><strong>💻 OS:</strong> ${session.os}</div>

        <div><strong>📍 Location:</strong> ${session.location}</div>

        <div><strong>🌍 IP:</strong> ${session.ip}</div>

        <div><strong>🕒 Login:</strong> ${session.loginTime}</div>

        <div><strong>🚪 Logout:</strong> ${
            session.logoutTime ?? "Active Now"
        }</div>

    </div>

    ${
        !session.isCurrent
        ?
        `<button class="btn-logout" onclick="terminateSession(${session.id})">
            Sign Out
        </button>`
        :
        ""
    }

</div>
`;
        listContainer.appendChild(item);
    });
}

// Function to remove a session when "Log Out" is clicked
function terminateSession(id) {
    if (confirm("Are you sure you want to log out of this device?")) {
        const filteredSessions = initialSessions.filter(session => session.id !== id);
        // Note: In production, you would send an API request to your server here.
        renderSessions(filteredSessions);
    }
}

// Initial render load
renderSessions(initialSessions);
