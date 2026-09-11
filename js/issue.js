const form = document.getElementById("issueForm");

const issueType = document.getElementById("issueType");
const otherProblemBox = document.getElementById("otherProblemBox");
const otherProblem = document.getElementById("otherProblem");

const description = document.getElementById("description");

const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");

const charCount = document.getElementById("charCount");

const loading = document.getElementById("loading");
const responseMessage = document.getElementById("responseMessage");

const submitBtn = document.querySelector(".submit-btn");
const issuesLoading =
  document.getElementById("issuesLoading");

const issuesError =
  document.getElementById("issuesError");

const issuesList =
  document.getElementById("issuesList");

const noIssues =
  document.getElementById("noIssues");

const refreshIssuesBtn =
  document.getElementById("refreshIssuesBtn");
// =====================================================
// API
// =====================================================
//const API = "https://api.buildskil.com/api/issues"
const API = "http://localhost:5000/api/issues";

// =====================================================
// CHARACTER COUNTER
// =====================================================

if (description && charCount) {
  description.addEventListener("input", () => {
    charCount.innerText = description.value.length;
  });
}

// =====================================================
// SHOW / HIDE OTHER PROBLEM
// =====================================================

if (issueType) {
  issueType.addEventListener("change", () => {
    if (issueType.value === "other") {
      otherProblemBox.classList.remove("hidden");

      otherProblem.required = true;
    } else {
      otherProblemBox.classList.add("hidden");

      otherProblem.required = false;

      otherProblem.value = "";
    }
  });
}

// =====================================================
// MESSAGE
// =====================================================

function showMessage(type, text) {
  if (!responseMessage) return;

  responseMessage.className = "";

  responseMessage.classList.add(type);

  responseMessage.innerHTML = text;
}

// =====================================================
// LOADING
// =====================================================

function setLoading(state) {
  if (!loading || !submitBtn) return;

  if (state) {
    loading.classList.remove("hidden");

    submitBtn.disabled = true;

    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
  } else {
    loading.classList.add("hidden");

    submitBtn.disabled = false;

    submitBtn.innerHTML =
      '<i class="fa-solid fa-paper-plane"></i> Submit Report';
  }
}

// =====================================================
// SUBMIT ISSUE
// =====================================================

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear old message

    responseMessage.className = "";

    responseMessage.innerHTML = "";

    // =============================================
    // FRONTEND VALIDATION
    // =============================================

    if (!issueType.value) {
      showMessage("error", "Please select a problem.");

      return;
    }

    if (!description.value.trim()) {
      showMessage("error", "Please describe your issue.");

      return;
    }

    if (description.value.trim().length > 500) {
      showMessage("error", "Description cannot exceed 500 characters.");

      return;
    }

    if (issueType.value === "other" && !otherProblem.value.trim()) {
      showMessage("error", "Please enter your problem.");

      return;
    }

    // =============================================
    // TOKEN
    // =============================================

    const token = localStorage.getItem("cb_token");

    if (!token) {
      showMessage("error", "Please login before reporting an issue.");

      return;
    }

    try {
      setLoading(true);

      // =========================================
      // JSON DATA
      // =========================================

      const body = {
        issueType: issueType.value.trim(),

        otherProblem:
          issueType.value === "other" ? otherProblem.value.trim() : "",

        description: description.value.trim(),
      };

      console.log("Submitting issue:", body);

      // =========================================
      // API REQUEST
      // =========================================

      const res = await fetch(API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(body),
      });

      // =========================================
      // RESPONSE
      // =========================================

      let data = {};

      try {
        data = await res.json();
      } catch (jsonError) {
        data = {};
      }

      if (res.status === 401) {
        throw new Error("Your session has expired. Please login again.");
      }

      if (!res.ok) {
        throw new Error(data.message || "Unable to submit issue.");
      }

      // =========================================
      // SUCCESS
      // =========================================

      showMessage("success", "✅ Issue submitted successfully.");

      // Reset form

      form.reset();

      // Reset counter

      if (charCount) {
        charCount.innerText = "0";
      }

      // Hide other problem

      otherProblemBox.classList.add("hidden");

      otherProblem.required = false;

      // Hide preview

      if (previewBox) {
        previewBox.classList.add("hidden");
      }

      if (previewImage) {
        previewImage.src = "";
      }

      console.log("Issue created:", data.issue);
    } catch (err) {
      console.error("Issue submission error:", err);

      showMessage(
        "error",
        err.message || "Something went wrong while submitting your issue.",
      );
    } finally {
      setLoading(false);
    }
  });
}
// =====================================================
// FETCH MY ISSUES
// =====================================================

