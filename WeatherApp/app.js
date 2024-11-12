let weather = {
    "apiKey": "ee6f9f59bffd29f82eae790285cafe01",

    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city + "&units=metric&appid=" 
            + this.apiKey
        )
            .then((res) => res.json())
            .then((data) => this.displayWeather(data));
    },

    fetchSuggestions: function(query) {
        if(query.length < 3) {
            document.getElementById("suggestions").innerHTML = '';
            return;
        }
        fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${this.apiKey}`)
            .then((res) => res.json())
            .then((data) => this.displayCitySuggestions(data));
    },

    displayCitySuggestions: function(data) {
        const suggestionsDiv = document.getElementById("suggestions");
        suggestionsDiv.innerHTML = "";
        
        if (data.list.length === 0) {
            suggestionsDiv.innerHTML = "<p>No cities found</p>";
            return;
        }

        data.list.forEach((city) => {
            const cityDiv = document.createElement("div");
            cityDiv.className = "suggestion-item";
            cityDiv.innerHTML = city.name;
            cityDiv.addEventListener("click", () => {
                this.fetchWeather(city.name);
                this.fetchForecast(city.name);
                this.clearSuggestions(); 
            });
            suggestionsDiv.appendChild(cityDiv);
        });
    },

    clearSuggestions: function() {
        document.getElementById("suggestions").innerHTML = "";
    },

    fetchByLocation: function(lat, lon) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        )
        .then((res) => res.json())
        .then((data) => {
            if (data && data.name) {
                this.displayWeather(data);
            } else {
                console.log("Ошибка загрузки данных погоды");
            }
        })
        .catch((error) => console.error("Ошибка загрузки:", error));
    },

    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${Math.round(temp)}`; // Display Celsius by default
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");

        this.celsius = temp;
        this.fahrenheit = ((temp * 9/5) + 32).toFixed(2); 
    },

    search: function () {
        let city = document.querySelector(".search-bar").value;
        this.fetchWeather(city);
        this.fetchForecast(city);
        this.clearSuggestions();
    },

    loadWeatherByLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.fetchByLocation(lat, lon);
                },
                () => {
                    console.log("Unable to retrieve location.");
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    },

    fetchForecast: function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`)
        .then((res) => res.json())
        .then((data) => this.displayForecast(data));
    },

    displayForecast: function(data) {
        const forecastDiv = document.getElementById("forecast");
        forecastDiv.innerHTML = "";

        for(let i = 0; i < 5; i++) {
            const forecast = data.list[i * 8];
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const { icon } = forecast.weather[0];
            const { temp_max, temp_min } = forecast.main;

            const dayDiv = document.createElement("div");
            dayDiv.className = "forecast-day";
            dayDiv.innerHTML = `
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                <p>High: ${Math.round(temp_max)}°C</p>
                <p>Low: ${Math.round(temp_min)}°C</p>
            `;
            forecastDiv.appendChild(dayDiv);
        }
    }
};

document
    .querySelector(".search button")
    .addEventListener("click", function() {
        weather.search();
    });

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    const query = event.target.value;
    weather.fetchSuggestions(query);

    if (event.key === "Enter") {
        weather.search();
    }
});

let temperatureSection = document.querySelector(".degree-section");
const temperatureSpan = document.querySelector(".degree-section span");
const tempDegree = document.querySelector(".temp");

temperatureSection.addEventListener("click", () => {
    if (temperatureSpan.textContent === "°C") {
        temperatureSpan.textContent = "°F";
        tempDegree.innerText = `${weather.fahrenheit}`; 
    } else {
        temperatureSpan.textContent = "°C";
        tempDegree.innerText = `${weather.celsius}`; 
    }
});

weather.loadWeatherByLocation();
