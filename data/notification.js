const NOTIFICATION_API =
    "http://localhost:5000/api/notifications";

const TOKEN_KEY = "cb_token";

/*
 * ---------------------------------------------------------
 * ELEMENTS
 * ---------------------------------------------------------
 */

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const notificationsList =
    document.getElementById(
        "notificationsList"
    );

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const retryBtn =
    document.getElementById("retryBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const markAllBtn =
    document.getElementById("markAllBtn");

const unreadBadge =
    document.getElementById("unreadBadge");

const summarySubtitle =
    document.getElementById(
        "summarySubtitle"
    );

const headerSubtitle =
    document.getElementById(
        "headerSubtitle"
    );

const toast =
    document.getElementById("toast");

let notifications = [];
let unreadCount = 0;
let toastTimer = null;

/*
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function getToken() {
    return localStorage.getItem(
        TOKEN_KEY
    );
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value);
}

function showToast(message) {
    if (!toast) return;

    toast.textContent =
        String(message || "");

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

function showLoading(show) {
    loadingState.classList.toggle(
        "hidden",
        !show
    );
}

function showError(message) {
    if (!message) {
        errorBox.classList.add("hidden");
        return;
    }

    errorMessage.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );
}

function hideError() {
    errorBox.classList.add(
        "hidden"
    );
}

function notificationId(item) {
    return String(
        item?.id ||
        item?._id ||
        ""
    );
}

function formatTime(value) {
    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const diff =
        Math.max(
            0,
            Date.now() -
                date.getTime()
        );

    const seconds =
        Math.floor(diff / 1000);

    if (seconds < 60) {
        return "Just now";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    if (minutes < 60) {
        return `${minutes} min${
            minutes === 1
                ? ""
                : "s"
        } ago`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {
        return `${hours} hour${
            hours === 1
                ? ""
                : "s"
        } ago`;
    }

    const days =
        Math.floor(
            hours / 24
        );

    if (days < 7) {
        return `${days} day${
            days === 1
                ? ""
                : "s"
        } ago`;
    }

    return date.toLocaleString();
}

function getIcon(type) {
    switch (type) {
        case "work_request":
            return "🧰";

        case "work_request_accepted":
            return "✅";

        case "work_request_rejected":
            return "❌";

        case "work_request_cancelled":
            return "🚫";

        case "work_completed":
            return "🏁";

        case "profile_verified":
            return "✓";

        case "profile_unverified":
            return "⚠️";

        default:
            return "🔔";
    }
}

/*
 * ---------------------------------------------------------
 * API
 * Same endpoints as React Native notification screen.
 * ---------------------------------------------------------
 */

async function notificationApi(
    path = "",
    options = {}
) {
    const token =
        getToken();

    const headers = {
        Accept:
            "application/json",
        ...(options.headers || {}),
    };

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers[
            "Content-Type"
        ] = "application/json";
    }

    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }

    const response =
        await fetch(
            `${NOTIFICATION_API}${path}`,
            {
                ...options,
                headers,
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
        const error =
            new Error(
                data?.message ||
                `Request failed (${response.status})`
            );

        error.status =
            response.status;

        throw error;
    }

    if (
        data &&
        data.success === false
    ) {
        const error =
            new Error(
                data.message ||
                "Request failed."
            );

        error.status =
            response.status;

        throw error;
    }

    return data;
}

/*
 * ---------------------------------------------------------
 * GET NOTIFICATIONS
 * GET /api/notifications
 * ---------------------------------------------------------
 */

async function fetchNotifications() {
    const result =
        await notificationApi("");

    const list =
        Array.isArray(result?.data)
            ? result.data
            : Array.isArray(
                  result?.notifications
              )
            ? result.notifications
            : [];

    const count =
        Number.isFinite(
            Number(
                result?.unreadCount
            )
        )
            ? Number(
                  result.unreadCount
              )
            : list.filter(
                  item =>
                      item.read !== true
              ).length;

    return {
        notifications:
            list,
        unreadCount:
            count,
    };
}

