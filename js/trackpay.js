let workers = [];
//let workers = JSON.parse(localStorage.getItem("billingWorkers")) || [];
let currentWorker = null;
const pageLoader = document.getElementById("pageLoader");
//const API_BASE = "http://localhost:5000/api/billing";
const API_BASE = "https://api.buildskil.com/api/billing";
function authHeaders(isFormData = false) {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("cb_token")}`
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}
const workerContainer = document.getElementById("workerContainer");

const totalWorkers = document.getElementById("totalWorkers");
const activeBills = document.getElementById("activeBills");
const pendingBills = document.getElementById("pendingBills");
const paidBills = document.getElementById("paidBills");

const historyBody = document.getElementById("historyBody");

const paymentSection = document.getElementById("paymentSection");

const dailyWorkSection = document.getElementById("dailyWorkSection");

const historySection = document.getElementById("historySection");
const shareModal =
    document.getElementById("shareModal");

const sharePhone =
    document.getElementById("sharePhone");

const shareBillingBtn =
    document.getElementById("shareBillingBtn");

const sharedUsersList =
    document.getElementById("sharedUsersList");

const shareMessage =
    document.getElementById("shareMessage");

const closeShareModal =
    document.getElementById("closeShareModal");

let sharingBillingId = null;
document.getElementById("createBillingBtn").addEventListener("click", async () => {

    const workerName = document.getElementById("workerName").value.trim();
    const phone = document.getElementById("workerPhone").value.trim();
    const dailyRate = Number(document.getElementById("dailyRate").value);
    const cycle = Number(document.getElementById("paymentCycle").value);

    if (!workerName || !phone || !dailyRate || !cycle) {
        return alert("Fill all fields");
    }

    try {
         showLoader("Creating...");
        const res = await fetch(`${API_BASE}/create`, {

            method: "POST",

            headers: authHeaders(),

            body: JSON.stringify({

                workerName,

                phone,

                dailyRate,

                cycle

            })

        });

        const data = await res.json();

        if (!res.ok) {

            return alert(data.message);

        }

        clearForm();

        loadWorkers();

    } catch (err) {

        console.error(err);

    }finally{
        hideLoader();
    }

});
async function loadWorkers() {

    try {
        showLoader("Loading...");
        const res = await fetch(`${API_BASE}/list`, {
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        workers = data.billings;

        renderWorkers();
         updateDashboard();
    } catch (err) {

        console.error(err);

    }finally{
        hideLoader();
    }

}
function clearForm(){

const workerName = document.getElementById("workerName");
const workerPhone = document.getElementById("workerPhone");
const dailyRate = document.getElementById("dailyRate");
const paymentCycle = document.getElementById("paymentCycle");

workerName.value="";

workerPhone.value="";

dailyRate.value="";

paymentCycle.value="";

}


function renderWorkers(){

workerContainer.innerHTML="";

workers.forEach(worker=>{

const card=document.createElement("div");
const ownerActions = worker.accessType === "owner"
    ? `
        <button class="work">Open</button>
        <button class="delete">Delete</button>
        <button class="share">Share</button>
      `
    : "";
card.className="worker-card";

card.innerHTML=`

<h3>${worker.workerName}</h3>

<p><strong>Phone :</strong> ${worker.phone}</p>

<p><strong>Rate :</strong> ₹${worker.dailyRate}</p>

<p><strong>Cycle :</strong> ${worker.cycle} Days</p>

<p><strong>Worked :</strong> ${worker.workedDays}</p>

<p><strong>Total :</strong> ₹${worker.totalAmount}</p>

<p><strong>Status :</strong> ${worker.status}</p>

<div class="worker-actions">

<button class="view">
            View
        </button>

        ${ownerActions}

</div>

