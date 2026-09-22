const loadingEl =
  document.getElementById("loading");

const content =
  document.getElementById("content");


// =========================================================
// BOOKING API
// =========================================================

const BOOKING_API = "https://api.buildskil.com/api/bookings";
const ADDRESS_API = "https://api.buildskil.com/api/addresses";
//const BOOKING_API = "http://localhost:5000/api/bookings";

//const ADDRESS_API = "http://localhost:5000/api/addresses";

const BOOKING_TOKEN_KEY =
  "cb_token";

const SELECTED_ADDRESS_KEY =
  "buildskil_selected_address_v1";


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
    !(
      options.body instanceof FormData
    )
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

    data =
      await response.json();

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
        "Booking request failed."
      );

    error.status =
      response.status;

    throw error;
  }


  return data;
}


// =========================================================
// ADDRESS API
// =========================================================

async function addressApi(
  path,
  options = {}
) {

  const token =
    localStorage.getItem(
      BOOKING_TOKEN_KEY
    );


  if (!token) {

    const error =
      new Error(
        "Please sign in to BuildSkil first."
      );

    error.status = 401;

    throw error;
  }


  const headers = {
    Accept:
      "application/json",

    ...(options.headers || {}),

    Authorization:
      `Bearer ${token}`,
  };


  if (
    options.body &&
    !(
      options.body instanceof FormData
    )
  ) {

    headers["Content-Type"] =
      "application/json";
  }


  const response =
    await fetch(
      `${ADDRESS_API}${path}`,
      {
        ...options,
        headers,
      }
    );


  let data = null;


  try {

    data =
      await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    const error =
      new Error(
        data?.message ||
        `Address request failed (${response.status})`
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
        "Address request failed."
      );

    error.status =
      response.status;

    throw error;
  }


  return data;
}


// =========================================================
// CURRENT LOGIN USER
// =========================================================

function getCurrentClient() {

  try {

    const user =
      readLoginUser();

    return user || null;

  } catch (error) {

    console.error(
      "LOGIN USER ERROR:",
      error
    );

    return null;
  }
}


// =========================================================
// WORKER PROFILE SESSION
// =========================================================

function getBookingProfileForCurrentUser() {

  const me =
    getCurrentClient();


  const currentClientId =
    String(
      me?.id ||
      me?._id ||
      me?.userId ||
      me?.accountId ||
      ""
    );


  if (
    !currentClientId
  ) {
    return null;
  }


  const raw =
    sessionStorage.getItem(
      "buildskil_booking_profile_v2"
    );


  if (!raw) {
    return null;
  }


  try {

    const saved =
      JSON.parse(raw);


    const savedClientId =
      String(
        saved?.clientId ||
        ""
      );


    /*
      The selected worker belongs to a specific
      client login session.

      Never allow another login user to reuse it.
    */

    if (
      savedClientId !==
      currentClientId
    ) {

      sessionStorage.removeItem(
        "buildskil_booking_profile_v2"
      );

      return null;
    }


    const selectedProfile =
      saved?.profile ||
      null;


    if (
      !selectedProfile
    ) {
      sessionStorage.removeItem(
        "buildskil_booking_profile_v2"
      );

      return null;
    }


    return selectedProfile;

  } catch (error) {

    console.error(
      "Booking profile error:",
      error
    );


    sessionStorage.removeItem(
      "buildskil_booking_profile_v2"
    );


    return null;
  }
}


const profile =
  getBookingProfileForCurrentUser();


// =========================================================
// BACK
// =========================================================

const backButton =
  document.getElementById(
    "back"
  );


if (backButton) {

  backButton.onclick = () =>
    history.back();

}


// =========================================================
// TOAST
// =========================================================

function showToast(
  message
) {

  const element =
    document.getElementById(
      "toast"
    );


  if (!element) {
    return;
  }


  element.textContent =
    message;


  element.classList.add(
    "show"
  );


  setTimeout(() => {

    element.classList.remove(
      "show"
    );

  }, 3000);
}


// =========================================================
// CATEGORY LABEL
// =========================================================

