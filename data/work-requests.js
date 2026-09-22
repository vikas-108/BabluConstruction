const BOOKING_API = "https://api.buildskil.com/api/bookings";
//const BOOKING_API = "http://localhost:5000/api/bookings";
const BOOKING_TOKEN_KEY =
  "cb_token";


// =========================================================
// API REQUEST
// =========================================================
function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//const escapeHtml = escapeHTML;
async function bookingApi(
  path,
  options = {}
) {
  const token =
    localStorage.getItem(
      BOOKING_TOKEN_KEY
    );

  const headers = {
    ...(options.headers || {}),
  };


  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }


  if (token) {
    headers["Authorization"] =
      `Bearer ${token}`;
  }


  const response =
    await fetch(
      `${BOOKING_API}${path}`,
      {
        ...options,
        headers,
      }
    );


  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }


  if (!response.ok) {
    const error =
      new Error(
        data?.message ||
        `Request failed (${response.status})`
      );

    error.status =
      response.status;

    throw error;
  }


  if (
    data &&
    data.success === false
  ) {
    const error =
      new Error(
        data.message ||
        "Request failed."
      );

    error.status =
      response.status;

    throw error;
  }


  return data;
}


// =========================================================
// STATUS LABEL
// =========================================================

function statusLabel(status) {
  return (
    {
      accepted: "Accepted",
      rejected: "Rejected",
      cancelled: "Cancelled",
      pending: "New request",
      completed: "Completed",
    }[status] ||
    "New request"
  );
}


// =========================================================
// LOAD WORK REQUESTS
// =========================================================

async function loadWorkRequests() {
  const list =
    document.getElementById(
      "list"
    );

  if (!list) return;


  // -------------------------------------------------------
  // Login check
  // -------------------------------------------------------

  const token =
    localStorage.getItem(
      BOOKING_TOKEN_KEY
    );

  if (!token) {
    list.innerHTML =
      `
        <div class="empty">

          <div class="icon">
            🔐
          </div>

          <h2>
            Login required
          </h2>

          <p>
            Please sign in to BuildSkil
            to view your work requests.
          </p>

        </div>
      `;

    return;
  }


  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  list.innerHTML =
    `
      <div class="empty">

        <div class="icon">
          ⏳
        </div>

        <h2>
          Loading work requests...
        </h2>

        <p>
          Please wait.
        </p>

      </div>
    `;


  try {

    // -----------------------------------------------------
    // GET /api/bookings/requests
    // -----------------------------------------------------

    const result =
      await bookingApi(
        "/requests"
      );


    const items =
      Array.isArray(
        result?.data
      )
        ? result.data
        : [];


    renderRequests(
      items
    );


  } catch (error) {

    console.error(
      "WORK REQUEST LOAD ERROR:",
      error
    );


    if (
      error.status === 401
    ) {
      list.innerHTML =
        `
          <div class="empty">

            <div class="icon">
              🔐
            </div>

            <h2>
              Login expired
            </h2>

            <p>
              Please sign in again to
              view your work requests.
            </p>

          </div>
        `;

      return;
    }


    list.innerHTML =
      `
        <div class="empty">

          <div class="icon">
            ⚠️
          </div>

          <h2>
            Could not load work requests
          </h2>

          <p>
            ${escapeHtml(
              error.message ||
              "Something went wrong."
            )}
          </p>

         <button
    id="loadWorkRequestsBtn"
    class="btn primary"
    type="button"
>
    Load Work Requests
</button>
            Try again
          </button>

        </div>
      `;
  }
}

const loadWorkRequestsBtn =
    document.getElementById("loadWorkRequestsBtn");

if (loadWorkRequestsBtn) {
    loadWorkRequestsBtn.addEventListener(
        "click",
        loadWorkRequests
    );
}
// =========================================================
// RENDER REQUESTS
// =========================================================

function renderRequests(
  items
) {
  const list =
    document.getElementById(
      "list"
    );

  if (!list) return;


  if (!items.length) {
    list.innerHTML =
      `
        <div class="empty">

          <div class="icon">
            🧰
          </div>

          <h2>
            No work requests
          </h2>

          <p>
            When a client books you,
            their name, phone and work
            location will appear here.
          </p>

        </div>
      `;

    return;
  }


  list.innerHTML =
    `
      <section class="panel">

        <strong>
          ${items.length}
          work request${items.length === 1 ? "" : "s"}
        </strong>

        <div
          class="muted"
          style="margin-top:4px"
        >
          See who booked you and exactly
          where to go for the work.
        </div>

      </section>

    ` +
    items
      .map(
        (item) =>
          renderRequestCard(
            item
          )
      )
      .join("");
}


// =========================================================
// REQUEST CARD
// =========================================================