`;
const viewBtn = card.querySelector(".view");

if (viewBtn) {
    viewBtn.onclick = () => {
        showPreviousHistory(worker._id);
    };
}


const workBtn = card.querySelector(".work");

if (workBtn) {
    workBtn.onclick = () => {
        openWorker(worker._id);
    };
}


const deleteBtn = card.querySelector(".delete");

if (deleteBtn) {

    deleteBtn.onclick = () => {

        if (
            confirm(
                "Are you sure you want to delete this worker?"
            )
        ) {
            deleteWorker(worker._id);
        }

    };

}


const shareBtn = card.querySelector(".share");

if (shareBtn) {

    shareBtn.onclick = () => {
        openShareModal(worker._id);
    };

}
workerContainer.appendChild(card);

});

updateDashboard();

}
function updateDashboard(){

totalWorkers.textContent=workers.length;

activeBills.textContent=

workers.filter(w=>w.status==="Active").length;

pendingBills.textContent=

workers.filter(w=>w.status==="Pending").length;

paidBills.textContent=

workers.filter(w=>w.status==="Paid").length;

}
async function openWorker(id){

    const res = await fetch(`${API_BASE}/single/${id}`,{

        headers:authHeaders()

    });

    const data = await res.json();

    currentWorker=data.billing;

    dailyWorkSection.classList.remove("hidden");

    historySection.classList.remove("hidden");

    viewName.textContent=currentWorker.workerName;

    viewPhone.textContent=currentWorker.phone;

    viewRate.textContent=currentWorker.dailyRate;

    viewCycle.textContent=currentWorker.cycle;

    renderHistory();

}
async function deleteWorker(id){

    try{
        showLoader("Deleting...");

        const res=await fetch(`${API_BASE}/delete/${id}`,{

            method:"DELETE",

            headers:authHeaders()

        });

        const data=await res.json();

        if(!res.ok){

            return alert(data.message);

        }

        loadWorkers();

    }

    catch(err){

        console.log(err);

    }finally{
        hideLoader();
    }

}
document.getElementById("addWorkDayBtn").addEventListener("click",async()=>{

    if(!currentWorker) return;

    const res=await fetch(`${API_BASE}/${currentWorker._id}/work`,{

        method:"POST",

        headers:authHeaders()

    });

    const data=await res.json();

    if(!res.ok){

        return alert(data.message);

    }

    currentWorker=data.billing;

    renderHistory();

    loadWorkers();

    if(currentWorker.status==="Pending"){

        paymentSection.classList.remove("hidden");

        totalAmount.textContent=currentWorker.totalAmount;

    }

});
function renderHistory() {

    historyBody.innerHTML = "";

    if (!currentWorker) return;

    currentWorker.history.forEach(item => {

        historyBody.innerHTML += `

            <tr>

                <td>${item.day}</td>

                <td>${new Date(item.date).toLocaleDateString()}</td>

                <td>₹${item.amount}</td>

                <td>${item.status}</td>

            </tr>

        `;

    });

}
document.getElementById("paidBtn").addEventListener("click",async()=>{

    const res=await fetch(`${API_BASE}/${currentWorker._id}/pay`,{

        method:"POST",

        headers:authHeaders()

    });

    const data=await res.json();

    if(!res.ok){

        return alert(data.message);

    }

    paymentSection.classList.add("hidden");

    currentWorker=data.billing;

    loadWorkers();

    renderHistory();

});
document
.getElementById("notPaidBtn")
.addEventListener("click",()=>{

if(!currentWorker)return;
currentWorker.status="Pending";
paymentSection.classList.add("hidden");
renderWorkers();
renderHistory();
});
document.getElementById("addBillBtn").addEventListener("click",async()=>{

    const res=await fetch(`${API_BASE}/${currentWorker._id}/add-more`,{

        method:"POST",

        headers:authHeaders()

    });

    const data=await res.json();

    if(!res.ok){

        return alert(data.message);

    }

    paymentSection.classList.add("hidden");

    currentWorker=data.billing;

    loadWorkers();

});
//share billing btna
shareBillingBtn.addEventListener("click", async () => {

    const phone = sharePhone.value.trim();

    if (!sharingBillingId) {

        return;

    }

    if (phone.length !== 10) {

        showShareMessage(
            "Enter a valid 10-digit phone number.",
            "error"
        );

        return;

    }


    try {

        shareBillingBtn.disabled = true;

        shareBillingBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Sharing...
        `;


        const res = await fetch(
            `${API_BASE}/${sharingBillingId}/share`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify({
                    phone
                })
            }
        );


        const data = await res.json();


        if (!res.ok) {

            showShareMessage(
                data.message || "Unable to share billing.",
                "error"
            );

            return;

        }


        showShareMessage(
            "Billing shared successfully.",
            "success"
        );


        sharePhone.value = "";


        loadSharedUsers(sharingBillingId);

    }

    catch (err) {

        console.error("Share error:", err);

        showShareMessage(
            "Something went wrong.",
            "error"
        );

    }

    finally {

        shareBillingBtn.disabled = false;

        shareBillingBtn.innerHTML = `
            <i class="fa-solid fa-share"></i>
            Share Billing
        `;

    }

});

function showShareMessage(message, type) {

    shareMessage.textContent = message;

    shareMessage.className =
        `share-message ${type}`;

}

