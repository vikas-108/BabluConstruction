const LOGIN_KEY = "cb_login_user";

const COUNTRY_PHONE_RULES = {
  IN: { 
    code: "+91", 
    lengths: [10], 
    regex: /^[6-9]\d{9}$/, 
    message: "Indian numbers must be 10 digits and start with 6–9" 
  },
  US: { 
    code: "+1", 
    lengths: [10], 
    regex: /^[2-9]\d{9}$/, 
    message: "US numbers must be 10 digits and cannot start with 0 or 1" 
  },
  GB: { 
    code: "+44", 
    lengths: [10, 11], 
    regex: /^\d{10,11}$/, 
    message: "UK numbers must be 10 or 11 digits" 
  },
  AE: { 
    code: "+971", 
    lengths: [9], 
    regex: /^5\d{8}$/, 
    message: "UAE numbers must be 9 digits" 
  },
  JP: { 
    code: "+81", 
    lengths: [10], 
   regex: /^[7-9]\d{9}$/,
    message: "Japanese numbers must be 10 digits" 
  },
  DE: { 
    code: "+49", 
    lengths: [10, 11], 
    regex: /^\d{10,11}$/, 
    message: "German numbers must be 10 or 11 digits" 
  },
  FR: { 
    code: "+33", 
    lengths: [9], 
    regex: /^[6-7]\d{8}$/,
    message: "French numbers must be 9 digits" 
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");
  const form = document.getElementById("loginForm");
  const welcomeBox = document.getElementById("welcomeBox");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const select = document.getElementById("countryCode");
  const phoneInput = document.getElementById("phone");
  const user = JSON.parse(localStorage.getItem("cb_login_user"));
// ---------------- PROTECTED SECTIONS LOGIC ----------------
  const heroButtons = document.getElementById("heroButtons");
  const filterToggle = document.getElementById("filterToggle");
  const servicesSection = document.getElementById("servicesSection");
  const plansSection = document.getElementById("plansSection");
  const subscriptionSection = document.getElementById("subscriptionSection");

  if (user && user.username) {
    // ✅ Logged in → show protected sections
    heroButtons?.classList.remove("hidden");
    filterToggle?.classList.remove("hidden");
    servicesSection?.classList.remove("hidden");
    plansSection?.classList.remove("hidden");
    subscriptionSection?.classList.remove("hidden");
  } else {
    // ❌ Not logged in → keep hidden
    heroButtons?.classList.add("hidden");
     filterToggle?.classList.add("hidden");
    servicesSection?.classList.add("hidden");
    plansSection?.classList.add("hidden");
    subscriptionSection?.classList.add("hidden");
  }

  // ---------------- NAVBAR LOGIC ----------------
  function updateNavbarAuth() {
    const user = JSON.parse(localStorage.getItem(LOGIN_KEY));
    if (user && user.username) {
      authBtn?.classList.add("hidden");
      userMenu?.classList.remove("hidden");
      userName.textContent = maskUsername(user.username);
    } else {
      authBtn?.classList.remove("hidden");
      userMenu?.classList.add("hidden");
    }
  }

  userName?.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    userMenu?.classList.remove("open");
  });

  logoutBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    localStorage.removeItem(LOGIN_KEY);
    window.location.href = "index.html";
  });

  authBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  updateNavbarAuth();

  // ---------------- PHONE INPUT LOGIC ----------------
 function autoDetectCountryCode() {
  const select = document.getElementById("countryCode");
  if (!select) return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const TIMEZONE_TO_COUNTRY = {
    "Asia/Kolkata": "IN",
    "Asia/Dubai": "AE",
    "Asia/Tokyo": "JP",
    "Europe/London": "GB",
    "Europe/Berlin": "DE",
    "Europe/Paris": "FR",
    "America/New_York": "US",
    "America/Los_Angeles": "US"
  };

  const country = TIMEZONE_TO_COUNTRY[tz];

  if (!country) return;

  const option = select.querySelector(
    `option[data-country="${country}"]`
  );

  if (option) {
    select.value = option.value;
     // ✅ VERY IMPORTANT: update phone length after auto-select
    updatePhoneInputRules();
  }
 }

  function updatePhoneInputRules() {
    const select = document.getElementById("countryCode");
  const phoneInput = document.getElementById("phone");
    if (!select || !phoneInput) return;
    const country = select.selectedOptions[0].dataset.country;
    const rule = COUNTRY_PHONE_RULES[country];
    if (!rule) return;
    const maxLen = Math.max(...rule.lengths);
    phoneInput.maxLength = maxLen;
   phoneInput.placeholder =
    rule.lengths.length > 1
      ? `${rule.lengths.join(" or ")} digit mobile number`
      : `${maxLen} digit mobile number`;
    phoneInput.value = "";
  }

  phoneInput?.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  select?.addEventListener("change", updatePhoneInputRules);

  autoDetectCountryCode();
  updatePhoneInputRules();

  // ---------------- LOGIN PAGE LOGIC ----------------
  function isValidUsername(value) {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/.test(value);
  }

  function checkLogin() {
    const saved = JSON.parse(localStorage.getItem(LOGIN_KEY));
    if (saved) {
      form?.classList.add("hidden");
      welcomeBox?.classList.remove("hidden");
      usernameDisplay.innerText = maskUsername(saved.username);
    }
  }
 function maskUsername(username) {
  if (!username || username.length <= 2) return username;

  const visible = username.slice(-2); // last 2 chars
  const masked = "•".repeat(username.length - 2);

  return masked + visible;
 }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const username = document.getElementById("username").value.trim();

    const country = select?.selectedOptions[0]?.dataset.country;
    const rule = COUNTRY_PHONE_RULES[country];
      // ❌ Safety check
     if (!rule) {
    alert("Please select a valid country");
    return;
  }
 // 1️⃣ Length validation
    if (!rule || !rule.lengths.includes(phone.length)) {
      alert(`Phone number must be ${rule.lengths.join(" or ")} digits for this country`);
      return;
    }
  // ✅ Regex validation with custom message
  // 2️⃣ Regex (format) validation
  if (!rule.regex.test(phone)) {
    alert(rule.message);
    return;
  }
   // 3️⃣ Username validation
    if (!isValidUsername(username)) {
      alert("Username must include letters, numbers & special characters");
      return;
    }
    // ✅ Build full phone with country code
   const fullPhone = `${rule.code}${phone}`;
    // ✅ Save login
    localStorage.setItem(LOGIN_KEY, JSON.stringify({ phone: fullPhone, username }));

    // ✅ Redirect
    window.location.href = "index.html";
  });

  // 🚪 Logout function (used in welcome box)
  //function logout() {
   // localStorage.removeItem(LOGIN_KEY);
   // location.reload();
  //}

  // Run login check on page load
  checkLogin();
});