function renderRequestCard(
  item
) {
  const c =
    item.client ||
    item.user ||
    {};

  const address =
    item.workAddress ||
    item.address ||
    {};

  const addr =
    formatFullAddress(
      address
    );


  const bookingId =
    item.id ||
    item._id ||
    "";


  return `
    <article class="card">

      <!-- =============================================
           CLIENT HEADER
      ============================================== -->

      <div class="client-head">

        <div class="avatar">
          👤
        </div>


        <div class="identity">

          <div class="name">
    ${escapeHtml(
        address?.name?.trim() ||
        item?.workAddressSnapshot?.name?.trim() ||
        c?.name?.trim() ||
        "BuildSkil User"
    )}
</div>


          <div class="sub">
            Booked you for work
          </div>

        </div>


        <span
          class="status ${escapeHtml(
            item.status ||
            "pending"
          )}"
        >
          ${statusLabel(
            item.status
          )}
        </span>

      </div>


      <!-- =============================================
           CLIENT PHONE
      ============================================== 

      <div
        class="row space"
        style="
          margin-top:13px;
          padding-top:11px;
          border-top:1px solid #eef2f7;
        "
      >

        <span class="meta">
          Client phone
        </span>

        <strong>
          ${escapeHtml(
            c.phone ||
            "Not available"
          )}
        </strong>

      </div> -->


      <!-- =============================================
           WORK LOCATION
      ============================================== -->

      <div class="location">

        <h3>
          📍 Where to go
        </h3>


        <div class="address">

          ${escapeHtml(
            addr ||
            "Work address not provided"
          )}

        </div>

${
  address.latitude !== undefined &&
  address.latitude !== null &&
  address.longitude !== undefined &&
  address.longitude !== null
    ? `
      ${
        item.status === "accepted"
          ? `
           <div
  class="coords coords-clickable"
  data-latitude="${Number(address.latitude)}"
  data-longitude="${Number(address.longitude)}"
  title="Open location in Google Maps"
>
  <i class="fa-solid fa-location-dot"></i>
  <span>
    ${escapeHtml(String(address.latitude))},
    ${escapeHtml(String(address.longitude))}
  </span>
</div>
          `
          : `
            <div class="coords">
              <i class="fa-solid fa-location-dot"></i>
              <span>
                ${escapeHtml(String(address.latitude))},
                ${escapeHtml(String(address.longitude))}
              </span>
            </div>
          `
      }
    `
    : ""
}
  <!-- ${address.latitude !== undefined &&address.latitude !== null &&address.longitude !== undefined &&address.longitude !== null  ? `
      <div  class="coords"  onclick="openGoogleMap( ${Number(address.latitude)},${Number(address.longitude)})" title="Open location in Google Maps">
        <i class="fa-solid fa-location-dot"></i><span>  ${escapeHtml(String(address.latitude))},  ${escapeHtml(String(address.longitude))}
        </span> </div>`: ""}

        <div class="actions"><buttonclass="btn secondary"
            onclick='viewWorkAddress(${JSON.stringify(  address).replace( /'/g, "&#39;")})' >   View full address </button>  </div> -->

      </div>


      <!-- =============================================
           WORK NOTE
      ============================================== -->

      ${
        item.note
          ? `
            <div class="note">

              <strong>
                Work note
              </strong>

              <p>
                ${escapeHtml(
                  item.note
                )}
              </p>

            </div>
          `
          : ""
      }


      <!-- =============================================
           FOOTER / ACTIONS
      ============================================== -->

      <div
        class="row space"
        style="margin-top:12px"
      >

        <span class="meta">

          Requested
          ${formatDateTime(
            item.createdAt
          )}

        </span>


        <div
          class="actions"
          style="margin-top:0"
        >

          ${item.status === "accepted" && c.phone ? `
    <button
        class="call-client-btn"
        type="button"
        data-phone="${escapeHTML(c.phone)}"
      >
        <i class="fa-solid fa-phone"></i>
        Call Client
      </button>
` : ""}


         ${
    item.status === "pending"
        ? `
           <button
    type="button"
    class="btn danger"
    data-booking-status="rejected"
    data-booking-id="${escapeHtml(bookingId)}"
>
    Reject
</button>

<button
    type="button"
    class="btn primary"
    data-booking-status="accepted"
    data-booking-id="${escapeHtml(bookingId)}"
>
    Accept
</button>
        `
        : ""
}

${
    item.status === "accepted"
        ? `
           <select
    class="status-select"
    data-booking-id="${escapeHtml(bookingId)}"
>
    <option value="">Update status</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
</select>
        `
        : ""
}

        </div>

      </div>

    </article>
  `;
}
document.addEventListener("change", function (event) {

    const select = event.target.closest(
        ".status-select"
    );

    if (!select) {
        return;
    }

    const bookingId =
        select.dataset.bookingId;

    const status =
        select.value;

    if (!bookingId || !status) {
        return;
    }

    changeRequestStatus(
        bookingId,
        status,
        select
    );
});
document.addEventListener("click", function (event) {

    const button =
        event.target.closest(
            "[data-booking-status]"
        );

    if (!button) {
        return;
    }

    const bookingId =
        button.dataset.bookingId;

    const status =
        button.dataset.bookingStatus;

    if (!bookingId || !status) {
        console.error(
            "Missing booking ID or status."
        );

        return;
    }

    updateStatus(
        bookingId,
        status
    );
});
document.addEventListener("click", function (event) {
  const button = event.target.closest(".call-client-btn");

  if (!button) {
    return;
  }

  const phone =
    button.getAttribute("data-phone");

  if (!phone) {
    return;
  }

  callPhone(phone);
});

