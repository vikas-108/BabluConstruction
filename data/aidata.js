// ==========================================
// 1. GLOBAL MEMORY (For "Read More" Logic)
// ==========================================
let lastContext = null; // Stores the 'details' of the last question
let lastTopicForPdf = null; // Stores the full content for PDF generation
const storageKey = "construction_chat_v1";
// ==========================================
// 1. MINIPDF ENGINE (Fixed: Multi-line Support)
// ==========================================
class MiniPDF {
  constructor() {
    this.content = ""; // Stores the raw PDF instructions
  }

  // Core Function: Add Text with Auto-Wrap & Paragraphs
  text(textString, x, y, size = 12) {
    if (!textString) return;

    const lineHeight = size + 6;
    const maxChars = 85; // Adjust for A4 width
    let currentY = y;

    // 1. Split text by "Enter" keys (Newlines) so we don't mash paragraphs together
    const paragraphs = textString.split("\n");

    paragraphs.forEach(paragraph => {
      // If paragraph is empty (double enter), just add space
      if (paragraph.trim() === "") {
        currentY -= lineHeight;
        return;
      }

      // 2. Word Wrapping Logic
      const words = paragraph.split(" ");
      let line = "";

      words.forEach(word => {
        // PDF Security: Escape parenthesis ( ) or the file breaks
        const safeWord = word.replace(/\(/g, "\\(").replace(/\)/g, "\\)");

        if ((line + safeWord).length < maxChars) {
          line += safeWord + " ";
        } else {
          // Print the full line
          this.content += `BT /F1 ${size} Tf ${x} ${currentY} Td (${line.trim()}) Tj ET\n`;
          currentY -= lineHeight; // Move down
          line = safeWord + " ";
        }
      });

      // Print the last leftover line of the paragraph
      if (line.trim()) {
        this.content += `BT /F1 ${size} Tf ${x} ${currentY} Td (${line.trim()}) Tj ET\n`;
      }
      
      // Add extra space after every paragraph
      currentY -= (lineHeight * 1.5); 
    });
  }

