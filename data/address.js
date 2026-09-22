//const API_BASE = "http://localhost:5000/api/addresses";
const API_BASE = "https://api.buildskil.com/api/addresses";
const params = new URLSearchParams(location.search);
const readonly = params.get("readonly") === "1";
const returnPage = params.get("return") || "";

let addresses = [];
let form = { ...EMPTY_ADDRESS };
let editingId = "";

const els = {
  title: document.getElementById("title"),
  topAction: document.getElementById("topAction"),
  toggleForm: document.getElementById("toggleForm"),
  closeForm: document.getElementById("closeForm"),
  formPanel: document.getElementById("formPanel"),
  savedList: document.getElementById("savedList"),
  countText: document.getElementById("countText"),
};
/* =========================================================
   INDIA STATE / DISTRICT / PINCODE
========================================================= */

const INDIA_LOCATION_API =
  "https://api.postalpincode.in";
const ENABLE_PIN_LOOKUP = true;
/*
 * State and district data.
 *
 * You can replace this object with your complete
 * state/district JSON file later.
 *
 * The structure is:
 * State -> District[]
 */
const INDIA_STATE_DISTRICTS = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "Nellore",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],

  "Arunachal Pradesh": [
    "Anjaw",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Itanagar",
    "Kamle",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
  ],

  "Assam": [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],

  "Bihar": [
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

  "Chhattisgarh": [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Kondagaon",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Manendragarh-Chirmiri-Bharatpur",
    "Mohla-Manpur-Ambagarh Chowki",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sakti",
    "Sarangarh-Bilaigarh",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],

  "Delhi": [
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

  "Goa": [
    "North Goa",
    "South Goa",
  ],

  "Gujarat": [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udepur",
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

  "Haryana": [
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

  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],

  "Jharkhand": [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],

  "Karnataka": [
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

  "Kerala": [
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
    "Mauganj",
    "Morena",
    "Narmadapuram",
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

  "Maharashtra": [
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

  "Odisha": [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh",
  ],

  "Punjab": [
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
    "Malerkotla",
    "Mansa",
    "Moga",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sahibzada Ajit Singh Nagar",
    "Sangrur",
    "Shaheed Bhagat Singh Nagar",
    "Sri Muktsar Sahib",
    "Tarn Taran",
  ],

  "Rajasthan": [
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
    "Didwana-Kuchamana",
    "Dudu",
    "Dungarpur",
    "Ganganagar",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
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
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Tonk",
    "Udaipur",
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

  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhoopalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem Asifabad",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
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
    "Kheri",
    "Kushinagar",
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
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],

  "Uttarakhand": [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
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
};
/* =========================================================
   AUTH
========================================================= */

function getToken() {
  return localStorage.getItem("cb_token") || "";
}

/* =========================================================
   API HELPER
========================================================= */

async function apiFetch(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  /*
   * Only add JSON content type when a body exists.
   */
  if (options.body && typeof options.body !== "string") {
    headers["Content-Type"] = "application/json";
  }

  const finalOptions = {
    ...options,
    headers,
  };

  if (finalOptions.body && typeof finalOptions.body !== "string") {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }

  const response = await fetch(url, finalOptions);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

/* =========================================================
   NORMALIZE BACKEND ADDRESS
========================================================= */

function normalizeAddress(a = {}) {
  return {
    ...EMPTY_ADDRESS,

    id: String(a.id || a._id || ""),

    name: a.name || "",

    houseFlat: a.houseFlat || "",
    streetArea: a.streetArea || "",
    landmark: a.landmark || "",
    townCityVillage: a.townCityVillage || "",
    district: a.district || "",
    state: a.state || "",
    pincode: a.pincode || "",
    country: a.country || "India",

    latitude:
      a.latitude === null || a.latitude === undefined ? "" : String(a.latitude),

    longitude:
      a.longitude === null || a.longitude === undefined
        ? ""
        : String(a.longitude),

    addressType: a.addressType || "Home",

    createdAt: a.createdAt || "",
    updatedAt: a.updatedAt || "",
  };
}

/* =========================================================
   EXTRACT ADDRESS LIST FROM API RESPONSE
========================================================= */

function extractAddresses(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.addresses)) {
    return data.addresses;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (data?.address) {
    return [data.address];
  }

  return [];
}

/* =========================================================
   LOAD MY ADDRESSES
========================================================= */

async function loadAddresses() {
  if (readonly) return;

  try {
    els.savedList.innerHTML = `
      <div class="card" style="background:#f8fafc">
        Loading addresses...
      </div>
    `;

    const data = await apiFetch(API_BASE, {
      method: "GET",
    });

    addresses = extractAddresses(data).map(normalizeAddress);

    renderList();
  } catch (error) {
    console.error("Load addresses error:", error);

    addresses = [];

    els.savedList.innerHTML = `
      <div class="card" style="background:#fef2f2;color:#991b1b">
        ${escapeHtml(error.message || "Could not load addresses.")}
      </div>
    `;

    els.countText.textContent = "Unable to load addresses.";
  }
}

/* =========================================================
   CREATE ADDRESS
========================================================= */

async function createAddress() {
  const payload = buildApiPayload();

  const data = await apiFetch(API_BASE, {
    method: "POST",
    body: payload,
  });

  const created = data?.address || data?.data || data;

  return normalizeAddress(created);
}

/* =========================================================
   UPDATE ADDRESS
========================================================= */

async function updateAddress(id) {
  const payload = buildApiPayload();

  const data = await apiFetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });

  const updated = data?.address || data?.data || data;

  return normalizeAddress(updated);
}

/* =========================================================
   DELETE ADDRESS
========================================================= */

async function deleteAddressApi(id) {
  return apiFetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/* =========================================================
   API PAYLOAD
========================================================= */

function buildApiPayload() {
  return {
    name: form.name || "",

    houseFlat: form.houseFlat || "",
    streetArea: form.streetArea || "",
    landmark: form.landmark || "",
    townCityVillage: form.townCityVillage || "",
    district: form.district || "",
    state: form.state || "",
    pincode: form.pincode || "",
    country: form.country || "India",

    latitude:
      form.latitude !== "" &&
      form.latitude !== null &&
      form.latitude !== undefined
        ? Number(form.latitude)
        : null,

    longitude:
      form.longitude !== "" &&
      form.longitude !== null &&
      form.longitude !== undefined
        ? Number(form.longitude)
        : null,

    addressType: form.addressType || "Home",
  };
}

/* =========================================================
   NAVIGATION
========================================================= */
const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        // Click effect
        backBtn.classList.add("back-click");

        setTimeout(() => {
            backBtn.classList.remove("back-click");

            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "index.html";
            }
        }, 120);
    });
}
function goBack() {
  if (returnPage === "book-user") {
    location.href = "book-user.html";
  } else {
    history.back();
  }
}

/* =========================================================
   READONLY MODE
========================================================= */

function setReadOnly() {
  if (!readonly) return;

  document.getElementById("manager").classList.add("hidden");

  form = {
    ...EMPTY_ADDRESS,
    ...(getReadonlyAddress() || {}),
  };

  els.title.textContent = params.get("title") || "Work Location";

  els.topAction.textContent = "My address";

  els.topAction.onclick = () => {
    location.href = "address.html";
  };

  openForm(true);
}

/* =========================================================
   OPEN FORM
========================================================= */

function openForm(ro = false) {
  els.formPanel.classList.remove("hidden");

  els.toggleForm.textContent = "Close";
  els.topAction.textContent = "Close";

  fill();

  if (ro) {
    document
      .querySelectorAll(
        "#formPanel input,#formPanel button,#formPanel textarea",
      )
      .forEach((e) => {
        if (e.id !== "closeForm") {
          e.disabled = true;
        }
      });
  }
}

/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {
  if (readonly) return;

  els.formPanel.classList.add("hidden");

  els.toggleForm.textContent = "+ Add address";
  els.topAction.textContent = "+ Add address";

  editingId = "";
  form = { ...EMPTY_ADDRESS };
}

/* =========================================================
   FILL FORM
========================================================= */

function fill() {
  /*
   * Normal text inputs / textarea
   */
  for (const k of [
    "name",
    "houseFlat",
    "streetArea",
    "landmark",
    "townCityVillage",
    "country",
    "latitude",
    "longitude",
  ]) {
    const element =
      document.getElementById(k);

    if (element) {
      element.value = form[k] ?? "";
    }
  }

  /*
   * STATE
   */
  populateStates(form.state || "");

  /*
   * DISTRICT
   */
  populateDistricts(
    form.state || "",
    form.district || "",
  );

  /*
   * PINCODE
   *
   * Pincode is loaded asynchronously from
   * the district.
   */
  const pincodeEl =
  document.getElementById("pincode");

const manualPincodeEl =
  document.getElementById(
    "manualPincode",
  );

if (pincodeEl) {
  if (form.district) {
    loadPincodesByDistrict(
      form.district,
      form.pincode || "",
    );
  } else {
    resetPincode();
  }
}

if (manualPincodeEl) {
  manualPincodeEl.value =
    form.pincode || "";
}

  /*
   * ADDRESS TYPE
   */
  document
    .querySelectorAll(".radio")
    .forEach((b) => {
      b.classList.toggle(
        "active",
        b.dataset.type === form.addressType,
      );
    });

  /*
   * FULL ADDRESS PREVIEW
   */
  const preview =
    document.getElementById("preview");

  if (preview) {
    preview.textContent =
      formatFullAddress(form) ||
      "Address details will appear here.";
  }
}

/* =========================================================
   COLLECT FORM
========================================================= */
function collect() {
  for (const k of [
    "name",
    "houseFlat",
    "streetArea",
    "landmark",
    "townCityVillage",
    "country",
    "latitude",
    "longitude",
  ]) {
    const element =
      document.getElementById(k);

    if (element) {
      form[k] = element.value.trim();
    }
  }

  const stateEl =
    document.getElementById("state");

  const districtEl =
    document.getElementById("district");

  const pincodeEl =
    document.getElementById("pincode");

  const manualPincodeEl =
    document.getElementById(
      "manualPincode",
    );

  if (stateEl) {
    form.state =
      stateEl.value;
  }

  if (districtEl) {
    form.district =
      districtEl.value;
  }

  /*
   * Manual PIN takes priority.
   */
  if (
    pincodeEl &&
    pincodeEl.value === "__manual__"
  ) {
    form.pincode =
      manualPincodeEl?.value?.trim() || "";
  } else if (pincodeEl) {
    form.pincode =
      pincodeEl.value;
  }
}

/* =========================================================
   RENDER SAVED LIST
========================================================= */

function renderList() {
  if (readonly) return;

  els.countText.textContent = addresses.length
    ? `${addresses.length} saved address${addresses.length === 1 ? "" : "es"}`
    : "Add an address for bookings and work locations.";

  if (!addresses.length) {
    els.savedList.innerHTML = `
      <div class="card" style="background:#f8fafc">
        <div style="color:#64748b">
          No saved addresses yet.
        </div>
      </div>
    `;

    return;
  }

  els.savedList.innerHTML = addresses
    .map((a) => {
      const id = String(a.id);

      return `
        <div
          class="card"
          style="background:#f8fafc"
        >
          <div class="row space">

            <div>
              <strong>
                ${escapeHtml(a.name || "Unnamed address")}
              </strong>

              <div
                class="address"
                style="color:#334155"
              >
                ${escapeHtml(
                  formatFullAddress(a) || "Address details not filled yet.",
                )}
              </div>
            </div>

           <button
  type="button"
  class="close"
  data-action="toggle-menu"
  data-id="${escapeHtml(id)}"
>
  ⋮
</button>

</div>

<div
  id="m_${escapeHtml(id)}"
  class="saved-actions hidden"
>

  <button
    type="button"
    class="btn secondary"
    data-action="edit-address"
    data-id="${escapeHtml(id)}"
  >
    Edit
  </button>

  <button
    type="button"
    class="btn secondary"
    data-action="use-address"
    data-id="${escapeHtml(id)}"
  >
    Use
  </button>

  <button
    type="button"
    class="btn danger"
    data-action="delete-address"
    data-id="${escapeHtml(id)}"
  >
    Delete
  </button>

          </div>
        </div>
      `;
    })
    .join("");
}

document.addEventListener("click", function (event) {

  const button =
    event.target.closest(
      "[data-action]"
    );

  if (!button) {
    return;
  }

  const action =
    button.dataset.action;

  const id =
    button.dataset.id;

  if (!id) {
    return;
  }

  switch (action) {

    case "toggle-menu":
      toggleMenu(id);
      break;

    case "edit-address":
      editAddress(id);
      break;

    case "use-address":
      useAddress(id);
      break;

    case "delete-address":
      deleteAddress(id);
      break;

  }
});
/* =========================================================
   TOGGLE MENU
========================================================= */

function toggleMenu(id) {
  const element = document.getElementById("m_" + id);

  if (element) {
    element.classList.toggle("hidden");
  }
}

/* =========================================================
   EDIT ADDRESS
========================================================= */

function editAddress(id) {
  const address = addresses.find((x) => String(x.id) === String(id));

  if (!address) return;

  editingId = id;

  form = {
    ...EMPTY_ADDRESS,
    ...address,
  };

  document.getElementById("formTitle").textContent = "Edit address";

  openForm();
}

/* =========================================================
   USE ADDRESS
========================================================= */

function useAddress(id) {
  const address = addresses.find((x) => String(x.id) === String(id));

  if (!address) return;

  form = {
    ...EMPTY_ADDRESS,
    ...address,
  };

  sessionStorage.setItem("buildskil_selected_address_v1", JSON.stringify(form));

  if (returnPage === "book-user") {
    location.href = "book-user.html";
  } else {
    fill();
    openForm();
  }
}

/* =========================================================
   DELETE ADDRESS
========================================================= */

async function deleteAddress(id) {
  if (!confirm("Delete this saved address?")) {
    return;
  }

  try {
    const buttonContainer = document.getElementById("m_" + id);

    if (buttonContainer) {
      buttonContainer.innerHTML = `
        <div style="color:#64748b;padding:8px 0">
          Deleting...
        </div>
      `;
    }

    await deleteAddressApi(id);

    addresses = addresses.filter((x) => String(x.id) !== String(id));

    renderList();

    alert("Address deleted.");
  } catch (error) {
    console.error("Delete address error:", error);

    alert(error.message || "Could not delete the address.");

    renderList();
  }
}

/* =========================================================
   SAVE BUTTON
========================================================= */

els.toggleForm.onclick = () => {
  if (els.formPanel.classList.contains("hidden")) {
    editingId = "";

    form = {
      ...EMPTY_ADDRESS,
    };

    document.getElementById("formTitle").textContent = "Create address";

    openForm();
  } else {
    closeForm();
  }
};

els.topAction.onclick = els.toggleForm.onclick;

els.closeForm.onclick = closeForm;

/* =========================================================
   ADDRESS TYPE
========================================================= */

document.querySelectorAll(".radio").forEach((b) => {
  b.onclick = () => {
    form.addressType = b.dataset.type;

    document
      .querySelectorAll(".radio")
      .forEach((x) => x.classList.toggle("active", x === b));
  };
});

/* =========================================================
   PINCODE
========================================================= 

const pincodeElement = document.getElementById("pincode");

if (pincodeElement) {
  pincodeElement.oninput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
  };
}*/

/* =========================================================
   FORM LIVE PREVIEW
========================================================= */

document
  .querySelectorAll("#formPanel input,#formPanel textarea")
  .forEach((e) => {
    e.addEventListener("input", () => {
      collect();

      const preview = document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) || "Address details will appear here.";
      }
    });
  });

