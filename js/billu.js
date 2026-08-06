// Strict Definition of 6 Required Construction Format Categories
const CONSTRUCTION_TYPES = [
    "Contractor", "Technician", "Supplier", "Mechanics", "Helper", "Other"
];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize the App
    initializeInvoice();
    // 2. Setup the "Mirror" Logic
    setupGlobalListeners();
});

function initializeInvoice() {
    // Locate the Source (First Sheet)
    const sourceSheet = getSourceSheet();
    if (!sourceSheet) return;

    // Ensure the first sheet has a table body
    const tbody = sourceSheet.querySelector('.item-list');
    if (tbody) {
        tbody.innerHTML = ''; // Clear defaults
        addRowToDom(tbody);   // Add first fresh row
    }

    // Create the Bottom Copy immediately
    rebuildOfficeCopyStructure();
    
    // Calculate initial zeros
    calculateInvoiceTotals();
}

/**
 * HELPER: Robustly finds the first invoice sheet (Source)
 * Works even if you removed the ID="source-invoice"
 */
function getSourceSheet() {
    return document.getElementById('source-invoice') || document.querySelector('.invoice-sheet');
}

/**
 * HELPER: Robustly finds the second invoice sheet (Target)
 */
function getTargetSheet() {
    return document.getElementById('office-copy-target');
}

/**
 * Global Event Manager - Handles clicks & typing for BOTH copies
 */
function setupGlobalListeners() {
    // ---------------------------------------------------------
    // NEW: Print Button Listeners (Clean ID selection)
    // ---------------------------------------------------------
    const btnAll = document.getElementById('btn-print-all');
    const btnClient = document.getElementById('btn-print-client');
    const btnOffice = document.getElementById('btn-print-office');

    if(btnAll) btnAll.addEventListener('click', () => triggerPrint('all'));
    if(btnClient) btnClient.addEventListener('click', () => triggerPrint('client'));
    if(btnOffice) btnOffice.addEventListener('click', () => triggerPrint('office'));

    // A. Click Handling (Buttons)
    document.addEventListener('click', (e) => {
        // Add Row Trigger
        if (e.target.matches('.add-row-btn')) {
            const sourceSheet = getSourceSheet();
            const tbody = sourceSheet.querySelector('.item-list');
            addRowToDom(tbody);
            
            // We must rebuild the structure to add the new row to the bottom copy
            rebuildOfficeCopyStructure(); 
            calculateInvoiceTotals();
        }

        // Delete Row Trigger
        if (e.target.matches('.delete-btn')) {
            const row = e.target.closest('tr');
            const tbody = row.closest('tbody');
            
            if (tbody.children.length > 1) {
                // Find index to delete the matching row in the OTHER copy
                const index = Array.from(tbody.children).indexOf(row);
                
                // Remove from the Source (Master) regardless of where you clicked
                const sourceSheet = getSourceSheet();
                const sourceRow = sourceSheet.querySelectorAll('.item-list tr')[index];
                if(sourceRow) sourceRow.remove();
                
                // Rebuild to sync
                rebuildOfficeCopyStructure();
                calculateInvoiceTotals();
            } else {
                alert("You cannot delete the last row.");
            }
        }
        
        // Print Trigger
      //  if (e.target.matches('#download-btn')) {
          //  executePdfPrint();
      //  }
    });

    // B. Input Handling (Real-Time Bi-Directional Sync)
    document.addEventListener('input', (e) => {
        const el = e.target;
        const sourceSheet = getSourceSheet();
        const targetSheet = getTargetSheet();

        // Safety check
        if (!sourceSheet || !targetSheet) return;

        // 1. Identify where the user is typing
        const isTypingInSource = sourceSheet.contains(el);
        const isTypingInTarget = targetSheet.contains(el);

        if (!isTypingInSource && !isTypingInTarget) return; // Ignore outside inputs

        // 2. Define who is who
        const currentSection = isTypingInSource ? sourceSheet : targetSheet;
        const partnerSection = isTypingInSource ? targetSheet : sourceSheet;

        // 3. Sync the value to the Partner
        syncValueToPartner(el, currentSection, partnerSection);

        // 4. If numbers changed, run math
        if (el.matches('.row-qty, .row-rate, #discount-input, input[type="number"]')) {
            calculateInvoiceTotals();
        }
    });
    
    // C. Change Handling (For Checkboxes/Selects)
    document.addEventListener('change', (e) => {
        if (e.target.matches('#gst-toggle, select')) {
             // For toggles and selects, we just trigger a full math calc + sync
             const el = e.target;
             const sourceSheet = getSourceSheet();
             const targetSheet = getTargetSheet();
             
             // Simple sync for checkbox/select
             if(sourceSheet.contains(el)) {
                 syncValueToPartner(el, sourceSheet, targetSheet);
             } else if (targetSheet.contains(el)) {
                 syncValueToPartner(el, targetSheet, sourceSheet);
             }
             calculateInvoiceTotals();
        }
    });
}

