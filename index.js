const searchPanel = document.querySelector('.search-panel')
const searchBox = document.querySelector('.search-box')
const main = document.querySelector('.main')
const city = document.querySelector('.region')
const time = document.querySelector('.time')
const day = document.querySelector('.day')
const temperature = document.querySelector('.degrees')
const description = document.querySelector('.description')
const weatherCard = document.querySelector('.weather-card')
const weatherImage = document.querySelector('.weather-image')
const body = document.querySelector('body')
const header = document.querySelector('.heading-1')

const api = {
    key: "91b90de4f7d1b799d283ab92f367fb1b",
    base: "https://api.openweathermap.org/data/2.5/"
}

const getTime = now => {
    let hours = now.getHours()
    let minutes = now.getMinutes()
    const amOrPm = hours >= 12 ? 'pm' : 'am'

    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes

    const timeNow = `${hours}:${minutes}`

    return { timeNow, amOrPm }
}

const getDayOfWeek = now => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const weekDay = days[now.getDay()]

    return weekDay
}

const buildDateString = () => {
    const now = new Date()
    const { timeNow, amOrPm } = getTime(now)
    const dayOfWeek = getDayOfWeek(now)

    const dateString = `<strong class="time-bold">${timeNow}</strong> ${amOrPm}`

    return { dateString, dayOfWeek }
}

const buildTemperatureString = temp => `${Math.round(temp)}°c`

const clearBackgroundImage = () => {
    body.classList.remove('default-background')
    body.classList.remove('clear-background')
    body.classList.remove('rain-background')
    body.classList.remove('clouds-background')
}

const clearWeatherCard = () => {
    weatherCard.classList.remove('default-weather-card')
    weatherCard.classList.remove('clear-weather-card')
    weatherCard.classList.remove('rain-weather-card')
    weatherCard.classList.remove('clouds-weather-card')
}

const clearTemperature = () => {
    temperature.classList.remove('default-degrees-after')
    temperature.classList.remove('clear-degrees-after')
    temperature.classList.remove('rain-degrees-after')
    temperature.classList.remove('clouds-degrees-after')
}

const clearSearchBox = () => {
    searchBox.classList.remove('default-search-box')
    searchBox.classList.remove('clear-search-box')
    searchBox.classList.remove('rain-search-box')
    searchBox.classList.remove('clouds-search-box')
}

const changeBackground = (kind) => {
    clearBackgroundImage()
    clearWeatherCard()
    clearTemperature()
    clearSearchBox()
    body.classList.remove('with-after')
    body.classList.add('without-after')
    body.classList.add(`${kind}-background`)
    weatherCard.classList.add(`${kind}-weather-card`)
    temperature.classList.add(`${kind}-degrees-after`)
    searchBox.classList.add(`${kind}-search-box`)
    weatherImage.innerHTML = `<img src="./assets/svg/${kind}.svg" alt="${kind}" />`
}

const displayResults = ({ name, sys: { country }, main: { temp }, weather }) => {
    const { dateString, dayOfWeek } = buildDateString()
    const temperatureString = buildTemperatureString(temp)
    const { main } = weather[0]

    switch (main) {
        case 'Clear':
            changeBackground('clear')
            break
        case 'Rain':
            changeBackground('rain')
            break
        case 'Clouds':
            changeBackground('clouds')
            break
        default:
            break
    }

    time.innerHTML = dateString
    day.innerText = dayOfWeek
    temperature.innerHTML = temperatureString
    description.innerText = main
    city.innerText = `${name}, ${country}`
}

const fetchResults = async (query) => {
    const { key, base } = api

    const response = await fetch(`${base}weather?q=${query}&units=metric&appid=${key}`)
    const weather = await response.json()

    displayResults(weather)
}

const makeQuery = e => {
    if (e.keyCode === 13) {
        fetchResults(searchBox.value)
        searchBox.value = ''
        main.style.display = 'flex'
        header.style.display = 'none'
    }
}

searchBox.addEventListener('keypress', makeQuery)