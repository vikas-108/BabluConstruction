"use strict";

/* =========================================================
   API
========================================================= */

const PROFILE_API_BASE_URL =
  window.PROFILE_API_BASE_URL ||
  window.PROFILE_API ||
  "https://api.buildskil.com/api/profiles/public";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   EXACT CATEGORY DATA FROM OLD WORKING SCREEN
========================================================= */

const categories = {
  contractor: [
    "Plumbing",
    "Electrician",
    "Carpentry",
    "Masonry",
    "Painter",
    "BlackSmith",
    "Lohaar",
    "Roofing",
    "Flooring",
    "HVAC",
    "Landscaping",
    "Demolition",
    "Structural",
    "Marble & Tiles",
    "POP",
    "Glass",
  ],

  technician: [
    "Electrical Technician",
    "Plumbing Technician",
    "HVAC Technician",
    "Carpentry Technician",
    "Raj Mistry",
    "Lohaar",
    "BlackSmith",
    "Marble",
    "Painter",
    "POP",
    "weilding",
    "Glass",
    "Structural",
    "Renovation",
    "Solar Technician",
    "Demolition Technician",
  ],

  supplier: [
    "Cement Supplier",
    "Steel Supplier",
    "Sand Supplier",
    "Equipment Supplier",
    "Tiles Supplier",
    "Shuttering Supplier",
    "Bricks Supplier",
    "Paint Supplier",
    "Wood Supplier",
  ],

  architecture: [
    "Interior",
    "Exterior ",
    "Exterior & Interior",
    "Landscape Architecture",
    "Urban Architecture",
    "Naval Architecture",
    "Sustainable Architecture",
  ],

  mechanic: [
    "General Car Mechanic",
    "Engine Specialist",
    "Transmission Mechanic",
    "Brake Specialist",
    "Tyre/Wheel Mechanic",
    "Auto Electrician",
    "AC Mechanic",
    "Motorcycle Mechanic",
    "Diesel Mechanic",
    "Heavy Equipment Mechanic",
    "Marine Mechanic",
    "Aircraft Mechanic",
    "Industrial Mechanic",
  ],
};


/* =========================================================
   EXACT CATEGORY LABELS
========================================================= */

const categoryLabels = {
  contractor: "Contractor",
  technician: "Technician",
  supplier: "Supplier",
  architecture: "Architecture",
  mechanic: "Mechanic",
};


/* =========================================================
   DOM
========================================================= */

const backBtn =
  document.getElementById("backBtn");

const filterBtn =
  document.getElementById("filterBtn");

const filterDot =
  document.getElementById("filterDot");

const errorBanner =
  document.getElementById("errorBanner");

const errorBannerText =
  document.getElementById("errorBannerText");

const errorBannerClose =
  document.getElementById("errorBannerClose");

const activeFilters =
  document.getElementById("activeFilters");

const aiState =
  document.getElementById("aiState");

const aiStatusText =
  document.getElementById("aiStatusText");

const emptyState =
  document.getElementById("emptyState");

const idleState =
  document.getElementById("idleState");

const resultsMeta =
  document.getElementById("resultsMeta");

const resultCount =
  document.getElementById("resultCount");

const cardsGrid =
  document.getElementById("cardsGrid");

const pagination =
  document.getElementById("pagination");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const pageIndicator =
  document.getElementById("pageIndicator");

const searchInput =
  document.getElementById("searchInput");

const clearSearchBtn =
  document.getElementById("clearSearchBtn");

const filterBackdrop =
  document.getElementById("filterBackdrop");

const filterSheet =
  document.getElementById("filterSheet");

const filterCloseBtn =
  document.getElementById("filterCloseBtn");

const fCategory =
  document.getElementById("f-category");

const fRole =
  document.getElementById("f-role");

const roleField =
  document.getElementById("roleField");

const fAddress =
  document.getElementById("f-address");

const fPhone =
  document.getElementById("f-phone");

const fState =
  document.getElementById("f-state");

const fDistrict =
  document.getElementById("f-district");

const clearFiltersBtn =
  document.getElementById("clearFiltersBtn");

const applyFiltersBtn =
  document.getElementById("applyFiltersBtn");


/* =========================================================
   STATE / DISTRICTS
   Keep the same state names from your existing system.
========================================================= */

const states = [
  "Haryana",
  "Punjab",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Bihar",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "Chhattisgrah",
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
  "Lakshadweep",
  "Puducherry",
  "Ladakh",
  "Andaman & Nicobar",
  "Dadra & Nagar Haveli and Daman & Diu",
];

const districts = {
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],

  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Mansa",
    "Moga",
    "Mohali",
    "Muktsar",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Shaheed Bhagat Singh Nagar",
    "Tarn Taran",
  ],

  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],

  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],

  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayanagara",
    "Vijayapura",
    "Yadgir",
  ],

  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],

  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],

  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Anupgarh",
    "Balotra",
    "Banswara",
    "Baran",
    "Barmer",
    "Beawar",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Deeg",
    "Dholpur",
    "Didwana-Kuchaman",
    "Dungarpur",
    "Gangapur City",
    "Hanumangarh",
    "Jaipur",
    "Jaipur Rural",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Jodhpur Rural",
    "Karauli",
    "Kekri",
    "Khairthal-Tijara",
    "Kota",
    "Kotputli-Behror",
    "Nagaur",
    "Neem Ka Thana",
    "Pali",
    "Phalodi",
    "Pratapgarh",
    "Rajsamand",
    "Salumbar",
    "Sanchore",
    "Sawai Madhopur",
    "Shahpura",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],

  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Maihar",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Niwari",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],

  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharth Nagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],

  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],

  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
  ],

  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],
};


/* =========================================================
   FILTER STATE
========================================================= */

let filters = {
  search: "",
  category: "",
  role: "",
  address: "",
  phone: "",
  state: "",
  district: "",
};

let page = 1;
let totalPages = 1;
let total = 0;
let requestSeq = 0;

const PAGE_SIZE = 20;

const AI_MESSAGES = [
  "Understanding your search…",
  "Matching categories & roles…",
  "Searching profiles…",
  "Ranking best matches…",
];

