// ==============================
// Elements
// ==============================

const form = document.getElementById("issueForm");

const issueType = document.getElementById("issueType");

const otherProblemBox = document.getElementById("otherProblemBox");

const otherProblem = document.getElementById("otherProblem");

const description = document.getElementById("description");

const screenshot = document.getElementById("screenshot");

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
// Image Preview
// ==============================

screenshot.addEventListener("change", () => {

    const file = screenshot.files[0];

    if (!file) {

        previewBox.classList.add("hidden");

        return;

    }

    // Allow Images Only

    if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        screenshot.value = "";

        return;

    }

    // Max 5 MB

    if (file.size > 5 * 1024 * 1024) {

        alert("Image must be under 5 MB.");

        screenshot.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewBox.classList.remove("hidden");

    };

    reader.readAsDataURL(file);

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

        if (screenshot.files[0]) {

            formData.append(
                "image",
                screenshot.files[0]
            );

        }

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

});