/* =========================================================
   SAVE ADDRESS
========================================================= */

document.getElementById("save").onclick = async () => {
  collect();

  if (!form.name) {
    alert("Please enter an address name.");
    return;
  }

  if (!form.townCityVillage && !form.district) {
    alert("Please enter at least Town/City/Village or District.");
    return;
  }

  if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
    alert("PIN code must be 6 digits.");
    return;
  }

  const saveButton = document.getElementById("save");

  const originalText = saveButton ? saveButton.textContent : "Save Address";

  try {
    if (saveButton) {
      saveButton.disabled = true;

      saveButton.textContent = editingId ? "Updating..." : "Saving...";
    }

    let savedAddress;

    if (editingId) {
      savedAddress = await updateAddress(editingId);

      addresses = addresses.map((x) =>
        String(x.id) === String(editingId) ? savedAddress : x,
      );
    } else {
      savedAddress = await createAddress();

      addresses = [savedAddress, ...addresses];
    }

    form = {
      ...EMPTY_ADDRESS,
      ...savedAddress,
    };

    /*
     * Book User flow:
     * Save the address in sessionStorage as the
     * selected work location, then return.
     */
    if (returnPage === "book-user") {
      sessionStorage.setItem(
        "buildskil_selected_address_v1",
        JSON.stringify(form),
      );

      location.href = "book-user.html";
      return;
    }

    alert(
      editingId
        ? "Your address has been updated."
        : "Your address has been saved.",
    );

    closeForm();
    renderList();
  } catch (error) {
    console.error("Save address error:", error);

    alert(error.message || "Could not save the address.");
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = originalText;
    }
  }
};

