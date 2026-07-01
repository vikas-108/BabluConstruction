// Global App Configuration States
let activeNotebookId = null;
let activePage = 1;
let allNotebooks = {};
let selectedColor = "#2c3e50"; 
let saveTimeout = null; // Used to control saving animation states
let targetShareNotebookId = null;
// API Config Base URL
//const NOTEBOOK_API = 'http://localhost:5000/api/notebooks'; // Update with your actual server URL
const NOTEBOOK_API = 'https://api.buildskil.com/api/notebooks'; // Update with your actual server URL
// DOM References
const dashboardView = document.getElementById('dashboard-view');
const notebookView = document.getElementById('notebook-view');
const controlsRow = document.getElementById('controls-row');
const notebooksList = document.getElementById('notebooks-list');
const notebookSpine = document.getElementById('notebook-spine');
const paperPage = document.getElementById('paper-page');
const searchBar = document.getElementById('search-bar');
const saveStatus = document.getElementById('save-status');

const addNotebookBtn = document.getElementById('add-notebook-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const clearBtn = document.getElementById('clear-btn');
const printBtn = document.getElementById('print-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const pageNumDisplay = document.getElementById('page-number');
const colorDots = document.querySelectorAll('.color-dot');
const counterStats = document.getElementById('counter-stats');
const fontSelect = document.getElementById('font-select');

const shareDrawerOverlay = document.getElementById('share-drawer-overlay');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const sendShareBtn = document.getElementById('send-share-btn');
const sharePhone = document.getElementById('share-phone');
const shareAccess = document.getElementById('share-access');
// Helper to provide headers along with JWT token
function getAuthHeaders() {
    const token = localStorage.getItem("cb_token"); // Make sure your user login API saves this token
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}
// Initialize Boot Configuration Block
window.addEventListener('DOMContentLoaded', async() => {
   // const savedData = localStorage.getItem('global_notebook_system');
    //if (savedData) {
    //    allNotebooks = JSON.parse(savedData);
    //}
     // Load Saved Dark Theme State
    const savedTheme = localStorage.getItem('notebook_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    //renderDashboardList();
    setupColorPicker();
    setupLiveListeners();
     // Fetch fresh database contents via API instead of localstorage
    await fetchAndRenderNotebooks();
});

// Programmatically assign palette hex colors to preview selectors via JavaScript
function setupColorPicker() {
    colorDots.forEach(dot => {
        const dataColor = dot.getAttribute('data-color');
        dot.style.backgroundColor = dataColor;

        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            selectedColor = dataColor;
        });
    });
}

// Target specific keystroke listeners to perform instant background saving
function setupLiveListeners() {
    noteTitle.addEventListener('input', triggerAutoSave);
    noteContent.addEventListener('input', () => {
        triggerAutoSave();
        calculateMetrics(); 
    });
    
    searchBar.addEventListener('input', () => {
        //renderDashboardList(searchBar.value.trim().toLowerCase());
         // Trigger live search against database index using values from inputs
        fetchAndRenderNotebooks(searchBar.value.trim().toLowerCase());
    });

    fontSelect.addEventListener('change', async () => {
        if (!activeNotebookId) return;
        noteContent.classList.remove('font-handwriting', 'font-typewriter');
        const chosenFont = fontSelect.value;
        noteContent.classList.add(chosenFont);
        allNotebooks[activeNotebookId].preferredFont = chosenFont;
        triggerAutoSave();
    // Immediate network update for structural preference switches
        try {
            await fetch(`${NOTEBOOK_API}/${activeNotebookId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ preferredFont: chosenFont })
            });
        } catch (err) {
            console.error("Error saving font preference:", err);
        }
    });

    /* NEW LISTENER: Native print dialog pipeline
    printBtn.addEventListener('click', () => {
        window.print();
    });*/

    // NEW LISTENER: System theme logic switch
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        //localStorage.setItem('notebook_theme', newTheme);
        themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

function calculateMetrics() {
    const currentText = noteContent.value.trim();
    const totalWords = currentText === "" ? 0 : currentText.split(/\s+/).length;
    const totalChars = noteContent.value.length;
    counterStats.textContent = `Words: ${totalWords} | Chars: ${totalChars}`;
}
// Fetch all database records for the logged-in user and build dashboard UI
async function fetchAndRenderNotebooks(searchTerm = "") {
    try {
        let url = NOTEBOOK_API;
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Failed to load notebooks");

        // Restructure array into matching dynamic front-end state format object
        allNotebooks = {};
        result.data.forEach(book => {
            allNotebooks[book._id] = book;
        });

        renderDashboardList(searchTerm);
    } catch (err) {
        console.error("Fetch Error:", err);
        notebooksList.innerHTML = `<div class="empty-list-text" style="color: red;">Failed to load notebooks. Please log in again.</div>`;
    }
}

// Build and display filtered/unfiltered notebook list items
// Helper to decode user ID from your saved JWT login token
function getCurrentUserId() {
    const token = localStorage.getItem('cb_token');
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.id; // Returns the user ID stored inside your token
    } catch (e) {
        return null;
    }
}

function renderDashboardList(filterTerm = "") {
    notebooksList.innerHTML = "";
    const keys = Object.keys(allNotebooks);
    const currentUserId = getCurrentUserId();

    if (keys.length === 0) {
        const noNotesMsg = document.createElement('div');
        noNotesMsg.className = "empty-list-text";
        noNotesMsg.textContent = filterTerm ? "No notes found matching your search term." : "No notebooks found. Create one above!";
        notebooksList.appendChild(noNotesMsg);
        return;
    }

    keys.forEach(id => {
        const book = allNotebooks[id];
        const pageCount = book.pages ? Object.keys(book.pages).length : 0;
        const coverColor = book.color || "#2c3e50";
        
        // Check if the current user is the actual creator of this notebook
        const isOwner = book.user === currentUserId;

        const item = document.createElement('div');
        item.className = "notebook-item animate-fade";
        item.style.borderLeft = `6px solid ${coverColor}`;
        
        item.innerHTML = `
            <div class="info-side">
                <span class="title">${book.title || "Untitled Notebook"}</span>
                <span class="page-count">${pageCount} Page(s) ${!isOwner ? '<span style="font-size:11px;color:#7f8c8d;">(Shared with you)</span>' : ''}</span>
            </div>
            <div class="action-buttons">
                <button class="share-btn" title="Share Notebook" ${!isOwner ? 'style="opacity: 0.4;"' : ''}>🔗</button>
                <button class="delete-btn" title="Delete Notebook" ${!isOwner ? 'style="opacity: 0.4;"' : ''}>🗑️</button>
            </div>
        `;
        
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                e.stopPropagation(); 
                if (!isOwner) {
                    alert("🚫 You cannot delete this notebook because it was shared with you by another user.");
                    return;
                }
                deleteNotebook(id);
            } else if (e.target.classList.contains('share-btn')) {
                e.stopPropagation();
                if (!isOwner) {
                    alert("🚫 You cannot share this notebook because it was shared with you by another user. Only the owner can share it.");
                    return;
                }
                openShareDrawer(id);
            } else {
                loadNotebook(id);
            }
        });
        notebooksList.appendChild(item);
    });
}


// NEW EXCLUSIVE FEATURE: Trigger Auto Save directly in the background
function triggerAutoSave() {
    if (!activeNotebookId) return;
       // NEW BLOCK: If the elements are currently read-only, block background network operations completely
    if (noteContent.readOnly || noteTitle.readOnly) {
        saveStatus.textContent = "🔒 Read Only (Changes Not Saved)";
        saveStatus.style.color = "#e74c3c";
        return;
    }
    // Update badge visually to notify text changes are active
    saveStatus.textContent = "Typing...";
    saveStatus.style.color = "#e67e22";
        if (!allNotebooks[activeNotebookId].pages) {
        allNotebooks[activeNotebookId].pages = {};
    }
    
    if (typeof allNotebooks[activeNotebookId].pages[activePage] !== 'object') {
        allNotebooks[activeNotebookId].pages[activePage] = { title: "", content: "" };
    }
    // Cache text data state objects instantly 
    allNotebooks[activeNotebookId].title = noteTitle.value;
    allNotebooks[activeNotebookId].pages[activePage] = noteContent.value;
    
    if (activePage === 1) {
        allNotebooks[activeNotebookId].title = noteTitle.value;
    }
    
    // Debounce background server writes
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        try {
            const payload = {
                title: allNotebooks[activeNotebookId].title, 
                pages: {
                    [activePage]: JSON.stringify({
                        title: noteTitle.value,
                        content: noteContent.value
                    })
                }
            };

            const res = await fetch(`${NOTEBOOK_API}/${activeNotebookId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                saveStatus.textContent = "Saved to Cloud";
                saveStatus.style.color = "#2ecc71";
            } else {
                throw new Error("Server write failed");
            }
        } catch (err) {
            saveStatus.textContent = "Connection Error";
            saveStatus.style.color = "#e74c3c";
            console.error("Auto-save sync error:", err);
        }
    }, 400); 
}


// Remote API Delete Call
async function deleteNotebook(id) {
    if (confirm(`Are you completely sure you want to delete "${allNotebooks[id].title}"? This cannot be undone.`)) {
        try {
            const res = await fetch(`${NOTEBOOK_API}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            if (!res.ok) throw new Error("Could not delete from server");

            delete allNotebooks[id];
            renderDashboardList(searchBar.value.trim().toLowerCase());
        } catch (err) {
            alert("Error deleting notebook: " + err.message);
        }
    }
}

// Remote API Post Call
addNotebookBtn.addEventListener('click', async () => {
    try {
        const payload = {
            title: "My Notebook",
            color: selectedColor,
            preferredFont: "font-handwriting"
        };

        const res = await fetch(NOTEBOOK_API, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
         const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Could not create notebook resource");

        const newNotebook = result.data;
        allNotebooks[newNotebook._id] = newNotebook;
        loadNotebook(newNotebook._id);
    } catch (err) {
        alert("Error creating notebook: " + err.message);
    }
});
// HELPER FUNCTION: Safely parses page contents whether they are strings or JSON objects
function renderPageDataContent() {
    if (!activeNotebookId || !allNotebooks[activeNotebookId]) return;
    
    const book = allNotebooks[activeNotebookId];
    const rawPageData = (book.pages && book.pages[activePage]) ? book.pages[activePage] : "";
    
    try {
        // Attempt to parse as JSON object (New Format)
        const parsedData = JSON.parse(rawPageData);
        noteTitle.value = parsedData.title || "";
        noteContent.value = parsedData.content || "";
    } catch (e) {
        // Fallback rule for older plain strings (Old Format)
        noteTitle.value = (activePage === 1) ? (book.title || "") : "";
        noteContent.value = rawPageData;
    }
}
function loadNotebook(id) {
    activeNotebookId = id;
    activePage = 1; 
    
    const book = allNotebooks[id];
    notebookSpine.style.borderLeftColor = book.color || "#2c3e50";
    pageNumDisplay.textContent = `Page ${activePage}`;
    
    // 1. DETERMINE ACCESS LEVEL
    const currentUserId = getCurrentUserId(); // Uses the token decoder function we made
    const isOwner = book.user === currentUserId;
    
    // Check if you are listed in sharedWith array with 'edit' access
    // Note: If your backend returns an explicit flag like book.myPermission === 'read', use that instead
    let canEdit = isOwner; 
    if (book.sharedWith && !isOwner) {
        // Fallback check matching against current local profile indicator configurations
        const hasEditorFlag = book.sharedWith.some(share => share.access === 'edit');
        if (hasEditorFlag) canEdit = true;
    }

    // 2. TOGGLE READ-ONLY STATES ON DOM ELEMENTS
    if (!canEdit) {
        noteTitle.readOnly = true;
        noteContent.readOnly = true;
        if(fontSelect) fontSelect.disabled = true; // Block switching fonts
        
        saveStatus.textContent = "🔒 Read Only Mode";
        saveStatus.style.color = "#7f8c8d";
    } else {
        noteTitle.readOnly = false;
        noteContent.readOnly = false;
        if(fontSelect) fontSelect.disabled = false;
        
        saveStatus.textContent = "Cloud Synchronized";
        saveStatus.style.color = "#2ecc71";
    }

    // 3. RENDER TEXT CONTENT VALUES
    renderPageDataContent(); 
    
    // Sync font styles
    noteContent.classList.remove('font-handwriting', 'font-typewriter', 'font-standard');
    const chosenFont = book.preferredFont || "font-handwriting";
    noteContent.classList.add(chosenFont);
    if(fontSelect) fontSelect.value = chosenFont;
    
    // UI Screen Swap Toggles
    dashboardView.classList.add('hidden');
    notebookView.classList.remove('hidden');
    if(controlsRow) controlsRow.classList.remove('hidden');
    
    calculateMetrics();
}


function renderPage() {
    const currentBook = allNotebooks[activeNotebookId];
    noteTitle.value = currentBook.title;
    noteContent.value = currentBook.pages[activePage] || "";
    pageNumDisplay.textContent = `Page ${activePage}`;
      const notebookFont = currentBook.preferredFont || "font-handwriting";
    noteContent.classList.remove('font-handwriting', 'font-typewriter');
    noteContent.classList.add(notebookFont);
    fontSelect.value = notebookFont;
    
    calculateMetrics();
    // Set immediate status to saved on a page change hook
    saveStatus.textContent = "Saved";
    saveStatus.style.color = "#2ecc71";
}

prevBtn.addEventListener('click', () => {
    if (activePage > 1) {
        activePage--;
        
        paperPage.classList.remove('page-turn-next', 'page-turn-prev');
        void paperPage.offsetWidth; 
        paperPage.classList.add('page-turn-prev');
        
        renderPage();
    }
});

nextBtn.addEventListener('click', () => {
    activePage++;
    
    if (!allNotebooks[activeNotebookId].pages[activePage]) {
        allNotebooks[activeNotebookId].pages[activePage] = "";
    }
    
    paperPage.classList.remove('page-turn-next', 'page-turn-prev');
    void paperPage.offsetWidth; 
    paperPage.classList.add('page-turn-next');
    
    renderPage();
});

paperPage.addEventListener('animationend', () => {
    paperPage.classList.remove('page-turn-next', 'page-turn-prev');
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear this entire specific page?')) {
        noteContent.value = "";
        triggerAutoSave();
         calculateMetrics();
    }
});

backBtn.addEventListener('click', async () => {
    activeNotebookId = null;
    activePage = 1;
    
    // Reset fields back to default editable state for the next document selection
    noteTitle.readOnly = false;
    noteContent.readOnly = false;
    if(fontSelect) fontSelect.disabled = false;

    notebookView.classList.add('hidden');
    if(controlsRow) controlsRow.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    
    await fetchAndRenderNotebooks(searchBar.value.trim().toLowerCase());
});




function openShareDrawer(notebookId) {
    targetShareNotebookId = notebookId;
    sharePhone.value = "";
    shareDrawerOverlay.classList.remove('hidden');
}

closeDrawerBtn.addEventListener('click', () => {
    shareDrawerOverlay.classList.add('hidden');
});

// Close overlay if background area is clicked
shareDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === shareDrawerOverlay) shareDrawerOverlay.classList.add('hidden');
});

sendShareBtn.addEventListener('click', async () => {
    const phoneNumber = sharePhone.value.trim();
    const accessLevel = shareAccess.value;

    if (!phoneNumber) {
        alert("Please enter a phone number.");
        return;
    }

    try {
        const res = await fetch(`${NOTEBOOK_API}/${targetShareNotebookId}/share`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ phone: phoneNumber, access: accessLevel })
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || "Failed to share notebook");

        alert("Notebook shared successfully!");
        shareDrawerOverlay.classList.add('hidden');
    } catch (err) {
        alert("Error sharing: " + err.message);
    }
});