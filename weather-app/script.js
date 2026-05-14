document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

function showLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city");

  fetchCoordinates(city);
  saveToHistory(city);
}


async function fetchCoordinates(city) {
  showLoader(true);

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }

    const { latitude, longitude, name, country } = data.results[0];

    fetchWeather(latitude, longitude, name, country);

  } catch (err) {
    alert(err.message);
    showLoader(false);
  }
}


async function fetchWeather(lat, lon, cityName, country) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );

    const data = await res.json();

    displayWeather(data, cityName, country);
    displayForecast(data);

  } catch (err) {
    alert("Error fetching weather");
  }

  showLoader(false);
}


function getWeatherInfo(code) {
  const map = {
    0: ["Clear", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Cloudy", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Fog", "🌫️"],
    51: ["Drizzle", "🌦️"],
    61: ["Rain", "🌧️"],
    71: ["Snow", "❄️"],
    95: ["Thunderstorm", "⛈️"]
  };

  return map[code] || ["Unknown", "❓"];
}


function displayWeather(data, city, country) {
  const current = data.current_weather;
  const [desc, icon] = getWeatherInfo(current.weathercode);

  document.getElementById("weatherBox").classList.remove("hidden");

  document.getElementById("cityName").innerText = `${city}, ${country}`;
  document.getElementById("temp").innerText = `🌡 ${current.temperature}°C`;
  document.getElementById("condition").innerText = `${icon} ${desc}`;
  document.getElementById("humidity").innerText = `💧 N/A`;
  document.getElementById("wind").innerText = `🌬 ${current.windspeed} km/h`;


  document.getElementById("icon").style.display = "none";
}


function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const days = data.daily;

  days.time.forEach((date, i) => {
    const [desc, icon] = getWeatherInfo(days.weathercode[i]);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>${date}</p>
      <p style="font-size:24px">${icon}</p>
      <p>${days.temperature_2m_max[i]}° / ${days.temperature_2m_min[i]}°</p>
    `;

    forecastDiv.appendChild(div);
  });
}


function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);

  if (history.length > 5) history.pop();

  localStorage.setItem("weatherHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const container = document.getElementById("historyList");

  container.innerHTML = "";

  history.forEach(city => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerText = city;

    div.onclick = () => {
      document.getElementById("cityInput").value = city;
      fetchCoordinates(city);
    };

    container.appendChild(div);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  renderHistory();
}


window.onload = renderHistory;