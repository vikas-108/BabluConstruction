/* =========================================================
   CONFIG
========================================================= */

const API_BASE = "https://api.buildskil.com/api";

const TOKEN_KEY = "cb_token";

const ADMIN_WORK_REQUESTS_API =
    `${API_BASE}/bookings/admin/all`;


/* =========================================================
   DOM
========================================================= */

const loadingEl =
    document.getElementById("loading");

const errorStateEl =
    document.getElementById("errorState");

const errorMessageEl =
    document.getElementById("errorMessage");

const emptyStateEl =
    document.getElementById("emptyState");

const requestsContainer =
    document.getElementById(
        "requestsContainer"
    );

const searchInput =
    document.getElementById("searchInput");

const clearSearchBtn =
    document.getElementById("clearSearch");

const refreshBtn =
    document.getElementById("refreshBtn");

const retryBtn =
    document.getElementById("retryBtn");

const backBtn =
    document.getElementById("backBtn");

const statusFilters =
    document.getElementById(
        "statusFilters"
    );

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const acceptedCount =
    document.getElementById("acceptedCount");

const completedCount =
    document.getElementById(
        "completedCount"
    );


/* =========================================================
   MODAL DOM
========================================================= */

const detailsModal =
    document.getElementById(
        "detailsModal"
    );

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );

