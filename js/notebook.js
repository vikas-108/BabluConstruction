// Global App Configuration States
let activeNotebookId = null;
let activePage = 1;
let allNotebooks = {};
let selectedColor = "#2c3e50"; 
let saveTimeout = null; // Used to control saving animation states

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

// Initialize Boot Configuration Block
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('global_notebook_system');
    if (savedData) {
        allNotebooks = JSON.parse(savedData);
    }
     // Load Saved Dark Theme State
    const savedTheme = localStorage.getItem('notebook_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    renderDashboardList();
    setupColorPicker();
    setupLiveListeners();
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
        renderDashboardList(searchBar.value.trim().toLowerCase());
    });

    fontSelect.addEventListener('change', () => {
        if (!activeNotebookId) return;
        noteContent.classList.remove('font-handwriting', 'font-typewriter');
        const chosenFont = fontSelect.value;
        noteContent.classList.add(chosenFont);
        allNotebooks[activeNotebookId].preferredFont = chosenFont;
        triggerAutoSave();
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
        localStorage.setItem('notebook_theme', newTheme);
        themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

function calculateMetrics() {
    const currentText = noteContent.value.trim();
    const totalWords = currentText === "" ? 0 : currentText.split(/\s+/).length;
    const totalChars = noteContent.value.length;
    counterStats.textContent = `Words: ${totalWords} | Chars: ${totalChars}`;
}

// Build and display filtered/unfiltered notebook list items
function renderDashboardList(filterTerm = "") {
    notebooksList.innerHTML = "";
    const keys = Object.keys(allNotebooks);

    // Apply smart conditional filtering matching keywords inside titles or bodies
    const filteredKeys = keys.filter(id => {
        const book = allNotebooks[id];
        const titleMatch = (book.title || "").toLowerCase().includes(filterTerm);
        
        // Scan inside all compiled text blocks across every page sheet
        const contentsMatch = Object.values(book.pages).some(text => 
            (text || "").toLowerCase().includes(filterTerm)
        );
        
        return titleMatch || contentsMatch;
    });

    if (filteredKeys.length === 0) {
        const noNotesMsg = document.createElement('div');
        noNotesMsg.className = "empty-list-text";
        noNotesMsg.textContent = filterTerm ? "No notes found matching your search term." : "No notebooks found. Create one above!";
        notebooksList.appendChild(noNotesMsg);
        return;
    }

    filteredKeys.forEach(id => {
        const book = allNotebooks[id];
        const pageCount = Object.keys(book.pages).length;
        const coverColor = book.color || "#2c3e50";

        const item = document.createElement('div');
        item.className = "notebook-item animate-fade";
        
        item.style.borderLeftColor = coverColor;
        item.style.borderLeftWidth = "6px";
        item.style.borderLeftStyle = "solid";
        
        item.innerHTML = `
            <div class="info-side">
                <span class="title">${book.title || "Untitled Notebook"}</span>
                <span class="page-count">${pageCount} Page(s)</span>
            </div>
            <button class="delete-btn" title="Delete Notebook">🗑️</button>
        `;
        
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                e.stopPropagation(); 
                deleteNotebook(id);
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
    
    // Update badge visually to notify text changes are active
    saveStatus.textContent = "Typing...";
    saveStatus.style.color = "#e67e22";
    
    // Cache text data state objects instantly 
    allNotebooks[activeNotebookId].title = noteTitle.value;
    allNotebooks[activeNotebookId].pages[activePage] = noteContent.value;
    
    // Debounce actual disk writing events to preserve local browser performance
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('global_notebook_system', JSON.stringify(allNotebooks));
        saveStatus.textContent = "Saved";
        saveStatus.style.color = "#2ecc71";
    }, 400); // Saves exactly 400ms after typing halts safely
}

function deleteNotebook(id) {
    if (confirm(`Are you completely sure you want to delete "${allNotebooks[id].title}"? This cannot be undone.`)) {
        delete allNotebooks[id];
        localStorage.setItem('global_notebook_system', JSON.stringify(allNotebooks));
        renderDashboardList(searchBar.value.trim().toLowerCase());
    }
}

addNotebookBtn.addEventListener('click', () => {
    const newId = "nb_" + Date.now();
    allNotebooks[newId] = {
        title: "My Notebook",
        color: selectedColor,
        preferredFont: "font-handwriting",
        pages: { 1: "" }
    };
    localStorage.setItem('global_notebook_system', JSON.stringify(allNotebooks));
    loadNotebook(newId);
});

function loadNotebook(id) {
    activeNotebookId = id;
    activePage = 1;
    
    notebookSpine.style.borderLeftColor = allNotebooks[id].color || "#2c3e50";
    
    dashboardView.classList.add('hidden');
    notebookView.classList.remove('hidden');
    controlsRow.classList.remove('hidden');
    
    renderPage();
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

backBtn.addEventListener('click', () => {
    notebookView.classList.add('hidden');
    controlsRow.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    
    activeNotebookId = null;
    searchBar.value = ""; // Clear active search string upon returning safely
    renderDashboardList();
});
