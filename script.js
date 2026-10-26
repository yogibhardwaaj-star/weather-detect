
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const weatherBox = document.getElementById("weather");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Searching for city and state...";
    weatherBox.hidden = true;

    try {
        // Search for the entered city in India
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=100&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        // Find the Indian city matching the user's input
        const results = (geoData.results || []).filter(
            place => place.country_code === "IN"
        );

        if (results.length === 0) {
            throw new Error(
                "Indian city not found. Check the spelling and try again."
            );
        }

        // Prefer an exact city-name match when available
        const place = results.find(
            item => item.name.toLowerCase() === city.toLowerCase()
        ) || results[0];

        const state = place.admin1 || "State information unavailable";

        // Fetch weather for the selected city's coordinates
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Display the selected city and its state
        document.getElementById("cityName").textContent =
            `${place.name}, ${state}, India`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        document.getElementById("description").textContent =
            getDescription(current.weather_code);

        document.getElementById("weatherIcon").textContent =
            getIcon(current.weather_code, current.is_day);

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("feelsLike").textContent =
            `${current.apparent_temperature} °C`;

        document.getElementById("updated").textContent =
            `Local time: ${current.time.replace("T", " ")} IST`;

        message.textContent = "";
        weatherBox.hidden = false;

    } catch (error) {
        message.textContent = error.message;
    }
});

function getDescription(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain showers";
    if ([85, 86].includes(code)) return "Snow showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Conditions unavailable";
}

function getIcon(code, isDay) {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2].includes(code)) return "🌤️";
    if (code === 3) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌡️";
}
