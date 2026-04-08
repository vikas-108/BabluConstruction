const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const categoryFilter = document.getElementById("categoryFilter");
const stateFilter = document.getElementById("stateFilter");
const districtFilter = document.getElementById("districtFilter");
const PAGE_SIZE = 20;
let currentPage = 1;
let lastSearchResults = [];
const SERVER_BASE = "https://api.buildskil.com";
const PROFILE_API = "https://api.buildskil.com/api/profiles/public";
let API_PROFILES_CACHE = [];
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
  "Lakshadweep",
  "Puducherry",
  "Ladakh",
  "Andaman & Nicobar", "Dadra & Nagar Haveli and Daman & Diu",
];
const districts = [
  // Haryana (22)
  "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar",
  "Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal",
  "Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar",
  // Uttar Pradesh (75)
  "Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh",
  "Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti",
  "Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah",
  "Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad",
  "Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun",
  "Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi",
  "Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri",
  "Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh",
  "Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur",
  "Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi",

  // Delhi (11)
  "Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi",
  "North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi",

  // Bihar (38)
  "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga",
  "East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj",
  "Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia",
  "Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul",
  "Vaishali","West Champaran",

  // Odisha (30)
  "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal",
  "Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
  "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada",
  "Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh",

  // Chandigarh (1)
  "Chandigarh",

  // Punjab (23)
  "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur",
  "Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot",
  "Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran",

  // Gujarat (33)
  "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur",
  "Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch",
  "Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha",
  "Surat","Surendranagar","Tapi","Vadodara","Valsad",
  // Rajasthan (50)
  "Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur",
  "Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman",
  "Dungarpur","Gangapur City","Hanumangarh","Jaipur","Jaipur Rural","Jaisalmer","Jalore","Jhalawar",
  "Jhunjhunu","Jodhpur","Jodhpur Rural","Karauli","Kekri","Khairthal-Tijara","Kota","Kotputli-Behror",
  "Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore",
  "Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur",

  // Madhya Pradesh (55)
  "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind",
  "Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori",
  "Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone",
  "Maihar","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen",
  "Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur",
  "Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha",

  // Maharashtra (36)
  "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur",
  "Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City",
  "Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani",
  "Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal",

  // Karnataka (31)
  "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar",
  "Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad",
  "Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru",
  "Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayanagara",
  "Vijayapura","Yadgir",

  // Tamil Nadu (38)
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul",
  "Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai",
  "Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram",
  "Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
  "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur",
  "Vellore","Viluppuram","Virudhunagar",

  // West Bengal (23)
  "Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling",
  "Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda",
  "Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur",
  "Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur",

  // Andhra Pradesh (26)
  "Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor",
  "East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool",
  "Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","SPSR Nellore",
  "Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa",

  // Telangana (33)
  "Adilabad","Bhadradri Kothagudem","Hanamkonda","Hyderabad","Jagtial","Jangaon",
  "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
  "Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal–Malkajgiri",
  "Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
  "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad",
  "Wanaparthy","Warangal","Yadadri Bhuvanagiri",
  // Kerala (14)
  "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam",
  "Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram",
  "Thrissur","Wayanad",

  // Himachal Pradesh (12)
  "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti",
  "Mandi","Shimla","Sirmaur","Solan","Una",

  // Uttarakhand (13)
  "Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital",
  "Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi",

  // Jharkhand (24)
  "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa",
  "Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar",
  "Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum",

  // Chhattisgarh (33)
  "Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur",
  "Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa",
  "Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund",
  "Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli",
  "Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh",
  "Sukma","Surajpur","Surguja",

  // Assam (35)
  "Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang",
  "Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat",
  "Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong",
  "Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari",
  "Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong",

  // Arunachal Pradesh (26)
  "Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle",
  "Kra Daadi","Kurung Kumey","Leparada","Lohit","Longding","Lower Dibang Valley",
  "Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare",
  "Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri",
  "West Kameng","West Siang","Keyi Panyor",

  // Nagaland (16)
  "Chümoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
  "Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyü","Tuensang","Wokha","Zunheboto",

  // Manipur (16)
  "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam",
  "Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong",
  "Tengnoupal","Thoubal","Ukhrul",

  // Meghalaya (12)
  "East Garo Hills","East Jaintia Hills","East Khasi Hills","Mairang",
  "North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills",
  "South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills",

  // Mizoram (11)
  "Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
  "Lunglei","Mamit","Saiha","Saitual","Serchhip",

  // Tripura (8)
  "Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura",
  "Unakoti","West Tripura",

  // Goa (2)
  "North Goa","South Goa",

  // Sikkim (6)
  "Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng",

  // Jammu & Kashmir (20)
  "Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu",
  "Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri",
  "Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur",

  // Ladakh (2)
  "Kargil","Leh",

  // Andaman & Nicobar (3)
  "Nicobar","North and Middle Andaman","South Andaman",

  // Dadra & Nagar Haveli and Daman & Diu (3)
  "Dadra and Nagar Haveli","Daman","Diu",

  // Lakshadweep (1)
  "Lakshadweep",

  // Puducherry (4)
  "Karaikal","Mahe","Puducherry","Yanam",
];
function getSearchStateKey() {
  const user = JSON.parse(localStorage.getItem("cb_login_user"));

  // guest mode
  if (!user) return "brg_search_state_guest";

  // per-user search state
  return `brg_search_state_${user.phone}`;
}

