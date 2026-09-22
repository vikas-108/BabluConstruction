// =========================================================
// BOOKED USERS API
// =========================================================
const BOOKING_API = "https://api.buildskil.com/api/bookings";
//const BOOKING_API = "http://localhost:5000/api/bookings";
const BOOKING_TOKEN_KEY =
  "cb_token";


// =========================================================
// API REQUEST
// =========================================================

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
      pending: "Pending",
      completed: "Completed",
    }[status] ||
    "Pending"
  );
}


// =========================================================
// LOAD MY BOOKINGS
// =========================================================

async function loadMyBookings() {
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
          <div class="icon">🔐</div>

          <h2>Login required</h2>

          <p>
            Please sign in to BuildSkil
            to view your booked users.
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
        <div class="icon">⏳</div>

        <h2>Loading bookings...</h2>

        <p>
          Please wait.
        </p>
      </div>
    `;


  try {

    // -----------------------------------------------------
    // Genuine backend request
    // -----------------------------------------------------

    const result =
      await bookingApi(
        "/mine"
      );


    const items =
      Array.isArray(
        result?.data
      )
        ? result.data
        : [];


    renderBookings(
      items
    );


  } catch (error) {

    console.error(
      "BOOKINGS LOAD ERROR:",
      error
    );


    if (
      error.status === 401
    ) {
      list.innerHTML =
        `
          <div class="empty">
            <div class="icon">🔐</div>

            <h2>Login expired</h2>

            <p>
              Please sign in again to
              view your bookings.
            </p>
          </div>
        `;

      return;
    }


    list.innerHTML =
      `
        <div class="empty">
          <div class="icon">⚠️</div>

          <h2>Could not load bookings</h2>

          <p>
            ${escapeHtml(
              error.message ||
              "Something went wrong."
            )}
          </p>

          <button
  id="tryAgainBookingsBtn"
  class="btn primary"
  type="button"
>
  Try again
</button>
        </div>
      `;
  }
}

const tryAgainBookingsBtn =
  document.getElementById(
    "tryAgainBookingsBtn"
  );

if (tryAgainBookingsBtn) {
  tryAgainBookingsBtn.addEventListener(
    "click",
    () => {
      loadMyBookings();
    }
  );
}
// =========================================================
// RENDER BOOKINGS
// =========================================================

function renderBookings(
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
            📅
          </div>

          <h2>
            No booked users yet
          </h2>

          <p>
            Book a user from Find Better.
            Before confirming, add the
            location where the work will happen.
          </p>

      <button
  id="findUserButton"
  class="btn primary"
  type="button"
>
  Find a user
</button>

        </div>
      `;

    return;
  }


  list.innerHTML =
    `
      <section class="panel">

        <strong>
          ${items.length}
          booked user${items.length === 1 ? "" : "s"}
        </strong>

        <div
          class="muted"
          style="margin-top:4px"
        >
          Each request contains the work
          location they need to visit.
        </div>

      </section>
    ` +
    items
      .map(
        (item) =>
          renderBookingCard(
            item
          )
      )
      .join("");
}

document.addEventListener("click", function (event) {
    const button = event.target.closest("#findUserButton");

    if (!button) {
        return;
    }

   // console.log("Find user button clicked");

    window.location.href = "find-better.html";
});
//========================================================
// BOOKING CARD
// =========================================================

