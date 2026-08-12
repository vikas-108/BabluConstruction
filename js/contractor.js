// Clean legal templates mapping worker structures to specific penalty and milestone sets
const contractTemplates = {
    general: `
        <h2>1. Scope of Work</h2>
        <p>The Contractor agrees to furnish all materials, tools, heavy equipment, and labor infrastructure required to perform structural building upgrades in strict conformity with project blueprints.</p>
        
        <h2>2. Project Payment Terms</h2>
        <p>Payments will be structured securely across core deliverables as outlined in the breakdown schedule below:</p>
        
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Project Phase / Milestone</th>
                    <th>Deliverable Requirement</th>
                    <th>Payment Due (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Phase 1: Mobilization</td>
                    <td>Site setup and raw materials delivery</td>
                    <td>20%</td>
                </tr>
                <tr>
                    <td>Phase 2: Framework</td>
                    <td>Structural framing and inspection pass</td>
                    <td>40%</td>
                </tr>
                <tr>
                    <td>Phase 3: Handover</td>
                    <td>Final walkthrough and client sign-off</td>
                    <td>40%</td>
                </tr>
            </tbody>
        </table>

        <h2>3. Delay & Performance Penalty</h2>
        <p>Time is of the essence. If the Contractor fails to achieve project completion within the specified timeframe, a delay penalty of <strong>$150.00 per calendar day</strong> will be levied against the final payment due, up to a maximum cap of 10% of the gross contract value.</p>
    `,
    technician: `
        <h2>1. Specialized Technical Scope</h2>
        <p>The Skilled Technician is engaged specifically to manage advanced mechanical, electrical, plumbing, or HVAC installations adhering to local engineering and safety codes.</p>
        
        <h2>2. Technical Service Schedule</h2>
        <p>Compensations are cataloged upon execution and immediate safety testing of systems:</p>
        
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Technical System Component</th>
                    <th>Verification Requirement</th>
                    <th>Milestone Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Rough-In Placement</td>
                    <td>Wiring/Piping run behind structural walls</td>
                    <td>50%</td>
                </tr>
                <tr>
                    <td>Final Integration</td>
                    <td>Fixtures live, load tested & verified</td>
                    <td>50%</td>
                </tr>
            </tbody>
        </table>

        <h2>3. Non-Compliance & Safety Penalties</h2>
        <p>All work must pass independent safety evaluations on the first attempt. Any system failure causing inspection delays will prompt a penalty of <strong>$200.00 per rejected test</strong>. The technician will handle corrective modifications at their own personal material expense.</p>
    `,
    helper: `
        <h2>1. Labor Assignments</h2>
        <p>The Helper agrees to complete general labor, material handling, site preservation, clean-up operations, and assist tradesmen on site under strict supervisor directives.</p>
        
        <h2>2. Labor Compensation Grid</h2>
        <p>Payments are calculated against hourly or daily logging metrics as registered here:</p>
        
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Labor Bracket</th>
                    <th>Standard Rate</th>
                    <th>Overtime Rate</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>General Site Labor</td>
                    <td>$25.00 / Hour</td>
                    <td>$37.50 / Hour</td>
                </tr>
            </tbody>
        </table>

        <h2>3. No-Show & Attendance Penalty</h2>
        <p>The Helper must provide a minimum 24-hour advance warning if unable to attend an assigned shift. Failure to report for an shift without notice will trigger a <strong>one-day compensation fine ($200.00 flat)</strong> applied directly to the current week's settlement ledger.</p>
    `
};

// Application logic separating actions cleanly from HTML structures
document.addEventListener("DOMContentLoaded", () => {
    const workerDropdown = document.getElementById("worker-type");
    const downloadButton = document.getElementById("btn-download");
    const contentArea = document.getElementById("contract-content");

    // Dynamic document clause updater
    function updateContractContent() {
        const selectedValue = workerDropdown.value;
        contentArea.innerHTML = contractTemplates[selectedValue];
    }

    // Modern event handler bindings
    workerDropdown.addEventListener("change", updateContractContent);
    
    downloadButton.addEventListener("click", () => {
        window.print();
    });

    // Run layout initializer
    updateContractContent();
});


