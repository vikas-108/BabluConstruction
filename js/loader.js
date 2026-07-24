(function () {

    // Create loader automatically
    const loader = document.createElement("div");

    loader.id = "pageLoader";

    loader.className = "page-loader";

    loader.innerHTML = `
        <div>
            <div class="loader-spinner"></div>
            <div class="loader-text">Please wait...</div>
        </div>
    `;

    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(loader);
    });

    window.showLoader = function (text = "Please wait...") {

        const l = document.getElementById("pageLoader");

        if (!l) return;

        l.querySelector(".loader-text").textContent = text;

        l.classList.add("show");
    };

    window.hideLoader = function () {

        const l = document.getElementById("pageLoader");

        if (!l) return;

        l.classList.remove("show");
    };

})();


//call everywher showLoader() and hideLoader() function to show and hide loader on page load and api call