function categoryLabel(
  value
) {

  return (
    {
      contractor:
        "Contractor",

      technician:
        "Technician",

      supplier:
        "Supplier",

      architecture:
        "Architecture",

      mechanic:
        "Mechanic",

    }[value] ||

    value ||

    "Professional"
  );
}


// =========================================================
// LOAD ONLY CURRENT USER'S ADDRESSES
// =========================================================

async function loadMyBookingAddresses() {

  const result =
    await addressApi(
      ""
    );


  const addresses =
    Array.isArray(
      result?.data
    )
      ? result.data
      : Array.isArray(
          result?.addresses
        )
        ? result.addresses
        : [];


  return addresses;
}


// =========================================================
// GET SELECTED ADDRESS ID
// =========================================================

function getSelectedAddressId() {

  const raw =
    sessionStorage.getItem(
      SELECTED_ADDRESS_KEY
    );


  if (!raw) {
    return "";
  }


  try {

    const parsed =
      JSON.parse(raw);


    /*
      address.html currently stores:

      JSON.stringify(String(addressId))

      Therefore normally parsed is:
      "66xxxxxxxxxxxxxxxxxxxxxx"

      We also support an object in case
      an older version stored the address object.
    */

    if (
      typeof parsed ===
      "string"
    ) {

      return String(
        parsed
      ).trim();

    }


    if (
      parsed &&
      typeof parsed ===
      "object"
    ) {

      return String(
        parsed?._id ||
        parsed?.id ||
        ""
      ).trim();

    }


    return "";

  } catch (error) {

    console.error(
      "Selected address ID parse error:",
      error
    );


    sessionStorage.removeItem(
      SELECTED_ADDRESS_KEY
    );


    return "";
  }
}


// =========================================================
// GET ADDRESS FOR CURRENT LOGIN USER
// =========================================================

async function getSelectedBookingAddress() {

  /*
    IMPORTANT:

    Never return the previously stored address
    directly.

    First fetch addresses from the backend.

    The backend returns ONLY addresses belonging
    to the authenticated cb_token user.
  */

  const addresses =
    await loadMyBookingAddresses();


  if (
    !addresses.length
  ) {

    /*
      The currently logged-in user has no
      saved addresses.
    */

    sessionStorage.removeItem(
      SELECTED_ADDRESS_KEY
    );


    return (
      typeof EMPTY_ADDRESS !==
      "undefined"
        ? {
            ...EMPTY_ADDRESS,
          }
        : {}
    );
  }


  const selectedAddressId =
    getSelectedAddressId();


  // -------------------------------------------------------
  // Find selected address ONLY inside current user's list
  // -------------------------------------------------------

  if (
    selectedAddressId
  ) {

    const selected =
      addresses.find(
        address =>
          String(
            address?._id ||
            address?.id ||
            ""
          ) ===
          selectedAddressId
      );


    if (selected) {

      return {
        ...(typeof EMPTY_ADDRESS !==
        "undefined"
          ? EMPTY_ADDRESS
          : {}),

        ...selected,
      };
    }


    /*
      The saved selected address doesn't belong
      to this login user.

      This is the situation that was causing
      the previous user's address to appear.
    */

    sessionStorage.removeItem(
      SELECTED_ADDRESS_KEY
    );
  }


  // -------------------------------------------------------
  // No valid selected address
  //
  // Use the first address returned by the backend.
  // This is guaranteed to belong to current user.
  // -------------------------------------------------------

  const firstAddress =
    addresses[0];


  if (firstAddress) {

    /*
      Save ONLY the current user's address ID.
    */

    const firstAddressId =
      String(
        firstAddress?._id ||
        firstAddress?.id ||
        ""
      );


    if (firstAddressId) {

      sessionStorage.setItem(
        SELECTED_ADDRESS_KEY,
        JSON.stringify(
          firstAddressId
        )
      );
    }


    return {
      ...(typeof EMPTY_ADDRESS !==
      "undefined"
        ? EMPTY_ADDRESS
        : {}),

      ...firstAddress,
    };
  }


  return (
    typeof EMPTY_ADDRESS !==
    "undefined"
      ? {
          ...EMPTY_ADDRESS,
        }
      : {}
  );
}