  generate(filename = "download.pdf") {
    const header = "%PDF-1.4\n";
    let body = "";
    let xref = "xref\n0 6\n0000000000 65535 f \n";

    // Define PDF Objects (Catalog, Pages, Font, Content)
    const objects = [
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n`,
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
      `5 0 obj\n<< /Length ${this.content.length} >>\nstream\n${this.content}\nendstream\nendobj\n`
    ];

    // Calculate Byte Offsets (Crucial for PDF to open)
    let currentPos = header.length;
    objects.forEach(obj => {
      xref += currentPos.toString().padStart(10, "0") + " 00000 n \n";
      body += obj;
      currentPos += obj.length;
    });

    const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${currentPos + header.length}\n%%EOF`;
    
    // Combine & Download
    const blob = new Blob([header + body + xref + trailer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}

// ==========================================
// 2. STORAGE MANAGER (The Long-Term Memory)
// ==========================================
let chatHistory = JSON.parse(localStorage.getItem(storageKey)) || [];

// Function to Load History on Startup
function loadChatHistory() {
  chatHistory.forEach(msg => {
    // Re-create the HTML elements from saved data
    const div = document.createElement('div');
    div.className = msg.className;
    div.innerHTML = `<span>${msg.html}</span>`;
    chatLog.appendChild(div);
  });
  // Scroll to bottom
  chatLog.scrollTop = chatLog.scrollHeight;
}


// ==========================================
// 2. THE BRAIN (DATASET)
// ==========================================
const constructionHQ = [
  // --- CORE BUSINESS INTENTS (Multilingual) ---
  {
    keywords: ["cost", "price", "rate", "sqft", "budget", "quote", "estimate", "money", "paisa", "kharcha", "kimat", "bhav", "rate", "कीमत", "पैसा", "खर्चा", "रेट"],
    questions: ["how much", "what is the price", "kitna paisa lagega", "kya rate hai", "kitna kharcha aayega", "रेट क्या है"],
    answer: `
      <strong>English:</strong> Residential builds start at <strong>$150/sqft</strong>. 
      <br><hr style="margin:5px 0; opacity:0.3">
      <strong>हिंदी:</strong> घर बनाने का खर्च <strong>$150 प्रति वर्ग फीट</strong> से शुरू होता है।`,
    details: "<strong>Breakdown:</strong><br>• Material: 60%<br>• Labor: 30%<br>• Permits/Fees: 10%<br><br>For a fixed bid, we need architectural drawings."
  },{
    keywords: ["construction"],
    questions: ["what is construction", "construction kya hai"],
    answer: "Construction is the process of building or assembling infrastructure. It involves planning, design, financing, and execution to create structures like homes, offices, and roads." ,
    details: [
      "<strong>Planning:</strong> Defining the project scope, budget, and timeline.",
      "<strong>Design:</strong> Creating architectural and engineering drawings.",
      "<strong>Financing:</strong> Securing funds for the project.",
      "<strong>Execution:</strong> The actual building process, including site preparation, foundation work, framing, and finishing.",
      "<strong>Maintenance:</strong> Ongoing upkeep after construction is complete.",
      "<strong>Safety & Efficiency:</strong> Safely and efficiently construction requires coordination between architects, engineers, contractors, and clients to ensure the project meets quality standards and is completed on time and within budget."
    ]
  },
  {
    keywords: ["time", "long", "duration", "schedule", "when", "date", "kab", "samay", "time", "din", "mahina", "khatam", "कब", "समय", "कितने दिन"],
    questions: ["how long", "when will it be done", "kab tak banega", "kitna time lagega", "kab shuru hoga"],
    answer: `
      <strong>English:</strong> A custom home takes <strong>8-12 months</strong>. Kitchens take 4-8 weeks.
      <br><hr style="margin:5px 0; opacity:0.3">
      <strong>हिंदी:</strong> नया घर बनने में <strong>8-12 महीने</strong> लगते हैं।`,
    details: "<strong>Timeline Phases:</strong><br>1. Foundation: 1 Month<br>2. Framing: 2 Months<br>3. Systems (MEP): 2 Months<br>4. Finishes: 3 Months"
  },
  {
    keywords: ["contractor", "builder", "services", "thekedar"],
    questions: ["are you a contractor", "do you offer services", "kya aap builder ho", "kya aap thekedar ho"],
    answer: "Yes, we are a full-service construction company offering design-build services. We manage everything from permits to final finishes.",
    details: [
      "<strong>Design-Build:</strong> We handle both design and construction for a seamless experience.",
      "<strong>Permits:</strong> We manage all city permits and inspections.",
      "<strong>Custom Solutions:</strong> We tailor our services to meet your specific needs, whether it's a new home, remodel, or commercial project.",
      "<strong>Trusted Network:</strong> We have a network of trusted architects, engineers, and subcontractors to ensure quality and efficiency throughout the project.",
      "<strong>Commitment to Excellence:</strong> Our team is committed to clear communication, timely updates, and delivering exceptional results on every project we undertake.",
      "<strong>Contractor Services:</strong> We provide comprehensive construction services to build or renovate structures. We manage the construction process, coordinate with subcontractors, and ensure the project is completed on time and within budget.",
    ]
  },
  {
    keywords: ["types"],
    questions: ["how many types of contractor are there", "contractor ke kitne types hote hain"],
    answer: "There are several types of contractors, including General Contractors, Specialty Contractors (e.g., Electrical, Plumbing), Design-Build Contractors, and Construction Managers. Each type specializes in different aspects of the construction process.",
    details: [
      "<strong>General Contractors:</strong> Oversee the entire construction project, managing all aspects from start to finish.",
      "<strong>Specialty Contractors:</strong> Focus on specific trades such as electrical, plumbing, or HVAC work.",
      "<strong>Design-Build Contractors:</strong> Handle both the design and construction phases, providing a streamlined process for clients.",
      "<strong>Construction Managers:</strong> Coordinate and supervise the construction process, ensuring that projects are completed on time and within budget.",
      "<em>Note:</em> The specific types of contractors can vary by region and project requirements, but these are the most common categories in the construction industry.",
      "Here are some common types of contractors: masonry, carpentry, painting, tiling, landscaping, masonry, architecture, engineering, HVAC, electrical, plumbing, glass, steel, interior design, exterior design, pool specialization, solar specialization, smart home specialization, security specialization, demolition contracting, excavation contracting, roofing contracting, flooring contracting, insulation contracting, drywall contracting, concrete contracting, fencing contracting, paving contracting, siding contracting, window and door contracting.",
      "General Contractor: Manages the entire construction project, coordinating all aspects from start to finish.",
      "Specialty Contractor: Focuses on specific trades such as electrical, plumbing, or HVAC work.",
      "Design-Build Contractor: Handles both the design and construction phases, providing a streamlined process for clients.",
      "Construction Manager: Coordinates and supervises the construction process, ensuring that projects are completed on time and within budget.",
    ]
  },
  {
    keywords: ["service", "build", "make", "kitchen", "bath", "house", "home", "bana", "banana", "banvana", "kaam", "sewa", "kya", "lanter", "chhat", "सेवा", "बनाना", "काम"],
    questions: ["what do you do", "can you build", "kya bana sakte ho", "app kya karte ho", "me app ka kya bana skta hu", "ghar bana doge", "क्या बना सकते हो"],
    answer: [
      "We specialize in <strong>Custom Homes</strong>, <strong>Kitchen Remodels</strong>, and <strong>Commercial Fit-outs</strong>.",
      "We build everything from <strong>Residential Homes</strong> to <strong>Commercial Offices</strong>."
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    keywords: ["permit", "license", "legal", "map", "drawing", "naksha", "pass", "thekedar", "kagaz", "license", "permission", "नक्शा", "कागज", "लाइसेंस", "परमिशन"],
    questions: ["are you licensed", "do i need a permit", "naksha pass karvana hai", "license hai kya", "nasha banana"],
    answer: "<strong>We handle it all.</strong> We are Class A Licensed & Insured ($2M Liability). We manage all city permits.",
    image: "https://cdn-icons-png.flaticon.com/512/4300/4300056.png" 
  },
  
  // --- CONSTRUCTION DICTIONARY (Educational) ---
  {
   keywords: ["process", "steps", "procedure", "kaise"],
    // Step 1 (Immediate Answer)
    questions: ["what is the process of building a house", "house banane ka process", "ghar banane ke steps"],
    answer: "Building a house has <strong>3 Major Phases</strong>. <br><em>(Type <strong>'Next'</strong> to see Phase 1)</em>",
    
    // Step 2, 3, 4... (The Queue)
    details: [
      "<strong>Phase 1: Foundation (Month 1)</strong><br>We dig the plot and pour concrete footings.",
      "<strong>Phase 2: Structure (Month 2-3)</strong><br>Brickwork, pillars, and the roof slab (Lanter) are cast.",
      "<strong>Phase 3: Finishing (Month 4-8)</strong><br>Plumbing, flooring, paint, and interiors.",
      "<strong>Phase 4: Handover (Month 8-12)</strong><br>Final inspections, touch-ups, and move-in ready!",
      "<strong>All Done!</strong><br>Those are the main steps. Ask about 'Cost' to learn more."
    ]
  },
  {
    keywords:["brick", "eet", "ईंट"],
    questions: ["what is a brick", "eet kya hai"],
    answer: "A <strong>Brick</strong> is a rectangular block made of clay or concrete. It is used for building walls and structures.",
    details: [
      "<strong>Types of Bricks:</strong><br>1. Clay Bricks: Traditional, strong, and durable.<br>2. Concrete Bricks: Made from cement and aggregates, often used for facades.<br>3. Fly Ash Bricks: Eco-friendly, made from fly ash and cement.<br>4. Fire Bricks: Heat-resistant, used in fireplaces and kilns." 
    ]
  },
  {
    keywords:["cement", "siment", "सीमेंट"],
    questions: ["what is cement", "siment kya hai"],
    answer: "Cement is a powdery substance made from calcined lime and clay. It acts as a binder when mixed with water, sand, and gravel to form concrete."
  },
  {
    keywords:["sand", "ratti", "ret", "रेत"],
    questions: ["what is sand", "ratti kya hai"],
    answer: "Sand is a granular material composed of finely divided rock and mineral particles. It is a key ingredient in concrete and mortar.",
    details:[
      "<strong>Types of Sand:</strong><br>1. River Sand: Smooth and rounded, ideal for plastering.<br>2. M-Sand (Manufactured Sand): Crushed rock sand, used for concrete.<br>3. Pit Sand: Coarse and angular, used for concrete work.<br>4. Beach Sand: Contains salt, not suitable for construction.",
      "<strong>Importance of Sand:</strong><br>Sand provides strength and stability to concrete and mortar. It fills voids and helps bind the mixture together, ensuring durability and longevity of structures.",
      "<em>Note:</em> The choice of sand type can affect the quality and finish of the construction work, so it's important to select the right sand for each specific application.",
    ]
  },
  {    keywords:["aggregate", "gitti", "bajri", "गिट्टी", "बजरी"],
    questions: ["what is aggregate", "gitti kya hai", "bajri kya hai"],
    answer: "Aggregate refers to crushed stone, gravel, or sand used in construction. It provides bulk and strength to concrete.",
    details: [
      "<strong>Types of Aggregate:</strong><br>1. Coarse Aggregate: Larger particles (e.g., gravel) used for structural strength.<br>2. Fine Aggregate: Smaller particles (e.g., sand) used for workability and finish.<br>3. Recycled Aggregate: Made from crushed concrete, used for sustainable construction.<br>4. Lightweight Aggregate: Made from expanded clay or shale, used for insulation and reduced weight.",
      "<strong>Importance of Aggregate:</strong><br>Aggregate is essential for providing strength, durability, and stability to concrete. It also helps reduce shrinkage and cracking, ensuring the longevity of structures.",
      "<em>Note:</em> The quality and type of aggregate can significantly impact the performance of concrete, so it's crucial to select the appropriate aggregate for each construction project."
    ]
  },
  {
     keywords:["ratio", "mixture", "मिश्रण", "मसाला"],
    questions: ["what is the ratio of concrete", "concrete ka mixture kya hai", "mishran kya hai"],
    answer: "The typical ratio for concrete is <strong>1:2:4</strong> (1 Cement : 2 Sand : 4 Aggregate). For mortar (brickwork), it is usually 1:6.",
    details: [
      "<strong>Mix Ratio Explained:</strong><br>The mix ratio indicates the proportion of each ingredient in the concrete or mortar mix. It is expressed as a ratio of cement to sand to aggregate. For example, a 1:2:4 mix means 1 part cement, 2 parts sand, and 4 parts aggregate.",
      "<strong> in roof (slab) lanter mix ratio is 1:1.5:3 (cement:sand:aggregate) </strong>. it is used for roof slab (lanter) construction to ensure the necessary strength and durability to support the weight of the structure and withstand environmental factors. there are different mix ratios for different construction needs, such as foundations, beams, and columns, which may require stronger or weaker mixes based on the load they will bear.",
      "<strong>Concrete Mix Ratios:</strong><br>1. Standard Concrete: 1:2:4 (Cement:Sand:Aggregate)<br>2. High-Strength Concrete: 1:1.5:3<br>3. Lean Concrete: 1:3:6<br><br><strong>Mortar Mix Ratios:</strong><br>1. Standard Mortar: 1:6 (Cement:Sand)<br>2. Rich Mortar: 1:4<br>3. Lean Mortar: 1:8",
      "<strong>Importance of Mix Ratios:</strong><br>The mix ratio determines the strength, durability, and workability of concrete and mortar. Using the correct ratio is crucial for ensuring the structural integrity of the construction project.",
      "<em>Note:</em> The specific mix ratio may vary based on the requirements of the project, environmental conditions, and the type of construction being undertaken.",
    ]
  },
  {
    keywords:["beam"],
    questions: ["what is a beam" ],
    answer: "A <strong>Beam</strong> is a horizontal structural element that supports loads. It transfers weight to columns or walls.",
    image: "https://images.unsplash.com/photo-1586262764383-15f1c36a7927?auto=format&fit=crop&w=600&q=80"
  },
  {
    keywords:["column", "pillar", "khamba"],
    questions:["what is a column", "what is pillar"],
    answer: "A <strong>Column</strong> is a vertical structural element that carries compressive loads down to the foundation."
  },
  {
    keywords:["foundation", "basement", "neev"],
    questions:["what is a foundation", "what is a basement"],
    answer: "The <strong>Foundation</strong> is the lowest part of a building. It transfers the load of the structure to the ground to prevent settling."
  },
  {
    keywords:["slab", "lantr", "chhat", "roof"],
    questions:["what is a slab", "lantr kya hai"],
    answer: "A <strong>Slab</strong> is a flat, horizontal concrete surface. It serves as the floor or roof and is reinforced with steel."
  },
  {
    keywords:["steel", "rod", "sariya", "rebar"],
    questions:["what is the size of a steel rod", "sariya ka size"],
    answer: "Common sizes include <strong>#3 (3/8 inch)</strong> to <strong>#6 (3/4 inch)</strong>. The size depends on the structural load designed by the engineer."
  },
  {
    keywords:["ratio", "mixture", " मसाला"],
    questions:["what is the ratio of cement", "mixture kya hai"],
    answer: "The typical ratio for concrete is <strong>1:2:4</strong> (1 Cement : 2 Sand : 4 Aggregate). For mortar (brickwork), it is usually 1:6."
  },

  // --- CHIT CHAT & FALLBACK ---
  {
    keywords:["hello", "hey", "hi", "greetings", "welcome", "namaste"],
    questions: ["hello", "hi", "hey", "good morning"],
    answer: [
      "Hello! Ask me about <strong>costs</strong>, <strong>timelines</strong>, or <strong>designs</strong>.",
      "Namaste! How can I help build your dream project today?"
    ]
  },
  {
    keywords:["thank", "thanks", "dhanyavad", "shukriya", "okie", "ok", "thx", "got it","samajh gaya"],
    answer: "You're welcome! Let me know if you need anything else."
  },
  // school data
  {
    keywords: ["school"],
    questions: ["what is a school", "school kya hai"],
    answer: "a school is an educational institution designed to provide learning spaces and learning environments for the teaching of students under the direction of teachers.",
    details: [
      "<strong>Types of Schools:</strong><br>1. Public Schools: Funded by the government and free to attend.<br>2. Private Schools: Funded through tuition fees and private sources.<br>3. Charter Schools: Publicly funded but operate independently.<br>4. International Schools: Follow an international curriculum, often for expatriate students.",
      "<strong>Levels of Education:</strong><br>1. Primary School: Early years of education, typically ages 5-11.<br>2. Secondary School: Middle and high school, typically ages 12-18.<br>3. Higher Education: Colleges and universities for post-secondary education.",
      "<strong>Importance of Schools:</strong><br>Schools play a crucial role in shaping individuals and societies by providing education, fostering social skills, and preparing students for future careers and citizenship."
    ]
  },
  {
    keywords: ["default"],
    answer: `
      I didn't quite catch that. 
      <br>Try asking about:
      <br>• <strong>Prices / Kharcha</strong>
      <br>• <strong>Timelines / Samay</strong>
      <br>• <strong>Designs / Naksha</strong>`
  }
];

// ==========================================
// 3. THE LOGIC (MATH & SEARCH)
// ==========================================

// A. Levenshtein Distance (The "Spell Checker")
function getLevenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// B. The Fuzzy Matcher
function findBestMatch(userText) {
  const userWords = userText.toLowerCase().split(" ");
  let bestMatch = null;
  let highestScore = 0;

  constructionHQ.forEach(topic => {
    let currentScore = 0;
    
    // 1. Check Keywords (with Typo Tolerance)
    userWords.forEach(uWord => {
      if(uWord.length < 2) return; // Skip single letters
      
      topic.keywords.forEach(key => {
        const dist = getLevenshteinDistance(uWord, key);
        const keyLen = key.length;
        
        // Exact Match
        if (dist === 0) { 
          currentScore += 10; 
        } 
        // Typo Match (Logic adapted for Hinglish/English)
        else if (dist <= (keyLen > 5 ? 2 : 1) && keyLen > 3) { 
          currentScore += 5; 
        }
      });
    });

    // 2. Check Questions (Phrase Matching)
    if(topic.questions) {
      topic.questions.forEach(q => {
        if(userText.toLowerCase().includes(q)) currentScore += 20;
      });
    }

    // Winner Logic
    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = topic;
    }
  });

  // Threshold check (Score must be >= 5 to be considered a match)
  return (highestScore >= 5) ? bestMatch : constructionHQ.find(q => q.keywords.includes("default"));
}

// ==========================================
// 4. THE UI (INTERACTION)
// ==========================================
const widget = document.getElementById('chat-widget');
const chatLog = document.getElementById('chat-log');
const inputField = document.getElementById('user-input');
const toggleBtn = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');

// Toggle Window
toggleBtn.addEventListener('click', () => {
  const isHidden = window.getComputedStyle(widget).display === 'none';
  widget.style.display = isHidden ? 'flex' : 'none';
  if(isHidden) inputField.focus();
});

closeBtn.addEventListener('click', () => widget.style.display = 'none');

// Helper: Add Message to Log
// ==========================================
// UI HELPER (Upgraded with Auto-Save)
// ==========================================
function addMessage(html, className, save = true) {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = `<span>${html}</span>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;

  // SAVE TO MEMORY
  // We allow passing 'save = false' for temporary messages (like status updates)
  if (save) {
    chatHistory.push({ html, className });
    localStorage.setItem(storageKey, JSON.stringify(chatHistory));
  }

  return div;
}
// ==========================================
// ROBUST MEMORY LOGIC (Persist on Error)
// ==========================================

// ==========================================
// ROBUST MEMORY LOGIC (Persist on Error)
// ==========================================

function processMessage() {
  const text = inputField.value.trim();
  const safeText = text.toLowerCase();
  if (!text) return;

  // 1. Show User Message
  addMessage(text, 'user-msg');
  inputField.value = '';
  // --- A. PDF COMMAND ---
  if (safeText.includes("pdf") || safeText.includes("download")) {
     addMessage("Generating Document...", "bot-msg", false); // Temporary message, won't save to history
     setTimeout(() => {
        if (lastTopicForPdf) {
            const doc = new MiniPDF();
            // Title
            doc.text("PROJECT DOCUMENTATION", 40, 800, 18);
            doc.text("------------------------------------------------------", 40, 780, 12);
            // The Full Content
            doc.text(lastTopicForPdf, 40, 750, 11);
            // Footer
            doc.text("Generated by Construction AI", 40, 100, 10);
            doc.generate("Construction_Guide.pdf");
            addMessage("✅ <strong>PDF Downloaded.</strong> Includes full topic details.", "bot-msg");
        } else {
            addMessage("⚠️ No active topic. Ask about <strong>Cost</strong> first.", "bot-msg", false);
        }
     }, 1000);
     return; 
  }
  // ... (after the PDF logic) ...

  // --- B. CLEAR COMMAND ---
  if (safeText === "clear" || safeText === "reset" || safeText === "delete") {
      localStorage.removeItem(storageKey);
      chatHistory = []; // Clear Javascript memory
      chatLog.innerHTML = ""; // Clear Visual UI
      addMessage("History deleted. Starting fresh!", 'bot-msg');
      return;
  }


  // --- ANIMATION START ---
  const loaderHTML = `
    <div class="loading-bubble" id="loader">
      <div class="typing-indicator">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
      <span class="loading-text" id="loader-text">Analyzing...</span>
    </div>`;
  
  const loaderDiv = document.createElement('div');
  loaderDiv.innerHTML = loaderHTML;
  chatLog.appendChild(loaderDiv);
  chatLog.scrollTop = chatLog.scrollHeight;

  // Cycle Text
  const states = ["Analyzing...", "Searching...", "Getting Ready..."];
  let stateIndex = 0;
  const textCycler = setInterval(() => {
    if (stateIndex < states.length - 1) {
      stateIndex++;
      const textSpan = document.getElementById('loader-text');
      if(textSpan) textSpan.innerText = states[stateIndex];
    } else {
      clearInterval(textCycler);
    }
  }, 500);

  // --- LOGIC DELAY ---
  setTimeout(() => {
    clearInterval(textCycler);
    if(loaderDiv.parentNode) loaderDiv.remove();
    
    // 2. CHECK CONTEXT ("Next", "More")
    // We do this BEFORE searching. If user wants "Next", serve it immediately.
    const followUpWords = ["next", "more", "aage", "detail", "aur", "go on"];
    if (followUpWords.some(w => safeText.includes(w)) && lastContext) {
        if (Array.isArray(lastContext)) {
            const nextStep = lastContext.shift();
            addMessage(nextStep, 'bot-msg');
            if (lastContext.length === 0) lastContext = null;
        } else {
            addMessage(lastContext, 'bot-msg');
            lastContext = null;
        }
        return; 
    }

    // 3. FIND MATCH
    const match = findBestMatch(safeText);
    
    // 4. SELECT ANSWER
    let botHtml = Array.isArray(match.answer) 
      ? match.answer[Math.floor(Math.random() * match.answer.length)]
      : match.answer;
/*
    // 5. IMAGE LOGIC
    if (match.image) {
      botHtml += `<br><img src="${match.image}" class="chat-img">`;
    }
    else if (safeText.includes("show") || safeText.includes("photo")) {
      const keyword = safeText.replace(/show|me|a|image|photo/gi, "").trim();
      if(keyword.length > 2) {
         const dynamicUrl = `https://source.unsplash.com/featured/?${keyword},construction`;
         botHtml += `<br>Here is an idea for <strong>${keyword}</strong>:<br><img src="${dynamicUrl}" class="chat-img">`;
      }
    }
*/
    // ============================================================
    // 6. MEMORY PROTECTION (The Fix)
    // ============================================================
    
    // Check if the bot is confused (Fallback Intent)
    const isFallback = match.keywords.includes("default");

    // RULE: Only update memory if the user actually changed the topic successfully.
    // If they made a mistake (isFallback is true), we TOUCH NOTHING.
    if (!isFallback) {
        if (match.details) {
            // New valid topic with details -> Overwrite memory
            lastContext = Array.isArray(match.details) ? [...match.details] : match.details;
        } else {
            // New valid topic WITHOUT details (e.g. "Hello") -> Clear memory
            lastContext = null;
        }
    }
    // If isFallback is TRUE, the code skips the 'else' block above,
    // so 'lastContext' stays exactly as it was before the error.

    // ============================================================

    // 7. SHOW RESULT
    const msg = addMessage(botHtml, 'bot-msg');
    msg.style.animation = "fadeIn 0.5s ease";
      if (!isFallback) {
        
        // 1. Save for PDF (Prioritize Full Details)
        if (match.details && Array.isArray(match.details)) {
             // Join ALL steps with double newlines for the PDF
             lastTopicForPdf = match.details.join("\n\n");
        } else if (match.pdfContent) {
             lastTopicForPdf = match.pdfContent;
        } else {
             // Clean HTML tags for standard answer
             lastTopicForPdf = botHtml.replace(/<[^>]*>?/gm, '');
        }

        // 2. Save for "Next" Logic
        if (match.details) {
            // Clone the array so we don't destroy the original data
            lastContext = Array.isArray(match.details) ? [...match.details] : match.details;
        } else {
            lastContext = null;
        }
    }

  }, 2000); 

}
// Call this immediately!
loadChatHistory();
// Event Listeners
sendBtn.addEventListener('click', processMessage);
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') processMessage();
});
