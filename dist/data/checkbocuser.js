/* =========================================
   TERMS & CONDITIONS
   SHOW MODAL WHEN TERMS VERSION CHANGES
========================================= */

const CURRENT_TERMS_VERSION = "2.0";

const TERMS_API = "https://api.buildskil.com/api/terms";
// For local development:
//const TERMS_API = "http://localhost:5000/api/terms";

const termsModal = document.getElementById("termsModal");
const termsCheckbox = document.getElementById("termsCheckbox");
const termsError = document.getElementById("termsError");


/* =========================================
   GET AUTH TOKEN
========================================= */

function getToken() {
    return localStorage.getItem("cb_token");
}


/* =========================================
   GET TERMS STATUS FROM BACKEND
========================================= */

async function getTermsStatus() {

    const token = getToken();

    if (!token) {
        throw new Error("Please sign in again.");
    }

    const response = await fetch(
        `${TERMS_API}/status`,
        {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Could not check terms status."
        );
    }

    return data;
}


/* =========================================
   ACCEPT CURRENT TERMS VERSION
========================================= */

async function acceptTermsFromBackend() {

    const token = getToken();

    if (!token) {
        throw new Error("Please sign in again.");
    }

    const response = await fetch(
        `${TERMS_API}/accept`,
        {
            method: "PATCH",

            headers: {
                Accept: "application/json",

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`
            },

            body: JSON.stringify({
                termsVersion:
                    CURRENT_TERMS_VERSION
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Could not save terms acceptance."
        );
    }

    if (
        data?.data?.termsAccepted !== true
    ) {
        throw new Error(
            "Terms acceptance was not saved."
        );
    }

    return data;
}


/* =========================================
   SHOW MODAL
========================================= */

function showTermsModal() {

    if (!termsModal) {
        return;
    }

    termsModal.hidden = false;

    document.body.style.overflow = "hidden";

    if (termsCheckbox) {
        termsCheckbox.checked = false;
        termsCheckbox.disabled = false;
    }

    if (termsError) {
        termsError.hidden = true;
    }
}


/* =========================================
   CLOSE MODAL
========================================= */

function closeTermsModal() {

    if (!termsModal) {
        return;
    }

    termsModal.hidden = true;

    document.body.style.overflow = "";
}


/* =========================================
   CHECK TERMS VERSION
========================================= */

async function checkTermsVersion() {

    try {

        const status = await getTermsStatus();

        const accepted =
            status?.data?.termsAccepted === true;

        const acceptedVersion =
            String(
                status?.data?.termsVersion || ""
            ).trim();

        /*
         * Show modal when:
         *
         * 1. User never accepted terms
         * OR
         *
         * 2. User accepted an older version
         */

        if (
            !accepted ||
            acceptedVersion !== CURRENT_TERMS_VERSION
        ) {

            showTermsModal();

        } else {

            closeTermsModal();

        }

    } catch (error) {

        console.error(
            "Terms status error:",
            error
        );

        /*
         * Do not automatically accept terms
         * when status cannot be checked.
         *
         * You can choose whether to show
         * the modal or leave the page unchanged.
         */

        showTermsModal();

    }
}


/* =========================================
   CHECKBOX ACCEPTANCE
========================================= */

function setupTermsCheckbox() {

    if (!termsCheckbox) {
        return;
    }

    termsCheckbox.addEventListener(
        "change",
        async function () {

            if (!this.checked) {

                if (termsError) {
                    termsError.hidden = false;
                }

                return;
            }

            if (termsError) {
                termsError.hidden = true;
            }

            try {

                this.disabled = true;

                await acceptTermsFromBackend();

                /*
                 * Backend successfully stored:
                 *
                 * termsAccepted = true
                 * termsVersion = 2.0
                 */

                closeTermsModal();

            } catch (error) {

                console.error(
                    "Terms acceptance error:",
                    error
                );

                this.checked = false;

                if (termsError) {
                    termsError.textContent =
                        error.message ||
                        "Could not save your acceptance.";

                    termsError.hidden = false;
                }

            } finally {

                this.disabled = false;

            }
        }
    );
}


/* =========================================
   PREVENT OVERLAY CLOSE
========================================= */

function setupTermsModal() {

    if (!termsModal) {
        return;
    }

    termsModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === termsModal
            ) {

                event.stopPropagation();

            }

        }
    );
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setupTermsCheckbox();

        setupTermsModal();

        await checkTermsVersion();

    }
);