const AI_MIN_DURATION = 1400;


/* =========================================================
   HELPERS
========================================================= */

function escapeRegex(value) {
  return String(value || "").replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}

function hideError() {
  errorBanner.classList.add("hidden");
}

function setUiState(state) {

  idleState.classList.toggle(
    "hidden",
    state !== "idle"
  );

  aiState.classList.toggle(
    "hidden",
    state !== "ai"
  );

  emptyState.classList.toggle(
    "hidden",
    state !== "empty"
  );

  resultsMeta.classList.toggle(
    "hidden",
    state !== "results"
  );

  pagination.classList.toggle(
    "hidden",
    state !== "results"
  );

  if (state !== "results") {
    cardsGrid.innerHTML = "";
  }
}

function categoryMeta(key) {
  return Object.prototype.hasOwnProperty.call(
    categoryLabels,
    key
  )
    ? {
        key,
        label: categoryLabels[key],
      }
    : null;
}

function normalizeFilterText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeRoleValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}


/* =========================================================
   CATEGORY DROPDOWN
   EXACT SAME ROLE VALUE FORMAT AS OLD SCREEN
========================================================= */

function populateCategories() {

  fCategory.innerHTML =
    `<option value="">All categories</option>`;

  Object.keys(categories).forEach((key) => {

    const option =
      document.createElement("option");

    option.value = key;

    option.textContent =
      categoryLabels[key] || key;

    fCategory.appendChild(option);
  });
}

function populateRoles() {

  const category = fCategory.value;

  fRole.innerHTML =
    `<option value="">All roles</option>`;

  if (
    !category ||
    !categories[category]
  ) {
    roleField.style.display = "none";
    return;
  }

  categories[category].forEach((role) => {

    const option =
      document.createElement("option");

    // EXACT VALUE USED BY OLD WORKING SCREEN
    option.value =
      role
        .toLowerCase()
        .replace(/\s+/g, "-");

    option.textContent = role;

    fRole.appendChild(option);
  });

  roleField.style.display = "";
}


/* =========================================================
   STATE / DISTRICT
========================================================= */

function populateStates() {

  fState.innerHTML =
    `<option value="">All states</option>`;

  states.forEach((state) => {

    const option =
      document.createElement("option");

    option.value = state;
    option.textContent = state;

    fState.appendChild(option);
  });
}

function populateDistricts() {

  const selectedState = fState.value;

  fDistrict.innerHTML =
    `<option value="">${
      selectedState
        ? "All districts"
        : "Select a state first"
    }</option>`;

  if (!selectedState) {
    fDistrict.disabled = true;
    return;
  }

  const list =
    districts[selectedState] || [];

  list.forEach((district) => {

    const option =
      document.createElement("option");

    option.value = district;
    option.textContent = district;

    fDistrict.appendChild(option);
  });

  fDistrict.disabled = false;
}


/* =========================================================
   API RESPONSE
========================================================= */

function normalizeResponse(json) {

  if (Array.isArray(json)) {

    return {
      data: json,
      total: json.length,
      totalPages: 1,
    };
  }

  const data =
    json?.data ||
    json?.results ||
    [];

  const responseTotal =
    json?.total ??
    data.length;

  return {
    data,
    total: responseTotal,
    totalPages:
      json?.totalPages ||
      Math.max(
        1,
        Math.ceil(
          responseTotal /
            PAGE_SIZE
        )
      ),
  };
}


/* =========================================================
   API SEARCH
========================================================= */

async function fetchProfiles(pageNum) {

  const params =
    new URLSearchParams();

  /*
   * IMPORTANT:
   * Old backend uses q, not search.
   */
  if (filters.search) {
    params.set(
      "q",
      filters.search
    );
  }

  if (filters.category) {
    params.set(
      "category",
      filters.category
    );
  }

  /*
   * fRole contains:
   *
   * shuttering-supplier
   *
   * because this is exactly how the
   * old working screen creates values.
   */
  if (filters.role) {

    params.set(
      "role",
      filters.role
    );
  }

  if (filters.address) {
    params.set(
      "address",
      filters.address
    );
  }

  if (filters.phone) {
    params.set(
      "phone",
      filters.phone
    );
  }

  if (filters.state) {
    params.set(
      "state",
      filters.state
    );
  }

  if (filters.district) {
    params.set(
      "district",
      filters.district
    );
  }

  params.set(
    "page",
    pageNum
  );

  params.set(
    "limit",
    PAGE_SIZE
  );

  const url =
    `${PROFILE_API_BASE_URL}?${params.toString()}`;

  const res =
    await fetch(url);

  let json = null;

  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {

    throw new Error(
      json?.message ||
      `Request failed (${res.status})`
    );
  }

  return normalizeResponse(json);
}


/* =========================================================
   PROFILE NORMALIZATION
========================================================= */

function normalizeProfile(profile) {

  return {
    id:
      profile?._id,

    profileUrl:
      `/profile-details.html?id=${profile?._id}`,

    name:
      profile?.name || "",

    role:
      profile?.role || "",

    rating:
      profile?.rating,

    experience:
      profile?.experience,

    teamSize:
      profile?.teamSize,

    skills:
      Array.isArray(profile?.skills)
        ? profile.skills
        : [],

    category:
      profile?.category || "",

    image:
      profile?.mediaType === "image"
        ? profile.media
        : "",

    video:
      profile?.mediaType === "video"
        ? profile.media
        : "",

    languages:
      Array.isArray(profile?.languages)
        ? profile.languages
        : [],

    phone:
      profile?.phone || "",

    description:
      profile?.description || "",

    location:
      profile?.location || "",

    state:
      profile?.state || "",

    district:
      profile?.district || "",
  };
}


/* =========================================================
   CLIENT SIDE FILTER
   Uses the exact normalized role values.
========================================================= */