function saveSearchState() {
  const state = {
    query: input?.value,
    category: categoryFilter?.value || "",
    state: stateFilter?.value || "",
    district: districtFilter?.value || "",
  };

  localStorage.setItem(getSearchStateKey(), JSON.stringify(state));
}
function restoreSearchState() {
  const saved = localStorage.getItem(getSearchStateKey());
  if (!saved) return;

  const state = JSON.parse(saved);

  if (state.query) input.value = state.query;
  if (categoryFilter && state.category) categoryFilter.value = state.category;
  if (stateFilter && state.state) stateFilter.value = state.state;
  if (districtFilter && state.district) districtFilter.value = state.district;

  // Trigger search after restoring
  setTimeout(() => {
    applySearch();
  }, 10);
  
setupSearchableSelect("stateFilter", "stateList", states);
setupSearchableSelect("districtFilter", "districtList", districts);
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
   console.log("Filtered:", filtered);
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
  console.log("List children:", list.children.length);
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
function normalizeText(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .normalize("NFKD") // ✅ mobile unicode fix
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\u00A0/g, " ") // non-breaking space
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
// notification updates (could come from API or JSON file)
const updates = [
  "🚀 New feature launched: search engine",
  "📢 Scheduled maintenance on March 1st",
  "🎨 Updated design guidelines available",
  "🔧 full Profile click comming",
];

const notificationList = document.getElementById("notificationList");

// Inject updates dynamically
updates.forEach((update) => {
  const li = document.createElement("li");
  li.textContent = update;
  notificationList.appendChild(li);
});
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
function openProfile(id) {
  window.location.href = `profile-details.html?id=${id}`;
}
function isMathExpression(input) {
  return /^[0-9+\-*/().%\s^,a-zA-Z]+$/.test(input) && /[\d]/.test(input); // must contain at least one number
}
function clearSearchAll() {
  if (window.recognition) {
    try {
      recognition.abort();
    } catch (e) {}
  }

  input.value = "";
  categoryFilter.value = "";
  stateFilter.value = "";
  districtFilter.value = "";

  document.getElementById("calcResult")?.classList.add("hidden");

  results.innerHTML =
    "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

  localStorage.removeItem(getSearchStateKey());

  hideSearchLoader();
  toggleClearButton(); // ✅ HIDE CLEAR BUTTON
}

// clear button logic function
function toggleClearButton() {
  const clearBtn = document.getElementById("clearSearchBtn");
  if (!clearBtn) return;

  if (input.value.trim().length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
}
// below is pagination code of which show how manges with data
function renderPage() {
  const pagination = document.getElementById("pagination");

  // 🚫 NO RESULTS
  if (!lastSearchResults.length) {
    results.innerHTML =
      "<p style='text-align:center;color:#64748b;'>No results found</p>";
    pagination?.classList.add("hidden");
    return;
  }

  const totalPages = Math.ceil(lastSearchResults.length / PAGE_SIZE);

  // 🚫 ONLY ONE PAGE → HIDE PAGINATION
  if (totalPages <= 1) {
    pagination?.classList.add("hidden");
  }

  // 🚫 PAGE OUT OF RANGE (from old search)
  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const pageItems = lastSearchResults.slice(start, end);

  render(pageItems);

  // ✅ SHOW PAGINATION ONLY IF NEEDED
  if (totalPages > 1) {
    renderPagination(totalPages);
  }
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

  pagination.classList.remove("hidden");
  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">⬅ Prev</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next ➡</button>
  `;
}

function resetPagination() {
  lastSearchResults = [];
  currentPage = 1;

  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.classList.add("hidden");
    pagination.innerHTML = "";
  }
}

function nextPage() {
  const totalPages = Math.ceil(lastSearchResults.length / PAGE_SIZE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
}
async function fetchPublishedProfiles() {
  try {
    const res = await fetch(PROFILE_API);
    const data = await res.json();

    // 🔥 NORMALIZE DATA TO MATCH YOUR CURRENT RENDER FORMAT api cards
    API_PROFILES_CACHE = data.map((p) => ({
      id: p._id,
      profileUrl: `profile-details.html?id=${p._id}`,
      name: p.name,
      role: p.role,
      rating: p.rating,
      experience: p.experience,
      category: p.category || "contractor",
      image: p.mediaType === "image" ? SERVER_BASE + p.media : "",

      video: p.mediaType === "video" ? SERVER_BASE + p.media : "",
      languages: p.languages,
      phone: p.phone,
      description: p.description,
      location: p.location,
      state: p.state,
      district: p.district,

      source: "api",
    }));
  } catch (e) {
    console.error("Profile API error", e);
  }
}
//fetchPublishedProfiles();
// all card code if all type of data set render code ui from below code
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
    <div class="card quiz-card" data-quiz-id="${item.id}">
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
     <div class="card" onclick="openProfile('${item._id || item.id}')">
       <div class="card">
         ${
           item.image || item.video
             ? `
<div class="card-header">
  ${
    item.video
      ? `<video src="${item.video}" muted loop autoplay playsinline></video>`
      : `<img src="${item.image}" alt="${item.name}">`
  }
  <div>
    <h3>${item.name}</h3>
    <p>${item.role || item.type}</p>
  </div>
</div>`
             : ""
         }

        <div class="badge ${item.category}">
          ${item.category.toUpperCase()}, ${item.role ? `(${item.role})` : ""}  ${item.type ? `(${item.type})` : ""}
          
        </div>

        ${item.rating ? `<div class="rating">⭐ ${item.rating}</div>` : ""}
        ${item.experience ? `<div class="experience">${item.experience} years</div>` : ""}
        <p>${item.state}, ${item.district}, ${item.location}</p>
            <p>${item.description}</p>
        ${
          item.phone
            ? `
        <div class="contact-actions">
  <a href="tel:${phoneClean}" class="btn call-btn">
    <!-- Call Icon -->
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2
      1 .3 2.1.5 3.2.5.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2
      C10.1 21.2 2.8 13.9 2.8 4.4c0-.7.5-1.2 1.2-1.2h3.6
      c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.5 3.2.1.4 0 .9-.3 1.2L6.6 10.8z"/>
    </svg>
    Call
  </a>

  <a href="https://wa.me/${phoneClean}" target="_blank" class="btn whatsapp-btn">
    <!-- WhatsApp Icon -->
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 3.6 17.8L2 22l4.3-1.6
      A11 11 0 1 0 20.5 3.5z"/>
    </svg>
    WhatsApp
  </a>
</div>
        `
            : ""
        }

    ${item.email ? `<p>✉️ ${item.email}</p>` : ""}
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
// backend common filter code .
function applyCommonFilters(item, q, category, state, district) {
  // 🔎 TEXT TOKEN MATCH
  const searchableText = Object.values(item).join(" ").toLowerCase();

  const tokenMatch = !q || searchableText.includes(q);

  // 🎯 CATEGORY FILTER
  const categoryMatch = !category || item.category?.toLowerCase() === category;

  // 📍 STATE FILTER
  const stateMatch = !state || item.state?.toLowerCase() === state;

  // 📍 DISTRICT FILTER
  const districtMatch =
    !district || item.district?.toLowerCase().includes(district);

  return tokenMatch && categoryMatch && stateMatch && districtMatch;
}
function applySearch() {
  showSearchLoader(); // 🔄 start loader
  setTimeout(() => {
    saveSearchState(); // 💾 SAVE BEFORE SEARCH
    const q = input.value.toLowerCase().trim();
    const category = categoryFilter.value.toLowerCase();
    const state = stateFilter.value.toLowerCase();
    const district = districtFilter.value.toLowerCase();

    // 🚫 Prevent heavy search for very short input
    if (q.length === 1 && !isMathExpression(q)) {
      results.innerHTML =
        "<p style='text-align:center;color:#94a3b8;'>Type at least 2 characters to search</p>";
      hideSearchLoader();
      return;
    }

    // 🟡 EMPTY SEARCH STATE
    if (!q && !category && !state && !district) {
      resetPagination();
      results.innerHTML =
        "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";
      hideSearchLoader();
      return;
    }

    const queryTokens = normalizeText(q)
      .split(" ")
      .filter((t) => t.length >= 2);

    // 🔹 Unified search function
    function searchProfiles(queryTokens, category, state, district) {
      const combinedData = [...SEARCH_DATA, ...API_PROFILES_CACHE];

      const dataResults = shuffleArray(
        combinedData.filter((item) => {
          // Apply common filters first
          if (!applyCommonFilters(item, q, category, state, district)) {
            return false;
          }
          // Build searchable text
          const searchableText = normalizeText(
            [
              item.name,
              item.type,
              item.category,
              item.role,
              item.state,
              item.district,
              item.location,
              item.city,
              item.village,
              item.description,
            ]
              .filter(Boolean)
              .join(" "),
          );

          // Token match with typo tolerance
          const tokenMatch = queryTokens.every((token) => {
            if (searchableText.includes(token)) return true;

            if (token.length >= 4) {
              return searchableText.split(" ").some((word) => {
                const dist = levenshtein(word, token);
                if (word.length > 8) return dist <= 3;
                return dist <= 2;
              });
            }

            return false;
          });

          // Filters
          const categoryMatch =
            !category || item.category?.toLowerCase() === category;
          const stateMatch = !state || item.state?.toLowerCase() === state;
          const districtMatch =
            !district || item.district?.toLowerCase().includes(district);

          return tokenMatch && categoryMatch && stateMatch && districtMatch;
        }),
      ).slice(0, 50);

      return dataResults;
    }

    // 🔹 Run search
    const dataResults = searchProfiles(queryTokens, category, state, district);

    // 🔹 Other data sources
    const theoryResults = q ? searchTheory(q) : [];
    const designResults = q ? searchDesigns(q) : [];
    const mediaResults = q ? searchMedia(q) : [];
    const mathResults = q ? searchMathFormulas(q) : [];
    const kidsResults = q ? searchKids(q) : [];
    const QuizResults = q ? searchQuiz(q) : [];

    // 🔴 Clear old pagination
    resetPagination();

    // 🔹 Merge results
    lastSearchResults = [
      ...theoryResults,
      ...designResults,
      ...mediaResults,
      ...dataResults,
      ...mathResults,
      ...kidsResults,
      ...QuizResults,
    ];

    // 🔁 Reset to first page
    currentPage = 1;

    // 📄 Render first page
    renderPage();

    hideSearchLoader();
  }, 300);
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
    e.preventDefault(); // stop form submit / keyboard close
    debouncedSearch.cancel?.(); // safety
    applySearch();
    fetchPublishedProfiles();
    toggleClearButton(); // ✅ ONLY trigger
  }
});

// Filters: still update instantly
[categoryFilter, stateFilter, districtFilter].forEach((el) => {
  el.addEventListener("input", debounce(applySearch, 800));
});

results.innerHTML =
  "<p style='text-align:center;color:#64748b;'>Start typing or use voice search to see results.</p>";

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
    toggleClearButton(); // ✅ REQUIRED
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

// 4️⃣ event bindings (LAST)
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("clearSearchBtn")
    ?.addEventListener("click", clearSearchAll);

  toggleClearButton(); // initial state
});

document.addEventListener("DOMContentLoaded", async () => {
  // 1️⃣ load profiles first
  await fetchPublishedProfiles();

  // 2️⃣ restore previous search
  restoreSearchState();
});