async function fetchMyIssues() {

  const token =
    localStorage.getItem("cb_token");

  if (!token) {

    showIssuesError(
      "Please login to view your reported issues."
    );

    return;

  }


  try {

    setIssuesLoading(true);

    hideIssuesError();


    const res = await fetch(
      `${API}/my`,
      {
        method: "GET",

        headers: {

          "Accept": "application/json",

          "Authorization":
            `Bearer ${token}`

        }

      }
    );


    let data = {};

    try {

      data = await res.json();

    } catch (error) {

      data = {};

    }


    if (res.status === 401) {

      throw new Error(
        data.message ||
        "Authentication failed. Please login again."
      );

    }


    if (!res.ok) {

      throw new Error(
        data.message ||
        "Unable to load your issues."
      );

    }


    renderMyIssues(
      data.issues || []
    );


  } catch (error) {

    console.error(
      "Fetch issues error:",
      error
    );


    showIssuesError(
      error.message ||
      "Unable to load your issues."
    );

  } finally {

    setIssuesLoading(false);

  }

}

// =====================================================
// ISSUE LOADING
// =====================================================

function setIssuesLoading(state) {

  if (!issuesLoading) return;


  if (state) {

    issuesLoading.classList.remove("hidden");

  } else {

    issuesLoading.classList.add("hidden");

  }

}
// =====================================================
// ISSUE ERROR
// =====================================================

function showIssuesError(message) {

  if (!issuesError) return;


  issuesError.textContent =
    message;

  issuesError.classList.remove(
    "hidden"
  );

}


function hideIssuesError() {

  if (!issuesError) return;


  issuesError.textContent = "";

  issuesError.classList.add(
    "hidden"
  );

}
// =====================================================
// RENDER MY ISSUES
// =====================================================

function renderMyIssues(issues) {

  if (!issuesList) return;


  issuesList.innerHTML = "";


  // No issues

  if (!issues.length) {

    noIssues?.classList.remove(
      "hidden"
    );

    return;

  }


  noIssues?.classList.add(
    "hidden"
  );


  issues.forEach((issue) => {

    const card =
      document.createElement("div");

    card.className =
      "issue-item";


    const statusClass =
      getStatusClass(
        issue.status
      );


    const issueTitle =
      issue.issueType === "other" &&
      issue.otherProblem
        ? issue.otherProblem
        : issue.issueType;


    card.innerHTML = `

      <div class="issue-item-top">

        <div class="issue-info">

          <h3>
            ${escapeHTML(issueTitle)}
          </h3>

          <span class="issue-date">
            ${formatDate(issue.createdAt)}
          </span>

        </div>


        <span class="
          issue-status
          ${statusClass}
        ">
          ${formatStatus(issue.status)}
        </span>

      </div>


      <div class="issue-description">

        <strong>Description</strong>

        <p>
          ${escapeHTML(
            issue.description || ""
          )}
        </p>

      </div>


      ${
        issue.adminComment
          ? `
            <div class="admin-response">

              <div class="admin-response-title">

                <i class="fa-solid fa-user-shield"></i>

                Admin Response

              </div>

              <p>
                ${escapeHTML(
                  issue.adminComment
                )}
              </p>

            </div>
          `
          : ""
      }

    `;


    issuesList.appendChild(
      card
    );

  });

}
// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;

}
// =====================================================
// STATUS
// =====================================================

