/* =========================================================
   BUILDSKIL TEAM REQUIREMENT
   SHARED JAVASCRIPT
========================================================= */

const STORAGE_KEY = "buildskil_team_requirements";

function getRequirements() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveRequirements(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


function getRequirement(id) {

    return getRequirements().find(
        item => item.id === id
    );

}


function updateRequirement(id, changes) {

    const requirements = getRequirements();

    const index = requirements.findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return null;
    }

    requirements[index] = {
        ...requirements[index],
        ...changes
    };

    saveRequirements(requirements);

    return requirements[index];

}


function createId() {

    return "REQ-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();

}


function showToast(message) {

    let toast =
        document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


function goBack() {

    history.back();

}


/* =========================================================
   CLIENT - CREATE REQUIREMENT
========================================================= */

function changeMember(id, amount) {

    const input =
        document.getElementById(id);

    if (!input) return;

    let value =
        Number(input.value) || 0;

    value += amount;

    if (value < 0) {
        value = 0;
    }

    if (id === "leader") {

        value = Math.min(value, 1);

    }

    input.value = value;

    updateMemberTotal();

}


function updateMemberTotal() {

    const ids = [
        "technicians",
        "workers",
        "leader",
        "specialists"
    ];

    let total = 0;

    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            total += Number(element.value) || 0;

        }

    });

    const totalElement =
        document.getElementById("totalMembers");

    if (totalElement) {

        totalElement.textContent = total;

    }

}


function updateRadius() {

    const range =
        document.getElementById("radius");

    if (!range) return;

    const value =
        Number(range.value);

    const output =
        document.getElementById("radiusValue");

    if (output) {

        output.textContent =
            value + " km";

    }

}