const closeModalBtn =
    document.getElementById(
        "closeModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalStatus =
    document.getElementById(
        "modalStatus"
    );

const modalClientName =
    document.getElementById(
        "modalClientName"
    );

const modalClientPhone =
    document.getElementById(
        "modalClientPhone"
    );

const modalClientEmail =
    document.getElementById(
        "modalClientEmail"
    );

const modalWorkerName =
    document.getElementById(
        "modalWorkerName"
    );

const modalWorkerCategory =
    document.getElementById(
        "modalWorkerCategory"
    );

const modalWorkerRole =
    document.getElementById(
        "modalWorkerRole"
    );

const modalWorkerPhone =
    document.getElementById(
        "modalWorkerPhone"
    );

const modalWorkerEmail =
    document.getElementById(
        "modalWorkerEmail"
    );

const modalAddressName =
    document.getElementById(
        "modalAddressName"
    );

const modalAddress =
    document.getElementById(
        "modalAddress"
    );

const modalCoordinates =
    document.getElementById(
        "modalCoordinates"
    );

const modalNoteSection =
    document.getElementById(
        "modalNoteSection"
    );

const modalNote =
    document.getElementById(
        "modalNote"
    );

const modalRequestId =
    document.getElementById(
        "modalRequestId"
    );

const modalCreated =
    document.getElementById(
        "modalCreated"
    );

const modalUpdated =
    document.getElementById(
        "modalUpdated"
    );

const modalResponded =
    document.getElementById(
        "modalResponded"
    );

const modalCompleted =
    document.getElementById(
        "modalCompleted"
    );

const toastEl =
    document.getElementById("toast");


/* =========================================================
   STATE
========================================================= */

let allBookings = [];

let currentStatus =
    "all";

let searchTimer = null;


/* =========================================================
   TOKEN
========================================================= */

function getToken() {

    try {

        return (
            localStorage.getItem(
                TOKEN_KEY
            ) || ""
        );

    } catch (error) {

        console.error(
            "Unable to read token:",
            error
        );

        return "";
    }
}


/* =========================================================
   API
========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const token =
        getToken();

    const headers = {
        Accept:
            "application/json",

        ...(options.body
            ? {
                "Content-Type":
                    "application/json"
            }
            : {}),

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`
            }
            : {})
    };

    const response =
        await fetch(
            url,
            {
                ...options,
                headers: {
                    ...headers,
                    ...(options.headers || {})
                }
            }
        );

    const raw =
        await response.text();

    let data = {};

    try {

        data = raw
            ? JSON.parse(raw)
            : {};

    } catch (error) {

        throw new Error(
            "Server returned an invalid response."
        );
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            "Unable to load work requests."
        );
    }

    return data;
}


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll(
            "'",
            "&#039;"
        );
}


function safeValue(
    value,
    fallback = "—"
) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
}


function getStatusLabel(
    status
) {

    switch (status) {

        case "pending":
            return "Pending";

        case "accepted":
            return "Accepted";

        case "rejected":
            return "Rejected";

        case "completed":
            return "Completed";

        case "cancelled":
            return "Cancelled";

        default:
            return safeValue(
                status
            );
    }
}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return safeValue(
            value
        );
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function buildAddress(
    address
) {

    if (!address) {
        return "No address";
    }

    const parts = [

        address.houseFlat,

        address.streetArea,

        address.landmark,

        address.townCityVillage,

        address.district,

        address.state,

        address.pincode,

        address.country

    ].filter(Boolean);

    return parts.length
        ? parts.join(", ")
        : "No address";
}


function getAddress(
    item
) {

    return (
        item?.workAddress ||
        item?.address ||
        {}
    );
}


function getClient(
    item
) {

    return (
        item?.client ||
        {}
    );
}


function getWorker(
    item
) {

    return (
        item?.worker ||
        {}
    );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function createStatusBadge(
    status
) {

    const label =
        getStatusLabel(
            status
        );

    return `
        <span
            class="status-badge status-${escapeHTML(status)}"
        >
            <span class="status-dot"></span>
            ${escapeHTML(label)}
        </span>
    `;
}


/* =========================================================
   RENDER CARD
========================================================= */

function renderBookingCard(
    item
) {

    const client =
        getClient(item);

    const worker =
        getWorker(item);

    const address =
        getAddress(item);

    const requestId =
        item?._id || "";

    const shortId =
        requestId.length > 8
            ? requestId
                .slice(-8)
                .toUpperCase()
            : requestId
                .toUpperCase();

    const clientName =
        client.name ||
        address.name ||
        "Unnamed client";

    const workerName =
        worker.name ||
        "Worker not assigned";

    const category =
        worker.category || "";

    const role =
        worker.role || "";

    const workerPhone =
        worker.phone || "";

    const clientPhone =
        client.phone || "";

    const addressText =
        buildAddress(
            address
        );


    return `
        <article
            class="request-card"
            data-request-id="${escapeHTML(requestId)}"
        >

            <div class="request-card-header">

                <div class="request-heading">

                    <span class="request-label">
                        WORK REQUEST
                    </span>

                    <div class="request-id">
                        #${escapeHTML(shortId)}
                    </div>

                </div>

                ${createStatusBadge(
                    item?.status
                )}

            </div>


            <div class="card-divider"></div>


            <!-- CLIENT -->

            <div class="request-section">

                <div class="section-title">
                    Client
                </div>

                <div class="person-name">
                    ${escapeHTML(
                        clientName
                    )}
                </div>

                ${
                    clientPhone
                        ? `
                            <div class="secondary-line">
                                ${escapeHTML(
                                    clientPhone
                                )}
                            </div>
                        `
                        : ""
                }

            </div>


            <!-- WORKER -->

            <div class="request-section">

                <div class="section-title">
                    Worker
                </div>

                <div class="person-name">
                    ${escapeHTML(
                        workerName
                    )}
                </div>

                ${
                    category
                        ? `
                            <div class="secondary-line">
                                ${escapeHTML(
                                    category
                                )}
                            </div>
                        `
                        : ""
                }

                ${
                    role
                        ? `
                            <div class="secondary-line">
                                ${escapeHTML(
                                    role
                                )}
                            </div>
                        `
                        : ""
                }

                ${
                    workerPhone
                        ? `
                            <div class="secondary-line">
                                ${escapeHTML(
                                    workerPhone
                                )}
                            </div>
                        `
                        : ""
                }

            </div>


            <!-- ADDRESS -->

            <div class="request-section">

                <div class="section-title">
                    Work Address
                </div>

                ${
                    address.name
                        ? `
                            <span class="address-name">
                                ${escapeHTML(
                                    address.name
                                )}
                            </span>
                        `
                        : ""
                }

                <div class="address-text">
                    ${escapeHTML(
                        addressText
                    )}
                </div>

               ${
    address.latitude != null &&
    address.longitude != null
        ? `
            <button
                type="button"
                class="location-button"
                data-action="location"
                data-lat="${escapeHTML(address.latitude)}"
                data-lng="${escapeHTML(address.longitude)}"
            >
                <span class="location-icon">⌖</span>

                <span>
                    ${escapeHTML(
                        Number(address.latitude).toFixed(6)
                    )},
                    ${escapeHTML(
                        Number(address.longitude).toFixed(6)
                    )}
                </span>

                <span class="location-open">
                    Open Map →
                </span>
            </button>
        `
        : ""
}

            </div>


            ${
                item?.note
                    ? `
                        <div class="note-box">

                            <div class="note-box-title">
                                Note
                            </div>

                            <div class="note-box-text">
                                ${escapeHTML(
                                    item.note
                                )}
                            </div>

                        </div>
                    `
                    : ""
            }


            <div class="request-card-footer">

                <span class="created-time">
                    ${escapeHTML(
                        formatDate(
                            item?.createdAt
                        )
                    )}
                </span>

                <button
                    type="button"
                    class="view-details"
                    data-action="details"
                    data-id="${escapeHTML(
                        requestId
                    )}"
                >
                    View details →
                </button>

            </div>

        </article>
    `;
}

function openLocationOnMap(
    latitude,
    longitude
) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        showToast("Location coordinates are not available");
        return;
    }

    const googleMapsUrl =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${lat},${lng}`
        )}`;

    window.open(
        googleMapsUrl,
        "_blank",
        "noopener,noreferrer"
    );
}
/* =========================================================
   RENDER
========================================================= */

