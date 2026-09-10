(function () {

    "use strict";


    /* =========================================================
       QUICK TOOLS CONFIG
       Add every BuildSkil tool here
       ========================================================= */

    const TOOLS = {

        "/screen/notebook.html": {
            id: "notebook",
            name: "Notebook",
            icon: "fa-solid fa-book"
        },

        "/screen/table.html": {
            id: "table",
            name: "Table",
            icon: "fa-solid fa-table"
        },
         "/screen/tmr.html": {
            id: "tmr",
            name: "Tmr",
            icon: "fa-solid fa-table"
        },
         "/screen/trackpay.html": {
            id: "trackpay",
            name: "Trackpay",
            icon: "fa-solid fa-table"
        },
         "/screen/billu.html": {
            id: "billu",
            name: "Tillu",
            icon: "fa-solid fa-table"
        },
          "/screen/invoice.html": {
            id: "invoice",
            name: "Invoice",
            icon: "fa-solid fa-table"
        },
         "/screen/projects-reports.html": {
            id: "projects-reports",
            name: "Project-reports",
            icon: "fa-solid fa-table"
        },
         "/screen/conversion.html": {
            id: "conersion",
            name: "Conversion",
            icon: "fa-solid fa-table"
        },
         "/screen/aichat.html": {
            id: "aichat",
            name: "Aichat",
            icon: "fa-solid fa-table"
        },
         "/screen/bhūgolapaṭa.html": {
            id: "bhūgolapaṭa",
            name: "Bhūgolapaṭa",
            icon: "fa-solid fa-table"
        },
         "/screen/contractor.html": {
            id: "contractor",
            name: "Contractor",
            icon: "fa-solid fa-table"
        },
        "/screen/activity/areadetec.html": {
            id: "areadetec",
            name: "Areadetec",
            icon: "fa-solid fa-calculator"
        },

        "/screen/activity/attance.html": {
            id: "attance",
            name: "Attance",
            icon: "fa-solid fa-box"
        },
        "/screen/activity/construction-camera.html": {
            id: "construction-camera",
            name: "Construction-camera",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/direction.html": {
            id: "direction",
            name: "Direction",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/estmiar.html": {
            id: "estmiar",
            name: "Estmiar",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/quatgenz.html": {
            id: "quatgenz",
            name: "Quatgenz",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/remborr.html": {
            id: "remborr",
            name: "Remborr",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/rocls.html": {
            id: "rocls",
            name: "Rocls",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/routinepay.html": {
            id: "routinepay",
            name: "Routinepay",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/scnner.html": {
            id: "scnner",
            name: "Scnner",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/site-command.html": {
            id: "site-command",
            name: "Site-command",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/sitelevling.html": {
            id: "sitelevling",
            name: "Sitelivling",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/usemyPP.html": {
            id: "usemyapp",
            name: "Usemyapp",
            icon: "fa-solid fa-box"
        },
         "/screen/activity/Workshop-Ledger-2Punch.html": {
            id: "workshop-ledger-2punch",
            name: "Workshop-ledger-2punch",
            icon: "fa-solid fa-box"
        },
        "/common/archi/chaylam.html": {
            id: "chaylam",
            name: "Chaylam",
            icon: "fa-solid fa-box"
        },
          "/common/archi/farset.html": {
            id: "farset",
            name: "Farset",
            icon: "fa-solid fa-box"
        },
          "/common/archi/paperscale.html": {
            id: "paperscale",
            name: "Paperscale",
            icon: "fa-solid fa-box"
        },
          "/common/archi/quickcheck.html": {
            id: "quickchick",
            name: "Quickcheck",
            icon: "fa-solid fa-box"
        },
          "/common/archi/saclerul.html": {
            id: "saclerul",
            name: "Saclerul",
            icon: "fa-solid fa-box"
        },
          "/common/archi/unitarea.html": {
            id: "unitarea",
            name: "Unitarea",
            icon: "fa-solid fa-box"
        },
          "/common/brscn/busiinvoice.html": {
            id: "busiinvoice",
            name: "Busiinvoice",
            icon: "fa-solid fa-box"
        },
          "/common/brscn/cards.html": {
            id: "cards",
            name: "Cards",
            icon: "fa-solid fa-box"
        },
          "/common/brscn/expen.html": {
            id: "expen",
            name: "Expen",
            icon: "fa-solid fa-box"
        },
          "/common/brscn/letterhead.html": {
            id: "letterhead",
            name: "Letterhead",
            icon: "fa-solid fa-box"
        },
          "/common/dyansay/checkoutlog.html": {
            id: "checkoutlog",
            name: "Checkoutlog",
            icon: "fa-solid fa-box"
        },
        "/common/dyansay/digitalpass.html": {
            id: "digitalpass",
            name: "Digitalpass",
            icon: "fa-solid fa-box"
        },
        "/common/dyansay/gatelog.html": {
            id: "gateog",
            name: "Gatelog",
            icon: "fa-solid fa-box"
        },
        "/common/dyansay/gaurdsit.html": {
            id: "gaurdsit",
            name: "Gaurdsit",
            icon: "fa-solid fa-box"
        },
        "/common/dyansay/incidentrepo.html": {
            id: "incidentrepo",
            name: "Incidentrepo",
            icon: "fa-solid fa-box"
        },
        "/common/dyansay/sos.html": {
            id: "sos",
            name: "Sos",
            icon: "fa-solid fa-box"
        },
        "/common/elec/cktloadp.html": {
            id: "cktloadp",
            name: "Cktloadp",
            icon: "fa-solid fa-box"
        },
        "/common/elec/colorcode.html": {
            id: "colorcode",
            name: "Colorcode",
            icon: "fa-solid fa-box"
        },
        "/common/elec/conduitfill.html": {
            id: "conduitfill",
            name: "Conduitfill",
            icon: "fa-solid fa-box"
        },
        "/common/elec/motorsizing.html": {
            id: "motorsizing",
            name: "Motorsizing",
            icon: "fa-solid fa-box"
        },
        "/common/elec/olawacal.html": {
            id: "olawcal",
            name: "Olawca",
            icon: "fa-solid fa-box"
        },
        "/common/elec/proximityindi.html": {
            id: "proximityindi",
            name: "Proximityindi",
            icon: "fa-solid fa-box"
        },
        "/common/elec/wire.html": {
            id: "wire",
            name: "Wire",
            icon: "fa-solid fa-box"
        },
        "/common/pain/plaintesti.html": {
            id: "plaintesti",
            name: "Plaintesti",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/analog.html": {
            id: "analog",
            name: "Analog",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/boardfoot.html": {
            id: "boardfoot",
            name: "Boardfoot",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/cutkist.html": {
            id: "cutist",
            name: "Cutlist",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/fractional.html": {
            id: "fractional",
            name: "Fractional",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/miterangle.html": {
            id: "miterangle",
            name: "Miterangle",
            icon: "fa-solid fa-box"
        },
        "/common/pentery/rafterrrof.html": {
            id: "rafterroof",
            name: "Rafterroof",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/abiment.html": {
            id: "abiment",
            name: "Abiment",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/awaz.html": {
            id: "awaz",
            name: "Awaz",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/doop.html": {
            id: "doop",
            name: "Doop",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/hoowall.html": {
            id: "hoowall",
            name: "Hoowall",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/magnetfin.html": {
            id: "magnetfin",
            name: "Magnetfin",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/sccode.html": {
            id: "sccode",
            name: "Sccode",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/sitewalker.html": {
            id: "sitewalker",
            name: "Sitewalker",
            icon: "fa-solid fa-box"
        },
        "/common/sensor/univscn.html": {
            id: "univscn",
            name: "Univscn",
            icon: "fa-solid fa-box"
        },
        // Add more tools here
    };


    /* =========================================================
       STORAGE
       ========================================================= */

    const QUICK_TOOLS_KEY =
        "buildskil_quick_tools";

    const MAX_QUICK_TOOLS = 10;


    /* =========================================================
       GET TOOLS
       ========================================================= */

    function getQuickTools() {

        try {

            const data =
                localStorage.getItem(
                    QUICK_TOOLS_KEY
                );

            if (!data) {
                return [];
            }

            const tools =
                JSON.parse(data);

            return Array.isArray(tools)
                ? tools
                : [];

        } catch (error) {

            console.error(
                "Failed to read Quick Tools:",
                error
            );

            return [];
        }
    }


    /* =========================================================
       TRACK TOOL
       ========================================================= */

    function trackTool(tool) {

        if (!tool || !tool.id) {
            return;
        }


        let tools =
            getQuickTools();


        // Remove existing copy
        tools =
            tools.filter(
                item =>
                    item.id !== tool.id
            );


        // Add newest tool first
        tools.unshift({

            id: tool.id,

            name:
                tool.name ||
                "Tool",

            url:
                tool.url ||
                "#",

            icon:
                tool.icon ||
                "fa-solid fa-toolbox"

        });


        // Keep maximum 10
        tools =
            tools.slice(
                0,
                MAX_QUICK_TOOLS
            );


        try {

            localStorage.setItem(
                QUICK_TOOLS_KEY,
                JSON.stringify(tools)
            );

        } catch (error) {

            console.error(
                "Failed to save Quick Tools:",
                error
            );
        }
    }


    /* =========================================================
       REMOVE ONE TOOL
       ========================================================= */

    function removeQuickTool(toolId) {

        if (!toolId) {
            return;
        }


        const tools =
            getQuickTools()
                .filter(
                    tool =>
                        tool.id !== toolId
                );


        localStorage.setItem(
            QUICK_TOOLS_KEY,
            JSON.stringify(tools)
        );
    }


    /* =========================================================
       CLEAR ALL
       ========================================================= */

    function clearQuickTools() {

        localStorage.removeItem(
            QUICK_TOOLS_KEY
        );
    }


    /* =========================================================
       AUTO TRACK CURRENT PAGE
       ========================================================= */

    function trackCurrentTool() {

        const currentPath =
            window.location.pathname
                .replace(/\/+/g, "/")
                .toLowerCase();


        const tool =
            TOOLS[currentPath];


        // Not a registered tool
        if (!tool) {
            return;
        }


        trackTool({

            id: tool.id,

            name: tool.name,

            url: currentPath,

            icon: tool.icon

        });
    }


    /* =========================================================
       DASHBOARD RENDER
       ========================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function renderQuickTools() {

        const container =
            document.getElementById(
                "quickTools"
            );


        if (!container) {
            return;
        }


        const tools =
            getQuickTools();


        if (!tools.length) {

            container.innerHTML = `
                <div class="quick-empty">

                    <i class="fa-solid fa-toolbox"></i>

                    <strong>
                        No tools used yet
                    </strong>

                    <span>
                        Your recently used tools
                        will appear here.
                    </span>

                </div>
            `;

            return;
        }


        container.innerHTML =
            tools.map(tool => `

                <article
                    class="quick-tool-card"
                    data-tool-url="${escapeHTML(tool.url)}"
                >

                    <div class="quick-tool-icon">

                        <i class="${escapeHTML(tool.icon)}"></i>

                    </div>


                    <div class="quick-tool-info">

                        <strong>
                            ${escapeHTML(tool.name)}
                        </strong>

                        <small>
                            Recently used
                        </small>

                    </div>


                    <button
                        type="button"
                        class="quick-tool-open"
                        aria-label="Open ${escapeHTML(tool.name)}"
                    >

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </article>

            `).join("");
    }


    /* =========================================================
       DASHBOARD EVENTS
       ========================================================= */

    function setupQuickToolsEvents() {

        const container =
            document.getElementById(
                "quickTools"
            );


        if (container) {

            container.addEventListener(
                "click",
                function (event) {

                    const card =
                        event.target.closest(
                            ".quick-tool-card"
                        );


                    if (!card) {
                        return;
                    }


                    const url =
                        card.dataset.toolUrl;


                    if (!url || url === "#") {
                        return;
                    }


                    window.location.href =
                        url;
                }
            );
        }


        const clearButton =
            document.getElementById(
                "clearQuickTools"
            );


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                function () {

                    clearQuickTools();

                    renderQuickTools();
                }
            );
        }
    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function initQuickTools() {

        // On every tool page
        trackCurrentTool();


        // On dashboard
        renderQuickTools();


        // Dashboard buttons
        setupQuickToolsEvents();
    }


    /* =========================================================
       EXPOSE FUNCTIONS
       ========================================================= */

    window.getQuickTools =
        getQuickTools;

    window.trackTool =
        trackTool;

    window.removeQuickTool =
        removeQuickTool;

    window.clearQuickTools =
        clearQuickTools;

    window.renderQuickTools =
        renderQuickTools;


    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initQuickTools
        );

    } else {

        initQuickTools();
    }


})();



/*(function () {
    const TOOLS = {
        "/screen/notebook.html": {
            id: "notebook",
            name: "Notebook",
            icon: "fa-solid fa-book"
        },

        "./screen/table.html": {
            id: "table",
            name: "Table",
            icon: "fa-solid fa-table"
        },

        "/screen/bsc/calculator.html": {
            id: "bsc-calculator",
            name: "Calculator",
            icon: "fa-solid fa-calculator"
        },

        "/screen/bsc/material.html": {
            id: "bsc-material",
            name: "Material",
            icon: "fa-solid fa-box"
        }
    };

    const path = window.location.pathname
        .replace(/\/+/g, "/")
        .toLowerCase();

    const tool = TOOLS[path];

    if (!tool) return;

    if (typeof trackTool !== "function") {
        console.warn("trackTool() is not available.");
        return;
    }

    trackTool({
        id: tool.id,
        name: tool.name,
        url: window.location.pathname + window.location.search,
        icon: tool.icon
    });
})();*/