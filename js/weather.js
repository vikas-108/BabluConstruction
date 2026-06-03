const apiKey = "2af41d190681424fa5774639262905"; // Get this from weatherapi.com
const apiUrl = "https://api.weatherapi.com/v1/forecast.json?key=";
async function getWeather() {
    const city = document.getElementById('city-input').value;
    if(city) fetchData(city);
}

// GPS Location (Most Accurate)
function getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchData(`${position.coords.latitude},${position.coords.longitude}`);
        });
    } else {
        alert("Geolocation not supported");
    }
}

async function fetchData(query) {
    try {
        // We add 'aqi=yes' to get pollution data
        const res = await fetch(`${apiUrl}${apiKey}&q=${query}&days=1&aqi=yes&alerts=no`);
        const data = await res.json();

        // 1. Update Text
        document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById("temp").innerText = Math.round(data.current.temp_c) + "°c";
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("weather-icon").src = "https:" + data.current.condition.icon;
        document.getElementById("humidity").innerText = data.current.humidity + "%";
        document.getElementById("wind").innerText = data.current.wind_kph + " km/h";
        document.getElementById("sunrise").innerText = data.forecast.forecastday[0].astro.sunrise;
        document.getElementById("sunset").innerText = data.forecast.forecastday[0].astro.sunset;
        // 2. Handle AQI (India Specific)
        const aqiVal = data.current.air_quality['us-epa-index'];
        const aqiCard = document.getElementById("aqi-card");
        const aqiText = document.getElementById("aqi");
        
        // Remove old classes
        aqiCard.classList.remove("aqi-good", "aqi-mid", "aqi-bad");

        if(aqiVal <= 2) {
            aqiText.innerText = "Good";
            aqiCard.classList.add("aqi-good");
        } else if (aqiVal <= 4) {
            aqiText.innerText = "Moderate";
            aqiCard.classList.add("aqi-mid");
        } else {
            aqiText.innerText = "Poor";
            aqiCard.classList.add("aqi-bad");
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
    
    body.className = ''; // Reset

    // India-Specific Conditions
    if (text.includes("rain") || text.includes("drizzle") || text.includes("storm")) {
        body.classList.add('rainy');
    } else if (text.includes("haze") || text.includes("smoke") || text.includes("mist")) {
        body.classList.add('haze'); // Common in Winters
    } else if (isDay === 1 && (text.includes("sun") || text.includes("clear"))) {
        body.classList.add('sunny');
    } else {
        // Fallback or Night
        body.style.background = isDay ? "#2980b9" : "#1a1a2e"; 
    }
}

// Default to India's Capital
window.onload = () => {
    fetchData("New Delhi");
};