function renderBookings() {

    const query =
        searchInput
            .value
            .trim()
            .toLowerCase();


    const filtered =
        allBookings.filter(
            item => {

                const status =
                    item?.status ||
                    "pending";

                if (
                    currentStatus !== "all" &&
                    status !== currentStatus
                ) {
                    return false;
                }


                if (!query) {
                    return true;
                }


                const client =
                    getClient(item);

                const worker =
                    getWorker(item);

                const address =
                    getAddress(item);


                const searchable = [

                    item?._id,

                    client.name,
                    client.phone,
                    client.email,

                    worker.name,
                    worker.phone,
                    worker.email,
                    worker.category,
                    worker.role,

                    address.name,
                    address.houseFlat,
                    address.streetArea,
                    address.landmark,
                    address.townCityVillage,
                    address.district,
                    address.state,
                    address.pincode,

                    item?.note,

                    status

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                return searchable
                    .includes(query);
            }
        );


    requestsContainer.innerHTML = "";


    if (!filtered.length) {

        emptyStateEl.classList.remove(
            "hidden"
        );

        return;
    }


    emptyStateEl.classList.add(
        "hidden"
    );


    requestsContainer.innerHTML =
        filtered
            .map(
                renderBookingCard
            )
            .join("");
}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const total =
        allBookings.length;

    const pending =
        allBookings.filter(
            item =>
                item?.status ===
                "pending"
        ).length;

    const accepted =
        allBookings.filter(
            item =>
                item?.status ===
                "accepted"
        ).length;

    const completed =
        allBookings.filter(
            item =>
                item?.status ===
                "completed"
        ).length;


    totalCount.textContent =
        total;

    pendingCount.textContent =
        pending;

    acceptedCount.textContent =
        accepted;

    completedCount.textContent =
        completed;
}


/* =========================================================
   LOADING / ERROR
========================================================= */

function showLoading() {

    loadingEl.classList.remove(
        "hidden"
    );

    errorStateEl.classList.add(
        "hidden"
    );

    emptyStateEl.classList.add(
        "hidden"
    );

    requestsContainer.innerHTML = "";
}


function hideLoading() {

    loadingEl.classList.add(
        "hidden"
    );
}


function showError(
    message
) {

    loadingEl.classList.add(
        "hidden"
    );

    errorStateEl.classList.remove(
        "hidden"
    );

    emptyStateEl.classList.add(
        "hidden"
    );

    requestsContainer.innerHTML = "";

    errorMessageEl.textContent =
        message ||
        "Unable to load work requests.";
}


/* =========================================================
   LOAD BOOKINGS
========================================================= */

async function loadBookings() {

    showLoading();

    const token =
        getToken();


    if (!token) {

        showError(
            "Login session not found. Please login again."
        );

        return;
    }


    try {

        const result =
            await apiRequest(
                ADMIN_WORK_REQUESTS_API
            );


        const list =
            Array.isArray(
                result?.bookings
            )
                ? result.bookings

                : Array.isArray(
                    result?.data
                )
                    ? result.data

                    : Array.isArray(
                        result
                    )
                        ? result
                        : [];


        allBookings =
            list;


        updateStats();

        hideLoading();

        renderBookings();


    } catch (error) {

        console.error(
            "Work request loading error:",
            error
        );

        showError(
            error?.message ||
            "Unable to load work requests."
        );
    }
}


/* =========================================================
   MODAL
========================================================= */