/*
 * ---------------------------------------------------------
 * MARK ONE READ
 * PATCH /api/notifications/:id/read
 * ---------------------------------------------------------
 */

async function markAsRead(id) {
    if (!id) {
        throw new Error(
            "Notification ID is missing."
        );
    }

    return notificationApi(
        `/${encodeURIComponent(
            id
        )}/read`,
        {
            method: "PATCH",
        }
    );
}

/*
 * ---------------------------------------------------------
 * MARK ALL READ
 * PATCH /api/notifications/read-all
 * ---------------------------------------------------------
 */

async function markAllAsRead() {
    return notificationApi(
        "/read-all",
        {
            method: "PATCH",
        }
    );
}

/*
 * ---------------------------------------------------------
 * DELETE
 * DELETE /api/notifications/:id
 * ---------------------------------------------------------
 */

async function removeNotification(
    id
) {
    if (!id) {
        throw new Error(
            "Notification ID is missing."
        );
    }

    return notificationApi(
        `/${encodeURIComponent(
            id
        )}`,
        {
            method: "DELETE",
        }
    );
}

/*
 * ---------------------------------------------------------
 * RELATED SCREEN
 *
 * Keep these URLs aligned with your actual web files.
 * ---------------------------------------------------------
 */

function getOpenTarget(item) {
    const type =
        String(
            item?.type || ""
        );

    const data =
        item?.data || {};

    /*
     * Worker side:
     * New work request
     */
    if (
        type ===
            "work_request" &&
        data.bookingId
    ) {
        return (
            "work-requests.html" +
            `?bookingId=${encodeURIComponent(
                data.bookingId
            )}`
        );
    }

    /*
     * Client side:
     * Accepted / rejected /
     * cancelled / completed
     */
    if (
        [
            "work_request_accepted",
            "work_request_rejected",
            "work_request_cancelled",
            "work_completed",
        ].includes(type) &&
        data.bookingId
    ) {
        return (
            "booked-users.html" +
            `?bookingId=${encodeURIComponent(
                data.bookingId
            )}`
        );
    }

    /*
     * Profile notifications
     */
    if (
        [
            "profile_verified",
            "profile_unverified",
        ].includes(type) &&
        data.profileId
    ) {
        return (
            "profile-details.html" +
            `?id=${encodeURIComponent(
                data.profileId
            )}`
        );
    }

    /*
     * Generic notification:
     *
     * {
     *   data: {
     *     url: "some-screen.html"
     *   }
     * }
     */
    if (
        typeof data.url ===
            "string" &&
        data.url.trim()
    ) {
        return data.url;
    }

    /*
     * Generic page supplied
     * by backend.
     */
    if (
        typeof data.page ===
            "string" &&
        data.page.trim()
    ) {
        return data.page;
    }

    return "";
}

/*
 * ---------------------------------------------------------
 * RENDER
 * ---------------------------------------------------------
 */

