// ---- Edit these two to match your setup ----

// Base URL of your Express server's API
//window.API_BASE_URL = "http://localhost:5000/api/client/create";
window.API_BASE_URL = "https://api.buildskil.com/api/client/create";

// The localStorage key your login flow already saves the JWT under.
// e.g. after login you probably do: localStorage.setItem("token", data.token)
window.AUTH_TOKEN_KEY = "cb_token";
//window.PROFILE_API_BASE_URL = "http://localhost:5000/api/profiles/public";
window.PROFILE_API_BASE_URL = "https://api.buildskil.com/api/profiles/public";
//window.ROUTINE_PAY_BASE = "http://localhost:5000/api/routinepay/buiders";
window.ROUTINE_PAY_BASE = "https://api.buildskil.com/api/routinepay/buiders";
// ---------------------------------------------

window.APP_CONFIG = Object.freeze({
    //API_BASE_URL: "http://localhost:5000/api",
    API_BASE_URL:"https://api.buildskil.com/api",

    AUTH_TOKEN_KEY:"cb_token"
});