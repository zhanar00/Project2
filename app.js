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
        document.querySelector(".temp").innerText = temp;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");

        this.celsius = temp;
        this.fahrenheit = (temp * 9/5) + 32;

        document.querySelector(".temp").innerText = `${this.celsius}`;
    },

    search: function () {
        let city = document.querySelector(".search-bar").value;
        this.fetchWeather(city);
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
    }  
};

document
    .querySelector(".search button")
    .addEventListener("click", function() {
        weather.search();
    });

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

let temperatureSection = document.querySelector(".degree-section");
const temperatureSpan = document.querySelector(".degree-section span");
const tempDegree = document.querySelector(".temp");

temperatureSection.addEventListener("click", () => {
    if (temperatureSpan.textContent === "°C") {
        temperatureSpan.textContent = "F";
        tempDegree.innerText = `${weather.fahrenheit}`;
    } else {
        temperatureSpan.textContent = "°C";
        tempDegree.innerText = `${weather.celsius}`;
    }
});

weather.loadWeatherByLocation();


