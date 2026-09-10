/* =========================================================
   INDIA LOCATION DROPDOWNS
========================================================= */
const indiaLocations = {

    "Andhra Pradesh": {

        "Anantapur": [
            "Anantapur",
            "Dharmavaram",
            "Guntakal"
        ],

        "Chittoor": [
            "Chittoor",
            "Tirupati",
            "Madanapalle"
        ]

    },

    "Arunachal Pradesh": {

        "Tawang": [
            "Tawang"
        ],

        "Papum Pare": [
            "Itanagar",
            "Naharlagun"
        ]

    },

    "Maharashtra": {

        "Pune": [
            "Pune",
            "Hinjewadi",
            "Wakad",
            "Baner",
            "Hadapsar",
            "Kharadi"
        ],

        "Mumbai Suburban": [
            "Andheri",
            "Bandra",
            "Borivali",
            "Kurla"
        ]

    }

};
function loadStates() {

    const stateSelect =
        document.getElementById("state");

    if (!stateSelect) return;


    stateSelect.innerHTML = `

        <option value="">
            Select State
        </option>

        ${
            Object.keys(indiaLocations)
                .sort()
                .map(
                    state => `
                        <option value="${escapeRequirementHtml(state)}">
                            ${escapeRequirementHtml(state)}
                        </option>
                    `
                )
                .join("")
        }

    `;

}


/* =========================================================
   STATE CHANGE
========================================================= */

function handleStateChange() {

    const state =
        document.getElementById(
            "state"
        ).value;


    const districtSelect =
        document.getElementById(
            "district"
        );


    const townSelect =
        document.getElementById(
            "townVillage"
        );


    /*
       Reset district
    */

    districtSelect.innerHTML = `

        <option value="">
            Select District
        </option>

    `;


    /*
       Reset town
    */

    townSelect.innerHTML = `

        <option value="">
            Select Town / Village
        </option>

    `;


    townSelect.disabled = true;


    if (!state) {

        districtSelect.disabled = true;

        return;

    }


    const districts =
        indiaLocations[state];


    if (!districts) {

        districtSelect.disabled = true;

        return;

    }


    districtSelect.innerHTML +=

        Object.keys(districts)
            .sort()
            .map(
                district => `

                    <option
                        value="${escapeRequirementHtml(district)}"
                    >
                        ${escapeRequirementHtml(district)}
                    </option>

                `
            )
            .join("");


    districtSelect.disabled = false;

}


/* =========================================================
   DISTRICT CHANGE
========================================================= */

function handleDistrictChange() {

    const state =
        document.getElementById(
            "state"
        ).value;


    const district =
        document.getElementById(
            "district"
        ).value;


    const townSelect =
        document.getElementById(
            "townVillage"
        );


    townSelect.innerHTML = `

        <option value="">
            Select Town / Village
        </option>

    `;


    townSelect.disabled = true;


    if (
        !state ||
        !district
    ) {

        return;

    }


    const towns =
        indiaLocations
            [state]
            [district];


    if (
        !Array.isArray(towns)
    ) {

        return;

    }


    townSelect.innerHTML +=

        towns
            .sort()
            .map(
                town => `

                    <option
                        value="${escapeRequirementHtml(town)}"
                    >
                        ${escapeRequirementHtml(town)}
                    </option>

                `
            )
            .join("");


    townSelect.disabled = false;

}
