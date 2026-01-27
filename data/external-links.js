/**const EXTERNAL_LINKS = [
  {
    title: "IS Code for Concrete (IS 456)",
    description: "Official Indian Standard code for plain and reinforced concrete",
    url: "https://bis.gov.in",
    keywords: "is code concrete is456 rcc standard"
  },
  {
    title: "Cement Price Today in India",
    description: "Latest cement prices by brand and location",
    url: "https://www.indiamart.com",
    keywords: "cement price today cement cost"
  },
  {
    title: "Architect House Design Ideas",
    description: "Modern house plans and architectural inspirations",
    url: "https://www.archdaily.com",
    keywords: "architect design ideas house plan"
  },
  {
    title: "Soil Testing Methods",
    description: "Soil testing procedures used in construction",
    url: "https://www.civillearning.com",
    keywords: "soil testing foundation geotechnical"
  }
];
function searchExternalLinks(query) {
  return EXTERNAL_LINKS.filter((link) =>
    (link.title + " " + link.keywords).toLowerCase().includes(query)
  );
}
function isValidURL(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
    // EXTERNAL LINK RESULT
// ✅ If user pasted a URL
let rawInput = input.value.trim();

if (rawInput.startsWith("www.")) {
  rawInput = "https://" + rawInput;
}
if (isValidURL(input.value.trim())) {
  results.innerHTML = `
    <div class="card">
      <div class="badge material">EXTERNAL WEBSITE</div>
      <h3>Open External Website</h3>
      <p>${input.value}</p>
      <a href="${input.value}" target="_blank" rel="noopener noreferrer">
        🔗 Open Link
      </a>
    </div>
  `;
  saveSearch(input.value.trim());
  return;
}
// in applysearch function after filtering dataresult 
 const theoryResults = q ? searchTheory(q) : [];
  const designResults = q ? searchDesigns(q) : [];
  const externalResults = q ? searchExternalLinks(q) : [];
  render([
    ...filtered,
    ...theoryResults,
    ...designResults,
    ...dataResults,
    ...externalResults,
  ]);
}  
  // css code 
  .card a {
  display: inline-block;
  margin-top: 10px;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
}
.card a:hover {
  text-decoration: underline;
} **/

// this is code of search function which is deleted recently
  /**function applySearch() {
  const q = input.value.toLowerCase().trim();

  if (
    !q &&
    !categoryFilter.value &&
    !stateFilter.value &&
    !districtFilter.value
  ) {
    results.innerHTML =
      "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
    return;
  }
  const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (categoryFilter.value === "" || item.category === categoryFilter.value) &&
      (stateFilter.value === "" || item.state === stateFilter.value) &&
      (districtFilter.value === "" || item.district === districtFilter.value)
  );

  const filtered = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (categoryFilter.value === "" || item.category === categoryFilter.value) &&
      (stateFilter.value === "" ||
        item.state === stateFilter.value.toLowerCase()) &&
      (districtFilter.value === "" ||
        item.district === districtFilter.value.toLowerCase())
  );
  const theoryResults = q ? searchTheory(q) : [];
  const designResults = q ? searchDesigns(q) : [];
  const mediaResults = q ? searchMedia(q) : [];
  render([
    ...filtered,
    ...theoryResults,
    ...designResults,
    ...dataResults,
    ...mediaResults,
  ]);
} */










  // 🔹 SEARCH DATA (ONLY ONCE)
 /**  const dataResults = SEARCH_DATA.filter(
    (item) =>
      Object.values(item).join(" ").toLowerCase().includes(q) &&
      (category === "" || item.category === category) &&
      (state === "" || item.state === state) &&
      (district === "" || item.district === district)
  );
  */
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


//this is also delete recently

  /**
   * // previous code: instant search on input
   * const debouncedSearch = debounce(applySearch, 800);

[input, categoryFilter, stateFilter, districtFilter].forEach((el) =>
  el.addEventListener("input", debouncedSearch)
);

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

  
 * // Main search input: only on Enter
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    applySearch();
  }
});

// Filters: still update instantly
[categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("input", debounce(applySearch, 800));
});
// another way is to use a single debounced function for all inputs
// Instead of listening to "input", listen to "keydown"
[input, categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      applySearch(); // run your search only when Enter is pressed
    }
  });
});

// Initial message
results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Press Enter after typing to see results.</p>";
 */
// clear search buttton code delete recently
  /**<button id="clearSearchBtn" class="clear-search-btn">
  ✖ Clear
</button>
// css
.clear-search-btn {
  margin-left: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font-size: 14px;
}
// js
function clearSearch() {
  // 1️⃣ Clear inputs
  input.value = "";

  if (categoryFilter) categoryFilter.value = "";
  if (stateFilter) stateFilter.value = "";
  if (districtFilter) districtFilter.value = "";

  // 2️⃣ Remove saved search state
  localStorage.removeItem(SEARCH_STATE_KEY);

  // 3️⃣ Reset results UI
  results.innerHTML = `
    <p style="text-align:center;color:#64748b;">
      Start typing or use voice search to see results.
    </p>
  `;

  // 4️⃣ Hide loader if visible
  hideSearchLoader();
}
//CONNECT BUTTON TO LOGIC
document
  .getElementById("clearSearchBtn")
  .addEventListener("click", clearSearch);
 */
