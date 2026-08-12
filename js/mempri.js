
let permissions = null;
let membership = null;
async function loadMembership() {
  const token = localStorage.getItem("cb_token");
  if (!token) return;
  try {
    const res = await fetch(
      "https://api.buildskil.com/api/membership/my-membership",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    if (!data.success) {
      alert(data.message);
      return;
    }
    membership = data.membership;
    permissions = data.permissions;
    // ⭐ Update the buttons

    setupProtectedButtons();
   // updateCurrentPlan(membership.plan);
  } catch (err) {
    console.error(err);
  }
}
function hasPageAccess(pageName) {

    if (!permissions)
        return false;

    if (permissions.pages.includes("*"))
        return true;

    return permissions.pages.includes(pageName);

}
function setupProtectedButtons() {

    if (!permissions) return;

    document.querySelectorAll(".protected-btn").forEach(btn => {

        const page = btn.dataset.page;

        const allowed =
            permissions.pages.includes("*") ||
            permissions.pages.includes(page);

        if (!allowed) {

            // Show lock icon
            btn.innerHTML += " 🔒";

            btn.addEventListener("click", function (e) {

                e.preventDefault();

                openModal(); // your upgrade modal

                // or:
                // alert("Upgrade Membership");

            });

        }

    });

}
document.addEventListener("DOMContentLoaded", async () => {

    await loadMembership();

    //updateCurrentPlan(membership.plan);

});
function openModal() {
  document.getElementById("upgradeModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("upgradeModal").style.display = "none";
}
function goToPricing() {
  window.location.href = "price.html";
}
function checkChatbotAccess() {
  if (userPlan === "free") {
    openModal();
    return false;
  }
  return true;
}

async function openProtectedPage(url) {

    if (!permissions) {

        const ok = await loadMembership();

        if (!ok) return;

    }

    const pageName = url.split("/").pop();

    if (hasPageAccess(pageName)) {

        window.location.href = url;

    } else {

        alert("Upgrade your membership to access this feature.");

        // OR:
        // openModal();

    }

}
function openModal() {

    const modal = document.getElementById("upgradeModal");

    if (modal) {

        modal.style.display = "flex";

    } else {

        alert("Upgrade your membership to access this feature.");

        // or redirect
         window.location.href = "../screen/price.html";

    }

}