function matchesActiveFilters(
  profile,
  activeFilters
) {

  if (activeFilters.search) {

    const q =
      normalizeFilterText(
        activeFilters.search
      );

    const text =
      [
        profile.name,
        profile.role,
        profile.category,
        profile.description,
        profile.location,
        profile.state,
        profile.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (!text.includes(q)) {
      return false;
    }
  }


  if (
    activeFilters.category &&
    normalizeFilterText(
      profile.category
    ) !==
    normalizeFilterText(
      activeFilters.category
    )
  ) {
    return false;
  }


  if (activeFilters.role) {

    const wantedRole =
      normalizeRoleValue(
        activeFilters.role
      );

    const actualRole =
      normalizeRoleValue(
        profile.role
      );

    if (
      actualRole !==
      wantedRole
    ) {
      return false;
    }
  }


  if (activeFilters.address) {

    const wanted =
      normalizeFilterText(
        activeFilters.address
      );

    const actual =
      [
        profile.location,
        profile.district,
        profile.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (!actual.includes(wanted)) {
      return false;
    }
  }


  if (activeFilters.phone) {

    const wanted =
      activeFilters.phone
        .replace(/\D/g, "");

    const actual =
      String(profile.phone || "")
        .replace(/\D/g, "");

    if (
      wanted &&
      !actual.includes(wanted)
    ) {
      return false;
    }
  }


  if (
    activeFilters.state &&
    normalizeFilterText(
      profile.state
    ) !==
    normalizeFilterText(
      activeFilters.state
    )
  ) {
    return false;
  }


  if (
    activeFilters.district &&
    normalizeFilterText(
      profile.district
    ) !==
    normalizeFilterText(
      activeFilters.district
    )
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   RANKING
========================================================= */

const SCORE_WEIGHTS = {
  experience: 0.30,
  rating: 0.25,
  teamSize: 0.15,
  skills: 0.15,
  languages: 0.10,
};

const SCORE_CAPS = {
  experience: 20,
  rating: 5,
  teamSize: 50,
  skills: 8,
  languages: 4,
};

function computeMatchScore(
  profile,
  activeFilters
) {

  const experienceScore =
    Math.min(
      Number(profile.experience) || 0,
      SCORE_CAPS.experience
    ) /
    SCORE_CAPS.experience;

  const ratingScore =
    Math.min(
      Number(profile.rating) || 0,
      SCORE_CAPS.rating
    ) /
    SCORE_CAPS.rating;

  const teamScore =
    Math.min(
      Number(profile.teamSize) || 0,
      SCORE_CAPS.teamSize
    ) /
    SCORE_CAPS.teamSize;

  const skillsScore =
    Math.min(
      profile.skills.length,
      SCORE_CAPS.skills
    ) /
    SCORE_CAPS.skills;

  const languageCount =
    Array.isArray(profile.languages)
      ? profile.languages.length
      : 0;

  const languageScore =
    Math.min(
      languageCount,
      SCORE_CAPS.languages
    ) /
    SCORE_CAPS.languages;

  let relevanceBonus = 0;

  if (activeFilters.role) {

    const wanted =
      normalizeRoleValue(
        activeFilters.role
      );

    const actual =
      normalizeRoleValue(
        profile.role
      );

    if (actual === wanted) {
      relevanceBonus += 0.15;
    }
  }

  const score =
    experienceScore *
      SCORE_WEIGHTS.experience +

    ratingScore *
      SCORE_WEIGHTS.rating +

    teamScore *
      SCORE_WEIGHTS.teamSize +

    skillsScore *
      SCORE_WEIGHTS.skills +

    languageScore *
      SCORE_WEIGHTS.languages +

    relevanceBonus;

  return Math.min(
    1,
    score
  );
}

function rankProfiles(
  rawProfiles
) {

  return rawProfiles
    .map((raw) => {

      const profile =
        normalizeProfile(raw);

      return {
        profile,
        score:
          computeMatchScore(
            profile,
            filters
          ),
      };

    })
    .sort(
      (a, b) =>
        b.score -
        a.score
    );
}


/* =========================================================
   AI STATE
========================================================= */

function hasActiveQuery() {

  return Boolean(
    filters.search ||
    filters.category ||
    filters.role ||
    filters.address ||
    filters.phone ||
    filters.state ||
    filters.district
  );
}

function playAiMessages(
  signal
) {

  let index = 0;

  aiStatusText.textContent =
    AI_MESSAGES[0];

  const timer =
    setInterval(() => {

      if (signal.stopped) {
        clearInterval(timer);
        return;
      }

      index =
        (index + 1) %
        AI_MESSAGES.length;

      aiStatusText.textContent =
        AI_MESSAGES[index];

    }, 550);

  return () =>
    clearInterval(timer);
}


/* =========================================================
   SEARCH
========================================================= */

async function runSearch({
  showAiSequence = true
} = {}) {

  hideError();

  const requestId =
    ++requestSeq;

  if (!hasActiveQuery()) {

    setUiState("idle");

    return;
  }

  const started =
    Date.now();

  let stopMessages =
    () => {};

  const signal = {
    stopped: false,
  };

  if (showAiSequence) {

    setUiState("ai");

    stopMessages =
      playAiMessages(
        signal
      );
  }

  try {

    const response =
      await fetchProfiles(page);

    if (
      requestId !==
      requestSeq
    ) {
      return;
    }

    const elapsed =
      Date.now() -
      started;

    if (showAiSequence) {

      const remaining =
        Math.max(
          0,
          AI_MIN_DURATION -
            elapsed
        );

      if (remaining) {
        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              remaining
            )
        );
      }
    }

    signal.stopped = true;
    stopMessages();

    total =
      response.total;

    totalPages =
      response.totalPages;

    const ranked =
      rankProfiles(
        response.data
      ).filter(
        entry =>
          matchesActiveFilters(
            entry.profile,
            filters
          )
      );

    if (!ranked.length) {

      setUiState(
        "empty"
      );

      return;
    }

    setUiState(
      "results"
    );

    resultCount.textContent =
      `${total} profile${
        total === 1
          ? ""
          : "s"
      } found · sorted by best match`;

    renderCards(
      ranked
    );

    updatePagination();

  } catch (error) {

    signal.stopped = true;
    stopMessages();

    console.error(
      "PROFILE SEARCH ERROR:",
      error
    );

    showError(
      error.message ||
      "Could not search profiles right now."
    );

    setUiState(
      "idle"
    );
  }
}


/* =========================================================
   CARD RENDER
========================================================= */

function renderCards(
  ranked
) {

  cardsGrid.innerHTML = "";

  ranked.forEach(
    (entry, index) => {

      const profile =
        entry.profile;

      const score =
        Math.round(
          entry.score *
            100
        );

      const category =
        categoryMeta(
          profile.category
        );

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "profile-card";

      const media =
        profile.image

          ? `<img
              class="profile-thumb"
              src="${escapeHtml(
                profile.image
              )}"
              alt="${escapeHtml(
                profile.name
              )}"
            />`

          : `<div class="profile-thumb profile-thumb-fallback">
              <i data-lucide="user"></i>
            </div>`;

      const skills =
        profile.skills.length

          ? `<div class="chip-row">
              ${profile.skills
                .slice(0, 6)
                .map(
                  skill =>
                    `<span class="skill-chip">
                      ${escapeHtml(
                        skill
                      )}
                    </span>`
                )
                .join("")}
            </div>`

          : "";

      const languages =
        profile.languages.length

          ? `<div class="chip-row">
              ${profile.languages
                .map(
                  language =>
                    `<span class="lang-chip">
                      <i data-lucide="languages"></i>
                      ${escapeHtml(
                        language
                      )}
                    </span>`
                )
                .join("")}
            </div>`

          : "";

      card.innerHTML = `

        <div class="profile-card-top">

          ${media}

          <div class="profile-card-id">

            <div class="profile-name">
              ${escapeHtml(
                profile.name ||
                "Unnamed"
              )}
            </div>

            <div class="profile-role-row">

              <span class="profile-category-badge">
                ${escapeHtml(
                  category?.label ||
                  profile.category ||
                  ""
                )}
              </span>

              ${
                profile.rating
                  ? `
                    <span class="profile-rating">
                      <i data-lucide="star"></i>
                      ${Number(
                        profile.rating
                      ).toFixed(1)}
                    </span>
                  `
                  : ""
              }

            </div>

          </div>

          <span class="match-pill">
            ${score}% match
          </span>

        </div>

        <div class="profile-card-body">

          <div class="profile-meta">

            ${
              profile.role
                ? `<span>
                    ${escapeHtml(
                      profile.role
                    )}
                  </span>`
                : ""
            }

            ${
              profile.experience
                ? `<span>
                    <i data-lucide="award"></i>
                    ${escapeHtml(
                      profile.experience
                    )} yrs exp.
                  </span>`
                : ""
            }

            ${
              profile.teamSize
                ? `<span>
                    <i data-lucide="users"></i>
                    Team of
                    ${escapeHtml(
                      profile.teamSize
                    )}
                  </span>`
                : ""
            }

          </div>

          <div class="profile-meta">

            ${
              profile.location ||
              profile.district ||
              profile.state

                ? `<span>
                    <i data-lucide="map-pin"></i>
                    ${escapeHtml(
                      profile.location ||
                      [
                        profile.district,
                        profile.state,
                      ]
                        .filter(Boolean)
                        .join(", ")
                    )}
                  </span>`

                : ""
            }

          </div>

          ${skills}
          ${languages}

          ${
            profile.description
              ? `<p class="profile-desc">
                  ${escapeHtml(
                    profile.description
                  )}
                </p>`
              : ""
          }

        </div>

        <div class="profile-card-actions">

          <a
            class="card-btn view-btn"
            href="${escapeHtml(
              profile.profileUrl
            )}"
          >
            <i data-lucide="user"></i>
            View profile
          </a>

          ${
            profile.phone
              ? `<a
                  class="card-btn call-btn"
                  href="tel:${escapeHtml(
                    profile.phone
                  )}"
                  aria-label="Call"
                >
                  <i data-lucide="phone"></i>
                </a>`
              : ""
          }

        </div>
      `;

      cardsGrid.appendChild(
        card
      );
    }
  );

  refreshIcons();
}