/* =========================================================
   CURRENT LOCATION
========================================================= */

document.getElementById("locate").onclick = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported in this browser.");
    return;
  }

  const locateButton = document.getElementById("locate");

  const originalText = locateButton
    ? locateButton.textContent
    : "Use current location";

  if (locateButton) {
    locateButton.disabled = true;
    locateButton.textContent = "Getting location...";
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.latitude = String(pos.coords.latitude);

      form.longitude = String(pos.coords.longitude);

      fill();

      if (locateButton) {
        locateButton.disabled = false;
        locateButton.textContent = originalText;
      }
    },

    (err) => {
      console.error("Geolocation error:", err);

      alert(
        "Could not fetch your current location. Please allow location permission and enable GPS.",
      );

      if (locateButton) {
        locateButton.disabled = false;
        locateButton.textContent = originalText;
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 20000,
    },
  );
};

// dropdown function
/* =========================================================
   LOCATION DROPDOWN EVENTS
========================================================= */

const stateElement =
  document.getElementById("state");

const districtElement =
  document.getElementById("district");

const pincodeElement =
  document.getElementById("pincode");


if (stateElement) {
  stateElement.addEventListener(
    "change",
    async () => {
      const selectedState =
        stateElement.value;

      form.state = selectedState;

      form.district = "";
      form.pincode = "";

      populateDistricts(selectedState);

      resetPincode();

      const preview =
        document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) ||
          "Address details will appear here.";
      }
    },
  );
}