/**
 * Finds the matching input in the other section and updates it
 */
function syncValueToPartner(element, currentSection, partnerSection) {
    let partnerElement = null;

    // SCENARIO 1: It's inside a Table Row
    if (element.closest('tr') && element.closest('tbody')) {
        const row = element.closest('tr');
        // Get row index
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        
        // Get the class of the input to match
        // We look for common classes we used like 'row-qty', 'row-desc', 'row-rate'
        const inputClass = Array.from(element.classList).find(cls => cls.startsWith('row-') || cls === 'cell-input');
        
        if (inputClass) {
            const partnerRow = partnerSection.querySelectorAll('.item-list tr')[rowIndex];
            if (partnerRow) {
                partnerElement = partnerRow.querySelector(`.${inputClass}`);
            }
        } else if (element.tagName === 'SELECT') {
             const partnerRow = partnerSection.querySelectorAll('.item-list tr')[rowIndex];
             if(partnerRow) partnerElement = partnerRow.querySelector('select');
        }
    } 
    // SCENARIO 2: It's a Header or Summary Field
    else {
        // Try to match by Class Name first (Most reliable)
        const classList = Array.from(element.classList);
        if (classList.length > 0) {
            // Find the first class that exists in the partner section
            for (const cls of classList) {
                // Ignore generic layout classes
                if(['meta-field', 'toggle-item'].includes(cls)) continue; 
                
                const candidate = partnerSection.querySelector(`.${cls}`);
                if (candidate) {
                    partnerElement = candidate;
                    break;
                }
            }
        }
        
        // Special Fallback for Discount/GST inputs that might be ID based
        if (!partnerElement) {
             if (element.type === 'number' && element.closest('.toggle-box')) {
                 partnerElement = partnerSection.querySelector('.toggle-box input[type="number"]');
             }
             if (element.type === 'checkbox') {
                 partnerElement = partnerSection.querySelector('.toggle-box input[type="checkbox"]');
             }
        }
    }

    // Apply the Value
    if (partnerElement) {
        if (element.type === 'checkbox') {
            partnerElement.checked = element.checked;
        } else {
            partnerElement.value = element.value;
        }
    }
}

/**
 * Adds a new row HTML to a specific tbody
 */
function addRowToDom(tbodyElement) {
    const tr = document.createElement('tr');
    const selectOptions = CONSTRUCTION_TYPES.map(type => `<option value="${type}">${type}</option>`).join('');
    
    tr.innerHTML = `
        <td><select class="row-type">${selectOptions}</select></td>
        <td><input type="text" class="row-desc" value="Service details"></td>
        <td><input type="number" class="row-qty" value="1" min="1"></td>
        <td><input type="number" class="row-rate" value="0" min="0"></td>
        <td style="font-weight: bold; text-align: right;">₹ <span class="row-total">0.00</span></td>
        <td class="no-print" style="text-align: center;"><button class="delete-btn">X</button></td>
    `;
    tbodyElement.appendChild(tr);
}

/**
 * Calculates Totals using the SOURCE data, then updates text in BOTH copies
 */