/* =========================================================
   PAGINATION
========================================================= */

function updatePagination() {

  pageIndicator.textContent =
    `Page ${page} of ${totalPages}`;

  prevBtn.disabled =
    page <= 1;

  nextBtn.disabled =
    page >= totalPages;
}

prevBtn.addEventListener(
  "click",
  async () => {

    if (page <= 1) return;

    page -= 1;

    await runSearch({
      showAiSequence: false,
    });

    window.scrollTo?.({
      top: 0,
      behavior: "smooth",
    });
  }
);

nextBtn.addEventListener(
  "click",
  async () => {

    if (
      page >=
      totalPages
    ) {
      return;
    }

    page += 1;

    await runSearch({
      showAiSequence: false,
    });

    window.scrollTo?.({
      top: 0,
      behavior: "smooth",
    });
  }
);


/* =========================================================
   SEARCH BAR
========================================================= */

let searchTimer;

searchInput.addEventListener(
  "input",
  () => {

    clearSearchBtn.classList.toggle(
      "hidden",
      !searchInput.value
    );

    clearTimeout(
      searchTimer
    );

    searchTimer =
      setTimeout(
        () => {

          filters.search =
            searchInput.value.trim();

          page = 1;

          runSearch();

        },
        450
      );
  }
);

clearSearchBtn.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    clearSearchBtn.classList.add(
      "hidden"
    );

    filters.search = "";

    page = 1;

    runSearch();

    searchInput.focus();
  }
);


/* =========================================================
   FILTER SHEET
========================================================= */

function openSheet() {

  fCategory.value =
    filters.category;

  populateRoles();

  fRole.value =
    filters.role;

  fAddress.value =
    filters.address;

  fPhone.value =
    filters.phone;

  fState.value =
    filters.state;

  populateDistricts();

  fDistrict.value =
    filters.district;

  filterBackdrop.classList.remove(
    "hidden"
  );

  filterSheet.classList.remove(
    "hidden"
  );

  requestAnimationFrame(
    () => {

      filterBackdrop.classList.add(
        "open"
      );

      filterSheet.classList.add(
        "open"
      );
    }
  );
}

function closeSheet() {

  filterBackdrop.classList.remove(
    "open"
  );

  filterSheet.classList.remove(
    "open"
  );

  setTimeout(
    () => {

      filterBackdrop.classList.add(
        "hidden"
      );

      filterSheet.classList.add(
        "hidden"
      );

    },
    220
  );
}