if (districtElement) {
  districtElement.addEventListener(
    "change",
    async () => {
      const selectedDistrict =
        districtElement.value;

      form.district =
        selectedDistrict;

      form.pincode = "";

      resetPincode();

      if (!selectedDistrict) {
        return;
      }

      await loadPincodesByDistrict(
        selectedDistrict,
      );

      const preview =
        document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) ||
          "Address details will appear here.";
      }
    },
  );
}


if (pincodeElement) {
  pincodeElement.addEventListener(
    "change",
    () => {
      form.pincode =
        pincodeElement.value;

      const preview =
        document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) ||
          "Address details will appear here.";
      }
    },
  );
}
 /* =========================================================
   STATE DROPDOWN
========================================================= */

function populateStates(selectedState = "") {
  const stateEl = document.getElementById("state");

  if (!stateEl) return;

  stateEl.innerHTML = `
    <option value="">Select State</option>
  `;

  Object.keys(INDIA_STATE_DISTRICTS)
    .sort()
    .forEach((state) => {
      const option = document.createElement("option");

      option.value = state;
      option.textContent = state;

      if (state === selectedState) {
        option.selected = true;
      }

      stateEl.appendChild(option);
    });
}

/* =========================================================
   DISTRICT DROPDOWN
========================================================= */