/**
 * 
 * // Language Dictionary for Interface Headers and Labels
const staticTranslations = {
    en: {
        lblWorkerType: "Agreement Type:",
        contractTitle: "CONSTRUCTION SERVICE AGREEMENT",
        contractSubtitle: "This document is legally binding and fully editable.",
        lblContractorHeader: "CONTRACTOR / PROVIDER",
        lblClientHeader: "CLIENT / PROPERTY OWNER",
        lblCName: "Name:", lblCPhone: "Phone:", lblCAddress: "Address:", lblCLicense: "License No:",
        lblClName: "Name:", lblClPhone: "Phone:", lblClAddress: "Address:", lblClDate: "Date:",
        lblSigContractor: "Contractor Signature", lblSigClient: "Client Signature",
        lblDateLine: "Date: _______________",
        btnLang: "हिन्दी में बदलें",
        options: [
            { value: "general", text: "General Contractor Agreement" },
            { value: "technician", text: "Specialized Technician Agreement" },
            { value: "helper", text: "Helper / General Labor Agreement" }
        ]
    },
    hi: {
        lblWorkerType: "अनुबंध का प्रकार:",
        contractTitle: "निर्माण सेवा अनुबंध पत्र",
        contractSubtitle: "यह दस्तावेज़ कानूनी रूप से बाध्यकारी और पूरी तरह से संपादन योग्य है।",
        lblContractorHeader: "ठेकेदार / सेवा प्रदाता",
        lblClientHeader: "ग्राहक / संपत्ति का मालिक",
        lblCName: "नाम:", lblCPhone: "फ़ोन:", lblCAddress: "पता:", lblCLicense: "लाइसेंस संख्या:",
        lblClName: "नाम:", lblClPhone: "फ़ोन:", lblClAddress: "पता:", lblClDate: "दिनांक:",
        lblSigContractor: "ठेकेदार के हस्ताक्षर", lblSigClient: "ग्राहक के हस्ताक्षर",
        lblDateLine: "दिनांक: _______________",
        btnLang: "Switch to English",
        options: [
            { value: "general", text: "सामान्य ठेकेदार अनुबंध" },
            { value: "technician", text: "विशेषज्ञ तकनीशियन अनुबंध" },
            { value: "helper", text: "सहायक / सामान्य श्रमिक अनुबंध" }
        ]
    }
};

// Dynamic Bilingual Clause Templates
const contractTemplates = {
    en: {
        general: `
            <h2>1. Scope of Work</h2>
            <p>The Contractor agrees to furnish all materials, tools, heavy equipment, and labor infrastructure required to perform structural building upgrades in strict conformity with project blueprints.</p>
            
            <h2>2. Project Payment Terms</h2>
            <p>Payments will be structured securely across core deliverables as outlined in the breakdown schedule below:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Project Phase / Milestone</th>
                        <th>Deliverable Requirement</th>
                        <th>Payment Due (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Phase 1: Mobilization</td><td>Site setup and raw materials delivery</td><td>20%</td></tr>
                    <tr><td>Phase 2: Framework</td><td>Structural framing and inspection pass</td><td>40%</td></tr>
                    <tr><td>Phase 3: Handover</td><td>Final walkthrough and client sign-off</td><td>40%</td></tr>
                </tbody>
            </table>

            <h2>3. Delay & Performance Penalty</h2>
            <p>Time is of the essence. If the Contractor fails to achieve project completion within the specified timeframe, a delay penalty of <strong>$150.00 per calendar day</strong> will be levied against the final payment due, up to a maximum cap of 10% of the gross contract value.</p>
        `,
        technician: `
            <h2>1. Specialized Technical Scope</h2>
            <p>The Skilled Technician is engaged specifically to manage advanced mechanical, electrical, plumbing, or HVAC installations adhering to local engineering and safety codes.</p>
            
            <h2>2. Technical Service Schedule</h2>
            <p>Compensations are cataloged upon execution and immediate safety testing of systems:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Technical System Component</th>
                        <th>Verification Requirement</th>
                        <th>Milestone Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Rough-In Placement</td><td>Wiring/Piping run behind structural walls</td><td>50%</td></tr>
                    <tr><td>Final Integration</td><td>Fixtures live, load tested & verified</td><td>50%</td></tr>
                </tbody>
            </table>

            <h2>3. Non-Compliance & Safety Penalties</h2>
            <p>All work must pass independent safety evaluations on the first attempt. Any system failure causing inspection delays will prompt a penalty of <strong>$200.00 per rejected test</strong>. The technician will handle corrective modifications at their own personal material expense.</p>
        `,
        helper: `
            <h2>1. Labor Assignments</h2>
            <p>The Helper agrees to complete general labor, material handling, site preservation, clean-up operations, and assist tradesmen on site under strict supervisor directives.</p>
            
            <h2>2. Labor Compensation Grid</h2>
            <p>Payments are calculated against hourly or daily logging metrics as registered here:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Labor Bracket</th>
                        <th>Standard Rate</th>
                        <th>Overtime Rate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>General Site Labor</td><td>$25.00 / Hour</td><td>$37.50 / Hour</td></tr>
                </tbody>
            </table>

            <h2>3. No-Show & Attendance Penalty</h2>
            <p>The Helper must provide a minimum 24-hour advance warning if unable to attend an assigned shift. Failure to report for a shift without notice will trigger a <strong>one-day compensation fine ($200.00 flat)</strong> applied directly to the current week's settlement ledger.</p>
        `
    },
    hi: {
        general: `
            <h2>1. कार्य का दायरा</h2>
            <p>ठेकेदार परियोजना के ब्लूप्रिंट के कड़े अनुपालन में संरचनात्मक भवन उन्नयन करने के लिए आवश्यक सभी सामग्री, उपकरण, भारी मशीनरी और श्रम बुनियादी ढांचा प्रस्तुत करने के लिए सहमत है।</p>
            
            <h2>2. परियोजना भुगतान की शर्तें</h2>
            <p>भुगतान को मुख्य डिलिवरेबल्स के आधार पर सुरक्षित रूप से संरचित किया जाएगा जैसा कि नीचे दी गई समय-सारणी में उल्लिखित है:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>परियोजना चरण / मुख्य मील का पत्थर</th>
                        <th>आवश्यकता विवरण</th>
                        <th>देय भुगतान (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>चरण 1: मोबिलाइजेशन</td><td>साइट सेटअप और कच्ची सामग्री की डिलीवरी</td><td>20%</td></tr>
                    <tr><td>चरण 2: फ्रेमवर्क निर्माण</td><td>संरचनात्मक फ्रेमिंग और निरीक्षण पास होना</td><td>40%</td></tr>
                    <tr><td>चरण 3: हैंडओवर</td><td>अंतिम वॉकथ्रू और ग्राहक द्वारा स्वीकृति</td><td>40%</td></tr>
                </tbody>
            </table>

            <h2>3. विलंब एवं कार्य प्रदर्शन दंड (पेनल्टी)</h2>
            <p>समय अत्यंत महत्वपूर्ण है। यदि ठेकेदार निर्दिष्ट समय सीमा के भीतर परियोजना को पूरा करने में विफल रहता है, तो अंतिम देय भुगतान में से <strong>₹1,500.00 प्रति कैलेंडर दिन</strong> का विलंब दंड काटा जाएगा, जो कुल अनुबंध मूल्य के अधिकतम 10% तक हो सकता है।</p>
        `,
        technician: `
            <h2>1. विशेष तकनीकी दायरा</h2>
            <p>कुशल तकनीशियन को विशेष रूप से स्थानीय इंजीनियरिंग और सुरक्षा कोडों का पालन करते हुए उन्नत मैकेनिकल, इलेक्ट्रिकल, प्लंबिंग या एचवीएसी इंस्टॉलेशन को संभालने के लिए नियुक्त किया गया है।</p>
            
            <h2>2. तकनीकी सेवा भुगतान अनुसूची</h2>
            <p>सिस्टम के निष्पादन और तत्काल सुरक्षा परीक्षण पर मुआवजे को निम्नानुसार सूचीबद्ध किया गया है:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>तकनीकी सिस्टम घटक</th>
                        <th>सत्यापन आवश्यकता</th>
                        <th>मील का पत्थर राशि</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>रफ-इन प्लेसमेंट</td><td>दीवारों के पीछे वायरिंग/पाइपिंग बिछाना</td><td>50%</td></tr>
                    <tr><td>अंतिम एकीकरण</td><td>फिक्स्चर लाइव, लोड टेस्ट और सत्यापित</td><td>50%</td></tr>
                </tbody>
            </table>

            <h2>3. गैर-अनुपालन एवं सुरक्षा दंड</h2>
            <p>सभी कार्यों को पहले प्रयास में ही स्वतंत्र सुरक्षा मूल्यांकनों को पास करना होगा। निरीक्षण में देरी का कारण बनने वाली किसी भी सिस्टम विफलता पर <strong>₹2,000.00 प्रति अस्वीकृत परीक्षण</strong> का दंड लगाया जाएगा। तकनीशियन अपने व्यक्तिगत सामग्री खर्च पर सुधारात्मक बदलाव करेगा।</p>
        `,
        helper: `
            <h2>1. श्रम कार्यभार असाइनमेंट</h2>
            <p>सहायक सामान्य श्रम, सामग्री प्रबंधन, साइट संरक्षण, सफाई संचालन को पूरा करने और सख्त पर्यवेक्षक निर्देशों के तहत साइट पर कारीगरों की सहायता करने के लिए सहमत है।</p>
            
            <h2>2. श्रम मुआवजा ग्रिड</h2>
            <p>भुगतान की गणना यहां पंजीकृत प्रति घंटा या दैनिक लॉगिंग मेट्रिक्स के आधार पर की जाती है:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>श्रम श्रेणी</th>
                        <th>मानक दर</th>
                        <th>ओवरटाइम दर</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>सामान्य साइट श्रम</td><td>₹1,875.00 / घंटा</td><td>₹2,812.50 / घंटा</td></tr>
                </tbody>
            </table>
            <h2>3. अनुपस्थिति एवं उपस्थिति दंड</h2>
            <p>सहायक को किसी भी असाइन किए गए शिफ्ट में उपस्थित न होने की स्थिति में कम से कम 24 घंटे पहले चेतावनी देनी होगी। बिना सूचना के शिफ्ट में रिपोर्ट न करने पर <strong>एक-दिन का मुआवजा जुर्माना (₹15,000.00 फ्लैट)</strong> लागू होगा, जो सीधे वर्तमान सप्ताह के निपटान लेजर में लागू किया जाएगा।</p>
        `
    }
};
 // application state tracking
 let currentLang = 'en';

    //render static labels based on active language setting
   document.addEventListener('DOMContentLoaded', () => {
    const workerDropdown = document.getElementById("worker-type");
    const downloadButton = document.getElementById("btn-download");
    const langToggleButton = document.getElementById("btn-lang-toggle");
    const contentArea = document.getElementById("contract-content");

    // Render static labels based on active language setting
    function renderStaticLabels() {
        const trans = staticTranslations[currentLang];

        document.getElementById("lbl-worker-type").textContent = trans.lblWorkerType;
        document.getElementById("contract-title").textContent = trans.contractTitle;
        document.getElementById("contract-subtitle").textContent = trans.contractSubtitle;
        document.getElementById("lbl-contractor-header").textContent = trans.lblContractorHeader;
        document.getElementById("lbl-client-header").textContent = trans.lblClientHeader;
        document.getElementById("lbl-c-name").textContent = trans.lblCName;
        document.getElementById("lbl-c-phone").textContent = trans.lblCPhone;
        document.getElementById("lbl-c-address").textContent = trans.lblCAddress;
        document.getElementById("lbl-c-license").textContent = trans.lblCLicense;
        document.getElementById("lbl-cl-name").textContent = trans.lblClName;
        document.getElementById("lbl-cl-phone").textContent = trans.lblClPhone;
        document.getElementById("lbl-cl-address").textContent = trans.lblClAddress;
        document.getElementById("lbl-cl-date").textContent = trans.lblClDate;
        document.getElementById("lbl-sig-contractor").textContent = trans.lblSigContractor;
        document.getElementById("lbl-sig-client").textContent = trans.lblSigClient;
        document.getElementById("lbl-date-line-1").textContent = trans.lblDateLine;
        document.getElementById("lbl-date-line-2").textContent = trans.lblDateLine;
        langToggleButton.textContent = trans.btnLang;

        // Remember selection, rebuild options layout, and re-apply selection
        const previousValue = workerDropdown.value || "general";
        workerDropdown.innerHTML = "";
        trans.options.forEach(opt => {
            const el = document.createElement("option");
            el.value = opt.value;
            el.textContent = opt.text;
            workerDropdown.appendChild(el);
        });
        workerDropdown.value = previousValue;
    }

    // Dynamic document clause updater
    function updateContractContent() {
        const selectedWorker = workerDropdown.value || "general";
        contentArea.innerHTML = contractTemplates[currentLang][selectedWorker];
    }

    // Combined layout refresh pipeline
    function refreshInterface() {
        renderStaticLabels();
        updateContractContent();
    }
    
    // Modern Event Listeners 
    workerDropdown.addEventListener("change", updateContractContent);
    
    downloadButton.addEventListener("click", () => {
        window.print();
    });
    
    langToggleButton.addEventListener("click", () => {
        currentLang = (currentLang === 'en') ? 'hi' : 'en';
        refreshInterface();
    });
    
    // Run Initializer Setup
    refreshInterface();
});

 */