function openDetails(
    item
) {

    if (!item) {
        return;
    }


    const client =
        getClient(item);

    const worker =
        getWorker(item);

    const address =
        getAddress(item);


    const requestId =
        item?._id || "";


    const shortId =
        requestId.length > 8
            ? requestId
                .slice(-8)
                .toUpperCase()
            : requestId
                .toUpperCase();


    modalTitle.textContent =
        `#${shortId}`;


    modalStatus.innerHTML =
        createStatusBadge(
            item?.status
        );


    /* Client */

    modalClientName.textContent =
        safeValue(
            client.name ||
            address.name
        );

    modalClientPhone.textContent =
        safeValue(
            client.phone
        );

    modalClientEmail.textContent =
        safeValue(
            client.email
        );


    /* Worker */

    modalWorkerName.textContent =
        safeValue(
            worker.name
        );

    modalWorkerCategory.textContent =
        safeValue(
            worker.category
        );

    modalWorkerRole.textContent =
        safeValue(
            worker.role
        );

    modalWorkerPhone.textContent =
        safeValue(
            worker.phone
        );

    modalWorkerEmail.textContent =
        safeValue(
            worker.email
        );


    /* Address */

    modalAddressName.textContent =
        safeValue(
            address.name
        );

    modalAddress.textContent =
        buildAddress(
            address
        );

if (
    address.latitude != null &&
    address.longitude != null
) {

    modalCoordinates.innerHTML = `
        <button
            type="button"
            class="location-button modal-location-button"
            data-action="modal-location"
            data-lat="${escapeHTML(address.latitude)}"
            data-lng="${escapeHTML(address.longitude)}"
        >
            <span class="location-icon">⌖</span>

            <span>
                ${escapeHTML(
                    Number(address.latitude).toFixed(6)
                )},
                ${escapeHTML(
                    Number(address.longitude).toFixed(6)
                )}
            </span>

            <span class="location-open">
                Open Map →
            </span>
        </button>
    `;

}else {

        modalCoordinates.textContent =
            "";
    }


    /* Note */

    if (item?.note) {

        modalNoteSection.classList.remove(
            "hidden"
        );

        modalNote.textContent =
            item.note;

    } else {

        modalNoteSection.classList.add(
            "hidden"
        );

        modalNote.textContent =
            "";
    }


    /* Request information */

    modalRequestId.textContent =
        safeValue(
            item?._id
        );

    modalCreated.textContent =
        formatDate(
            item?.createdAt
        );

    modalUpdated.textContent =
        formatDate(
            item?.updatedAt
        );

    modalResponded.textContent =
        formatDate(
            item?.respondedAt
        );

    modalCompleted.textContent =
        formatDate(
            item?.completedAt
        );


    detailsModal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";
}


function closeDetails() {

    detailsModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
}

modalCoordinates.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                '[data-action="modal-location"]'
            );

        if (!button) {
            return;
        }

        openLocationOnMap(
            button.dataset.lat,
            button.dataset.lng
        );
    }
);
/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(
    message
) {

    toastEl.textContent =
        message;

    toastEl.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toastEl.classList.remove(
                    "show"
                );

            },
            2200
        );
}


/* =========================================================
   EVENTS
========================================================= */


/* Search */

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(
            searchTimer
        );


        clearSearchBtn.style.display =
            searchInput.value.trim()
                ? "flex"
                : "none";


        searchTimer =
            setTimeout(
                renderBookings,
                120
            );
    }
);


/* Clear search */

clearSearchBtn.addEventListener(
    "click",
    () => {

        searchInput.value =
            "";

        clearSearchBtn.style.display =
            "none";

        renderBookings();

        searchInput.focus();
    }
);


/* Status filters */

statusFilters.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".status-filter"
            );


        if (!button) {
            return;
        }


        currentStatus =
            button.dataset.status ||
            "all";


        document
            .querySelectorAll(
                ".status-filter"
            )
            .forEach(
                item => {

                    item.classList.toggle(
                        "active",
                        item === button
                    );
                }
            );


        renderBookings();
    }
);


/* Card details */

requestsContainer.addEventListener(
    "click",
    event => {

        /* =========================
           LOCATION CLICK
        ========================= */

        const locationButton =
            event.target.closest(
                '[data-action="location"]'
            );

        if (locationButton) {

            const latitude =
                locationButton.dataset.lat;

            const longitude =
                locationButton.dataset.lng;

            openLocationOnMap(
                latitude,
                longitude
            );

            return;
        }


        /* =========================
           DETAILS CLICK
        ========================= */

        const detailsButton =
            event.target.closest(
                '[data-action="details"]'
            );

        if (!detailsButton) {
            return;
        }

        const id =
            detailsButton.dataset.id;

        const item =
            allBookings.find(
                booking =>
                    String(
                        booking?._id
                    ) === String(id)
            );

        openDetails(item);
    }
);


/* Refresh */

refreshBtn.addEventListener(
    "click",
    async () => {

        refreshBtn.disabled =
            true;

        refreshBtn.style.opacity =
            "0.5";


        try {

            await loadBookings();

            showToast(
                "Work requests refreshed"
            );

        } finally {

            refreshBtn.disabled =
                false;

            refreshBtn.style.opacity =
                "";
        }
    }
);


/* Retry */

retryBtn.addEventListener(
    "click",
    loadBookings
);


/* Back */

backBtn.addEventListener(
    "click",
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "account.html";
        }
    }
);


/* Modal */

closeModalBtn.addEventListener(
    "click",
    closeDetails
);

modalOverlay.addEventListener(
    "click",
    closeDetails
);


/* Escape key */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !detailsModal.classList.contains(
                "hidden"
            )
        ) {
            closeDetails();
        }
    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

loadBookings();