/**
 * // english-hindi toggle buttons
document.addEventListener('DOMContentLoaded', function () {
  var btnEn = document.getElementById('btn-en');
  var btnHi = document.getElementById('btn-hi');

  // Page does not have language toggle → exit safely
  if (!btnEn || !btnHi) return;

  btnEn.addEventListener('click', function () {
    toggleLang('en');
  });

  btnHi.addEventListener('click', function () {
    toggleLang('hi');
  });
});

function toggleLang(lang) {
  var en = document.getElementById('policy-en');
  var hi = document.getElementById('policy-hi');

  var btnEn = document.getElementById('btn-en');
  var btnHi = document.getElementById('btn-hi');

  // 🔒 HARD GUARD — prevents crashes on other pages
  if (!en || !hi || !btnEn || !btnHi) return;

  if (lang === 'en') {
    en.style.display = 'block';
    hi.style.display = 'none';
    btnEn.classList.add('active');
    btnHi.classList.remove('active');
  } else {
    hi.style.display = 'block';
    en.style.display = 'none';
    btnHi.classList.add('active');
    btnEn.classList.remove('active');
  }
}

 */
// quiz total , attempted, correct and wrong detail logic .
// <div id="quizSummary" class="quiz-summary hidden"></div> 
//let currentQuizResults = [];
//const QUIZ_STATE_KEY = "brg_quiz_state";
// quiz functions attampted, correct , wrong functions
/*function getQuizState() {
  return JSON.parse(localStorage.getItem(QUIZ_STATE_KEY)) || {
    score: 0,
    attempted: {}
  };
}
function calculateQuizStats(quizResults) {
  const state = getQuizState();
  const attemptedIds = state.attempted || {};

  let attempted = 0;
  let correct = 0;
  let wrong = 0;

  quizResults.forEach(q => {
    if (attemptedIds[q.id]) {
      attempted++;
      attemptedIds[q.id].correct ? correct++ : wrong++;
    }
  });

  return {
    total: quizResults.length,
    attempted,
    correct,
    wrong
  };
}
function renderQuizSummary(quizResults) {
  const summaryBox = document.getElementById("quizSummary");

  if (!quizResults.length) {
    summaryBox.classList.add("hidden");
    return;
  }

  const stats = calculateQuizStats(quizResults);

  summaryBox.innerHTML = `
    <span>🧠 Total Quiz: <strong>${stats.total}</strong></span>
    <span>✅ Attempted: <strong>${stats.attempted}</strong></span>
    <span class="correct">🟢 Correct: <strong>${stats.correct}</strong></span>
    <span class="wrong">🔴 Wrong: <strong>${stats.wrong}</strong></span>
  `;

  summaryBox.classList.remove("hidden");
}
function saveQuizAttempt(quizId, selected, correct) {
  const state = getQuizState();

  state.attempted[quizId] = { selected, correct };

  if (correct) state.score += 108;

  localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
}

document.addEventListener("click", function (e) {
  const btn = e.target.closest(".quiz-option");
  if (!btn) return;

    const card = btn.closest(".quiz-card");
  const quizId = card.dataset.quizId;

  if (!quizId) {
    console.error("Quiz ID missing");
    return;
  }
  const selected = btn.dataset.answer;
  const correctAnswer = btn.dataset.correct;

  const isCorrect = selected === correctAnswer;

  // 🔒 prevent double attempt
  const saved = getQuizState();
  if (saved.attempted[quizId]) return;

  // 🎯 show feedback
  const feedback = card.querySelector(".quiz-feedback");

  if (isCorrect) {
    feedback.innerHTML = `<span class="correct">108</span>`;
  } else {
    const emoji = SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)];
    feedback.innerHTML = `<span class="wrong">108 ${emoji}</span>`;
  }

  // 🔕 disable all options
  card.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);

  // 💾 SAVE ATTEMPT
  saveQuizAttempt(quizId, selected, isCorrect);

  // 🔄 UPDATE SCORE UI
  document.getElementById("scoreValue").innerText =
    getQuizState().score;

  // 🔄 UPDATE SUMMARY (THIS WAS MISSING)
  if (currentQuizResults.length) {
    renderQuizSummary(currentQuizResults);
  }
}); */


    // kidsQuizResults already filtered + shuffled
/*currentQuizResults = QuizResults;
renderQuizSummary(currentQuizResults);
if (currentQuizResults.length) {
  renderQuizSummary(currentQuizResults);
}*/
/*.quiz-summary {
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 14px;
  font-weight: 600;
}

.quiz-summary span {
  white-space: nowrap;
}

.quiz-summary .correct {
  color: green;
}

.quiz-summary .wrong {
  color: red;
}

.hidden {
  display: none;
}
*/