// =========================================================
// RENDER WORKER
// =========================================================

function renderWorker() {

  if (!profile) {

    return;
  }


  const workerCard =
    document.getElementById(
      "workerCard"
    );


  if (!workerCard) {
    return;
  }


  // -------------------------------------------------------
  // Worker image / video
  // -------------------------------------------------------

  let media =
    "👤";


  if (
    profile.mediaType ===
      "image" &&
    profile.media
  ) {

    media =
      `
      <img
        src="${escapeHtml(
          profile.media
        )}"
        alt=""
      >
      `;

  } else if (
    profile.mediaType ===
      "video" &&
    profile.media
  ) {

    media =
      `
      <video
        src="${escapeHtml(
          profile.media
        )}"
        muted
        playsinline
      ></video>
      `;

  } else if (
    profile.image
  ) {

    media =
      `
      <img
        src="${escapeHtml(
          profile.image
        )}"
        alt=""
      >
      `;
  }


  workerCard.innerHTML =
    `
      <div class="profile-head">

        <div class="avatar">
          ${media}
        </div>

        <div class="identity">

          <div class="name">

            ${escapeHtml(
              profile.name ||
              "Unnamed"
            )}

          </div>


          <div
            class="row"
            style="margin-top:5px"
          >

            <span class="badge">

              ${escapeHtml(
                categoryLabel(
                  profile.category
                )
              )}

            </span>


            ${
              profile.role
                ? `
                  <span class="sub">

                    ${escapeHtml(
                      profile.role
                    )}

                  </span>
                `
                : ""
            }

          </div>


       <!--   ${
            profile.phone
              ? `
                <div
                  class="sub"
                  style="margin-top:6px"
                >

                  ${escapeHtml(
                    profile.phone
                  )}

                </div>
              `
              : ""
          }-->

        </div>

      </div>
    `;
}


// =========================================================
// RENDER CURRENT CLIENT
/*
function renderClient() {
  const client =getCurrentClient();
  const clientName =document.getElementById( "clientName");
  const clientPhone =document.getElementById(  "clientPhone");
  if (clientName) {
    clientName.textContent =
      client?.name ||
      "BuildSkil User";
  }
  if (clientPhone) {
    clientPhone.textContent =
      client?.phone ||
      "Phone not available";
  }
}*/
// =========================================================
// RENDER CURRENT CLIENT
// =========================================================

function renderClient(address) {

  const client =
    getCurrentClient();


  const clientName =
    document.getElementById(
      "clientName"
    );


  const clientPhone =
    document.getElementById(
      "clientPhone"
    );


  // -------------------------------------------------------
  // IMPORTANT:
  // Use Address screen "name" first.
  // Example:
  // Address name = "Rajesh Kumar"
  // -------------------------------------------------------

  const bookingClientName =
    address?.name?.trim() ||
    client?.name ||
    "BuildSkil User";


  if (clientName) {

    clientName.textContent =
      bookingClientName;
  }


  if (clientPhone) {

    clientPhone.textContent =
      client?.phone ||
      "Phone not available";
  }
}


// =========================================================
// RENDER ADDRESS
// =========================================================

function renderAddress(
  address
) {

  const addressCard =
    document.getElementById(
      "addressCard"
    );


  if (!addressCard) {
    return;
  }


  const hasLocation =
    address?.latitude !==
      null &&
    address?.latitude !==
      undefined &&
    address?.longitude !==
      null &&
    address?.longitude !==
      undefined;


  addressCard.innerHTML =
    `
      <div class="row">

        <span
          style="font-size:17px"
        >
          📍
        </span>

        <h3>
          Work location
        </h3>

      </div>


      ${
        address?.name
          ? `
            <div
              class="sub"
              style="
                margin-top:4px;
                font-weight:700;
              "
            >
              ${escapeHtml(
                address.name
              )}
            </div>
          `
          : ""
      }


      <div class="address">

        ${escapeHtml(
          formatFullAddress(
            address
          ) ||
          "No address saved yet."
        )}

      </div>


      ${
        hasLocation
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
    `;
}