function populateDistricts(
  selectedState,
  selectedDistrict = "",
) {
  const districtEl =
    document.getElementById("district");

  if (!districtEl) return;

  districtEl.innerHTML = `
    <option value="">Select District</option>
  `;

  districtEl.disabled = true;

  const districts =
    INDIA_STATE_DISTRICTS[selectedState] || [];

  districts.forEach((district) => {
    const option =
      document.createElement("option");

    option.value = district;
    option.textContent = district;

    if (district === selectedDistrict) {
      option.selected = true;
    }

    districtEl.appendChild(option);
  });

  if (districts.length) {
    districtEl.disabled = false;
  }
}

/* =========================================================
   RESET PINCODE
========================================================= */
function resetPincode() {
  const pincodeEl =
    document.getElementById("pincode");

  const manualPincodeEl =
    document.getElementById("manualPincode");

  const statusEl =
    document.getElementById("pincodeStatus");

  if (pincodeEl) {
    pincodeEl.innerHTML = `
      <option value="">Select PIN code</option>
      <option value="__manual__">
        Enter PIN manually
      </option>
    `;

    pincodeEl.value = "";
  }

  if (manualPincodeEl) {
    manualPincodeEl.value = "";
    manualPincodeEl.style.display = "none";
  }

  if (statusEl) {
    statusEl.textContent = "";
  }

  form.pincode = "";
}
/* =========================================================
   MANUAL PIN
========================================================= */