function calculateInvoiceTotals() {
    const sourceSheet = getSourceSheet();
    if (!sourceSheet) return;

    // 1. Math Logic (Based on Source)
    const rows = sourceSheet.querySelectorAll('.item-list tr');
    let subtotal = 0;

    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.row-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.row-rate').value) || 0;
        const total = qty * rate;
        
        // Update source row text immediate
        row.querySelector('.row-total').textContent = total.toFixed(2);
        subtotal += total;
    });

    // Handle Discount
    let discountVal = 10; // default
    const discInput = sourceSheet.querySelector('.toggle-box input[type="number"]'); // Robust selector
    if (discInput) discountVal = parseFloat(discInput.value) || 0;

    // Handle GST
    let isGst = true;
    const gstInput = sourceSheet.querySelector('.toggle-box input[type="checkbox"]');
    if (gstInput) isGst = gstInput.checked;

    const discountAmt = subtotal * (discountVal / 100);
    const net = subtotal - discountAmt;
    const gstAmt = isGst ? (net * 0.18) : 0;
    const grandTotal = net + gstAmt;

    // 2. Paint Values to BOTH sheets
    const sheets = [getSourceSheet(), getTargetSheet()];
    
    sheets.forEach(sheet => {
        if (!sheet) return;

        // Sync Row Totals Text
        const sheetRows = sheet.querySelectorAll('.item-list tr');
        sheetRows.forEach((r, i) => {
             // Recalculate strictly for display safety
             const q = parseFloat(r.querySelector('.row-qty').value) || 0;
             const rt = parseFloat(r.querySelector('.row-rate').value) || 0;
             r.querySelector('.row-total').textContent = (q * rt).toFixed(2);
        });

        // Sync Summary Text
        if(sheet.querySelector('.subtotal-val')) 
            sheet.querySelector('.subtotal-val').textContent = subtotal.toFixed(2);
        
        if(sheet.querySelector('.discount-rate-display')) 
            sheet.querySelector('.discount-rate-display').textContent = discountVal;
            
        if(sheet.querySelector('.discount-val')) 
            sheet.querySelector('.discount-val').textContent = discountAmt.toFixed(2);
            
        if(sheet.querySelector('.gst-val')) 
            sheet.querySelector('.gst-val').textContent = gstAmt.toFixed(2);
            
        if(sheet.querySelector('.grand-total-val')) 
            sheet.querySelector('.grand-total-val').textContent = grandTotal.toFixed(2);
    });
}

/**
 * REBUILDS the Office Copy completely. 
 * Used only when structure changes (Add/Remove Row).
 */
function rebuildOfficeCopyStructure() {
    const source = getSourceSheet();
    const target = getTargetSheet();
    
    if (!source || !target) return; // Prevents crash if HTML is wrong

    // 1. Clone
    const clone = source.cloneNode(true);
    
    // 2. Adjust Attributes
    clone.removeAttribute('id'); // Remove duplicates
    const badge = clone.querySelector('.copy-badge');
    if(badge) badge.textContent = "Internal Office Record Copy";
    
    // 3. Transfer Input State (Clone doesn't carry over user typed text)
    const sourceInputs = source.querySelectorAll('input, select, textarea');
    const cloneInputs = clone.querySelectorAll('input, select, textarea');
    
    sourceInputs.forEach((inp, i) => {
        if (inp.type === 'checkbox') cloneInputs[i].checked = inp.checked;
        else cloneInputs[i].value = inp.value;
    });

    // 4. Remove 'Add Row' button from bottom copy (optional, but cleaner)
    // We leave the delete buttons so you can delete from bottom too
    const addBtn = clone.querySelector('.add-row-btn');
    if(addBtn) addBtn.remove();

    // 5. Inject
    target.innerHTML = '';
    target.appendChild(clone);
}
//old pring and downloading mode
function executePdfPrint() {
    // Robustly get client name
    const source = getSourceSheet();
    let clientName = "Client";
    if (source.querySelector('.input-client')) {
        clientName = source.querySelector('.input-client').value;
    }
    
    // Robustly get total
    let total = "0.00";
    if (source.querySelector('.grand-total-val')) {
        total = source.querySelector('.grand-total-val').textContent;
    }

    window.print();
    updateAuditLog(clientName, total);
}
// NEW: FUNCTION TO HANDLE PRINT MODES
function triggerPrint(mode) {
    const source = getSourceSheet();
    
    // 1. Prepare Classes based on mode
    if (mode === 'client') {
        document.body.classList.add('print-client-only');
    } else if (mode === 'office') {
        document.body.classList.add('print-office-only');
    }
    
    // 2. Capture Data for log
    let clientName = "Client";
    if (source.querySelector('.input-client')) {
        clientName = source.querySelector('.input-client').value;
    }
    let total = "0.00";
    if (source.querySelector('.grand-total-val')) {
        total = source.querySelector('.grand-total-val').textContent;
    }
    const logType = mode === 'all' ? "Full Set" : (mode === 'client' ? "Client Copy" : "Office Copy");

    // 3. Print
    window.print();

    // 4. Cleanup Classes immediately after print dialog closes
    document.body.classList.remove('print-client-only');
    document.body.classList.remove('print-office-only');

    // 5. Update Log
    updateAuditLog(clientName, total, logType);
}
function updateAuditLog(client, amount, type = "Set") {
    const ul = document.getElementById('history-log');
    if(!ul) return;
    
    const empty = ul.querySelector('.empty-msg');
    if (empty) empty.remove();
    
    const li = document.createElement('li');
     li.innerHTML = `<span><strong>${type} Saved:</strong> ${client}</span> <span>₹ ${amount}</span>`;
    ul.prepend(li);
}
