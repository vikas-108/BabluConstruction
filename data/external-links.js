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