(function () {
  // 1. Check if both your auth token and user object exist in localStorage
  const token = localStorage.getItem("cb_token");
  const user = localStorage.getItem("cb_login_user"); 

  if (!token || !user) {
    // 2. Redirect to your actual login page if the user is missing
    window.location.href = "/login.html"; 
  } else {
    // 3. Keep the user on the page and reveal the content smoothly
    document.documentElement.style.visibility = 'visible';
  }
})();
/*(function () {
  const token = localStorage.getItem("cb_token");
  const user = localStorage.getItem("cb_login_user"); 

  if (!token || !user) {
    // Saves the current page URL so the login page knows where to send them back
    const currentPath = window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(currentPath)}`; 
  } else {
    document.documentElement.style.visibility = 'visible';
  }
})();
*/
/*// Replace window.location.href = "index.html"; with this:
const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirect');

if (redirectUrl) {
  // Sends them back to the private page they tried to open (like createprofile)
  window.location.href = redirectUrl;
} else {
  // Default fallback if they went straight to the login page
  window.location.href = "index.html";
}
*/