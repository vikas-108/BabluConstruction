   /* --- 1. INIT & UTILS --- */
    window.onload = () => {
        generateRandomID();
        document.getElementById('billDate').valueAsDate = new Date();
        updatePreview();
    };

    function generateRandomID() {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('invoiceNum').value = `INV-${year}-${rand}`;
        updatePreview();
    }

    /* --- 2. UI INTERACTIONS --- */
    function changeTemplate() {
        const theme = document.getElementById('templateSelect').value;
        const preview = document.getElementById('invoice-preview');
        preview.className = theme; // Replaces all classes with the selected theme
    }

    function toggleMode() {
        const isDaily = document.querySelector('input[name="mode"]:checked').value === 'daily';
        document.getElementById('dailyInputs').style.display = isDaily ? 'flex' : 'none';
        document.getElementById('lumpInputs').style.display = isDaily ? 'none' : 'block';
        updatePreview();
    }

    function toggleGST() {
        const isOn = document.getElementById('gstToggle').checked;
        document.getElementById('gstDetails').style.display = isOn ? 'block' : 'none';
        if(!isOn) {
            document.getElementById('gstin').value = '';
            document.getElementById('prev-gstin').style.display = 'none';
        }
        updatePreview();
    }

    function validateGST() {
        const input = document.getElementById('gstin');
        const error = document.getElementById('gstError');
        const val = input.value.toUpperCase();
        
        // Standard India GST Regex: 2 digits, 5 chars, 4 digits, 1 char, 1 char, Z, 1 char
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if(val.length > 0) {
            if(regex.test(val)) {
                input.style.borderColor = "var(--success)";
                error.style.display = "none";
            } else {
                input.style.borderColor = "var(--danger)";
                error.style.display = "block";
            }
        } else {
            input.style.borderColor = "#ddd";
            error.style.display = "none";
        }
        updatePreview();
    }

    /* --- 3. CORE LOGIC (CALCULATIONS) --- */
    function updatePreview() {
        // A. Get Inputs
        const fromName = document.getElementById('fromName').value || 'Your Business';
        const fromPhone = document.getElementById('fromPhone').value;
        const toName = document.getElementById('toName').value || 'Client Name';
        const toPhone = document.getElementById('toPhone').value;
        const invNum = document.getElementById('invoiceNum').value;
        const date = document.getElementById('billDate').value;
        const gstin = document.getElementById('gstin').value.toUpperCase();
        const product =  document.getElementById('product').value || 'services/work/products';
        // B. Math
        const isDaily = document.querySelector('input[name="mode"]:checked').value === 'daily';
        let subtotal = 0;
        let rate = 0;
        let qty = 0;

        if(isDaily) {
            rate = parseFloat(document.getElementById('rate').value) || 0;
            qty = parseFloat(document.getElementById('days').value) || 0;
            subtotal = rate * qty;
            // Show Table Columns
            document.getElementById('th-rate').style.display = '';
            document.getElementById('th-qty').style.display = '';
            document.getElementById('prev-rate').style.display = '';
            document.getElementById('prev-qty').style.display = '';
            document.getElementById('prev-desc').innerText = "Service Charges (Daily)";
        } else {
            subtotal = parseFloat(document.getElementById('fixedAmount').value) || 0;
            // Hide Table Columns
            document.getElementById('th-rate').style.display = 'none';
            document.getElementById('th-qty').style.display = 'none';
            document.getElementById('prev-rate').style.display = 'none';
            document.getElementById('prev-qty').style.display = 'none';
            document.getElementById('prev-desc').innerText = "Fixed Service Charge";
        }

        // Modifiers
        const discPercent = parseFloat(document.getElementById('discount').value) || 0;
        const discAmount = subtotal * (discPercent / 100);
        const taxable = subtotal - discAmount;
        
        const gstOn = document.getElementById('gstToggle').checked;
        const gstAmount = gstOn ? taxable * 0.18 : 0;
        const total = taxable + gstAmount;

        // C. Update DOM Text
        document.getElementById('prev-from-name').innerText = fromName;
        document.getElementById('prev-from-phone').innerText = fromPhone ? `Phone: ${fromPhone}` : '';
        
        // Update GSTIN in Header
        const gstEl = document.getElementById('prev-gstin');
        if(gstOn && gstin) {
            gstEl.innerText = `GSTIN: ${gstin}`;
            gstEl.style.display = 'block';
        } else {
            gstEl.style.display = 'none';
        }

        document.getElementById('prev-to-name').innerText = toName;
        document.getElementById('prev-to-phone').innerText = toPhone ? `Phone: ${toPhone}` : 'Phone: ---';
        document.getElementById('prev-inv-num').innerText = invNum;
        document.getElementById('prev-date').innerText = date;
        document.getElementById('prev-product').innerText = `Product/Service: ${product}`;  

        document.getElementById('prev-rate').innerText = `₹${rate}`;
        document.getElementById('prev-qty').innerText = qty;
        document.getElementById('prev-amt').innerText = `₹${subtotal.toFixed(2)}`;

        // Totals Section
        document.getElementById('out-sub').innerText = `₹${subtotal.toFixed(2)}`;
        
        // Discount Row
        const discRow = document.getElementById('row-disc');
        if(discAmount > 0) {
            discRow.style.display = 'flex';
            document.getElementById('out-disc-rate').innerText = discPercent;
            document.getElementById('out-disc-val').innerText = `-₹${discAmount.toFixed(2)}`;
        } else {
            discRow.style.display = 'none';
        }

        // GST Row
        const gstRow = document.getElementById('row-gst');
        if(gstOn) {
            gstRow.style.display = 'flex';
            document.getElementById('out-gst').innerText = `₹${gstAmount.toFixed(2)}`;
        } else {
            gstRow.style.display = 'none';
        }

        document.getElementById('out-total').innerText = `₹${total.toFixed(2)}`;
    }

    /* --- 4. PDF EXPORT & HISTORY --- */
    async function downloadPDF() {
        const element = document.getElementById('invoice-preview');
        const invNum = document.getElementById('invoiceNum').value;
        
        // 1. Capture HTML as Canvas
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        // 2. Generate PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${invNum}.pdf`);

        // 3. Add to History
        addToHistory(invNum);
    }

    function addToHistory(id) {
        const client = document.getElementById('toName').value || 'Unknown';
        const date = document.getElementById('billDate').value;
        const total = document.getElementById('out-total').innerText;
        
        const tbody = document.getElementById('historyList');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td style="font-weight:bold;">${id}</td>
            <td>${client}</td>
            <td>${date}</td>
            <td style="color:var(--success); font-weight:bold;">${total}</td>
            <td><span class="badge">Downloaded</span></td>
        `;
        
        // Prepend to top
        tbody.insertBefore(row, tbody.firstChild);
    }