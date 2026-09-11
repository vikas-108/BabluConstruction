    //const API_BASE = "https://api.buildskil.com/api";
    const API_BASE = "http://localhost:5000/api";


    const TOKEN_KEY =
        "cb_token";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const loadingState =
        document.getElementById(
            "loadingState"
        );

    const errorState =
        document.getElementById(
            "errorState"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const adminContent =
        document.getElementById(
            "adminContent"
        );


    /* =====================================================
       HELPERS
    ====================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatDate(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }


        return date.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    }


    function getToken() {

        return localStorage.getItem(
            TOKEN_KEY
        );
    }


    function showLoading() {

        loadingState.hidden = false;
        errorState.hidden = true;
        adminContent.hidden = true;
    }


    function showError(message) {

        loadingState.hidden = true;
        adminContent.hidden = true;
        errorState.hidden = false;

        errorMessage.textContent =
            message ||
            "Unable to load admin data.";
    }


    function showContent() {

        loadingState.hidden = true;
        errorState.hidden = true;
        adminContent.hidden = false;
    }


    /* =====================================================
       LOAD ADMIN DATA
    ====================================================== */

    async function loadAdminDashboard() {

        showLoading();


        const token =
            getToken();


        if (!token) {

            showError(
                "Your BuildSkil login session is missing. Please log in again."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${API_BASE}/admin/dashboard`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            let data = null;


            try {
                data =
                    await response.json();
            } catch {
                data = null;
            }


            if (!response.ok) {

                if (
                    response.status === 401
                ) {

                    showError(
                        "Your login session is invalid or expired."
                    );

                } else if (
                    response.status === 403
                ) {

                    showError(
                        "Your account does not have admin access."
                    );

                } else {

                    showError(
                        data?.message ||
                        "Unable to load admin data."
                    );
                }

                return;
            }


            renderDashboard(data);

            showContent();


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );


            showError(
                "Unable to connect to the BuildSkil server."
            );
        }
    }


    /* =====================================================
       RENDER DASHBOARD
    ====================================================== */

    function renderDashboard(data) {

        const users =
            Array.isArray(data?.users)
                ? data.users
                : [];

        const accounts =
        Array.isArray(data?.accounts)
            ? data.accounts
            : [];

        const profiles =
            Array.isArray(data?.profiles)
                ? data.profiles
                : [];


        const projects =
            Array.isArray(data?.projects)
                ? data.projects
                : [];


        const counts =
            data?.counts || {};


        document.getElementById(
            "userCount"
        ).textContent =
            Number.isFinite(
                Number(counts.users)
            )
                ? Number(counts.users)
                : users.length;

                document.getElementById(
                   "accountCount"
                ).textContent =
                counts.accounts ?? accounts.length;

        document.getElementById(
            "profileCount"
        ).textContent =
            Number.isFinite(
                Number(counts.profiles)
            )
                ? Number(counts.profiles)
                : profiles.length;


        document.getElementById(
            "projectCount"
        ).textContent =
            Number.isFinite(
                Number(counts.projects)
            )
                ? Number(counts.projects)
                : projects.length;


        document.getElementById(
            "usersSectionCount"
        ).textContent =
            users.length;


        document.getElementById(
            "profilesSectionCount"
        ).textContent =
            profiles.length;


        document.getElementById(
            "projectsSectionCount"
        ).textContent =
            projects.length;


        renderUsers(users);
         renderAccounts(accounts);
        renderProfiles(profiles);

        renderProjects(projects);
    }


    /* =====================================================
       USERS
    ====================================================== */

    function renderUsers(users) {

        const body =
            document.getElementById(
                "usersTable"
            );


        if (!users.length) {

            body.innerHTML = `
                <tr class="empty-row">
                    <td colspan="5">
                        No users found.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML =
            users.map(user => `

                <tr>

                    <td class="name-cell">
                        ${escapeHTML(
                            user.name ||
                            user.username ||
                            "-"
                        )}
                    </td>

                    <td class="phone">
                        ${escapeHTML(
                            user.phone ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.email ||
                            "-"
                        )}
                    </td>

                    <td>
                        <span class="badge">
                            ${escapeHTML(
                                user.role ||
                                "-"
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHTML(
                            formatDate(
                                user.createdAt
                            )
                        )}
                    </td>

                </tr>

            `).join("");
    }

    //function rendeer account 
    function renderAccounts(accounts) {

    const body =
        document.getElementById(
            "accountsTable"
        );

    const count =
        document.getElementById(
            "accountsSectionCount"
        );


    if (count) {
        count.textContent =
            accounts.length;
    }


    if (!accounts.length) {

        body.innerHTML = `
            <tr class="empty-row">

                <td colspan="5">
                    No account details found.
                </td>

            </tr>
        `;

        return;
    }


    body.innerHTML =
        accounts.map(account => `

            <tr>

                <td class="id-text">
                    ${escapeHTML(
                        account.userId || "-"
                    )}
                </td>

                <td class="phone">
                    ${escapeHTML(
                        account.phone || "-"
                    )}
                </td>

                <td>

                    <span class="badge">

                        ${
                            account.emailVerified
                                ? "Verified"
                                : "Not Verified"
                        }

                    </span>

                </td>

                <td>

                    <span class="badge">

                        ${escapeHTML(
                            account.role || "-"
                        )}

                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        formatDate(
                            account.createdAt
                        )
                    )}
                </td>

            </tr>

        `).join("");
}

    /* =====================================================
       PROFILES
    ====================================================== */

    function renderProfiles(profiles) {

        const body =
            document.getElementById(
                "profilesTable"
            );


        if (!profiles.length) {

            body.innerHTML = `
                <tr class="empty-row">
                    <td colspan="5">
                        No profiles found.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML =
            profiles.map(profile => `

                <tr>

                    <td class="name-cell">
                        ${escapeHTML(
                            profile.name ||
                            profile.userName ||
                            "-"
                        )}
                    </td>

                    <td class="phone">
                        ${escapeHTML(
                            profile.phone ||
                            "-"
                        )}
                    </td>

                    <td>
                        <span class="badge">
                            ${escapeHTML(
                                profile.role ||
                                "-"
                            )}
                        </span>
                    </td>

                    <td class="id-text">
                        ${escapeHTML(
                            profile._id ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatDate(
                                profile.createdAt
                            )
                        )}
                    </td>

                </tr>

            `).join("");
    }


    /* =====================================================
       PROJECTS
    ====================================================== */

    function renderProjects(projects) {

        const body =
            document.getElementById(
                "projectsTable"
            );


        if (!projects.length) {

            body.innerHTML = `
                <tr class="empty-row">
                    <td colspan="4">
                        No projects found.
                    </td>
                </tr>
            `;

            return;
        }


        body.innerHTML =
            projects.map(project => `

                <tr>

                    <td class="name-cell">
                        ${escapeHTML(
                            project.name ||
                            project.title ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            project.location ||
                            "-"
                        )}
                    </td>

                    <td class="id-text">
                        ${escapeHTML(
                            project.owner ||
                            project.createdBy ||
                            project.user ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            formatDate(
                                project.createdAt
                            )
                        )}
                    </td>

                </tr>

            `).join("");
    }

/* =====================================================
   ISSUES
====================================================== */

async function loadIssues() {

    const token = getToken();

    if (!token) {
        return;
    }

    const table =
        document.getElementById("issuesTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr class="empty-row">
            <td colspan="7">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Loading issues...
            </td>
        </tr>
    `;


    try {

        const response = await fetch(
            `${API_BASE}/issues`,
            {
                method: "GET",

                headers: {
                    Accept: "application/json",
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (response.status === 401) {

            throw new Error(
                data.message ||
                "Your login session is invalid or expired."
            );

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load reported issues."
            );

        }


        const issues =
            Array.isArray(data.issues)
                ? data.issues
                : [];


        renderIssues(issues);

    } catch (error) {

        console.error(
            "Issues load error:",
            error
        );

        table.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    ${escapeHTML(
                        error.message ||
                        "Unable to load issues."
                    )}
                </td>
            </tr>
        `;

    }

}
function renderIssues(issues) {

    const table =
        document.getElementById(
            "issuesTable"
        );

    const count =
        document.getElementById(
            "issuesSectionCount"
        );


    if (!table) {
        return;
    }


    if (count) {
        count.textContent =
            issues.length;
    }


    if (!issues.length) {

        table.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    No reported issues found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = issues.map(issue => {

        const user =
            issue.user || {};


        const issueTitle =
            issue.issueType === "other" &&
            issue.otherProblem
                ? issue.otherProblem
                : issue.issueType || "-";


        const status =
            issue.status || "open";


        return `

            <tr>

                <td class="name-cell">
                    ${escapeHTML(
                        user.name ||
                        user.username ||
                        "-"
                    )}
                </td>


                <td class="phone">
                    ${escapeHTML(
                        user.phone || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        issueTitle
                    )}
                </td>


                <td class="issue-description-cell">
                    ${escapeHTML(
                        issue.description || "-"
                    )}
                </td>


                <td>

                    <select
                        class="issue-status-select"
                        data-id="${escapeHTML(issue._id)}"
                        onchange="changeIssueStatus(this)"
                    >

                        <option
                            value="open"
                            ${status === "open" ? "selected" : ""}
                        >
                            Open
                        </option>

                        <option
                            value="in-progress"
                            ${status === "in-progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>

                        <option
                            value="resolved"
                            ${status === "resolved" ? "selected" : ""}
                        >
                            Resolved
                        </option>

                        <option
                            value="closed"
                            ${status === "closed" ? "selected" : ""}
                        >
                            Closed
                        </option>

                    </select>

                    <br>

                    <span
                        class="issue-status ${escapeHTML(status)}"
                    >
                        ${escapeHTML(
                            formatIssueStatus(status)
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        formatDate(
                            issue.createdAt
                        )
                    )}
                </td>


                <td>

                    <div class="issue-action-wrap">

                        <button
                            type="button"
                            class="issue-action-btn"
                            title="Reply"
                            onclick="replyToIssue('${issue._id}')"
                        >
                            <i class="fa-solid fa-comment"></i>
                        </button>


                        <button
                            type="button"
                            class="issue-action-btn delete"
                            title="Delete"
                            onclick="deleteIssue('${issue._id}')"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }).join("");

}
function formatIssueStatus(status) {

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
            return "Open";

    }

}
async function changeIssueStatus(selectElement) {

    const issueId =
        selectElement.dataset.id;

    const status =
        selectElement.value;

    const token =
        getToken();


    if (!issueId || !token) {
        return;
    }


    selectElement.disabled = true;


    try {

        const response =
            await fetch(
                `${API_BASE}/issues/${encodeURIComponent(issueId)}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update issue."
            );

        }


        console.log(
            "Issue updated:",
            data.issue
        );


        await loadIssues();


    } catch (error) {

        console.error(
            "Issue update error:",
            error
        );

        alert(
            error.message ||
            "Unable to update issue."
        );

        await loadIssues();

    } finally {

        selectElement.disabled = false;

    }

}
async function deleteIssue(issueId) {

    if (!issueId) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this issue?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        getToken();


    if (!token) {

        alert(
            "Your login session is missing."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/issues/${encodeURIComponent(issueId)}`,
                {
                    method: "DELETE",

                    headers: {
                        Accept:
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete issue."
            );

        }


        await loadIssues();


    } catch (error) {

        console.error(
            "Issue delete error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete issue."
        );

    }

}
async function replyToIssue(issueId) {

    if (!issueId) {
        return;
    }


    const comment =
        prompt(
            "Enter admin response:"
        );


    if (comment === null) {
        return;
    }


    const cleanedComment =
        comment.trim();


    if (!cleanedComment) {

        alert(
            "Please enter a response."
        );

        return;

    }


    const token =
        getToken();


    if (!token) {

        alert(
            "Your login session is missing."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/issues/${encodeURIComponent(issueId)}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        adminComment:
                            cleanedComment
                    })
                }
            );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to send admin response."
            );

        }


        await loadIssues();


    } catch (error) {

        console.error(
            "Issue reply error:",
            error
        );

        alert(
            error.message ||
            "Unable to send response."
        );

    }

}
    /* =====================================================
       BUTTON EVENTS
    ====================================================== */

    document
        .getElementById(
            "backAccountBtn"
        )
        .addEventListener(
            "click",
            function () {

                window.location.href =
                    "../../screen/account.html";
            }
        );


    document
        .getElementById(
            "logoutAdminBtn"
        )
        .addEventListener(
            "click",
            function () {

                /*
                    Only remove the normal BuildSkil
                    login token if you actually want
                    logout to log the user out of the
                    whole application.
                localStorage.removeItem(TOKEN_KEY);*/
                window.location.href =
                    "../../screen/account.html";
            }
        );


    document
        .getElementById(
            "retryBtn"
        )
        .addEventListener(
            "click",
            function () {

                loadAdminDashboard();
            }
        );


    /* =====================================================
       START
    ====================================================== */

    loadAdminDashboard();
   loadIssues();
