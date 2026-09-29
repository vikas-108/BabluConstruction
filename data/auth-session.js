const BUILDSKIL_TOKEN_KEY = "cb_token";
const BUILDSKIL_LOGIN_KEY = "cb_login_user";

let buildsKILLogoutRunning = false;
let buildsKILExpiryTimer = null;

/* ==========================================================
   READ TOKEN
========================================================== */

function getBuildSkilToken() {
  try {
    return localStorage.getItem(BUILDSKIL_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/* ==========================================================
   CLEAR ALL AUTH DATA
========================================================== */

function clearBuildSkilAuth() {
  try {
    localStorage.removeItem(BUILDSKIL_TOKEN_KEY);

    localStorage.removeItem(BUILDSKIL_LOGIN_KEY);

    // Older / alternate login cache
    localStorage.removeItem("cb_login_user");

    // Terms local cache
    localStorage.removeItem("buildskil_terms_accepted_v1");

    // User-specific search cache
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("searchState_")) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("BUILDSKIL AUTH CLEAR ERROR:", error);
  }
}

/* ==========================================================
   FORCE LOGOUT
========================================================== */

function forceBuildSkilLogout(reason = "expired") {
  if (buildsKILLogoutRunning) {
    return;
  }

  buildsKILLogoutRunning = true;

  console.warn("BuildSkil session logout:", reason);

  /*
   * IMPORTANT
   *
   * Clear local authentication FIRST.
   *
   * Do not wait for /logout API because an
   * expired token may itself produce 401.
   */
  clearBuildSkilAuth();

  /*
   * Send user to login page.
   *
   * replace() prevents the expired protected page
   * from being restored with browser Back.
   */
  const loginUrl = new URL("/login.html", window.location.origin);

  loginUrl.searchParams.set("session", reason);

  window.location.replace(loginUrl.href);
}

/* ==========================================================
   JWT PAYLOAD
========================================================== */

function decodeJwtPayload(token) {
  try {
    const parts = String(token).split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const json = atob(padded);

    return JSON.parse(json);
  } catch (error) {
    console.warn("Could not decode BuildSkil JWT:", error);

    return null;
  }
}

/* ==========================================================
   CHECK JWT EXPIRATION
========================================================== */

function getTokenExpiryTime(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const exp = Number(payload.exp);

  if (!Number.isFinite(exp) || exp <= 0) {
    return null;
  }

  return exp * 1000;
}

/* ==========================================================
   SCHEDULE AUTOMATIC LOGOUT
========================================================== */

function scheduleBuildSkilTokenExpiry() {
  if (buildsKILExpiryTimer) {
    clearTimeout(buildsKILExpiryTimer);

    buildsKILExpiryTimer = null;
  }

  const token = getBuildSkilToken();

  if (!token) {
    return;
  }

  const expiresAt = getTokenExpiryTime(token);

  /*
   * If this token is not a JWT or does not contain exp,
   * server-side 401 handling below will still log the user out.
   */
  if (!expiresAt) {
    return;
  }

  const remaining = expiresAt - Date.now();

  /*
   * Already expired
   */
  if (remaining <= 0) {
    forceBuildSkilLogout("expired");

    return;
  }

  /*
   * Browser setTimeout has a maximum safe delay.
   * Schedule in chunks when needed.
   */
  const delay = Math.min(remaining, 2147483647);

  buildsKILExpiryTimer = setTimeout(() => {
    /*
     * Check again rather than assuming
     * timer fired exactly on expiry.
     */
    const currentToken = getBuildSkilToken();

    if (!currentToken) {
      return;
    }

    const currentExpiry = getTokenExpiryTime(currentToken);

    if (!currentExpiry || currentExpiry <= Date.now()) {
      forceBuildSkilLogout("expired");
    } else {
      scheduleBuildSkilTokenExpiry();
    }
  }, delay);
}

/* ==========================================================
   PROTECT FETCH
========================================================== */

(function installBuildSkilFetchGuard() {
  /*
   * Prevent installing this wrapper twice.
   */
  if (window.__buildskilFetchGuardInstalled) {
    return;
  }

  window.__buildskilFetchGuardInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    const response = await originalFetch(input, init);

    /*
     * Only treat 401 as a BuildSkil session
     * expiry when the request actually used
     * the cb_token.
     */
    if (response.status === 401) {
      const headers = new Headers(init.headers || {});

      const authorization = headers.get("Authorization");

      const token = getBuildSkilToken();

      /*
       * If current request used our JWT,
       * the session has failed.
       */
      if (token && authorization && authorization.startsWith("Bearer ")) {
        forceBuildSkilLogout("expired");
      }
    }

    return response;
  };
})();

/* ==========================================================
   TAB / WINDOW SYNC
========================================================== */

window.addEventListener("storage", (event) => {
  if (event.key === BUILDSKIL_TOKEN_KEY && !event.newValue) {
    forceBuildSkilLogout("logout");
  }
});

/* ==========================================================
   INITIAL CHECK
========================================================== */

(function initializeBuildSkilAuth() {
  const token = getBuildSkilToken();

  if (!token) {
    return;
  }

  const expiresAt = getTokenExpiryTime(token);

  if (expiresAt && expiresAt <= Date.now()) {
    forceBuildSkilLogout("expired");

    return;
  }

  scheduleBuildSkilTokenExpiry();
})();