function useLocation() {

    if (!navigator.geolocation) {

        showToast(
            "Geolocation is not supported."
        );

        return;

    }

    showToast(
        "Getting your location..."
    );

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                document.getElementById("latitude");

            const lng =
                document.getElementById("longitude");

            const altitude =
                document.getElementById("altitude");

            if (lat) {

                lat.value =
                    position.coords.latitude.toFixed(7);

            }

            if (lng) {

                lng.value =
                    position.coords.longitude.toFixed(7);

            }

            if (altitude) {

                altitude.value =
                    position.coords.altitude !== null
                        ? position.coords.altitude.toFixed(2)
                        : "";

            }

            showToast(
                "Location captured."
            );

        },

        () => {

            showToast(
                "Unable to get your location."
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}

/* =========================================================
   INDIA LOCATION DROPDOWNS
========================================================= */

function loadStates() {

    const stateSelect =
        document.getElementById("state");

    if (!stateSelect) return;

    stateSelect.innerHTML =
        `<option value="">Select State</option>`;

    Object.keys(indiaLocations)
        .sort()
        .forEach(state => {

            const option =
                document.createElement("option");

            option.value = state;
            option.textContent = state;

            stateSelect.appendChild(option);

        });

}


function handleStateChange() {

    const stateSelect =
        document.getElementById("state");

    const districtSelect =
        document.getElementById("district");

    const townVillageSelect =
        document.getElementById("townVillage");

    if (!stateSelect ||
        !districtSelect ||
        !townVillageSelect) {

        return;
    }

    const state =
        stateSelect.value;

    districtSelect.innerHTML =
        `<option value="">Select District</option>`;

    townVillageSelect.innerHTML =
        `<option value="">Select Town / Village</option>`;

    districtSelect.disabled = true;
    townVillageSelect.disabled = true;

    if (!state || !indiaLocations[state]) {
        return;
    }

    Object.keys(indiaLocations[state])
        .sort()
        .forEach(district => {

            const option =
                document.createElement("option");

            option.value = district;
            option.textContent = district;

            districtSelect.appendChild(option);

        });

    districtSelect.disabled = false;

}


function handleDistrictChange() {

    const state =
        document.getElementById("state")?.value;

    const district =
        document.getElementById("district")?.value;

    const townVillageSelect =
        document.getElementById("townVillage");

    if (!townVillageSelect) return;

    townVillageSelect.innerHTML =
        `<option value="">Select Town / Village</option>`;

    townVillageSelect.disabled = true;

    if (
        !state ||
        !district ||
        !indiaLocations[state] ||
        !indiaLocations[state][district]
    ) {

        return;

    }

    indiaLocations[state][district]
        .sort()
        .forEach(place => {

            const option =
                document.createElement("option");

            option.value = place;
            option.textContent = place;

            townVillageSelect.appendChild(option);

        });

    townVillageSelect.disabled = false;

}
function createTeamRequirement() {

    const workName =
        document.getElementById("workName")?.value.trim();

    const workType =
        document.getElementById("workType")?.value;

    const description =
        document.getElementById("description")?.value.trim();

    const state =
    document.getElementById("state")?.value.trim();

const district =
    document.getElementById("district")?.value.trim();

const townVillage =
    document.getElementById("townVillage")?.value.trim();

const address =
    document.getElementById("address")?.value.trim();

const latitude =
    document.getElementById("latitude")?.value;

const longitude =
    document.getElementById("longitude")?.value;

const altitude =
    document.getElementById("altitude")?.value;

const radius =
    Number(
        document.getElementById("radius")?.value
    ) || 10;

    const startDate =
        document.getElementById("startDate")?.value;

    if (!workName) {

        showToast("Enter work name.");

        return;

    }

    if (!workType) {

        showToast("Select work type.");

        return;

    }

    if (!description) {

        showToast("Enter work description.");

        return;

    }
if (!state) {

    showToast("Select state.");

    return;
}

if (!district) {

    showToast("Select district.");

    return;
}

if (!townVillage) {

    showToast("Select town / village.");

    return;
}

if (!address) {

    showToast("Enter work address.");

    return;
}
    if (!latitude || !longitude) {

        showToast("Select work location.");

        return;

    }

    const technicians =
        Number(
            document.getElementById("technicians")?.value
        ) || 0;

    const workers =
        Number(
            document.getElementById("workers")?.value
        ) || 0;

    const leader =
        Number(
            document.getElementById("leader")?.value
        ) || 0;

    const specialists =
        Number(
            document.getElementById("specialists")?.value
        ) || 0;

    const total =
        technicians +
        workers +
        leader +
        specialists;

    if (total <= 0) {

        showToast(
            "Add at least one member."
        );

        return;

    }

    if (!startDate) {

        showToast(
            "Select start date."
        );

        return;

    }

    const requirement = {

        id: createId(),

        client: {

            id: "CURRENT_CLIENT",

            name: "Current Client"

        },

        work: {

            name: workName,

            type: workType,

            description

        },

        requiredMembers: {

            technicians,

            workers,

            teamLeader: leader,

            specialists,

            total

        },

        location: {

    state: state,

    district: district,

    townVillage: townVillage,

    address: address,

    latitude: Number(latitude),

    longitude: Number(longitude),

    altitude:
        altitude
            ? Number(altitude)
            : null,

    radiusKm: radius

},

        schedule: {

            startDate,

            duration:
                document.getElementById("duration")?.value || ""

        },

        additionalRequirements:
            document.getElementById("additional")?.value.trim() || "",

        status: "OPEN",

        acceptedTeam: null,

        assignments: [],

        createdAt:
            new Date().toISOString()

    };

    const requirements =
        getRequirements();

    requirements.unshift(requirement);
    /* Render newly created requirement cards */
if (typeof renderCreatedRequirements === "function") {
    renderCreatedRequirements();
}


    saveRequirements(requirements);

    showToast(
        "Requirement created successfully."
    );

}


/* =========================================================
   TEAM ACCEPT
========================================================= */

function acceptRequirement(id) {

    const requirement =
        getRequirement(id);

    if (!requirement) {

        showToast(
            "Requirement not found."
        );

        return;

    }

    updateRequirement(id, {

        status: "ACCEPTED",

        acceptedTeam: {

            teamId: "TEAM-001",

            name: "Buildskil Verified Team",

            leader: "Raj Kumar",

            acceptedAt:
                new Date().toISOString()

        },

        assignments: []

    });

    showToast(
        "Work accepted."
    );

    setTimeout(() => {

        window.location.href =
            "available-work.html?id=" +
            encodeURIComponent(id);

    }, 700);

}


/* =========================================================
   ASSIGN MEMBER
========================================================= */

const demoMembers = {

    technician: [
        "Amit Kumar",
        "Suresh Kumar",
        "Mohan Singh",
        "Ravi Kumar"
    ],

    worker: [
        "Rakesh",
        "Dinesh",
        "Sunil",
        "Vijay",
        "Anil",
        "Deepak",
        "Manoj"
    ],

    leader: [
        "Raj Kumar",
        "Arun Singh"
    ],

    specialist: [
        "Pankaj Sharma",
        "Vikas"
    ]

};


function assignMember(
    requirementId,
    role,
    memberName,
    index
) {

    if (!memberName) return;

    const requirement =
        getRequirement(requirementId);

    if (!requirement) return;

    let assignments =
        requirement.assignments || [];

    const assignmentIndex =
        assignments.findIndex(
            item =>
                item.role === role &&
                item.position === index
        );

    const assignment = {

        memberId:
            memberName
                .toLowerCase()
                .replace(/\s+/g, "-"),

        memberName,

        role,

        position: index,

        assignedAt:
            new Date().toISOString()

    };

    if (assignmentIndex >= 0) {

        assignments[assignmentIndex] =
            assignment;

    } else {

        assignments.push(
            assignment
        );

    }

    updateRequirement(
        requirementId,
        {
            assignments
        }
    );

    updateAssignmentProgress(
        requirementId
    );

}


function updateAssignmentProgress(id) {

    const requirement =
        getRequirement(id);

    if (!requirement) return;

    const required =
        requirement.requiredMembers;

    const requiredTotal =
        required.total;

    const assigned =
        requirement.assignments?.length || 0;

    const percent =
        requiredTotal > 0
            ? Math.round(
                assigned /
                requiredTotal *
                100
            )
            : 0;

    const progress =
        document.getElementById(
            "progressFill"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    if (progress) {

        progress.style.width =
            percent + "%";

    }

    if (progressText) {

        progressText.textContent =
            assigned +
            " / " +
            requiredTotal +
            " assigned";

    }

}


/* =========================================================
   TEAM READY
========================================================= */

function markTeamReady(id) {

    const requirement =
        getRequirement(id);

    if (!requirement) return;

    const required =
        requirement.requiredMembers.total;

    const assigned =
        requirement.assignments?.length || 0;

    if (assigned < required) {

        showToast(
            "Assign all required members first."
        );

        return;

    }

    updateRequirement(id, {

        status: "READY"

    });

    showToast(
        "Team is ready to reach the client."
    );

    setTimeout(() => {

        window.location.href =
            "team-details.html?id=" +
            encodeURIComponent(id);

    }, 700);

}


/* =========================================================
   OPEN DETAILS
========================================================= */

function openRequirement(id) {

    window.location.href =
        "team-details.html?id=" +
        encodeURIComponent(id);

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {

    if (!date) return "-";

    const d =
        new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}