function enableManualPincode(value = "") {
  const manualPincodeEl =
    document.getElementById("manualPincode");

  const pincodeEl =
    document.getElementById("pincode");

  const statusEl =
    document.getElementById("pincodeStatus");

  if (!manualPincodeEl) return;

  manualPincodeEl.style.display = "block";
  manualPincodeEl.value = value || "";

  if (pincodeEl) {
    pincodeEl.value = "__manual__";
  }

  if (statusEl) {
    statusEl.textContent =
      "Enter your 6-digit PIN code manually.";
  }

  form.pincode = value || "";
}

/* =========================================================
   FETCH PINCODES BY DISTRICT
========================================================= */
/* =========================================================
   OPTIONAL PIN LOOKUP
========================================================= */

async function loadPincodesByDistrict(
  district,
  selectedPincode = "",
) {
  const pincodeEl =
    document.getElementById("pincode");

  const manualPincodeEl =
    document.getElementById("manualPincode");

  const statusEl =
    document.getElementById("pincodeStatus");

  if (!pincodeEl) return;

  /*
   * Reset first.
   */
  pincodeEl.innerHTML = `
    <option value="">Select PIN code</option>
    <option value="__manual__">
      Enter PIN manually
    </option>
  `;

  pincodeEl.value = "";

  if (manualPincodeEl) {
    manualPincodeEl.style.display = "none";
    manualPincodeEl.value = "";
  }

  /*
   * PIN lookup is optional.
   */
  if (!ENABLE_PIN_LOOKUP || !district) {
    enableManualPincode(selectedPincode);
    return;
  }

  if (statusEl) {
    statusEl.textContent =
      "Finding PIN codes...";
  }

  try {
    const response = await fetch(
      `${INDIA_LOCATION_API}/postoffice/${encodeURIComponent(
        district,
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `PIN service returned ${response.status}`,
      );
    }

    const data = await response.json();

    const postOffices =
      Array.isArray(data) &&
      data[0]?.Status === "Success"
        ? data[0].PostOffice || []
        : [];

    const pincodes = [
      ...new Set(
        postOffices
          .map((office) =>
            String(office.Pincode || "").trim(),
          )
          .filter((pin) =>
            /^\d{6}$/.test(pin),
          ),
      ),
    ].sort();

    /*
     * API returned nothing.
     * Manual entry remains available.
     */
    if (!pincodes.length) {
      enableManualPincode(
        selectedPincode || "",
      );

      if (statusEl) {
        statusEl.textContent =
          "PIN could not be found automatically. Enter it manually.";
      }

      return;
    }

    /*
     * Populate dropdown.
     */
    pincodeEl.innerHTML = `
      <option value="">Select PIN code</option>
    `;

    pincodes.forEach((pin) => {
      const option =
        document.createElement("option");

      option.value = pin;
      option.textContent = pin;

      pincodeEl.appendChild(option);
    });

    /*
     * Manual option is ALWAYS available.
     */
    const manualOption =
      document.createElement("option");

    manualOption.value = "__manual__";
    manualOption.textContent =
      "Enter PIN manually";

    pincodeEl.appendChild(manualOption);

    /*
     * Existing PIN from database.
     */
    if (
      selectedPincode &&
      pincodes.includes(
        String(selectedPincode),
      )
    ) {
      pincodeEl.value =
        String(selectedPincode);

      form.pincode =
        String(selectedPincode);
    }

    /*
     * Existing PIN doesn't belong to returned
     * list, so use manual mode.
     */
    else if (
      selectedPincode &&
      /^\d{6}$/.test(
        String(selectedPincode),
      )
    ) {
      enableManualPincode(
        String(selectedPincode),
      );
    }

    /*
     * No existing PIN:
     * automatically select first PIN.
     */
    else {
      pincodeEl.value =
        pincodes[0];

      form.pincode =
        pincodes[0];
    }

    if (statusEl) {
      statusEl.textContent =
        `${pincodes.length} PIN code${
          pincodes.length === 1 ? "" : "s"
        } found.`;
    }
  } catch (error) {
    /*
     * IMPORTANT:
     * External API failure must NEVER
     * break address saving.
     */
    console.warn(
      "Optional PIN lookup unavailable:",
      error,
    );

    enableManualPincode(
      selectedPincode || "",
    );

    if (statusEl) {
      statusEl.textContent =
        "Automatic PIN lookup unavailable. Enter PIN manually.";
    }
  }
}
/* =========================================================
   PINCODE SELECT
========================================================= */

//const pincodeElement =document.getElementById("pincode");

const manualPincodeElement =
  document.getElementById("manualPincode");


if (pincodeElement) {
  pincodeElement.addEventListener(
    "change",
    () => {
      const value =
        pincodeElement.value;

      if (value === "__manual__") {
        enableManualPincode(
          form.pincode || "",
        );

        return;
      }

      /*
       * Normal automatic PIN.
       */
      const manual =
        document.getElementById(
          "manualPincode",
        );

      if (manual) {
        manual.style.display = "none";
        manual.value = "";
      }

      form.pincode = value || "";

      const preview =
        document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) ||
          "Address details will appear here.";
      }
    },
  );
}
if (manualPincodeElement) {
  manualPincodeElement.addEventListener(
    "input",
    (e) => {
      e.target.value =
        e.target.value
          .replace(/\D/g, "")
          .slice(0, 6);

      form.pincode =
        e.target.value;

      const preview =
        document.getElementById("preview");

      if (preview) {
        preview.textContent =
          formatFullAddress(form) ||
          "Address details will appear here.";
      }
    },
  );
}
/* =========================================================
   INITIAL LOAD
========================================================= */

async function initAddressScreen() {
  /*
   * Readonly mode does not need the address list.
   */
  if (readonly) {
    setReadOnly();
    return;
  }

  /*
   * Load genuine addresses from backend.
   */
  await loadAddresses();

  /*
   * When coming from Book User, restore the selected
   * address from sessionStorage.
   */
  if (returnPage === "book-user") {
    const selected = readJson("buildskil_selected_address_v1", null);

    if (selected) {
      form = {
        ...EMPTY_ADDRESS,
        ...selected,
      };

      sessionStorage.removeItem("buildskil_selected_address_v1");
    }
  }
}

initAddressScreen();