function renderNotifications() {
    const count =
        notifications.length;

    unreadCount =
        notifications.filter(
            item =>
                item.read !== true
        ).length;

    /*
     * Summary
     */

    if (!count) {
        summarySubtitle.textContent =
            "You are all caught up.";

        headerSubtitle.textContent =
            "No notifications";
    } else if (!unreadCount) {
        summarySubtitle.textContent =
            `${count} notification${
                count === 1
                    ? ""
                    : "s"
            }`;

        headerSubtitle.textContent =
            "All notifications read";
    } else {
        summarySubtitle.textContent =
            `${unreadCount} unread notification${
                unreadCount === 1
                    ? ""
                    : "s"
            }`;

        headerSubtitle.textContent =
            `${unreadCount} unread`;
    }

    /*
     * Unread badge
     */

    unreadBadge.textContent =
        String(unreadCount);

    unreadBadge.classList.toggle(
        "hidden",
        unreadCount === 0
    );

    /*
     * Mark all button
     */

    markAllBtn.classList.toggle(
        "hidden",
        unreadCount === 0
    );

    /*
     * Empty
     */

    emptyState.classList.toggle(
        "hidden",
        count !== 0
    );

    notificationsList.classList.toggle(
        "hidden",
        count === 0
    );

    if (!count) {
        notificationsList.innerHTML =
            "";

        return;
    }

    notificationsList.innerHTML =
        notifications
            .map(item => {
                const id =
                    notificationId(
                        item
                    );

                const unread =
                    item.read !== true;

                const target =
                    getOpenTarget(
                        item
                    );

                return `
                    <article
                        class="notification-card ${
                            unread
                                ? "unread"
                                : ""
                        }"
                        data-id="${escapeAttribute(
                            id
                        )}"
                    >

                        <button
                            type="button"
                            class="notification-main"
                            onclick="openNotification('${escapeAttribute(
                                id
                            )}')"
                        >

                            <div
                                class="notification-icon"
                            >
                                ${getIcon(
                                    item.type
                                )}
                            </div>

                            <div
                                class="notification-copy"
                            >

                                <div
                                    class="notification-title-row"
                                >

                                    <h3
                                        class="notification-title"
                                    >
                                        ${escapeHTML(
                                            item.title ||
                                            "BuildSkil notification"
                                        )}
                                    </h3>

                                    ${
                                        unread
                                            ? `
                                                <span
                                                    class="unread-dot"
                                                    title="Unread"
                                                ></span>
                                            `
                                            : ""
                                    }

                                </div>

                                <p
                                    class="notification-message"
                                >
                                    ${escapeHTML(
                                        item.message ||
                                        ""
                                    )}
                                </p>

                                <div
                                    class="notification-time"
                                >
                                    ${escapeHTML(
                                        formatTime(
                                            item.createdAt
                                        )
                                    )}
                                </div>

                                ${
                                    target
                                        ? `
                                            <span
                                                class="open-hint"
                                            >
                                                Tap to open
                                            </span>
                                        `
                                        : ""
                                }

                            </div>

                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            title="Delete notification"
                            aria-label="Delete notification"
                            onclick="confirmDeleteNotification('${escapeAttribute(
                                id
                            )}')"
                        >
                            ×
                        </button>

                    </article>
                `;
            })
            .join("");
}

/*
 * ---------------------------------------------------------
 * LOAD
 * ---------------------------------------------------------
 */

async function loadNotifications(
    showSpinner = true
) {
    if (!getToken()) {
        showLoading(false);

        notifications = [];

        renderNotifications();

        showError(
            "Your BuildSkil login session is missing. Please sign in again."
        );

        return;
    }

    if (showSpinner) {
        showLoading(true);
        hideError();
    }

    try {
        const result =
            await fetchNotifications();

        notifications =
            result.notifications;

        unreadCount =
            result.unreadCount;

        showLoading(false);
        hideError();

        renderNotifications();
    } catch (error) {
        console.error(
            "NOTIFICATION LOAD ERROR:",
            error
        );

        showLoading(false);

        if (
            error?.status === 401
        ) {
            showError(
                "Your BuildSkil login session has expired. Please sign in again."
            );
        } else {
            showError(
                error?.message ||
                "Could not load notifications."
            );
        }

        notifications = [];

        renderNotifications();
    }
}

/*
 * ---------------------------------------------------------
 * OPEN NOTIFICATION
 *
 * 1. Mark read
 * 2. Update UI
 * 3. Open related screen
 * ---------------------------------------------------------
 */

async function openNotification(
    id
) {
    const item =
        notifications.find(
            notification =>
                notificationId(
                    notification
                ) === String(id)
        );

    if (!item) {
        return;
    }

    const itemId =
        notificationId(item);

    const wasUnread =
        item.read !== true;

    try {
        if (
            wasUnread &&
            itemId
        ) {
            setCardBusy(
                itemId,
                true
            );

            await markAsRead(
                itemId
            );

            item.read = true;
            item.readAt =
                new Date().toISOString();

            unreadCount =
                Math.max(
                    0,
                    unreadCount - 1
                );

            renderNotifications();
        }

        const target =
            getOpenTarget(item);

        if (target) {
            window.location.href =
                target;
        }
    } catch (error) {
        console.error(
            "MARK READ ERROR:",
            error
        );

        showToast(
            error?.message ||
            "Could not mark notification as read."
        );

        setCardBusy(
            itemId,
            false
        );
    }
}