function renderBookingCard(
  item
) {
  const p =
    item.worker ||
    {};

  const address =
    item.workAddress ||
    item.address ||
    {};

  const addr =
    formatFullAddress(
      address
    );

  const cancelled =
    item.status ===
    "cancelled";

  const bookingId =
    item.id ||
    item._id ||
    "";
  const workerName = p.name || "";
  const workerPhone =
    p.phone ||
    "";

  return `
    <article
      class="card"
      ${
        cancelled
          ? 'style="opacity:.72"'
          : ""
      }
    >

      <div class="profile-head">

        <div class="avatar">

          ${
            p.image
              ? `
                <img
                  src="${escapeHtml(
                    p.image
                  )}"
                  alt=""
                >
              `
              : "👤"
          }

        </div>


        <div class="identity">

          <div class="name">

            ${escapeHtml(
              workerName ||
              "Unnamed"
            )}

          </div>


          <div
            class="row"
            style="margin-top:5px"
          >

            <span class="badge">

              ${escapeHtml(
                p.category ||
                "Professional"
              )}

            </span>

            ${
              p.role
                ? `
                  <span class="sub">
                    ${escapeHtml(
                      p.role
                    )}
                  </span>
                `
                : ""
            }

          </div>

<!-- comment pass --->
        <!--  ${  workerPhone    ? ` <div class="sub" style="margin-top:5px">
                  ${escapeHtml( workerPhone)}</div> ` : ""}-->

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
           WORK LOCATION
      ============================================== -->

      <div class="location">

        <h3>
          📍 Work location
        </h3>


        <div class="address">

          ${escapeHtml(
            addr ||
            "No work address saved"
          )}

        </div>


        ${
          address.latitude !==
            undefined &&
          address.latitude !==
            null &&
          address.longitude !==
            undefined &&
          address.longitude !==
            null
            ? `
              <div class="coords">

                ${escapeHtml(
                  String(
                    address.latitude
                  )
                )},

                ${escapeHtml(
                  String(
                    address.longitude
                  )
                )}

              </div>
            `
            : ""
        }

<!--
        <div class="actions">

          <button
            class="btn secondary"
            onclick='viewWorkAddress(${JSON.stringify(
              address
            ).replace(
              /'/g,
              "&#39;"
            )})'
          >
            📍 View full work address
          </button>

        </div>-->

      </div>


      <!-- =============================================
           NOTE
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
           FOOTER
      ============================================== -->

      <div
        class="row space"
        style="margin-top:12px"
      >

        <span class="meta">

          ${formatDateTime(
            item.createdAt
          )}

        </span>


        <div class="row">

          ${
  workerPhone &&
  item.status === "accepted"
    ? `
       <button
        type="button"
        class="btn secondary call-worker-btn"
        data-phone="${escapeHtml(workerPhone)}"
      >
        ☎ Call
      </button>
    `
    : ""
}
          ${
            !cancelled &&
            item.status !==
              "rejected" &&
            item.status !==
              "completed"
              ? `
               <button
  class="btn danger cancel-booking-btn"
  data-booking-id="${escapeHtml(bookingId)}"
  type="button"
>
  Cancel
</button>
              `
              : ""
          }

        </div>

      </div>

    </article>
  `;
}
document.addEventListener("click", (event) => {
  const button = event.target.closest(".call-worker-btn");

  if (!button) {
    return;
  }

  const phone = button.dataset.phone;

  if (!phone) {
    return;
  }

  callPhone(phone);
});
document.addEventListener("click", async function (event) {
  const button =
    event.target.closest(".cancel-booking-btn");

  if (!button) {
    return;
  }

  const bookingId =
    button.dataset.bookingId;

  if (!bookingId) {
    console.error("Booking ID is missing.");
    return;
  }

  if (button.disabled) {
    return;
  }

  button.disabled = true;

  const originalText =
    button.textContent;

  button.textContent = "Cancelling...";

  try {
    await cancelBooking(bookingId);
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );
  } finally {
    button.disabled = false;
    button.textContent =
      originalText;
  }
});
// =========================================================
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
      "VIEW ADDRESS ERROR:",
      error
    );

    alert(
      "Could not open work address."
    );
  }
}


// =========================================================
// CANCEL BOOKING
// =========================================================

async function cancelBooking(
  id
) {
  if (!id) {
    alert(
      "Booking ID is missing."
    );

    return;
  }


  const confirmed =
    window.confirm(
      "Are you sure you want to cancel this booking?"
    );

  if (!confirmed) {
    return;
  }


  try {

    // -----------------------------------------------------
    // Genuine backend cancel
    // -----------------------------------------------------

    const result =
      await bookingApi(
        `/${encodeURIComponent(
          id
        )}/cancel`,
        {
          method: "PATCH",
        }
      );


    showBookingToast(
      result?.message ||
      "Booking cancelled."
    );


    // -----------------------------------------------------
    // Reload from MongoDB
    // -----------------------------------------------------

    await loadMyBookings();


  } catch (error) {

    console.error(
      "CANCEL BOOKING ERROR:",
      error
    );


    alert(
      error.message ||
      "Could not cancel booking."
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

 const backBtn =
    document.getElementById("backBtn");

  const findUserBtn =
    document.getElementById("findUserBtn");

  // Back button
  if (backBtn) {
    backBtn.addEventListener(
      "click",
      () => {
        history.back();
      }
    );
  }

  // Find user button
  if (findUserBtn) {
    findUserBtn.addEventListener(
      "click",
      () => {
        window.location.href =
          "find-better.html";
      }
    );
  }
// =========================================================
// INITIAL LOAD
// =========================================================

loadMyBookings();