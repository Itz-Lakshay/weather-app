const API_KEY = "9740edefeffcf6e30214106f4a144aca"
const cityInput = document.getElementById("city-input")
const searchBtn = document.getElementById("search-btn")
const message = document.getElementById("message")
const currentWeather = document.getElementById("current-weather")

async function getWeather(city) {
    const q = encodeURIComponent(city)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data);
    showCurrentWeather(data)
}

function showCurrentWeather(data){
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

searchBtn.addEventListener("click",()=>{
    let city = cityInput.value
    city = city.trim()
    if (city === "") {
        return
    }
    getWeather(city)
})