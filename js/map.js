const API_BASE = "https://api.buildskil.com/api/location"; // change if deployed
let editingProjectId = null;
function authHeaders(isFormData = false) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let selectedLat = null;
  let selectedLng = null;
  let marker;
  let userMarker;
  
  // Live tracking
 navigator.geolocation.watchPosition(async (pos) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  if (!userMarker) {
    userMarker = L.marker([lat, lng]).addTo(map).bindPopup("you here");
  } else {
    userMarker.setLatLng([lat, lng]);
  }

  map.setView([lat, lng], 14);

  // 🔥 Send to backend
     try {
      await fetch(`${API_BASE}/live/update`, {
        method: "POST",
        headers: authHeaders(),
  body: JSON.stringify({ lat, lng })
      });
       } catch (err) {
      console.log("Live update error");
     }

 });

  // Map click
    map.on("click", (e) => {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;
    document.getElementById("lat").value = selectedLat;
    document.getElementById("lng").value = selectedLng;
    if (marker) map.removeLayer(marker);

    marker = L.marker([selectedLat, selectedLng])
      .addTo(map)
      .bindPopup("Selected Location")
      .openPopup();
  });
  const liveLayer = L.layerGroup().addTo(map);

async function loadLiveUsers() {
  try {
    const res = await fetch(`${API_BASE}/live/users`, {
       headers: authHeaders()
    });

    const users = await res.json();

    liveLayer.clearLayers();

    users.forEach(u => {
      L.marker([u.location.lat, u.location.lng])
        .bindPopup(`User: ${u.user.phone}`)
        .addTo(liveLayer);
    });

  } catch (err) {
    console.error(err);
  }
}
  setInterval(loadLiveUsers, 2000);
   // Create a layer group to hold all project markers
const projectMarkers = L.layerGroup().addTo(map);