filterBtn.addEventListener(
  "click",
  openSheet
);

filterCloseBtn.addEventListener(
  "click",
  closeSheet
);

filterBackdrop.addEventListener(
  "click",
  closeSheet
);


/* =========================================================
   FILTER EVENTS
========================================================= */

fCategory.addEventListener(
  "change",
  () => {

    populateRoles();

    fRole.value = "";

  }
);

fState.addEventListener(
  "change",
  () => {

    populateDistricts();

    fDistrict.value = "";

  }
);

clearFiltersBtn.addEventListener(
  "click",
  () => {

    fCategory.value = "";

    fRole.innerHTML =
      `<option value="">All roles</option>`;

    roleField.style.display =
      "none";

    fAddress.value = "";
    fPhone.value = "";

    fState.value = "";

    populateDistricts();

    fDistrict.value = "";

    filters = {
      search:
        searchInput.value.trim(),

      category: "",
      role: "",
      address: "",
      phone: "",
      state: "",
      district: "",
    };

    page = 1;

    updateFilterDot();

    renderChips();

    runSearch();

  }
);

applyFiltersBtn.addEventListener(
  "click",
  () => {

    filters.category =
      fCategory.value;

    /*
     * EXACT ROLE VALUE:
     * e.g. shuttering-supplier
     */
    filters.role =
      fRole.value;

    filters.address =
      fAddress.value.trim();

    filters.phone =
      fPhone.value
        .replace(/\D/g, "");

    filters.state =
      fState.value;

    filters.district =
      fDistrict.value;

    page = 1;

    updateFilterDot();

    renderChips();

    closeSheet();

    runSearch();

  }
);


/* =========================================================
   FILTER DOT / CHIPS
========================================================= */

function updateFilterDot() {

  const active =
    Boolean(
      filters.category ||
      filters.role ||
      filters.address ||
      filters.phone ||
      filters.state ||
      filters.district
    );

  filterDot.classList.toggle(
    "hidden",
    !active
  );
}

function renderChips() {

  activeFilters.innerHTML = "";

  const entries = [];

  if (filters.category) {
    entries.push([
      "category",
      categoryLabels[
        filters.category
      ] ||
      filters.category
    ]);
  }

  if (filters.role) {

    const roleLabel =
      categories[
        filters.category
      ]?.find(
        role =>
          normalizeRoleValue(
            role
          ) ===
          normalizeRoleValue(
            filters.role
          )
      );

    entries.push([
      "role",
      roleLabel ||
      filters.role
    ]);
  }

  if (filters.address) {
    entries.push([
      "address",
      filters.address
    ]);
  }

  if (filters.phone) {
    entries.push([
      "phone",
      filters.phone
    ]);
  }

  if (filters.state) {
    entries.push([
      "state",
      filters.state
    ]);
  }

  if (filters.district) {
    entries.push([
      "district",
      filters.district
    ]);
  }

  entries.forEach(
    ([key, label]) => {

      const chip =
        document.createElement(
          "span"
        );

      chip.className =
        "chip";

      chip.innerHTML = `
        ${escapeHtml(label)}
        <button
          type="button"
          aria-label="Remove filter"
        >
          <i data-lucide="x"></i>
        </button>
      `;

      chip
        .querySelector("button")
        .addEventListener(
          "click",
          () =>
            removeFilter(key)
        );

      activeFilters.appendChild(
        chip
      );
    }
  );

  refreshIcons();
}

function removeFilter(key) {

  filters[key] = "";

  if (
    key === "category"
  ) {
    filters.role = "";
  }

  if (
    key === "state"
  ) {
    filters.district = "";
  }

  page = 1;

  updateFilterDot();

  renderChips();

  runSearch();
}


/* =========================================================
   BACK BUTTON / ERROR
========================================================= */

errorBannerClose.addEventListener(
  "click",
  hideError
);

backBtn.addEventListener(
  "click",
  () => {

    if (
      window.history.length >
      1
    ) {
      window.history.back();
    }
  }
);


/* =========================================================
   INIT
========================================================= */

function init() {

  populateCategories();

  populateRoles();

  populateStates();

  populateDistricts();

  setUiState(
    "idle"
  );

  refreshIcons();
}

init();



