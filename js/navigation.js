(function () {

    document.addEventListener("DOMContentLoaded", () => {

        // Create floating buttons
        const nav = document.createElement("div");
        nav.id = "navControls";

        nav.innerHTML = `
            <button class="nav-btn" id="navBack" title="Back">&#8592;</button>
            <button class="nav-btn" id="navForward" title="Forward">&#8594;</button>
        `;

        document.body.appendChild(nav);

        // Back
        document.getElementById("navBack").onclick = () => {

            if (history.length > 1) {
                history.back();
            }

        };

        // Forward
        document.getElementById("navForward").onclick = () => {

            history.forward();

        };

    });

    // Swipe Navigation
    let startX = 0;
    let startY = 0;

    document.addEventListener("touchstart", e => {

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

    }, { passive: true });

    document.addEventListener("touchend", e => {

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const dx = endX - startX;
        const dy = endY - startY;

        // Ignore mostly vertical swipes
        if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy)) return;

        if (dx > 0) {

            // Swipe Right → Back
            if (history.length > 1) {
                history.back();
            }

        } else {

            // Swipe Left → Forward
            history.forward();

        }

    }, { passive: true });

})();