document.getElementById("saveBtn").addEventListener("click", async () => {

  if (!selectedLat && !editingProjectId) {
    alert("Select location first");
    return;
  }

   const phones = document.getElementById("phones").value
    .split(",")
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const data = {
    projectName: document.getElementById("projectName").value,
    description: document.getElementById("description").value,
    lat: selectedLat,
    lng: selectedLng,
    visibility: document.getElementById("visibility").value,
    projectType: document.getElementById("projectType").value,
    phones
  };

  try {

    let url = `${API_BASE}/project`;
    let method = "POST";

    // 🔥 UPDATE MODE
    if (editingProjectId) {
      url = `${API_BASE}/project/${editingProjectId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    alert(editingProjectId ? "Updated ✅" : "Created ✅");

    editingProjectId = null; // reset mode
    loadProjects();
      resetForm();
  } catch (err) {
    console.error(err);
    alert("Error saving project");
  }
});
function resetForm() {
  document.getElementById("projectName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("visibility").value = ""; // default
  document.getElementById("phones").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lng").value = "";
  document.getElementById("projectType").value = ""; // default
}
async function loadProjects() {
  const historyList = document.getElementById("projectHistory");
  historyList.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/project`, { headers: authHeaders() });
    const projects = await res.json();

    projectMarkers.clearLayers();

  const loginUser = JSON.parse(localStorage.getItem("cb_login_user"));
const currentUserId = loginUser?._id || loginUser?.id;

    projects.forEach(p => {
      const marker = L.marker([p.location.lat, p.location.lng], { icon: getBuildingIcon(p.projectType) })
        .bindPopup(`
          <div class="popup-content">
            <strong>${p.projectName}</strong><br>
            <strong>${p.projectType}</strong>
            ${p.description}<br>
            <em>${p.visibility}</em>
          </div>
        `)
        .addTo(projectMarkers);

      const li = document.createElement("li");
      const shortId = p._id.slice(-6).toUpperCase();
      li.innerHTML = `
        <span class="history-item"><strong>ID:</strong>${shortId} - ${p.projectName}</span>
      `;
// Debug log to see values
      console.log("Project owner:", p.owner, "Current user:", currentUserId);


      // Only show edit/delete if owner
      if (String(p.owner) === String(currentUserId)) {
        li.innerHTML += `
          <button class="edit-btn">✏️</button>
          <button class="remove-btn">🗑️</button>
        `;

        li.querySelector(".edit-btn").addEventListener("click", () => {
          editingProjectId = p._id;
          document.getElementById("projectName").value = p.projectName;
          document.getElementById("description").value = p.description;
          document.getElementById("visibility").value = p.visibility;
          document.getElementById("phones").value = "";
          document.getElementById("lat").value = p.location.lat;
          document.getElementById("lng").value = p.location.lng;
          document.getElementById("projectType").value = p.projectType;
        });

        li.querySelector(".remove-btn").addEventListener("click", async () => {
          if (!confirm("Delete project?")) return;
          const res = await fetch(`${API_BASE}/project/${p._id}`, {
            method: "DELETE",
            headers: authHeaders()
          });
          if (res.ok) {
            showToaster("Project deleted ✅", "success");
            loadProjects();
          } else {
            const err = await res.json();
            showToaster(err.message || "Delete failed", "error");
          }
        });
      } else {
        // Non-owner clicks → toaster error
        li.innerHTML += `
          <button class="edit-btn">✏️</button>
          <button class="remove-btn">🗑️</button>
        `;
        li.querySelector(".edit-btn").addEventListener("click", () => {
          showToaster("Only owner can edit this project", "error");
        });
        li.querySelector(".remove-btn").addEventListener("click", () => {
          showToaster("Only owner can delete this project", "error");
        });
      }
// History click → focus map and open popup
li.querySelector(".history-item").addEventListener("click", () => {
  map.setView([p.location.lat, p.location.lng], 15);
  marker.openPopup();   // 🔥 show popup too
});
      historyList.appendChild(li);
     
      marker.on("mouseover", function () { this.openPopup(); });
      marker.on("mouseout", function () { this.closePopup(); });
    });
  } catch (err) {
    console.error("Load error", err);
  }
}
function getBuildingIcon(type) {
  let iconClass = "fa-building"; // default
  let color = "#2c3e50";         // default dark gray

  switch (type) {
    case "office":
      iconClass = "fa-city";
      color = "blue";
      break;
    case "school":
      iconClass = "fa-school";
      color = "green";
      break;
    case "hospital":
      iconClass = "fa-hospital";
      color = "red";
      break;
    case "home":
      iconClass = "fa-house";
      color = "orange";
      break;
      case "building":
      iconClass = "fa-building";
      color = "gray";
      break;
  }

  return L.divIcon({
    html: `<i class="fa-solid ${iconClass}" style="font-size:24px;color:${color};"></i>`,
    iconSize: [24, 24],
    className: "custom-marker"
  });
}
async function startSharing(projectId, lat, lng) {
  await fetch(`${API_BASE}/live/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ projectId, lat, lng })
  });
}
document.getElementById("toggleFormLink").addEventListener("click", () => {
  const form = document.getElementById("projectForm");
  form.classList.toggle("open");
});
  // My Location button
  document.getElementById("myLocationBtn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 15);
    });
  });

  // Toggle sidebar
  document.getElementById("toggleSidebarBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("hidden");
  });
  function showToaster(message, type = "info") {
  const toaster = document.getElementById("toaster");
  toaster.textContent = message;

  if (type === "error") toaster.style.background = "#e74c3c";
  else if (type === "success") toaster.style.background = "#2ecc71";
  else toaster.style.background = "#333";

  toaster.classList.add("show");
  setTimeout(() => toaster.classList.remove("show"), 3000);
}
  loadProjects();
});












/*document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  let selectedLat = null;
  let selectedLng = null;
  let marker;
  let userMarker;
  
  // Live tracking
  navigator.geolocation.watchPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    if (!userMarker) {
      userMarker = L.marker([lat, lng]).addTo(map).bindPopup("You are here");
    } else {
      userMarker.setLatLng([lat, lng]);
    }

    map.setView([lat, lng], 14);
  });

  // Map click
  map.on("click", (e) => {
    selectedLat = e.latlng.lat;
    selectedLng = e.latlng.lng;
    document.getElementById("lat").value = selectedLat;
    document.getElementById("lng").value = selectedLng;
    if (marker) map.removeLayer(marker);

    marker = L.marker([selectedLat, selectedLng])
      .addTo(map)
      .bindPopup("Selected Location")
      .openPopup();
  });
   // Create a layer group to hold all project markers
const projectMarkers = L.layerGroup().addTo(map);

document.getElementById("saveBtn").addEventListener("click", () => {
  if (!selectedLat) {
    alert("Select location first");
    return;
  }

  const phones = document.getElementById('phones').value
    .split(',')
    .map(p => p.trim());

  const data = {
    id: Date.now(), // unique ID
    projectName: document.getElementById('projectName').value,
    description: document.getElementById('description').value,
    lat: selectedLat,
    lng: selectedLng,
    visibility: document.getElementById('visibility').value,
    permittedUsers: phones
  };

  // Create a new marker for this project
  const projectMarker = L.marker([data.lat, data.lng])
    .bindPopup(`
      <strong>${data.projectName}</strong><br>
      ${data.description}<br>
      <em>Visibility: ${data.visibility}</em><br>
      Phones: ${data.permittedUsers.join(", ")}
    `)
    .addTo(projectMarkers);

  projectMarker.on('mouseover', function () { this.openPopup(); });
  projectMarker.on('mouseout', function () { this.closePopup(); });

  // Add to history list
  const historyList = document.getElementById("projectHistory");
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="history-item"><strong>ID:</strong> ${data.id} - ${data.projectName}</span>
    <button class="edit-btn">✏️</button>
    <button class="remove-btn">🗑️</button>
  `;

  // Click on history item → zoom to marker
  li.querySelector(".history-item").addEventListener("click", () => {
    map.setView([data.lat, data.lng], 15);
    projectMarker.openPopup();
  });

  // Edit button
  li.querySelector(".edit-btn").addEventListener("click", () => {
    document.getElementById('projectName').value = data.projectName;
    document.getElementById('description').value = data.description;
    document.getElementById('visibility').value = data.visibility;
    document.getElementById('phones').value = data.permittedUsers.join(", ");
    document.getElementById('lat').value = data.lat;
    document.getElementById('lng').value = data.lng;
    map.setView([data.lat, data.lng], 14);
  });

  // Remove button
  li.querySelector(".remove-btn").addEventListener("click", () => {
    historyList.removeChild(li);
    projectMarkers.removeLayer(projectMarker);
  });

  historyList.appendChild(li);

  console.log("Send to backend:", data);
  alert("Saved (connect soon)");
});

  // My Location button
  document.getElementById("myLocationBtn").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 15);
    });
  });

  // Toggle sidebar
  document.getElementById("toggleSidebarBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("hidden");
  });
});
*/