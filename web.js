const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const categoryFilter = document.getElementById("categoryFilter");
const stateFilter = document.getElementById("stateFilter");
const districtFilter = document.getElementById("districtFilter");
const states = [
  "Haryana",
  "Punjab",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Bihar",
  "Delhi",
  "Karanataka",
  "Tamil Nadu",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "chhattisgrah",
  "Assam",
  "Jharkhand",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Uttarakhand",
  "Goa",
  "Kerala",
  "Telagana",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
];
const districts = [
  "Panipat",
  "Sonipat",
  "Patiala",
  "Pune",
  "Chandigarh",
  "Jaipur",
  "Lucknow",
  "Patna",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Bhopal",
  "Raipur",
  "Dispur",
  "Ranchi",
  "Shimala",
  "Srinagar",
  "Dehradum",
  "Panaji",
  "Kurukshtra",
  "Ambala",
  "Ludhiana",
  "Surat",
  "Indore",
  "Jind",
  "Hisar",
  "Faridabad",
  "Gurugram",
  "Yamunanagar",
  "Karnal",
  "Jalgaon",
  "Nashik",
];
const SEARCH_STATE_KEY = "brg_search_state";
function saveSearchState() {
  const state = {
    query: input.value,
    category: categoryFilter?.value || "",
    state: stateFilter?.value || "",
    district: districtFilter?.value || "",
  };

  localStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(state));
}
function restoreSearchState() {
  const saved = localStorage.getItem(SEARCH_STATE_KEY);
  if (!saved) return;

  const state = JSON.parse(saved);

  if (state.query) input.value = state.query;
  if (categoryFilter && state.category) categoryFilter.value = state.category;
  if (stateFilter && state.state) stateFilter.value = state.state;
  if (districtFilter && state.district) districtFilter.value = state.district;

  // Trigger search after restoring
  setTimeout(() => {
    applySearch();
  }, 100);
}

function setupSearchableSelect(inputId, listId, data) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) {
    console.error("Missing input or list:", inputId, listId);
    return;
  }
  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";
    if (!value) {
      list.style.display = "none";
      return;
    }
    const filtered = data.filter((item) => item.toLowerCase().includes(value));

    if (!filtered.length) {
      list.style.display = "none";
      return;
    }

    filtered.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.onclick = () => {
        input.value = item;
        list.style.display = "none";
        if (typeof applySearch === "function") {
          applySearch();
        }
      };
      list.appendChild(li);
    });

    list.style.display = filtered.length ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-select")) {
      list.style.display = "none";
    }
  });
}
function speakText(text) {
  if (!window.speechSynthesis) {
    alert("Voice not supported on this device");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // good for Indian users
  utterance.rate = 0.7; // slower for kids
  utterance.pitch = 1.1; // friendly tone

  window.speechSynthesis.cancel(); // stop previous
  window.speechSynthesis.speak(utterance);
}

setupSearchableSelect("stateFilter", "stateList", states);
setupSearchableSelect("districtFilter", "districtList", districts);
function normalizeText(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .normalize("NFKD")                // ✅ mobile unicode fix
    .replace(/[\u0300-\u036f]/g, "")  // remove accents
    .replace(/\u00A0/g, " ")          // non-breaking space
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return Infinity;

  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

/* ---------------- SEARCH FUNCTIONS ---------------- */
function searchTheory(query) {
  return THEORY_DATA.filter((item) =>
    (item.question + " " + item.keywords).toLowerCase().includes(query),
  );
}
function searchDesigns(query) {
  return DESIGN_DATA.filter((d) =>
    (d.title + " " + d.keywords + " " + d.area_sqft + " " + d.area_gaz)
      .toLowerCase()
      .includes(query),
  );
}
function searchMedia(query) {
  return MEDIA_DATA.filter((item) =>
    (item.title + " " + item.keywords).toLowerCase().includes(query),
  );
}
function searchMathFormulas(query) {
  return MATH_FORMULAS.filter((f) =>
    (f.name + " " + f.formula + " " + f.keywords).toLowerCase().includes(query),
  );
}
function searchKids(query) {
  return KIDS_DATA.filter((item) => {
    const ql = query.toLowerCase();

    const textMatch = (
      item.title +
      " " +
      item.keywords +
      " " +
      (item.color || "") +
      " " +
      (item.taste || "") +
      " " +
      (item.season || "") +
      " " +
      (item.weather || "") +
      " " +
      (item.tags || []).join(" ")
    )
      .toLowerCase()
      .includes(ql);

    // number search → age group
    if (/^\d+$/.test(ql) && item.ageGroup) {
      return item.ageGroup.includes(Number(ql));
    }

    return textMatch;
  });
}
function searchQuiz(query) {
  const q = query.toLowerCase();

  // Filter results based on query
  const results = QUIZ_DATA.filter((item) => {
    const text = (
      (item.question || "") +
      " " +
      (item.keywords || "") +
      " " +
      (item.quizType || "") +
      " " +
      (item.category || "") +
      " " +
      (item.type || "")
    ).toLowerCase();

    return text.includes(q);
  });

  // Shuffle the filtered results before returning
  return shuffleArray(results);
}
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const SAD_EMOJIS = ["😢", "😞", "😔", "😭", "😕", "☹️"];
function checkQuizAnswer(button, selected, correct) {
  const card = button.closest(".quiz-card");
  const feedback = card.querySelector(".quiz-feedback");

  if (selected === correct) {
    feedback.innerHTML = `<span class="correct">108</span>`;
  } else {
    const emoji = SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)];
    feedback.innerHTML = `<span class="wrong">108 ${emoji}</span>`;
  }

  // Disable all buttons after one click
  card.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.disabled = true;
  });
}
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("quiz-option")) return;

  const button = e.target;
  const selected = button.dataset.answer;
  const correct = button.dataset.correct;

  checkQuizAnswer(button, selected, correct);
});
function showSearchLoader() {
  document.getElementById("searchLoader").classList.remove("hidden");
}