// =========================================================
// RENDER PAGE
// =========================================================

async function render() {

  try {

    // -----------------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------------

    const token =
      localStorage.getItem(
        BOOKING_TOKEN_KEY
      );


    if (!token) {

      loadingEl.innerHTML =
        '<div class="icon">🔐</div>' +
        "<h2>Login required</h2>" +
        "<p>Please sign in to BuildSkil first.</p>";


      return;
    }


    // -----------------------------------------------------
    // WORKER PROFILE CHECK
    // -----------------------------------------------------

    if (!profile) {

      loadingEl.innerHTML =
        '<div class="icon">⚠️</div>' +
        "<h2>User not available</h2>" +
        "<p>Please return to Find Better and select the user again.</p>";


      return;
    }


    // -----------------------------------------------------
    // Loading message
    // -----------------------------------------------------

    loadingEl.innerHTML =
      '<div class="icon">⏳</div>' +
      "<h2>Loading booking details...</h2>" +
      "<p>Loading your saved address.</p>";


    loadingEl.classList.remove(
      "hidden"
    );


    content.classList.add(
      "hidden"
    );


    // -----------------------------------------------------
    // Load ONLY current user's address
    // -----------------------------------------------------

    const address =
      await getSelectedBookingAddress();


    // -----------------------------------------------------
    // Render worker
    // -----------------------------------------------------

    renderWorker();


    // -----------------------------------------------------
    // Render client
    // -----------------------------------------------------

    renderClient(address);


    // -----------------------------------------------------
    // Render own address
    // -----------------------------------------------------

    renderAddress(
      address
    );


    // -----------------------------------------------------
    // Show content
    // -----------------------------------------------------

    loadingEl.classList.add(
      "hidden"
    );

    content.classList.remove(
      "hidden"
    );


  } catch (error) {

    console.error(
      "BOOK USER LOAD ERROR:",
      error
    );


    loadingEl.innerHTML =
      '<div class="icon">⚠️</div>' +
      "<h2>Could not load booking details</h2>" +
      `<p>${escapeHtml(
        error.message ||
        "Could not load your address."
      )}</p>`;


    loadingEl.classList.remove(
      "hidden"
    );

    content.classList.add(
      "hidden"
    );
  }
}


// =========================================================
// CHANGE ADDRESS
// =========================================================

const changeAddressButton =
  document.getElementById(
    "changeAddress"
  );


if (changeAddressButton) {

  changeAddressButton.onclick =
    () => {

      /*
        Address screen will fetch the current
        user's addresses using the same cb_token.

        No address data is passed through URL.
      */

      location.href =
        "address.html?return=book-user";
    };
}


// =========================================================
// CONFIRM BOOKING
// =========================================================

const confirmButton =
  document.getElementById(
    "confirm"
  );