document.addEventListener("click", function (event) {

  const coords =
    event.target.closest(".coords-clickable");

  if (!coords) {
    return;
  }

  const latitude =
    Number(coords.dataset.latitude);

  const longitude =
    Number(coords.dataset.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    console.error(
      "Invalid coordinates:",
      latitude,
      longitude
    );

    return;
  }

  openGoogleMap(
    latitude,
    longitude
  );
});
function callClient(phone) {
  if (!phone) {
    return;
  }

  const cleanPhone = String(phone).trim();

  if (!cleanPhone) {
    return;
  }

  window.location.href = `tel:${cleanPhone}`;
}
window.callClient = function (phone) {
  if (!phone) {
    return;
  }

  const cleanPhone = String(phone).trim();

  if (!cleanPhone) {
    return;
  }

  window.location.href = `tel:${cleanPhone}`;
};

// =========================================================
function openGoogleMap(latitude, longitude) {
  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  ) {
    return;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return;
  }

  const googleMapUrl =
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  window.open(
    googleMapUrl,
    "_blank",
    "noopener,noreferrer"
  );
}
// VIEW FULL WORK ADDRESS
// =========================================================

function viewWorkAddress(
  address
) {
  try {

    sessionStorage.setItem(
      "buildskil_readonly_address_v1",
      JSON.stringify(
        address || {}
      )
    );


    location.href =
      "address.html?readonly=1&title=Work%20Location";

  } catch (error) {

    console.error(
      "VIEW WORK ADDRESS ERROR:",
      error
    );

    alert(
      "Could not open work address."
    );
  }
}


// =========================================================
// ACCEPT / REJECT REQUEST
// =========================================================

async function updateStatus(
  id,
  status
) {
  if (!id) {
    alert(
      "Booking ID is missing."
    );

    return;
  }


if (
    ![
        "accepted",
        "rejected",
        "completed",
        "cancelled",
    ].includes(status)
) {
    alert(
      "Invalid booking status."
    );

    return;
  }


  const actionText =
    status === "accepted"
      ? "accept this work request"
      : "reject this work request";


  const confirmed =
    window.confirm(
      `Are you sure you want to ${actionText}?`
    );


  if (!confirmed) {
    return;
  }


  try {

    // -----------------------------------------------------
    // PATCH /api/bookings/:id/status
    // -----------------------------------------------------

    const result =
      await bookingApi(
        `/${encodeURIComponent(
          id
        )}/status`,
        {
          method: "PATCH",

          body:
            JSON.stringify({
              status,
            }),
        }
      );


    showBookingToast(
      result?.message ||
      (
        status === "accepted"
          ? "Booking accepted."
          : "Booking rejected."
      )
    );


    // -----------------------------------------------------
    // Reload directly from MongoDB
    // -----------------------------------------------------

    await loadWorkRequests();


  } catch (error) {

    console.error(
      "UPDATE BOOKING STATUS ERROR:",
      error
    );


    if (
      error.status === 401
    ) {
      alert(
        "Your BuildSkil login has expired. Please sign in again."
      );

      return;
    }


    alert(
      error.message ||
      "Could not update booking status."
    );
  }
}

async function changeRequestStatus(id, status, selectElement) {

    if (!id || !status) {
        return;
    }

    const labels = {
        completed: "mark this work as completed",
        cancelled: "cancel this accepted work request",
    };

    const actionText =
        labels[status] || "update this work request";

    const confirmed = window.confirm(
        `Are you sure you want to ${actionText}?`
    );

    if (!confirmed) {
        if (selectElement) {
            selectElement.value = "";
        }
        return;
    }

    try {

        const result = await bookingApi(
            `/${encodeURIComponent(id)}/status`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    status,
                }),
            }
        );

        showBookingToast(
            result?.message ||
            `Booking status changed to ${status}.`
        );

        await loadWorkRequests();

    } catch (error) {

        console.error(
            "CHANGE BOOKING STATUS ERROR:",
            error
        );

        if (selectElement) {
            selectElement.value = "";
        }

        if (error.status === 401) {
            alert(
                "Your BuildSkil login has expired. Please sign in again."
            );
            return;
        }

        alert(
            error.message ||
            "Could not update booking status."
        );
    }
}
// =========================================================
// TOAST
// =========================================================

function showBookingToast(
  message
) {
  const toast =
    document.getElementById(
      "toast"
    );

  if (!toast) {
    return;
  }


  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  setTimeout(() => {
    toast.classList.remove(
      "show"
    );
  }, 3000);
}

const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", function () {
        history.back();
    });
}

// =========================================================
// INITIAL LOAD
// =========================================================

loadWorkRequests();