//function hideSearchLoader() {
//  document.getElementById("searchLoader").classList.add("hidden");
//}
function hideSearchLoader() {
  const loader = document.getElementById("searchLoader");
  if (!loader) return;
  loader.classList.add("hidden");
}

function openDesignModal(image, title, sqft, gaz, type) {
  document.getElementById("designModalImage").src = image;
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalArea").innerText =
    `Area: ${sqft} sq ft / ${gaz} gaz`;
  document.getElementById("modalType").innerText = `Type: ${type}`;

  const download = document.getElementById("modalDownload");
  download.href = image;

  document.getElementById("designModal").classList.add("show");
}
function openTheoryModal(image) {
  if (!image) return;
  document.getElementById("modalImage").src = image;
  document.getElementById("designTheoryModal").classList.add("show");
}
function openMediaModal(src, type) {
  const img = document.getElementById("mediaImage");
  const video = document.getElementById("mediaVideo");

  img.style.display = "none";
  video.style.display = "none";

  if (type === "image") {
    img.src = src;
    img.style.display = "block";
  } else {
    video.src = src;
    video.style.display = "block";
  }

  document.getElementById("mediaModal").classList.add("show");
}
function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalPhoto");

  img.src = src;
  modal.classList.add("show");
}

function closeDesignModal() {
  document.getElementById("designModal").classList.remove("show");
  document.getElementById("designTheoryModal").classList.remove("show");
  document.getElementById("mediaModal").classList.remove("show");
  document.getElementById("imageModal").classList.remove("show");
  document.getElementById("mediaVideo").pause();
}
function cleanPhone(phone) {
  return phone.replace(/[^0-9]/g, "");
}
function render(items) {
  results.innerHTML = "";
  if (!items.length) {
    results.innerHTML = "<p>No results found.</p>";
    return;
  }

  items.forEach((item) => {
    /* DESIGN RESULT */
    // DESIGN RESULT
    if (item.category === "design") {
      results.innerHTML += `
    <div class="card design-card">
      <img 
        src="${item.image}" 
        alt="${item.title}" 
        class="design-img"
        onclick="openDesignModal('${item.image}', '${item.title}', '${item.area_sqft}', '${item.area_gaz}', '${item.type}')"
      >

      <div class="design-info">
        <h3>${item.title}</h3>
        <p><strong>Area:</strong> ${item.area_sqft} sq ft / ${item.area_gaz} gaz</p>
        <p><strong>Type:</strong> ${item.type}</p>

        <a 
          href="${item.image}" 
          download 
          class="download-btn"
        >
          ⬇ Download Blueprint
        </a>
      </div>
    </div>
  `;
      return;
    }
    // quiz card
    if (item.type === "quiz") {
      results.innerHTML += `
    <div class="card quiz-card">
      <h3>${item.question}</h3>
<div class="quiz-voice">
        <button onclick="speakText('Question: ${item.question}')">🔊 Question</button>
        ${
          item.hint
            ? `<button onclick="speakText('Hint: ${item.hint}')">💡 Hint</button>`
            : ""
        }
      </div>
      <div class="quiz-options">
        ${item.options
          .map(
            (opt) => `
         <button class="quiz-option"
  data-answer="${opt}"
  data-correct="${item.correctAnswer}">
  ${opt}
</button>
        `,
          )
          .join("")}
      </div>

      <div class="quiz-feedback"></div>
    </div>
  `;
      return;
    }
    // 🧒 KIDS ALPHABET CARD
    if (item.category === "kids") {
      results.innerHTML += `
    <div class="card kids-card">
      <div class="kids-3d-box">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <h3>${item.title}</h3>
    </div>
  `;
      return;
    }

    // THEORY ANSWER
    // THEORY ANSWER
    if (item.answer) {
      results.innerHTML += `
    <div class="card">
      <div class="badge contractor">ANSWER</div>
      <h3>${item.question.toUpperCase()}</h3>

      ${
        item.image
          ? `
        <img 
          src="${item.image}" 
          class="design-img"
          onclick="openTheoryModal('${item.image}')"
        >
      `
          : ""
      }

      <div>${item.answer}</div>
    </div>
  `;
      return;
    }
    // MEDIA RESULT
    if (item.mediaType) {
      results.innerHTML += `
    <div class="card media-card">
      <h3>${item.title}</h3>

      ${
        item.mediaType === "image"
          ? `<img src="${item.src}" class="media-img" onclick="openMediaModal('${item.src}', 'image')">`
          : `<video controls class="media-video">
               <source src="${item.src}" type="video/mp4">
             </video>`
      }
    </div>
  `;
      return;
    }
    // MATH FORMULA RESULT
    if (item.category === "math") {
      results.innerHTML += `
    <div class="card math-card">
    <h4>${item.group}</h4>
      <h3>${item.name}</h3>

      <div class="formula-box">${item.formula}</div>

      <img
        src="${item.image}"
        alt="${item.name}"
        loading="lazy"
        class="formula-img"
        onclick="openImageModal('${item.image}')"
      >

      <p class="formula-desc">${item.explanation}</p>
    </div>
  `;
      return;
    }

   // CONTRACTOR / MATERIAL
    const phoneClean = item.phone ? cleanPhone(item.phone) : "";
    results.innerHTML += `
       <div class="card">
         ${
           item.image
             ? `
        <div class="card-header">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <p>${item.type}</p>
          </div>
         </div>`
             : ""
         }

        <div class="badge ${item.category}">
          ${item.category.toUpperCase()}
        </div>

        ${item.rating ? `<div class="rating">⭐ ${item.rating}</div>` : ""}

        <p>${item.state}, ${item.district}</p>
        ${
      item.phone
        ? `
        <div class="contact-actions">
          <a href="tel:${phoneClean}" class="btn call-btn">📞 Call</a>
          <a href="https://wa.me/${phoneClean}" target="_blank" class="btn whatsapp-btn">💬 WhatsApp</a>
        </div>
        `
        : ""
    }

    ${item.email ? `<p>✉️ ${item.email}</p>` : ""}

    <p>${item.description}</p>
  </div>
`;
  });
}
// debouncing function code to limit search frequency code.
function debounce(fn, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function applySearch() {
  showSearchLoader(); // 🔄 start loader
  setTimeout(() => {
    saveSearchState(); // 💾 SAVE BEFORE SEARCH
    const q = input.value.toLowerCase().trim();
    const category = categoryFilter.value.toLowerCase();
    const state = stateFilter.value.toLowerCase();
    const district = districtFilter.value.toLowerCase();
    if (!q && !category && !state && !district) {
      results.innerHTML =
        "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
      hideSearchLoader(); // ✅ IMPORTANT
      return;
    }

    // 🔹 SEARCH DATA (ONLY ONCE)
    /* const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (category === "" || item.category === category) &&
      (state === "" || item.state === state) &&
      (district === "" || item.district === district)
  );*/
    /*const dataResults = SEARCH_DATA.filter(item => {
    const textMatch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(q);

    const categoryMatch =
      !category || item.category?.toLowerCase() === category;

    const stateMatch =
      !state || item.state?.toLowerCase() === state;

    const districtMatch =
      !district || item.district?.toLowerCase().includes(district);

    return textMatch && categoryMatch && stateMatch && districtMatch;
  });*/
   const queryTokens = normalizeText(q)
  .split(" ")
  .filter(t => t.length >= 2);
const dataResults = shuffleArray(
  SEARCH_DATA.filter((item) => {
    // 1. Build searchable text from item
    const searchableText = normalizeText(
      [
        item.name,
        item.type,
        item.category,
        item.state,
        item.district,
        item.city,
        item.village,
        item.description,
      ]
        .filter(Boolean)
        .join(" ")
    );

    // 2. Token match (ALL tokens must match somewhere)
    const tokenMatch = queryTokens.every((token) => {
      if (searchableText.includes(token)) return true;

      // spelling tolerance (only for longer words)
      if (token.length >= 4) {
        return searchableText
          .split(" ")
          .some((word) => levenshtein(word, token) <= 2);
      }

      return false;
    });

    // 3. Existing filters (unchanged)
    const categoryMatch =
      !category || item.category?.toLowerCase() === category;

    const stateMatch =
      !state || item.state?.toLowerCase() === state;

    const districtMatch =
      !district || item.district?.toLowerCase().includes(district);

    return tokenMatch && categoryMatch && stateMatch && districtMatch;
  })
).slice(0, 50); // ✅ LIMIT RESULTS;


    // 🔹 OTHER DATA SOURCES
    const theoryResults = q ? searchTheory(q) : [];
    const designResults = q ? searchDesigns(q) : [];
    const mediaResults = q ? searchMedia(q) : [];
    const mathResults = q ? searchMathFormulas(q) : [];
    const kidsResults = q ? searchKids(q) : [];
    const QuizResults = q ? searchQuiz(q) : [];
    // 🔹 MERGE WITHOUT DUPLICATES
    render([
      ...theoryResults,
      ...designResults,
      ...mediaResults,
      ...dataResults,
      ...mathResults,
      ...kidsResults,
      ...QuizResults,
    ]);
    hideSearchLoader(); // ✅ STOP LOADER AFTER RENDER
  }, 300); // UX delay so loader is visible
}

/* ---------------- EVENTS ---------------- */
const debouncedSearch = debounce(applySearch, 800);

let isComposing = false;

input.addEventListener("compositionstart", () => {
  isComposing = true;
});
input.addEventListener("compositionend", () => {
  isComposing = false;
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isComposing) {
    e.preventDefault();        // stop form submit / keyboard close
    debouncedSearch.cancel?.(); // safety
    applySearch();             // ✅ ONLY trigger
  }
});



// Filters: still update instantly
[categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("input", debounce(applySearch, 800));
});

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
/**
 const debouncedSearch = debounce(applySearch, 800);

[input, categoryFilter, stateFilter, districtFilter].forEach((el) =>
  el.addEventListener("input", debouncedSearch)
);

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

 */
/// 🎤 VOICE SEARCH
const voiceBtn = document.getElementById("voiceBtn");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  voiceBtn.onclick = () => {
    recognition.start();
  };

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    applySearch();
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.innerText = "❌";
}

const filterToggle = document.getElementById("filterToggle");
const filterBox = document.getElementById("filterBox");

filterToggle.addEventListener("click", () => {
  filterBox.classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", restoreSearchState);
