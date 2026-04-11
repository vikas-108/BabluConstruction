const LOGIN_KEY = "cb_login_user";
const USERS_KEY = "cb_users";
const LOGIN_API = "https://api.buildskil.com/api/auth/";
// change if needed
const COUNTRY_PHONE_RULES = {
  IN: {
    code: "+91",
    lengths: [10],
    regex: /^[6-9]\d{9}$/,
    message: "Indian numbers must be 10 digits and start with 6–9",
  },
  US: {
    code: "+1",
    lengths: [10],
    regex: /^[2-9]\d{9}$/,
    message: "US numbers must be 10 digits and cannot start with 0 or 1",
  },
  GB: {
    code: "+44",
    lengths: [10, 11],
    regex: /^\d{10,11}$/,
    message: "UK numbers must be 10 or 11 digits",
  },
  AE: {
    code: "+971",
    lengths: [9],
    regex: /^5\d{8}$/,
    message: "UAE numbers must be 9 digits",
  },
  JP: {
    code: "+81",
    lengths: [10],
    regex: /^[7-9]\d{9}$/,
    message: "Japanese numbers must be 10 digits",
  },
  DE: {
    code: "+49",
    lengths: [10, 11],
    regex: /^\d{10,11}$/,
    message: "German numbers must be 10 or 11 digits",
  },
  FR: {
    code: "+33",
    lengths: [9],
    regex: /^[6-7]\d{8}$/,
    message: "French numbers must be 9 digits",
  },
};
let loginAttempts = 0;
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
  //const servicesSection = document.getElementById("servicesSection");
  const plansSection = document.getElementById("plansSection");
  const subscriptionSection = document.getElementById("subscriptionSection");
  const notification = document.getElementById("notification");
  const appContent = document.getElementById("appContent");
  const landingPage = document.getElementById("landingPage");
  const ctta = document.getElementById("ctta");
  if (user && user.username) {
    // ✅ Logged in → show protected sections
    heroButtons?.classList.remove("hidden");
    filterToggle?.classList.remove("hidden");
    //servicesSection?.classList.remove("hidden");
    plansSection?.classList.remove("hidden");
    subscriptionSection?.classList.remove("hidden");
    ctta?.classList.remove("hidden");
    notification?.classList.remove("hidden");
    appContent?.classList.remove("hidden");
    landingPage?.classList.add("hidden");
  } else {
    // ❌ Not logged in → keep hidden
    heroButtons?.classList.add("hidden");
    filterToggle?.classList.add("hidden");
    //servicesSection?.classList.add("hidden");
    plansSection?.classList.add("hidden");
    subscriptionSection?.classList.add("hidden");
    ctta?.classList.add("hidden");
    notification?.classList.add("hidden");
    appContent?.classList.add("hidden");
    landingPage?.classList.remove("hidden");
  }

  // ---------------- NAVBAR LOGIC ----------------
  function updateNavbarAuth() {
    const user = JSON.parse(localStorage.getItem(LOGIN_KEY));
    
    if (user && user.username) {
      authBtn?.classList.add("hidden");
      userMenu?.classList.remove("hidden");
      if (userName) {
      userName.textContent = maskPhone(user.phone);
      }
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

  logoutBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();

    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
        },
      });
    } catch {}

    localStorage.removeItem("cb_token");
    localStorage.removeItem(LOGIN_KEY);
    //localStorage.removeItem("cb_login_user");
    // clear per-user search cache
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("searchState_")) localStorage.removeItem(k);
    });

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
      "America/Los_Angeles": "US",
      "Australia/Sydney": "AU",
    };

    const country = TIMEZONE_TO_COUNTRY[tz];

    if (!country) return;

    const option = select.querySelector(`option[data-country="${country}"]`);

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
       if (usernameDisplay) {
        usernameDisplay.innerText = maskPhone(saved.phone);
      }
    }
  }
  function maskPhone(phone) {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, ""); // keep only numbers
    if (digits.length <= 2) return digits; // if very short, just show it

    const visible = digits.slice(-2); // last 2 digits
    const masked = "•".repeat(digits.length - 2); // mask the rest
    //digits.slice(-5); // last 5 digits
    return masked + visible;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const username = document.getElementById("username").value.trim();
    const country = select?.selectedOptions[0]?.dataset.country;
    const rule = COUNTRY_PHONE_RULES[country];
    if (!rule) {
      alert("Please select a valid country");
      return;
    }

    // Validate phone length
    if (!rule.lengths.includes(phone.length)) {
      alert(
        `Phone number must be ${rule.lengths.join(" or ")} digits for this country`,
      );
      return;
    }

    // Validate phone format
    if (!rule.regex.test(phone)) {
      alert(rule.message);
      return;
    }

    // Validate username
    if (!isValidUsername(username)) {
      alert("Username must include letters, numbers & special characters");
      return;
    }
    const countryCode = document.getElementById("countryCode").value; // ✅ STRING like "+91"
    // ✅ Build full phone with country code
    const fullPhone = `${rule.code}${phone}`;
    // call back end authorization point
    try {
      const res = await fetch(`${LOGIN_API}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, countryCode: countryCode, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        loginAttempts++;
        alert(data.message || "Login failed");
        if (loginAttempts >= 2) {
          document.getElementById("forgotBox").style.display = "block";
        }

        return;
      }

      // ✅ SAVE TOKEN + USER
      // ✅ Successful login
      loginAttempts = 0;
      localStorage.setItem("cb_token", data.token);
      localStorage.setItem("cb_login_user", JSON.stringify(data.user));
       // localStorage.setItem("cb_token", data.token);
        //localStorage.setItem("cb_userId", data.user._id);   // ✅ store just the ID
      // redirect
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
  const forgotBtn = document.getElementById("forgotBtn");
  if (forgotBtn) {
    forgotBtn.onclick = async () => {
      const phone = document.getElementById("phone").value.trim();

      if (!phone) {
        alert("Please enter your phone number first");
        return;
      }

      try {
        const res = await fetch(`${LOGIN_API}forgot-username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to send OTP");
          return;
        }

        alert("OTP sent to your registered email");
        document.getElementById("otpBox").style.display = "block";
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };
  }

  const verifyBtn = document.getElementById("verifyOtpBtn");
  if (verifyBtn) {
    verifyBtn.onclick = async () => {
      const phone = document.getElementById("phone").value.trim();
      const otp = document.getElementById("otpInput").value.trim();

      if (!phone || !otp) {
        alert("Enter OTP");
        return;
      }

      try {
        const res = await fetch(`${LOGIN_API}verify-username-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Invalid OTP");
          return;
        }

        alert("OTP verified");

        document.getElementById("resetBox").style.display = "block";
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };
  }
  const saveUsernameBtn = document.getElementById("saveUsernameBtn");
  if (saveUsernameBtn) {
    saveUsernameBtn.onclick = async () => {
      const phone = document.getElementById("phone").value.trim();
      const newUsername = document.getElementById("newusername").value.trim();

      if (!phone || !newUsername) {
        alert("Please enter new username");
        return;
      }

      try {
        const res = await fetch(`${LOGIN_API}update-username`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            newUsername,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Update failed");
          return;
        }

        alert("Username updated successfully. Please login again.");

        location.reload();
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };
  }
  checkLogin();
});