/*
 * ---------------------------------------------------------
 * DELETE NOTIFICATION
 * ---------------------------------------------------------
 */

async function confirmDeleteNotification(
    id
) {
    const item =
        notifications.find(
            notification =>
                notificationId(
                    notification
                ) === String(id)
        );

    if (!item) {
        return;
    }

    const confirmed =
        window.confirm(
            "Delete this notification?"
        );

    if (!confirmed) {
        return;
    }

    try {
        setCardBusy(
            id,
            true
        );

        const wasUnread =
            item.read !== true;

        await removeNotification(
            id
        );

        notifications =
            notifications.filter(
                notification =>
                    notificationId(
                        notification
                    ) !== String(id)
            );

        if (wasUnread) {
            unreadCount =
                Math.max(
                    0,
                    unreadCount - 1
                );
        }

        renderNotifications();

        showToast(
            "Notification deleted."
        );
    } catch (error) {
        console.error(
            "DELETE NOTIFICATION ERROR:",
            error
        );

        showToast(
            error?.message ||
            "Could not delete notification."
        );

        setCardBusy(
            id,
            false
        );
    }
}

/*
 * ---------------------------------------------------------
 * MARK ALL
 * ---------------------------------------------------------
 */

async function handleMarkAllAsRead() {
    if (!unreadCount) {
        return;
    }

    try {
        markAllBtn.disabled =
            true;

        markAllBtn.textContent =
            "Marking…";

        await markAllAsRead();

        const now =
            new Date().toISOString();

        notifications =
            notifications.map(
                item => ({
                    ...item,
                    read: true,
                    readAt:
                        item.readAt ||
                        now,
                })
            );

        unreadCount = 0;

        renderNotifications();

        showToast(
            "All notifications marked as read."
        );
    } catch (error) {
        console.error(
            "MARK ALL ERROR:",
            error
        );

        showToast(
            error?.message ||
            "Could not mark all notifications as read."
        );
    } finally {
        markAllBtn.disabled =
            false;

        markAllBtn.innerHTML =
            "✓ Mark all as read";
    }
}

/*
 * ---------------------------------------------------------
 * BUSY STATE
 * ---------------------------------------------------------
 */

function setCardBusy(
    id,
    busy
) {
    const card =
        document.querySelector(
            `.notification-card[data-id="${CSS.escape(
                String(id)
            )}"]`
        );

    if (!card) {
        return;
    }

    const buttons =
        card.querySelectorAll(
            "button"
        );

    buttons.forEach(button => {
        button.disabled =
            busy;
    });

    card.style.opacity =
        busy
            ? "0.6"
            : "";
}

/*
 * ---------------------------------------------------------
 * EVENTS
 * ---------------------------------------------------------
 */

document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        () => {
            if (
                window.history.length >
                1
            ) {
                window.history.back();
            } else {
                window.location.href =
                    "../screen/account.html";
            }
        }
    );

refreshBtn.addEventListener(
    "click",
    async () => {
        refreshBtn.disabled =
            true;

        refreshBtn.style.transform =
            "rotate(180deg)";

        try {
            await loadNotifications(
                false
            );

            showToast(
                "Notifications refreshed."
            );
        } finally {
            refreshBtn.disabled =
                false;

            refreshBtn.style.transform =
                "";
        }
    }
);

retryBtn.addEventListener(
    "click",
    () => {
        void loadNotifications();
    }
);

markAllBtn.addEventListener(
    "click",
    () => {
        void handleMarkAllAsRead();
    }
);

/*
 * Refresh when browser/tab
 * becomes visible.
 */
document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            void loadNotifications(
                false
            );
        }
    }
);

/*
 * Make functions available
 * to inline notification buttons.
 */
window.openNotification =
    openNotification;

window.confirmDeleteNotification =
    confirmDeleteNotification;

/*
 * ---------------------------------------------------------
 * START
 * ---------------------------------------------------------
 */

void loadNotifications();