if (confirmButton) {

  confirmButton.onclick =
    async () => {

      // ---------------------------------------------------
      // Worker profile
      // ---------------------------------------------------

      if (!profile) {

        showToast(
          "Worker profile is not available."
        );

        return;
      }


      // ---------------------------------------------------
      // Login token
      // ---------------------------------------------------

      const token =
        localStorage.getItem(
          BOOKING_TOKEN_KEY
        );


      if (!token) {

        alert(
          "Please sign in to BuildSkil first."
        );

        return;
      }


      // ---------------------------------------------------
      // Current client
      // ---------------------------------------------------

      const client =
        getCurrentClient();


      const clientId =
        String(
          client?.id ||
          client?._id ||
          client?.userId ||
          ""
        );


      if (!clientId) {

        alert(
          "Your login session is invalid. Please sign in again."
        );

        return;
      }


      // ---------------------------------------------------
      // IMPORTANT:
      // FETCH CURRENT USER'S ADDRESS AGAIN
      // RIGHT BEFORE BOOKING
      // ---------------------------------------------------

      let address;


      try {

        address =
          await getSelectedBookingAddress();

      } catch (error) {

        console.error(
          "ADDRESS FETCH BEFORE BOOKING:",
          error
        );

        alert(
          error.message ||
          "Could not load your address."
        );

        return;
      }


      // ---------------------------------------------------
      // Validate current user's address
      // ---------------------------------------------------

      if (
        !hasUsableAddress(
          address
        )
      ) {

        alert(
          "Add the work location first. The booked user must know where to go for the work."
        );


        location.href =
          "address.html?return=book-user";


        return;
      }


      // ---------------------------------------------------
      // Worker User ID
      // ---------------------------------------------------

      const workerUserId =
        profile.userId ||
        profile.user?._id ||
        profile.user?.id ||
        profile.accountId ||
        "";


      // ---------------------------------------------------
      // Worker phone fallback
      // ---------------------------------------------------

      const workerPhone =
        profile.phone ||
        "";


      if (
        !workerUserId &&
        !workerPhone
      ) {

        alert(
          "This worker profile is missing the worker account ID and phone number."
        );

        return;
      }


      // ---------------------------------------------------
      // Address ID
      // ---------------------------------------------------

      const workAddressId =
        address?._id ||
        address?.id ||
        "";


      if (!workAddressId) {

        alert(
          "Your selected address does not have a valid address ID. Please select your address again."
        );


        location.href =
          "address.html?return=book-user";


        return;
      }


      // ---------------------------------------------------
      // Note
      // ---------------------------------------------------

      const noteElement =
        document.getElementById(
          "note"
        );


      const note =
        noteElement
          ? noteElement.value.trim()
          : "";


      // ---------------------------------------------------
      // Button loading
      // ---------------------------------------------------

      const originalText =
        confirmButton.textContent;


      confirmButton.disabled =
        true;


      confirmButton.textContent =
        "Booking...";


      try {

        // -------------------------------------------------
        // Backend payload
        // -------------------------------------------------

        const payload = {

          workerUserId:
            workerUserId ||
            undefined,

          workerPhone:
            workerPhone ||
            undefined,

          workAddressId:
            String(
              workAddressId
            ),

          note:
            note,
        };


        console.log(
          "BOOKING PAYLOAD:",
          payload
        );


        console.log(
          "BOOKING CLIENT:",
          clientId
        );


        console.log(
          "BOOKING ADDRESS:",
          address
        );


        // -------------------------------------------------
        // Create genuine MongoDB booking
        // -------------------------------------------------

        const result =
          await bookingApi(
            "",
            {
              method:
                "POST",

              body:
                JSON.stringify(
                  payload
                ),
            }
          );


        console.log(
          "BOOKING CREATED:",
          result
        );


        // -------------------------------------------------
        // IMPORTANT:
        // Do NOT save booking/address into global
        // localStorage.
        //
        // MongoDB is the source of truth.
        // -------------------------------------------------

        showToast(
          result?.message ||
          "Booking request sent successfully."
        );


        // -------------------------------------------------
        // Go to backend booking list
        // -------------------------------------------------

        setTimeout(() => {

          location.href =
            "booked-users.html";

        }, 700);


      } catch (error) {

        console.error(
          "BOOKING ERROR:",
          error
        );


        // -------------------------------------------------
        // Duplicate booking
        // -------------------------------------------------

        if (
          error.status ===
          409
        ) {

          alert(
            error.message ||
            `${profile.name || "This user"} already has an active booking from you.`
          );


          location.href =
            "booked-users.html";


          return;
        }


        // -------------------------------------------------
        // Unauthorized
        // -------------------------------------------------

        if (
          error.status ===
          401
        ) {

          alert(
            "Your BuildSkil login has expired. Please sign in again."
          );


          return;
        }


        alert(
          error.message ||
          "Could not create booking. Please try again."
        );


      } finally {

        confirmButton.disabled =
          false;

        confirmButton.textContent =
          originalText;
      }
    };
}


// =========================================================
// INITIAL LOAD
// =========================================================

render();