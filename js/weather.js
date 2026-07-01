const apiKey = "2af41d190681424fa5774639262905"; // Get this from weatherapi.com
const apiUrl = "https://api.weatherapi.com/v1/forecast.json?key=";

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.innerText = value;
}

async function getWeather() {
    const cityInput = document.getElementById("city-input");
    const city = cityInput ? cityInput.value.trim() : "";
    if (city) fetchData(city);
}

// GPS Location (Most Accurate)
function getGeoLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        fetchData(`${position.coords.latitude},${position.coords.longitude}`);
    }, () => {
        alert("Location permission denied. Please enter your city manually.");
    });
}

async function fetchData(query) {
    try {
        // We add 'aqi=yes' to get pollution data.
        const res = await fetch(`${apiUrl}${apiKey}&q=${encodeURIComponent(query)}&days=1&aqi=yes&alerts=no`);
        const data = await res.json();

        if (!res.ok || data.error || !data.location || !data.current || !data.forecast) {
            throw new Error(data.error?.message || "Weather data unavailable");
        }

        // 1. Update Text
        setText("location", `${data.location.name}, ${data.location.country}`);
        setText("temp", Math.round(data.current.temp_c) + "°c");
        setText("condition", data.current.condition.text);
        setText("humidity", data.current.humidity + "%");
        setText("wind", data.current.wind_kph + " km/h");
        setText("sunrise", data.forecast.forecastday[0].astro.sunrise);
        setText("sunset", data.forecast.forecastday[0].astro.sunset);

        const weatherIcon = document.getElementById("weather-icon");
        if (weatherIcon) {
            weatherIcon.src = "https:" + data.current.condition.icon;
            weatherIcon.alt = data.current.condition.text;
        }

        // 2. Handle AQI (India Specific)
        const aqiVal = data.current.air_quality?.["us-epa-index"];
        const aqiCard = document.getElementById("aqi-card");

        aqiCard?.classList.remove("aqi-good", "aqi-mid", "aqi-bad");

        if (!aqiVal) {
            setText("aqi", "--");
        } else if (aqiVal <= 2) {
            setText("aqi", "Good");
            aqiCard?.classList.add("aqi-good");
        } else if (aqiVal <= 4) {
            setText("aqi", "Moderate");
            aqiCard?.classList.add("aqi-mid");
        } else {
            setText("aqi", "Poor");
            aqiCard?.classList.add("aqi-bad");
        }

        // 3. Dynamic Background
        updateBackground(data.current.condition.text, data.current.is_day);
    } catch (error) {
        alert("City not found. Try adding ',IN' (e.g. Pune,IN)");
    }
}

function updateBackground(condition, isDay) {
    const body = document.body;
    const text = condition.toLowerCase();

    body.className = ""; // Reset
    body.style.background = "";

    // India-Specific Conditions
    if (text.includes("rain") || text.includes("drizzle") || text.includes("storm")) {
        body.classList.add("rainy");
    } else if (text.includes("haze") || text.includes("smoke") || text.includes("mist")) {
        body.classList.add("haze"); // Common in Winters
    } else if (isDay === 1 && (text.includes("sun") || text.includes("clear"))) {
        body.classList.add("sunny");
    } else {
        // Fallback or Night
        body.style.background = isDay ? "#2980b9" : "#1a1a2e";
    }
}

// Default to India's Capital
window.addEventListener("DOMContentLoaded", () => {
    fetchData("New Delhi");
});