function getStatusClass(status) {

  switch (status) {

    case "open":
      return "status-open";

    case "in-progress":
      return "status-progress";

    case "resolved":
      return "status-resolved";

    case "closed":
      return "status-closed";

    default:
      return "status-open";

  }

}


function formatStatus(status) {

  switch (status) {

    case "open":
      return "Open";

    case "in-progress":
      return "In Progress";

    case "resolved":
      return "Resolved";

    case "closed":
      return "Closed";

    default:
      return status || "Open";

  }

}
// =====================================================
// DATE
// =====================================================

function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }


  const date =
    new Date(dateValue);


  if (Number.isNaN(
    date.getTime()
  )) {

    return "";

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
// =====================================================
// REFRESH ISSUES
// =====================================================

if (refreshIssuesBtn) {

  refreshIssuesBtn.addEventListener(
    "click",
    async () => {

      refreshIssuesBtn.disabled =
        true;

      refreshIssuesBtn
        .querySelector("i")
        ?.classList.add(
          "fa-spin"
        );


      await fetchMyIssues();


      refreshIssuesBtn.disabled =
        false;

      refreshIssuesBtn
        .querySelector("i")
        ?.classList.remove(
          "fa-spin"
        );

    }
  );

}
// =====================================================
// LOAD ISSUES ON PAGE LOAD
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    fetchMyIssues();

  }
);
/*const form = document.getElementById("issueForm");
const issueType = document.getElementById("issueType");
const otherProblemBox = document.getElementById("otherProblemBox");
const otherProblem = document.getElementById("otherProblem");
const description = document.getElementById("description");
const previewBox = document.getElementById("previewBox");
const previewImage = document.getElementById("previewImage");
const charCount = document.getElementById("charCount");
const loading = document.getElementById("loading");
const responseMessage = document.getElementById("responseMessage");
const submitBtn = document.querySelector(".submit-btn");
// ==============================
// API URL
// ==============================
const API = "/api/issues/report";
// ==============================
// Character Counter
// ==============================
description.addEventListener("input", () => {

    charCount.innerText = description.value.length;

});
// ==============================
// Show Other Input
// ==============================
issueType.addEventListener("change", () => {

    if (issueType.value === "other") {

        otherProblemBox.classList.remove("hidden");

        otherProblem.required = true;

    } else {

        otherProblemBox.classList.add("hidden");

        otherProblem.required = false;

        otherProblem.value = "";

    }

});
// ==============================
// Message
// ==============================

function showMessage(type, text) {

    responseMessage.className = "";

    responseMessage.classList.add(type);

    responseMessage.innerHTML = text;

}
// ==============================
// Loading
// ==============================

function setLoading(state) {

    if (state) {

        loading.classList.remove("hidden");

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Sending...';

    } else {

        loading.classList.add("hidden");

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Submit Report';

    }

}

// ==============================
// Submit
// ==============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    responseMessage.className = "";

    responseMessage.innerHTML = "";

    // Validation

    if (!issueType.value) {

        return showMessage("error", "Please select a problem.");

    }

    if (!description.value.trim()) {

        return showMessage("error", "Please describe your issue.");

    }

    if (issueType.value === "other" &&
        !otherProblem.value.trim()) {

        return showMessage(
            "error",
            "Please enter your problem."
        );

    }

    try {

        setLoading(true);

        const formData = new FormData();

        formData.append("issueType", issueType.value);

        formData.append("customIssue", otherProblem.value);

        formData.append("description", description.value);


        const token = localStorage.getItem("token");

        const res = await fetch(API, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await res.json();

        if (!res.ok) {

            throw new Error(
                data.message || "Something went wrong."
            );

        }

        showMessage(
            "success",
            "✅ Issue submitted successfully."
        );

        form.reset();

        charCount.innerText = 0;

        previewBox.classList.add("hidden");

        otherProblemBox.classList.add("hidden");

    }

    catch (err) {

        showMessage(
            "error",
            err.message
        );

    }

    finally {

        setLoading(false);

    }

});*/
