let workers = [];
//let workers = JSON.parse(localStorage.getItem("billingWorkers")) || [];
let currentWorker = null;
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
document.getElementById("createBillingBtn").addEventListener("click", async () => {

    const workerName = document.getElementById("workerName").value.trim();
    const phone = document.getElementById("workerPhone").value.trim();
    const dailyRate = Number(document.getElementById("dailyRate").value);
    const cycle = Number(document.getElementById("paymentCycle").value);

    if (!workerName || !phone || !dailyRate || !cycle) {
        return alert("Fill all fields");
    }

    try {

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

    }

});
async function loadWorkers() {

    try {

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

<button class="view">View</button>

<button class="work">Open</button>
<button class="delete">Delete</button>

</div>

`;
card.querySelector(".view").onclick = () => {
    console.log("View clicked", worker._id);
    showPreviousHistory(worker._id);
};
card.querySelector(".work").onclick=()=>{

openWorker(worker._id);

};

card.querySelector(".delete").onclick=()=>{

if(confirm("Are you sure you want to delete this worker?")){

deleteWorker(worker._id);

}

};
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
async function showPreviousHistory(id) {

    try {

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

function saveWorkers() {
    localStorage.setItem("billingWorkers", JSON.stringify(workers));
}
// Initial render local storage data , remove after testing on api call

loadWorkers();
