/* BuildSkil Booking/Address store - web equivalent of React Native AsyncStorage. */
const BOOKINGS_STORAGE_KEY = "buildskil_bookings_v2";
const BOOKED_USERS_STORAGE_KEY = "buildskil_booked_users_v1";
const MY_ADDRESS_STORAGE_KEY = "buildskil_my_address_v1";
const MY_ADDRESSES_STORAGE_KEY = "buildskil_my_addresses_v2";
const LOGIN_USER_STORAGE_KEY = "cb_login_user";

const EMPTY_ADDRESS = {
  id: "",
  name: "",
  houseFlat: "",
  streetArea: "",
  landmark: "",
  townCityVillage: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
  latitude: "",
  longitude: "",
  addressType: "Work",
};

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function formatFullAddress(address) {
  return address
    ? [
        address.houseFlat,
        address.streetArea,
        address.landmark,
        address.townCityVillage,
        address.district,
        address.state,
        address.pincode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
}
function hasUsableAddress(address) {
  return (
    !!address &&
    !![
      address.houseFlat,
      address.streetArea,
      address.townCityVillage,
      address.district,
    ].some((v) => String(v || "").trim())
  );
}
function readBookings() {
  const x = readJson(BOOKINGS_STORAGE_KEY, []);
  return Array.isArray(x) ? x : [];
}
function writeBookings(items) {
  writeJson(BOOKINGS_STORAGE_KEY, items);
}
function readLoginUser() {
  const u = readJson(LOGIN_USER_STORAGE_KEY, {});
  return {
    id: String(u?.id || u?._id || u?.userId || ""),
    name: String(u?.name || u?.fullName || "BuildSkil User"),
    phone: String(u?.phone || u?.mobile || ""),
    email: u?.email ? String(u.email) : "",
  };
}
function readMyAddresses() {
  let list = readJson(MY_ADDRESSES_STORAGE_KEY, null);
  if (Array.isArray(list))
    return list.map((x, i) => ({
      ...EMPTY_ADDRESS,
      ...x,
      id: String(x?.id || uid("address")),
    }));
  const legacy = readJson(MY_ADDRESS_STORAGE_KEY, null);
  return legacy
    ? [
        {
          ...EMPTY_ADDRESS,
          ...legacy,
          id: String(legacy?.id || uid("address")),
        },
      ]
    : [];
}
function readMyAddress() {
  return readMyAddresses()[0] || null;
}
function writeMyAddresses(list) {
  writeJson(MY_ADDRESSES_STORAGE_KEY, list);
  if (list[0]) writeJson(MY_ADDRESS_STORAGE_KEY, list[0]);
  else localStorage.removeItem(MY_ADDRESS_STORAGE_KEY);
}
function saveLegacyBookedUser(profile, bookedAt) {
  const current = readJson(BOOKED_USERS_STORAGE_KEY, []);
  const arr = Array.isArray(current) ? current : [];
  const filtered = arr.filter(
    (x) => String(x?.profile?.id) !== String(profile.id),
  );
  filtered.unshift({ profile, bookedAt });
  writeJson(BOOKED_USERS_STORAGE_KEY, filtered);
}
function getProfileSession() {
  return readJson("buildskil_book_profile_v1", null);
}
function setProfileSession(profile) {
  writeJson("buildskil_book_profile_v1", profile);
}
function setReadonlyAddress(address) {
  writeJson("buildskil_readonly_address_v1", address);
}
function getReadonlyAddress() {
  return readJson("buildskil_readonly_address_v1", null);
}
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function callPhone(phone) {
  const p = String(phone || "")
    .trim()
    .replace(/[^0-9+]/g, "");
  if (p) location.href = `tel:${p}`;
}
