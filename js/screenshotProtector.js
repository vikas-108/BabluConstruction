// screenshotProtector.js
(function () {
  function blurScreen() {
    document.body.style.filter = "blur(15px)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 5000); // restore after 5 seconds
  }

  function showToast(msg) {
    // Simple toast message (replace with your own UI if needed)
    let toast = document.createElement("div");
    toast.innerText = msg;
    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(0,0,0,0.7)",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "5px",
      zIndex: "9999",
      fontSize: "14px"
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function initScreenshotProtector() {
    // Desktop: detect PrintScreen key
    document.addEventListener("keyup", (e) => {
      if (e.key === "PrintScreen") {
        blurScreen();
        showToast("Screenshots are disabled on this page.");
      }
    });

    // Desktop: detect copy attempts
    document.addEventListener("copy", (e) => {
      e.preventDefault();
      showToast("Copying content is restricted on this page.");
    });

    // Desktop + Mobile: disable right-click / long-press menu
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mobile: detect long-press gesture
    document.addEventListener("touchstart", () => {
      this.touchTimer = setTimeout(() => {
        blurScreen();
        showToast("Screenshots are disabled on this page.");
      }, 3000); // if finger held >1s
    });
    document.addEventListener("touchend", () => clearTimeout(this.touchTimer));
  }

  // Expose globally so you can call with one line
  window.initScreenshotProtector = initScreenshotProtector;
})();
