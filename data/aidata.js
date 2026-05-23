// ==========================================
// PART 1: THE BRAIN (DATA)
// ==========================================
const constructionHQ = [
  {
    keywords: ["cost", "price", "rate", "sqft", "expensive", "cheap", "budget", "quote", "estimate", "money"],
    questions: ["how much", "what is the price"],
    answer: "<strong>Residential:</strong> Custom builds start at <strong>$150-$200/sqft</strong>. Commercial projects require a site visit."
  },
  {
    keywords: ["time", "long", "duration", "schedule", "when", "finish", "deadline", "date"],
    questions: ["how long", "when will it be done"],
    answer: "<strong>New Homes:</strong> 8-12 months. <br><strong>Kitchens:</strong> 4-8 weeks. <br><strong>Commercial:</strong> 3-6 months."
  },
  {
    keywords: ["service", "kitchen", "bath", "room", "garage", "addition", "remodel"],
    questions: ["what do you do", "can you build"],
    answer: "We specialize in <strong>Custom Homes</strong>, <strong>Kitchen Remodels</strong>, and <strong>Commercial Fit-outs</strong>."
  },
  {
    keywords: ["permit", "license", "legal", "insurance", "insured", "city", "code"],
    questions: ["are you licensed", "do i need a permit"],
    answer: "<strong>We handle it all.</strong> We are Class A Licensed & Insured ($2M Liability). We manage all city permits."
  },
  /*{
    keywords: ["contact", "call", "email", "phone", "address", "office"],
    questions: ["how to contact", "where are you"],
    answer: "Call us at <strong>(555) 123-4567</strong> or visit our office in Karnal, Haryana."
  },*/
  {
    // Fallback Intent
    keywords: ["default"],
    answer: "I didn't quite catch that. Try asking about <strong>Prices</strong>, <strong>Timelines</strong>, or <strong>Permits</strong>."
  },
  {
    keywords:["hello", "hey", "good morning", "hi", "greetings", "welcome", ],
    questions: ["hello", "hi", "hey", "good morning", "greetings", "welcome", ],
    answer: "Hello! I'm your Construction Assistant. Ask me about <strong>costs</strong>, <strong>timelines</strong>, or <strong>permits</strong> to get started!"
  },
  {
    keywords:["thank", "thanks", "appreciate", "grateful", "awesome", "helpful"],
    questions: ["thank you", "thanks", "appreciate it", "grateful", "awesome", "helpful"],
    answer: "You're welcome! If you have more questions, just ask. I'm here to help with all your construction needs!"
  },
  {
    keywords:["how are you", "what's up", "how's it going", "how do you do", "how are you doing"],
    questions: ["how are you", "what's up", "how's it going", "how do you do", "how are you doing"],
    answer: "I'm just a bunch of code, but I'm here to assist you! How can I help with your construction project today?"
  },
  {
    keywords:["bye", "goodbye", "see you", "farewell", "take care"],
    questions: ["bye", "goodbye", "see you", "farewell", "take care"],
    answer: "Goodbye! If you have more construction questions in the future, just come back and ask. Take care!"
  },
  {
    keywords:["code", "python", "java", "javascript", "c++", "ruby", "php", "swift", "go", "rust"],
    questions: ["what is code", "what is programming", "what is software", "what is a language"],
    answer: "Code is a set of instructions that computers follow to perform tasks. It's the language we use to create software, websites, and apps!"
  },
  {
    keywords:["ai", "artificial intelligence", "machine learning", "deep learning", "neural networks"],
    questions: ["what is ai", "what is artificial intelligence", "what is machine learning", "what is deep learning", "what are neural networks"],
    answer: "AI, or Artificial Intelligence, refers to machines that can perform tasks that typically require human intelligence, like understanding language, recognizing images, and making decisions."
  },
  {
    keywords:["construction", "building", "remodeling", "contractor", "architect"],
    questions: ["what is construction", "what is building", "what is a contractor", "what is an architect"],
    answer: "Construction is the process of building or assembling infrastructure. It involves various professionals like contractors, architects, and engineers working together to create structures."
  },
  {
    keywords:["beam"],
    questions: ["what is a beam" ],
    answer: "A beam is a horizontal structural element that supports loads. It is designed to resist bending and is commonly used in floors, roofs, and bridges to transfer weight to columns or walls."
  },
  {
    keywords:["column", "pillar"],
    questions:["what is a column", "what is pillar"],
    answer: "A column is a vertical structural element that primarily carries compressive loads. It transfers the weight of the structure above it down to the foundation."
  },
  {
    keywords:["footing"],
    questions:["what is a footing"],
    answer: "A footing is the part of a building's foundation that is in direct contact with the ground. It distributes the weight of the structure to prevent settling and provide stability."
  },
  {
    keywords:["foundation", "basement"],
    questions:["what is a foundation", "what is a basement"],
    answer: "A foundation is the lowest part of a building that provides support and stability. It transfers the load of the structure to the ground and prevents settling or shifting."
  },
  {
    keywords:["slab", "lantr"],
    questions:["what is a slab"],
    answer: "A slab is a flat, horizontal surface made of concrete that serves as the floor or roof of a building. It provides structural support and can be reinforced with steel for added strength."
  },
  {
    keywords:["steel rod"],
    questions:["what is the size of a steel rod according different size of plot"],
    answer: "The size of a steel rod, also known as rebar, depends on the load it needs to support and the size of the plot. Common sizes include #3 (3/8 inch), #4 (1/2 inch), #5 (5/8 inch), and #6 (3/4 inch). The appropriate size is determined by structural engineers based on the specific requirements of the construction project."
  },
  {
    keywords:["load-bearing"],
    questions: ["what is a load-bearing wall"],
    answer: "A load-bearing wall supports the weight of the structure above it, while a non-load-bearing wall does not. Load-bearing walls are crucial for the stability of a building and cannot be removed without proper support, while non-load-bearing walls can be modified or removed without affecting the structural integrity."
  },
  {
    keywords:["ratio"],
    questions:["what is the ratio of cement, sand and aggregate in construction"],
    answer: "The typical ratio of cement, sand, and aggregate in construction is 1:2:4. This means for every 1 part of cement, you would use 2 parts of sand and 4 parts of aggregate. However, this ratio can vary based on the specific requirements of the project and the desired strength of the concrete."
  },
  {
    keywords:["masonry"],
    questions:["what is masonry"],
    answer: "Masonry is a construction technique that involves building structures from individual units, such as bricks, stones, or concrete blocks, which are often bound together with mortar. It is known for its durability and aesthetic appeal and is commonly used in walls, facades, and other architectural elements."
  },
  {
    keywords:["drywall", "gypsum board"],
    questions:["what is drywall"],
    answer: "Drywall, also known as gypsum board, is a construction material used to create interior walls and ceilings. It consists of a layer of gypsum sandwiched between two sheets of paper. Drywall is easy to install and finish, making it a popular choice for residential and commercial construction."
  },
  {
    keywords:["insulation"],
    questions:["what is insulation"],
    answer: "Insulation is a material used in construction to reduce heat transfer and improve energy efficiency. It helps keep buildings warm in the winter and cool in the summer by preventing the flow of heat through walls, roofs, and floors. Common types of insulation include fiberglass, foam board, and spray foam."
  },
  // carpentry
  {
    keywords:["carpentry", "woodwork", "joinery"],
    questions:["what is carpentry"],
    answer: "Carpentry is the skilled trade of working with wood to construct, install, and maintain buildings and structures. Carpenters create frameworks, install doors and windows, build cabinets, and perform various tasks that involve cutting, shaping, and joining wood materials."
  },
  
];

