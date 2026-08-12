async function buyPlan(plan) {
  const token = localStorage.getItem("cb_token");
  if (!token) {
    alert("Please login first.");
    return;
  }
  try {
    const response = await fetch(
      "https://api.buildskil.com/api/membership/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      },
    );
    const data = await response.json();
    if (!data.success) {
      alert(data.message);
      return;
    }
    alert("Membership updated successfully!");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Server error.");
  }
}


function updateCurrentPlan(plan) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.disabled = false;
    btn.textContent = "Upgrade";
  });
  if (plan === "free") {
    document.querySelector(".free-btn").textContent = "Current Plan";
    document.querySelector(".free-btn").disabled = true;
  }
  if (plan === "small") {
    document.querySelector(".small-btn").textContent = "Current Plan";
    document.querySelector(".small-btn").disabled = true;
  }
  if (plan === "big") {
    document.querySelector(".big-btn").textContent = "Current Plan";
    document.querySelector(".big-btn").disabled = true;
  }
}

