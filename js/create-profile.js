const API_BASE = "https://api.buildskil.com/api/profiles";
const SERVER_BASE = "https://api.buildskil.com";
//const API_BASE = "http://localhost:5000/api/profiles"; // change if using domain
//const SERVER_BASE = "http://localhost:5000"; // change if using domain
let EDIT_PROFILE_ID = null;
let ORIGINAL_MEDIA = null;
let activeRequests = 0;
function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const login = JSON.parse(localStorage.getItem("cb_login_user"));
  const form = document.getElementById("profileForm");
  const card = document.getElementById("profileCard");
  const nameInput = document.getElementById("name");
  const roleSelect = document.getElementById("role");
  const categorySelect = document.getElementById("category");
  const experienceInput = document.getElementById("experience");
  const locationInput = document.getElementById("location");
  const stateInput = document.getElementById("state");
  const districtInput = document.getElementById("district");
  const descriptionInput = document.getElementById("description");
  const mediaInput = document.getElementById("media");
  const albumInput = document.getElementById("album");
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formWrapper = document.getElementById("formWrapper");
  const districtsByState  = {
   "Haryana" :[
  "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar",
  "Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal",
  "Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar",],
  "Uttar Pradesh": [
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
  ],
   "Delhi": [
  "Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi",
  "North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi",],

   "Bihar": [
  "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga",
  "East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj",
  "Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia",
  "Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul",
  "Vaishali","West Champaran",],

   "Odisha": [
  "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal",
  "Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara",
  "Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada",
  "Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh",],

   "Chandigarh": [
  "Chandigarh",],

   "Punjab": [
  "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur",
  "Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot",
  "Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran",],

   "Gujarat": [
  "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur",
  "Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch",
  "Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha",
  "Surat","Surendranagar","Tapi","Vadodara","Valsad",],
   "Rajasthan": [
  "Ajmer","Alwar","Anupgarh","Balotra","Banswara","Baran","Barmer","Beawar","Bharatpur",
  "Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Deeg","Dholpur","Didwana-Kuchaman",
  "Dungarpur","Gangapur City","Hanumangarh","Jaipur","Jaipur Rural","Jaisalmer","Jalore","Jhalawar",
  "Jhunjhunu","Jodhpur","Jodhpur Rural","Karauli","Kekri","Khairthal-Tijara","Kota","Kotputli-Behror",
  "Nagaur","Neem Ka Thana","Pali","Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore",
  "Sawai Madhopur","Shahpura","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur",],

  "Madhya Pradesh": [
  "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind",
  "Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori",
  "Guna","Gwalior","Harda","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone",
  "Maihar","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Niwari","Panna","Raisen",
  "Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur",
  "Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha",],

  "Maharashtra": [
  "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur",
  "Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City",
  "Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani",
  "Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal",],

   "Karnataka": [
  "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar",
  "Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad",
  "Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru",
  "Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayanagara",
  "Vijayapura","Yadgir",],

  "Tamil Nadu": [
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul",
  "Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai",
  "Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram",
  "Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
  "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur",
  "Vellore","Viluppuram","Virudhunagar",],

  "West Bengal": [
  "Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling",
  "Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda",
  "Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur",
  "Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur",],

  "Andhra Pradesh":[
  "Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla","Chittoor",
  "East Godavari","Eluru","Guntur","Kakinada","Konaseema","Krishna","Kurnool",
  "Nandyal","NTR","Palnadu","Parvathipuram Manyam","Prakasam","SPSR Nellore",
  "Srikakulam","Sri Sathya Sai","Tirupati","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa",],

  "Telangana": [
  "Adilabad","Bhadradri Kothagudem","Hanamkonda","Hyderabad","Jagtial","Jangaon",
  "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
  "Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal–Malkajgiri",
  "Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
  "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad",
  "Wanaparthy","Warangal","Yadadri Bhuvanagiri",],
  "Kerala": [
  "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam",
  "Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram",
  "Thrissur","Wayanad",],

   "Himachal Pradesh":[
  "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti",
  "Mandi","Shimla","Sirmaur","Solan","Una",],

  "Uttarakhand": [
  "Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital",
  "Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi",],

   "Jharkhand": [
  "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa",
  "Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar",
  "Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum",],

  "Chhattisgarh": [
  "Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur",
  "Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa",
  "Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund",
  "Manendragarh-Chirmiri-Bharatpur","Mohla-Manpur-Ambagarh Chowki","Mungeli",
  "Narayanpur","Raigarh","Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh",
  "Sukma","Surajpur","Surguja",],

   "Assam": [
  "Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang",
  "Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat",
  "Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong",
  "Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari",
  "Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong",],

  "Arunachal Pradesh": [
  "Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle",
  "Kra Daadi","Kurung Kumey","Leparada","Lohit","Longding","Lower Dibang Valley",
  "Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare",
  "Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri",
  "West Kameng","West Siang","Keyi Panyor",],

  "Nagaland": [
  "Chümoukedima","Dimapur","Kiphire","Kohima","Longleng","Mokokchung",
  "Mon","Niuland","Noklak","Peren","Phek","Shamator","Tseminyü","Tuensang","Wokha","Zunheboto",],

  "Manipur": [
  "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam",
  "Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong",
  "Tengnoupal","Thoubal","Ukhrul",],

  "Meghalaya": [
  "East Garo Hills","East Jaintia Hills","East Khasi Hills","Mairang",
  "North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills",
  "South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills",],

   "Mizoram": [
  "Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
  "Lunglei","Mamit","Saiha","Saitual","Serchhip",],

  "Tripura": [
  "Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura",
  "Unakoti","West Tripura",
],

  "Goa": [
  "North Goa","South Goa",
],

   "Sikkim": [
  "Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng",
],

   "Jammu & Kashmir": [
  "Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu",
  "Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri",
  "Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur",],

   "Ladakh": [
  "Kargil","Leh",
],

   "Andaman & Nicobar": [
  "Nicobar","North and Middle Andaman","South Andaman",
],

   "Dadra & Nagar Haveli and Daman & Diu": [
  "Dadra and Nagar Haveli","Daman","Diu",
],

   "Lakshadweep": [
  "Lakshadweep",
],

   "Puducherry": [
  "Karaikal","Mahe","Puducherry","Yanam",
]
};
stateInput.addEventListener("change", () => {
  const state = stateInput.value;

  districtInput.innerHTML =
    '<option value="">Select District</option>';

  if (districtsByState[state]) {
    districtsByState[state].forEach((district) => {
      const option = document.createElement("option");

      option.value = district;
      option.textContent = district;

      districtInput.appendChild(option);
    });
  }
});
  async function compressImage(file) {
    return new Promise((resolve) => {
      // ✅ skip videos or non-images
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onerror = () => resolve(file);

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onerror = () => resolve(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".jpg"),
              { type: "image/jpeg" },
            );

            resolve(compressedFile);
          },
          "image/jpeg",
          0.7, // quality
        );
      };

      reader.readAsDataURL(file);
    });
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!login) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();

    let mediaFile = mediaInput.files[0];

    if (mediaFile) {
      // ✅ ORIGINAL SIZE
      console.log(
        "Original:",
        (mediaFile.size / 1024 / 1024).toFixed(2) + " MB",
      );
      // 🔥 compress before upload
      mediaFile = await compressImage(mediaFile);
      // ✅ COMPRESSED SIZE
      console.log(
        "Compressed:",
        (mediaFile.size / 1024 / 1024).toFixed(2) + " MB",
      );
      formData.append("media", mediaFile);
    } else if (EDIT_PROFILE_ID) {
      formData.append("keepMedia", "true");
    }
    // ✅ Handle album (multiple images with compression)
    const albumFiles = albumInput.files;
    for (let i = 0; i < albumFiles.length; i++) {
      let file = albumFiles[i];

      // log original size
      console.log(
        `Album[${i}] Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      );

      // compress before upload
      file = await compressImage(file);

      // log compressed size
      console.log(
        `Album[${i}] Compressed: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      );

      formData.append("album", file);
    }
    formData.append("name", nameInput.value.trim());
    formData.append("category", categorySelect.value);
    formData.append("role", roleSelect.value);
    formData.append("experience", experienceInput.value);
    formData.append("location", locationInput.value);
    formData.append("state", stateInput.value);
    formData.append("district", districtInput.value);
    formData.append("description", descriptionInput.value);
    formData.append("skills", skills.value);
    formData.append("teamSize", teamSize.value);
    formData.append("projectsDone", projectsDone.value);
    formData.append("price", price.value);
    formData.append("languages", languages.value);
    let url = API_BASE;
    const method = EDIT_PROFILE_ID ? "PUT" : "POST";

    if (EDIT_PROFILE_ID) {
      url = `${API_BASE}/${EDIT_PROFILE_ID}`;
      method;
    }

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: formData,
    });

   if (!res.ok) {
  // line 159 to 174 linit checker Try to read the backend’s error message
  let msg = "Profile creation failed";
  try {
    const data = await res.json();
    if (data?.message) {
      msg = data.message;
    }
  } catch (e) {
    // If response isn’t JSON, keep default message
  }
  alert(msg);
  return;
}
/**if (!res.ok) {
  alert("Profile creation failed");
  return;
} */

    await loadMyProfiles();
    EDIT_PROFILE_ID = null; // ⭐ reset edit mode
    form.reset();
    formWrapper.classList.add("hidden");
    toggleBtn.textContent = "➕ Add Profile";
  });
  toggleBtn.addEventListener("click", () => {
    formWrapper.classList.toggle("hidden");

    toggleBtn.textContent = formWrapper.classList.contains("hidden")
      ? "➕ Add Profile"
      : "❌ Close Form";
  });

  function renderProfiles(list) {
    card.innerHTML = list
      .map(
        (p) => `
    <div class="profile-card-item" id="card-${p._id}">

      <div class="profile-media">
        ${
          p.mediaType === "video"
            ? `<video src="${p.media}" controls></video>`
            : `<img src="${p.media}?v=${Date.now()}" />`
        }
      </div>

      <div class="profile-body">
        <h3>${p.name}</h3>
        <p>${p.category} • ${p.role || ""} • ${p.experience} yrs</p>
        <p>${p.location}, ${p.state}, ${p.district}</p>
        <p>${p.description}</p>

        <div class="profile-actions-float">
          <a class="action-btn call" href="tel:${p.phone}">
            <span>📞</span>
          </a>

          <a class="action-btn whatsapp"
             href="https://wa.me/${p.phone.replace(/\D/g, "")}"
             target="_blank">
            <span>🟢</span>
          </a>
        </div>

        ${
          p.published
            ? `
              <div class="profile-actions">
                <button class="vtn"onclick="editProfile('${p._id}')">Edit</button>
                <button class="btn" onclick="deleteProfile('${p._id}')">Delete</button>
              </div>
            `
            : `
              <button onclick="togglePublish('${p._id}')">Publish</button>
            `
        }

      </div>
    </div>
  `,
      )
      .join("");

    card.classList.remove("hidden");
  }

  async function editProfile(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const profile = await res.json();

      // switch to edit mode
      EDIT_PROFILE_ID = id;
      ORIGINAL_MEDIA = profile.media; // ⭐ store original
      // fill form fields
      nameInput.value = profile.name || "";
      categorySelect.value = profile.category || "";
      roleSelect.value = profile.role || "";
      experienceInput.value = profile.experience || "";
      locationInput.value = profile.location || "";
      stateInput.value = profile.state || "";
      districtInput.value = profile.district || "";
      descriptionInput.value = profile.description || "";
      skills.value = profile.skills ? profile.skills.join(", ") : "";
      teamSize.value = profile.teamSize || "";
      projectsDone.value = profile.projectsDone || "";
      price.value = profile.price || "";
      languages.value = profile.languages ? profile.languages.join(", ") : "";
      // ✅ Populate roles for this category and pre-select saved role
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';
    if (categories[profile.category]) {
      categories[profile.category].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;

        if (option.value === profile.role.toLowerCase().replace(/\s+/g, "-")) {
          option.selected = true; // pre-select saved role
        }

        roleSelect.appendChild(option);
      });
    }

      // mediaInput .value = "";
      // ✅ Album preview
      const albumPreview = document.getElementById("albumPreview");
      albumPreview.innerHTML = "";
      if (profile.album && profile.album.length) {
        profile.album.forEach((img) => {
          const imageEl = document.createElement("img");
          imageEl.src = img.url;
          imageEl.style.width = "80px";
          imageEl.style.height = "80px";
          imageEl.style.objectFit = "cover";
          imageEl.style.marginRight = "8px";
          albumPreview.appendChild(imageEl);
        });
      }

      // open form
      formWrapper.classList.remove("hidden");
      toggleBtn.textContent = "❌ Close Form";

      // scroll to form
      formWrapper.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    }
  }
  // Define categories for each role
  const categories = {
    contractor: [
      "Plumbing",
      "Electrician",
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
      "Glass",
    ],
    technician: [
      "Electrical Technician",
      "Plumbing Technician",
      "HVAC Technician",
      "Carpentry Technician",
      "Raj Mistry",
      "Marble",
      "Painter",
      "POP",
      "weilding",
      "Glass",
      "Structural", "Renovation","Solar Technician","Demolition Technician",
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
    client:[
      "require Painter",
      "PLumber",
      "Havc",
      "Raj Mistry",
      "Technician",
      "Machanic",
      "Carpenter",
      "renovation",
      "Marble&Tiles",
      "Electrician",
      "Glass",
    ]
  };

  // Update category dropdown when role changes
  categorySelect.addEventListener("change", () => {
    const category = categorySelect.value;
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';

    if (categories[category]) {
      categories[category].forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;
        roleSelect.appendChild(option);
      });
    }
  });
  async function togglePublish(id) {
    await fetch(`${API_BASE}/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    loadMyProfiles();
  }
  async function deleteProfile(id) {
    if (!confirm("Delete this profile?")) return;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) return;

    // 🔥 instantly remove from UI
    const el = document.getElementById(`card-${id}`);
    if (el) el.remove();
  }

  async function loadMyProfiles() {
    const res = await fetch(`${API_BASE}/my`, {
      headers: authHeaders(),
    });

    const list = await res.json();

    if (list.length) {
      renderProfiles(list);
    }
  }
  loadMyProfiles();
  window.togglePublish = togglePublish;
  window.deleteProfile = deleteProfile;
  window.editProfile = editProfile;
});
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    if (activeRequests++ === 0) {
        showLoader();
    }

    try {
        return await originalFetch(...args);
    } finally {
        if (--activeRequests === 0) {
            hideLoader();
        }
    }
};