// ==========================================
// PART 2: THE LOGIC (MATH)
// ==========================================

// A. Levenshtein Distance (The "Spell Checker")
// Returns the number of edits needed to turn word A into word B
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
    
    // 1. Check Keywords
    userWords.forEach(uWord => {
      if(uWord.length < 3) return; // Ignore tiny words
      
      topic.keywords.forEach(key => {
        const dist = getLevenshteinDistance(uWord, key);
        
        if (dist === 0) { 
          currentScore += 10; // Perfect match
        } else if (dist <= 2 && key.length > 4) { 
          currentScore += 5; // Typo match (e.g., "kichen" -> "kitchen")
        }
      });
    });

    // 2. Check Questions (Bonus points for exact phrases)
    if(topic.questions) {
      topic.questions.forEach(q => {
        if(userText.toLowerCase().includes(q)) currentScore += 15;
      });
    }

    // Winner Logic
    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = topic;
    }
  });

  // If score is too low (< 5), return default
  return (highestScore >= 5) ? bestMatch : constructionHQ.find(q => q.keywords.includes("default"));
}

// ==========================================
// PART 3: THE UI (INTERACTION)
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
});

closeBtn.addEventListener('click', () => widget.style.display = 'none');

// Helper: Add Message to Log
function addMessage(html, className) {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = `<span>${html}</span>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

// AI Animation Engine
function showThinkingAndReply(answerHtml) {
  // 1. Show "Thinking..." Bubble
  const thinkingBubble = addMessage("Analyzng...", "bot-msg thinking");
  thinkingBubble.style.opacity = "0.7";
  
  // 2. Delay (Simulate AI processing)
  setTimeout(() => {
    thinkingBubble.remove(); // Remove thinking bubble
    
    // 3. Show Real Answer with Fade-in
    const msgDiv = addMessage(answerHtml, "bot-msg");
    msgDiv.style.animation = "fadeIn 0.5s ease";
    
  }, 800); // 800ms delay
}

// Main Process
function processMessage() {
  const text = inputField.value.trim();
  if (!text) return;

  // 1. User Message
  addMessage(text, 'user-msg');
  inputField.value = '';

  // 2. Find Answer (Using Fuzzy Logic)
  const result = findBestMatch(text);

  // 3. Bot Reply
  showThinkingAndReply(result.answer);
}

// Event Listeners
sendBtn.addEventListener('click', processMessage);
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') processMessage();
});