async function showPreviousHistory(id) {

    try {
         showLoader("wait...");
        const res = await fetch(`${API_BASE}/${id}/history`, {

            headers: authHeaders()

        });

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message);
        }

        const payments = data.payments;

        const content = document.getElementById("historyContent");

        content.innerHTML = "";

        if (!payments.length) {

            content.innerHTML = `
                <p style="text-align:center;padding:20px">
                    No Previous Billing History
                </p>
            `;

        } else {

            payments.forEach((payment, index) => {

                let html = `

                    <div class="history-card">

                        <h3>
                            Payment #${index + 1}
                        </h3>

                        <p>
                            <strong>Date :</strong>
                            ${new Date(payment.paymentDate).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>Worked Days :</strong>
                            ${payment.totalDays}
                        </p>

                        <p>
                            <strong>Total Amount :</strong>
                            ₹${payment.totalAmount}
                        </p>

                        <table>

                            <thead>

                                <tr>

                                    <th>Day</th>

                                    <th>Date</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                </tr>

                            </thead>

                            <tbody>

                `;

                payment.history.forEach(day => {

                    html += `

                        <tr>

                            <td>${day.day}</td>

                            <td>${new Date(day.date).toLocaleDateString()}</td>

                            <td>₹${day.amount}</td>

                            <td>${day.status}</td>

                        </tr>

                    `;

                });

                html += `

                            </tbody>

                        </table>

                    </div>

                `;

                content.innerHTML += html;

            });

        }

        document
            .getElementById("historyModal")
            .classList.add("show");

    }

    catch (err) {

        console.error(err);

    }finally{
        hideLoader();
    }

}
document.getElementById("closeHistory").onclick = () => {

    document.getElementById("historyModal").classList.remove("show");

};

document.getElementById("historyModal").onclick = (e) => {

    if (e.target === historyModal) {
        historyModal.classList.remove("show");
    }

};
async function loadSharedUsers(billingId) {

    try {

        const res = await fetch(
            `${API_BASE}/${billingId}/shares`,
            {
                headers: authHeaders()
            }
        );


        const data = await res.json();


        if (!res.ok) {

            sharedUsersList.innerHTML = `
                <p class="no-shared-users">
                    Unable to load shared users.
                </p>
            `;

            return;

        }


        renderSharedUsers(
            billingId,
            data.sharedWith || []
        );

    }

    catch (err) {

        console.error(
            "Load shared users error:",
            err
        );

    }

}
function renderSharedUsers(billingId, users) {

    sharedUsersList.innerHTML = "";


    if (!users.length) {

        sharedUsersList.innerHTML = `
            <p class="no-shared-users">
                No users shared yet.
            </p>
        `;

        return;

    }


    users.forEach(user => {

        const row = document.createElement("div");

        row.className = "shared-user-row";


        row.innerHTML = `

            <div class="shared-user-info">

                <strong>
                    ${user.name || "User"}
                </strong>

                <span>
                    ${user.phone}
                </span>

            </div>


            <button
                type="button"
                class="remove-share-btn"
                data-user="${user._id}">

                <i class="fa-solid fa-trash"></i>

                Remove

            </button>

        `;


        row
            .querySelector(".remove-share-btn")
            .addEventListener("click", () => {

                removeSharedUser(
                    billingId,
                    user._id
                );

            });


        sharedUsersList.appendChild(row);

    });

}
async function removeSharedUser(
    billingId,
    userId
) {

    if (
        !confirm(
            "Remove this user from billing sharing?"
        )
    ) {

        return;

    }


    try {

        const res = await fetch(
            `${API_BASE}/${billingId}/share/${userId}`,
            {
                method: "DELETE",
                headers: authHeaders()
            }
        );


        const data = await res.json();


        if (!res.ok) {

            showShareMessage(
                data.message || "Unable to remove user.",
                "error"
            );

            return;

        }


        showShareMessage(
            "User removed successfully.",
            "success"
        );


        loadSharedUsers(billingId);

    }

    catch (err) {

        console.error(
            "Remove share error:",
            err
        );

    }

}
shareModal.addEventListener("click", (e) => {

    if (e.target === shareModal) {

        shareModal.classList.add("hidden");

        sharingBillingId = null;

    }

});
sharePhone.addEventListener("input", function () {

    this.value = this.value
        .replace(/\D/g, "")
        .slice(0, 10);

});
function openShareModal(billingId) {

    sharingBillingId = billingId;

    sharePhone.value = "";

    shareMessage.textContent = "";

    shareMessage.className = "share-message";

    shareModal.classList.remove("hidden");

    loadSharedUsers(billingId);

}
closeShareModal.addEventListener("click", () => {

    shareModal.classList.add("hidden");

    sharingBillingId = null;

});
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
}

document.getElementById("goBackBtn")?.addEventListener("click", goBack);
function saveWorkers() {
    localStorage.setItem("billingWorkers", JSON.stringify(workers));
}
// Initial render local storage data , remove after testing on api call

loadWorkers();
function showLoader(message = "Please wait...") {
    pageLoader.querySelector("p").textContent = message;
    pageLoader.classList.add("active");
}

function hideLoader() {
    pageLoader.classList.remove("active");
}

