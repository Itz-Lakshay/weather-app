const API_KEY = "aa1d99d5262b42060d6be19bd605db31"
const cityInput = document.getElementById("city-input")
const searchBtn = document.getElementById("search-btn")
const message = document.getElementById("message")
const currentWeather = document.getElementById("current-weather")

async function getWeather(city) {
    filterSelect.value = "all"
    forecastSection.hidden = true
    currentWeather.innerHTML = ""
    message.textContent = ""

    try {
        const q = encodeURIComponent(city)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`
        const response = await fetch(url)
        if (!response.ok) { //this is same as response.ok === false
            if (response.status === 404) {
                throw new Error("City not found")
            }
            else if (response.status === 401) {
                throw new Error("Invalid API Key")
            }
            else {
                throw new Error("Something went wrong! Try Again")
            }
        }

        const data = await response.json()
        showCurrentWeather(data)
        await getForecast(city)

    }
    catch (error) {
        if (error instanceof TypeError) {
            message.textContent = "Network error. Check your internet connection."
        }
        else {
            message.textContent = error.message
        }
    }
}

function showCurrentWeather(data) {
    currentWeather.innerHTML = ""

    const name = document.createElement("h2")
    name.textContent = data.name

    const temp = document.createElement("p")
    temp.textContent = `${data.main.temp}°C`

    const desc = document.createElement("div")
    desc.textContent = data.weather[0].description

    const hum = document.createElement("p")
    hum.textContent = `Humidity: ${data.main.humidity}%`

    const icon = document.createElement("img")
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    currentWeather.append(icon)
    currentWeather.append(name)
    currentWeather.append(temp)
    currentWeather.append(desc)
    currentWeather.append(hum)
}

searchBtn.addEventListener("click", () => {
    let city = cityInput.value
    city = city.trim()
    if (city === "") {
        message.textContent = "Please enter a city name"
        return
    }
    getWeather(city)
})

const forecastSection = document.getElementById("forecast-section")
const forecastList = document.getElementById("forecast-list")
const filterSelect = document.getElementById("filter-select")

let forecastData = []

async function getForecast(city) {
    const q = encodeURIComponent(city)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)

    if (!response.ok) { //this is same as response.ok === false
        if (response.status === 404) {
            throw new Error("City not found")
        }
        else if (response.status === 401) {
            throw new Error("Invalid API Key")
        }
        else {
            throw new Error("Something went wrong! Try Again")
        }
    }

    const data = await response.json()
    forecastData = data.list
    forecastSection.hidden = false
    renderForecast()
}

function renderForecast() {
    const selected = filterSelect.value
    forecastList.innerHTML = ""

    let group
    if (selected === "all") {
        group = forecastData
    }
    else{
        group = forecastData.filter(g => g.weather[0].main === selected)
    }

    group.forEach(e => {
        let div = document.createElement("div")
        div.setAttribute("class", "forecast-card")
        let p1 = document.createElement("p")
        p1.textContent = e.dt_txt
        div.append(p1)

        let p2 = document.createElement("p")
        p2.textContent = `${e.main.temp}°C`
        div.append(p2)

        let p3 = document.createElement("p")
        p3.textContent = e.weather[0].description
        div.append(p3)

        forecastList.append(div)
    });
}

filterSelect.addEventListener("change", renderForecast)