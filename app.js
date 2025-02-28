const apiKey = "2daccf260c454bd38fa43746251602";
const searchInput = document.querySelector(".search-bar");
const weatherInfo = document.querySelector(".weather-info");
const forecastCards = document.querySelectorAll(".forecast .card");

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeather(searchInput.value);
    }
});

function getWeather(city) {
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
            searchInput.value = ""; 
        })
        .catch(error => console.error("Error fetching weather:", error));
}


function updateUI(data) {
    if (data.error) {
        weatherInfo.innerHTML = `<p>Error: ${data.error.message}</p>`;
        return;
    }

    document.querySelector(".location-name").textContent = `${data.location.name}, ${data.location.country}`;
    document.querySelector(".temperature").innerHTML = `${data.current.temp_c}&deg;C`;
    document.querySelector(".weather-icon").src = `https:${data.current.condition.icon}`;
    document.querySelector(".weather-condition").textContent = data.current.condition.text;
    document.querySelector(".min-temp").textContent = `Min temp: ${data.forecast.forecastday[0].day.mintemp_c}°C`;
    document.querySelector(".max-temp").textContent = `Max temp: ${data.forecast.forecastday[0].day.maxtemp_c}°C`;

    document.querySelector("#pressure p").textContent = `${data.current.pressure_mb} hPa`;
    document.querySelector("#humidity p").textContent = `${data.current.humidity}%`;
    document.querySelector("#uv-index p").textContent = `${data.current.uv}`;
    document.querySelector("#visibility p").textContent = `${data.current.vis_km} km`;

    data.forecast.forecastday.forEach((day, index) => {
        if (forecastCards[index]) {
            forecastCards[index].querySelector(".fore-day").textContent = new Date(day.date).toLocaleDateString("en-US", { weekday: "long" });
            forecastCards[index].querySelector("img").src = `https:${day.day.condition.icon}`;
            forecastCards[index].querySelector("img").alt = day.day.condition.text;
            forecastCards[index].querySelector(".fore-condition").textContent = day.day.condition.text;
            forecastCards[index].querySelector(".fore-min").textContent = `Min temp: ${day.day.mintemp_c}°C`;
            forecastCards[index].querySelector(".fore-max").textContent = `Max temp: ${day.day.maxtemp_c}°C`;
        }
    });
}