/* ---- Static data ----
const REQUIREMENTS = [
  { key: "contractor", label: "Contractor", icon: "hard-hat",
    roles: ["Plumbing",
      "electrician",
      "Carpentry",
      "Masonry",
      "Painter",
      "Roofing",
      "Flooring",
      "HVAC",
      "Landscaping",
      "Demolition",
      "Structural",
      "Marble & Tiles",
      "POP",
      "Glass",] },
  { key: "supplier", label: "Supplier", icon: "truck",
    roles: ["Material supplier", "Cement supplier", "Steel & rebar supplier", "Sand & aggregate supplier", "Equipment supplier", "Tiles & sanitaryware supplier"] },
  { key: "architect", label: "Architect", icon: "pen-tool",
    roles: ["Lead architect", "Interior architect", "Landscape architect", "Structural design architect"] },
  { key: "engineer", label: "Engineer", icon: "cog",
    roles: ["Civil engineer", "Structural engineer", "MEP engineer", "Site engineer", "Surveyor"] },
  { key: "mechanic", label: "Technician", icon: "wrench",
    roles: ["Equipment mechanic", "HVAC technician", "Machinery operator", "Maintenance technician"] },
  { key: "electrician", label: "Electrician", icon: "zap",
    roles: ["Wiring electrician", "Panel & DB electrician", "Maintenance electrician"] },
  { key: "plumber", label: "Plumber", icon: "droplet",
    roles: ["Pipefitter", "Sanitary plumber", "Drainage specialist"] },
  { key: "designer", label: "Interior designer", icon: "sofa",
    roles: ["Residential designer", "Commercial designer", "Furniture & decor consultant"] },
  { key: "labor", label: "Labour", icon: "users",
    roles: ["Mason", "Carpenter", "Painter", "Welder", "Helper / laborer"] },
  { key: "consultant", label: "Consultant", icon: "clipboard-list",
    roles: ["Project management consultant", "Cost / quantity consultant", "Safety consultant", "Legal & compliance consultant"] },
];

const STATE_DISTRICTS = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubli-Dharwad", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Durgapur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
};

const PAGE_SIZE = 20;
const AI_MESSAGES = ["Understanding your search…", "Matching categories & roles…", "Searching profiles…", "Ranking best matches…"];
const AI_MIN_DURATION = 1400; // ms — keeps the AI sequence feeling real even on a fast API

// ---- State ----
let filters = { search: "", category: "", role: "", address: "", phone: "", state: "", district: "" };
let page = 1;
let totalPages = 1;
let total = 0;
let requestSeq = 0;

// ---- Element refs ----
const el = (id) => document.getElementById(id);
const backBtn = el("backBtn");
const filterBtn = el("filterBtn");
const filterDot = el("filterDot");
const errorBanner = el("errorBanner");
const errorBannerText = el("errorBannerText");
const errorBannerClose = el("errorBannerClose");
const activeFilters = el("activeFilters");

const aiState = el("aiState");
const aiStatusText = el("aiStatusText");
const emptyState = el("emptyState");
const idleState = el("idleState");
const resultsMeta = el("resultsMeta");
const resultCount = el("resultCount");
const cardsGrid = el("cardsGrid");
const pagination = el("pagination");
const prevBtn = el("prevBtn");
const nextBtn = el("nextBtn");
const pageIndicator = el("pageIndicator");

const searchInput = el("searchInput");
const clearSearchBtn = el("clearSearchBtn");

const filterBackdrop = el("filterBackdrop");
const filterSheet = el("filterSheet");
const filterCloseBtn = el("filterCloseBtn");
const fCategory = el("f-category");
const fRole = el("f-role");
const roleField = el("roleField");
const fAddress = el("f-address");
const fPhone = el("f-phone");
const fState = el("f-state");
const fDistrict = el("f-district");
const clearFiltersBtn = el("clearFiltersBtn");
const applyFiltersBtn = el("applyFiltersBtn");

// ---- Init static lists ----
REQUIREMENTS.forEach((r) => {
  const opt = document.createElement("option");
  opt.value = r.key; opt.textContent = r.label;
  fCategory.appendChild(opt);
});
Object.keys(STATE_DISTRICTS).forEach((s) => {
  const opt = document.createElement("option");
  opt.value = s; opt.textContent = s;
  fState.appendChild(opt);
});

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function formatBudget(v) {
  const n = Number(v);
  if (!v || Number.isNaN(n)) return v;
  return "\u20B9" + n.toLocaleString("en-IN");
}

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}
function hideError() {
  errorBanner.classList.add("hidden");
}
errorBannerClose.addEventListener("click", hideError);

// ---- Navigation ----
backBtn.addEventListener("click", () => {
  if (window.history.length > 1) window.history.back();
});

// ================= API =================
function normalizeResponse(json) {
  if (Array.isArray(json)) {
    return { data: json, total: json.length, totalPages: 1 };
  }
  const data = json.data || json.results || [];
  return {
    data,
    total: json.total ?? data.length,
    totalPages: json.totalPages || Math.max(1, Math.ceil((json.total ?? data.length) / PAGE_SIZE)),
  };
}

async function fetchProfiles(pageNum) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.role) params.set("role", filters.role);
  if (filters.address) params.set("address", filters.address);
  if (filters.phone) params.set("phone", filters.phone);
  if (filters.state) params.set("state", filters.state);
  if (filters.district) params.set("district", filters.district);
  params.set("page", pageNum);
  params.set("limit", PAGE_SIZE);

  const res = await fetch(`${PROFILE_API_BASE_URL}?${params.toString()}`);
  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || (json && json.success === false)) {
    throw new Error((json && json.message) || `Request failed (${res.status})`);
  }
  return normalizeResponse(json);
}

// ---- Normalize a profile doc into render-friendly shape ----
function normalizeProfile(p) {
  return {
    id: p._id,
    profileUrl: `/profile-details.html?id=${p._id}`,
    name: p.name,
    role: p.role,
    rating: p.rating,
    experience: p.experience,
    teamSize: p.teamSize,
    skills: Array.isArray(p.skills) ? p.skills : [],
    category: p.category || "contractor",
    image: p.mediaType === "image" ? p.media : "",
    video: p.mediaType === "video" ? p.media : "",
    languages: p.languages,
    phone: p.phone,
    description: p.description,
    location: p.location,
    state: p.state,
    district: p.district,
  };
}

// ================= Ranking algorithm =================
// Weighted "best match" score (0–1) from experience, rating, team size,
// skills breadth, and language versatility — with a relevance bonus when
// the profile's own role/skills line up with the role filter in use.
// Caps below keep any one very large number (e.g. 40 yrs experience) from
// dominating the score — everything is normalized before weighting.
const SCORE_WEIGHTS = { experience: 0.30, rating: 0.25, teamSize: 0.15, skills: 0.15, languages: 0.10 };
const SCORE_CAPS = { experience: 20, rating: 5, teamSize: 50, skills: 8, languages: 4 };

function computeMatchScore(np, activeFilters) {
  const expScore = Math.min(Number(np.experience) || 0, SCORE_CAPS.experience) / SCORE_CAPS.experience;
  const ratingScore = Math.min(Number(np.rating) || 0, SCORE_CAPS.rating) / SCORE_CAPS.rating;
  const teamScore = Math.min(Number(np.teamSize) || 0, SCORE_CAPS.teamSize) / SCORE_CAPS.teamSize;
  const skillsScore = Math.min(np.skills.length, SCORE_CAPS.skills) / SCORE_CAPS.skills;
  const langCount = Array.isArray(np.languages) ? np.languages.length : 0;
  const langScore = Math.min(langCount, SCORE_CAPS.languages) / SCORE_CAPS.languages;

  let relevanceBonus = 0;
  if (activeFilters.role) {
    const roleLower = activeFilters.role.toLowerCase();
    if ((np.role || "").toLowerCase() === roleLower) {
      relevanceBonus += 0.15;
    } else if (np.skills.some((s) => s.toLowerCase().includes(roleLower.split(" ")[0]))) {
      relevanceBonus += 0.08;
    }
  }

  const raw =
    expScore * SCORE_WEIGHTS.experience +
    ratingScore * SCORE_WEIGHTS.rating +
    teamScore * SCORE_WEIGHTS.teamSize +
    skillsScore * SCORE_WEIGHTS.skills +
    langScore * SCORE_WEIGHTS.languages +
    relevanceBonus;

  return Math.min(1, raw);
}

function rankProfiles(rawProfiles) {
  return rawProfiles
    .map((raw) => {
      const np = normalizeProfile(raw);
      return { profile: np, score: computeMatchScore(np, filters) };
    })
    .sort((a, b) => b.score - a.score);
}

// ================= Client-side safety filter =================
// Belt-and-suspenders: re-checks every fetched profile against the active
// filters before rendering. This guards against a backend search endpoint
// that silently ignores query params (returns everything regardless of
// ?search=...) — a common cause of "I typed a name and got unrelated
// results back." It only filters what's already on the current page, so
// it can't fix incorrect totals/pagination from a broken backend — that
// still needs a real fix server-side (see README/notes).
function matchesActiveFilters(np, f) {
  if (f.search) {
    const q = f.search.toLowerCase();
    if (!(np.name || "").toLowerCase().includes(q)) return false;
  }
  if (f.category && np.category !== f.category) return false;
  if (f.role && np.role !== f.role) return false;
  if (f.address) {
    const q = f.address.toLowerCase();
    const hay = `${np.location || ""} ${np.district || ""} ${np.state || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.phone && !(np.phone || "").replace(/\s+/g, "").includes(f.phone.replace(/\s+/g, ""))) return false;
  if (f.state && np.state !== f.state) return false;
  if (f.district && np.district !== f.district) return false;
  return true;
}

function categoryMeta(key) {
  return REQUIREMENTS.find((r) => r.key === key);
}

// ================= AI search sequence =================
function hasActiveQuery() {
  return !!(filters.search || filters.category || filters.role || filters.address || filters.phone || filters.state || filters.district);
}

function playAiMessages(stopSignal) {
  let i = 0;
  aiStatusText.textContent = AI_MESSAGES[0];
  const interval = setInterval(() => {
    if (stopSignal.stopped) { clearInterval(interval); return; }
    i = (i + 1) % AI_MESSAGES.length;
    aiStatusText.style.opacity = 0;
    setTimeout(() => {
      aiStatusText.textContent = AI_MESSAGES[i];
      aiStatusText.style.opacity = 1;
    }, 150);
  }, 550);
  return () => { clearInterval(interval); };
}

function setUiState(state) {
  // state: "idle" | "ai" | "results" | "empty"
  idleState.classList.toggle("hidden", state !== "idle");
  aiState.classList.toggle("hidden", state !== "ai");
  emptyState.classList.toggle("hidden", state !== "empty");
  resultsMeta.classList.toggle("hidden", state !== "results");
  pagination.classList.toggle("hidden", state !== "results");
  if (state !== "results") cardsGrid.innerHTML = "";
}

async function runSearch({ showAiSequence = true } = {}) {
  hideError();
  const seq = ++requestSeq;

  if (!hasActiveQuery()) {
    setUiState("idle");
    return;
  }

  const start = Date.now();
  let stopMessages = () => {};
  if (showAiSequence) {
    setUiState("ai");
    aiStatusText.style.transition = "opacity 150ms ease";
    stopMessages = playAiMessages({ stopped: false });
  }

  try {
    const res = await fetchProfiles(page);
    if (seq !== requestSeq) return;

    const elapsed = Date.now() - start;
    const wait = showAiSequence ? Math.max(0, AI_MIN_DURATION - elapsed) : 0;
    await new Promise((r) => setTimeout(r, wait));
    if (seq !== requestSeq) return;

    stopMessages();
    total = res.total;
    totalPages = res.totalPages;

    const ranked = rankProfiles(res.data).filter((entry) => matchesActiveFilters(entry.profile, filters));

    if (ranked.length === 0) {
      setUiState("empty");
      return;
    }

    setUiState("results");
    const filteredOut = res.data.length - ranked.length;
    resultCount.textContent = filteredOut > 0
      ? `${ranked.length} profile${ranked.length === 1 ? "" : "s"} found on this page · sorted by best match`
      : `${total} profile${total === 1 ? "" : "s"} found · sorted by best match`;
    renderCards(ranked);
    updatePagination();
  } catch (err) {
    if (seq !== requestSeq) return;
    stopMessages();
    showError(err.message || "Could not search profiles right now.");
    setUiState("idle");
  }
}

function updatePagination() {
  pageIndicator.textContent = `Page ${page} of ${totalPages}`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages;
}

prevBtn.addEventListener("click", async () => {
  if (page <= 1) return;
  page -= 1;
  await runSearch({ showAiSequence: false });
  window.scrollTo?.({ top: 0 });
  document.querySelector(".results-area")?.scrollTo?.({ top: 0, behavior: "smooth" });
});
nextBtn.addEventListener("click", async () => {
  if (page >= totalPages) return;
  page += 1;
  await runSearch({ showAiSequence: false });
  document.querySelector(".results-area")?.scrollTo?.({ top: 0, behavior: "smooth" });
});

// ================= Rendering =================
function renderCards(ranked) {
  cardsGrid.innerHTML = "";
  ranked.forEach((entry, idx) => {
    const { profile: p, score } = entry;
    const cat = categoryMeta(p.category);
    const matchPct = Math.round(score * 100);
    const isTopMatch = idx < 3 && matchPct >= 60;

    const media = p.image
      ? `<img class="profile-thumb" src="${p.image}" alt="${p.name}" />`
      : `<div class="profile-thumb profile-thumb-fallback"><i data-lucide="user"></i></div>`;

    const languages = Array.isArray(p.languages) && p.languages.length
      ? `<div class="chip-row">${p.languages.map((l) => `<span class="lang-chip"><i data-lucide="languages"></i>${l}</span>`).join("")}</div>`
      : "";

    const skills = p.skills.length
      ? `<div class="chip-row">${p.skills.slice(0, 6).map((s) => `<span class="skill-chip">${s}</span>`).join("")}${p.skills.length > 6 ? `<span class="skill-chip more">+${p.skills.length - 6}</span>` : ""}</div>`
      : "";

    const card = document.createElement("div");
    card.className = "profile-card";
    card.style.animationDelay = `${Math.min(idx, 10) * 30}ms`;
    card.innerHTML = `
      ${isTopMatch ? `<div class="top-match-ribbon"><i data-lucide="sparkles"></i>Top match</div>` : ""}
      <div class="profile-card-top">
        ${media}
        <div class="profile-card-id">
          <div class="profile-name">${p.name || "Unnamed"}</div>
          <div class="profile-role-row">
            <span class="profile-category-badge">${cat ? cat.label : p.category}</span>
            ${p.rating ? `<span class="profile-rating"><i data-lucide="star"></i>${Number(p.rating).toFixed(1)}</span>` : ""}
          </div>
        </div>
        <span class="match-pill" title="Ranked on experience, rating, team size, skills & languages">${matchPct}% match</span>
      </div>
      <div class="profile-card-body">
        <div class="profile-meta">
          <span>${p.role || ""}</span>
          ${p.experience ? `<span><i data-lucide="award"></i>${p.experience} yrs exp.</span>` : ""}
          ${p.teamSize ? `<span><i data-lucide="users"></i>Team of ${p.teamSize}</span>` : ""}
        </div>
        <div class="profile-meta">
          ${p.location || p.district ? `<span><i data-lucide="map-pin"></i>${p.location || `${p.district}, ${p.state}`}</span>` : ""}
        
        </div>
        ${skills}
        ${languages}
        ${p.description ? `<p class="profile-desc">${p.description}</p>` : ""}
      </div>
      <div class="profile-card-actions">
        <a class="card-btn view-btn" href="${p.profileUrl}"><i data-lucide="user"></i> View profile</a>
        ${p.phone ? `<a class="card-btn call-btn" href="tel:${p.phone}" aria-label="Call"><i data-lucide="phone"></i></a>` : ""}
      </div>
    `;
    cardsGrid.appendChild(card);
  });
  refreshIcons();
}

// ================= Search input ================
let searchTimer;
searchInput.addEventListener("input", () => {
  clearSearchBtn.classList.toggle("hidden", !searchInput.value);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.search = searchInput.value.trim();
    page = 1;
    runSearch();
  }, 450);
});
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.classList.add("hidden");
  filters.search = "";
  page = 1;
  runSearch();
  searchInput.focus();
});

// ================= Filter sheet ================
function openSheet() {
  // sync sheet inputs to current filters
  fCategory.value = filters.category;
  fCategory.dispatchEvent(new Event("change"));
  fRole.value = filters.role;
  fAddress.value = filters.address;
  fPhone.value = filters.phone;
  fState.value = filters.state;
  fState.dispatchEvent(new Event("change"));
  fDistrict.value = filters.district;

  filterBackdrop.classList.remove("hidden");
  filterSheet.classList.remove("hidden");
  requestAnimationFrame(() => {
    filterBackdrop.classList.add("open");
    filterSheet.classList.add("open");
  });
}
function closeSheet() {
  filterBackdrop.classList.remove("open");
  filterSheet.classList.remove("open");
  setTimeout(() => {
    filterBackdrop.classList.add("hidden");
    filterSheet.classList.add("hidden");
  }, 220);
}
filterBtn.addEventListener("click", openSheet);
filterCloseBtn.addEventListener("click", closeSheet);
filterBackdrop.addEventListener("click", closeSheet);

fCategory.addEventListener("change", () => {
  fRole.innerHTML = '<option value="">All roles</option>';
  if (fCategory.value) {
    const cat = categoryMeta(fCategory.value);
    cat.roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      fRole.appendChild(opt);
    });
    roleField.style.display = "";
  } else {
    roleField.style.display = "none";
  }
  refreshIcons();
});

fState.addEventListener("change", () => {
  const districts = STATE_DISTRICTS[fState.value] || [];
  fDistrict.innerHTML = '<option value="">All districts</option>';
  districts.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    fDistrict.appendChild(opt);
  });
  fDistrict.disabled = !fState.value;
});

function updateFilterDot() {
  const active = filters.category || filters.role || filters.address || filters.phone || filters.state || filters.district;
  filterDot.classList.toggle("hidden", !active);
}

applyFiltersBtn.addEventListener("click", () => {
  filters.category = fCategory.value;
  filters.role = fRole.value;
  filters.address = fAddress.value.trim();
  filters.phone = fPhone.value.trim();
  filters.state = fState.value;
  filters.district = fDistrict.value;
  page = 1;
  updateFilterDot();
  renderChips();
  closeSheet();
  runSearch();
});

clearFiltersBtn.addEventListener("click", () => {
  fCategory.value = ""; fCategory.dispatchEvent(new Event("change"));
  fRole.value = "";
  fAddress.value = "";
  fPhone.value = "";
  fState.value = ""; fState.dispatchEvent(new Event("change"));
  fDistrict.value = "";
});

// ---- Active filter chips ----
function renderChips() {
  activeFilters.innerHTML = "";
  const entries = [];
  if (filters.category) entries.push(["category", categoryMeta(filters.category)?.label || filters.category]);
  if (filters.role) entries.push(["role", filters.role]);
  if (filters.address) entries.push(["address", filters.address]);
  if (filters.phone) entries.push(["phone", filters.phone]);
  if (filters.state) entries.push(["state", filters.state]);
  if (filters.district) entries.push(["district", filters.district]);

  entries.forEach(([key, text]) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${text}<button type="button" aria-label="Remove filter"><i data-lucide="x"></i></button>`;
    chip.querySelector("button").addEventListener("click", () => removeFilter(key));
    activeFilters.appendChild(chip);
  });
  refreshIcons();
}

function removeFilter(key) {
  filters[key] = "";
  if (key === "category") filters.role = "";
  if (key === "state") filters.district = "";
  page = 1;
  updateFilterDot();
  renderChips();
  runSearch();
}

// ---- Boot ----
refreshIcons();
setUiState("idle");
*/
