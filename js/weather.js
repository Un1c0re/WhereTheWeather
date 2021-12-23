const temperatureUnit = '˚';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';
const api = 'a33e246c1afb94247350405413d5565e';
var url;


function checkForm(el) {
    let nameCity = el.name.value;
    console.log(nameCity);

    let city = nameCity;
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api}`;
    start();
    return false;
}


async function getData() {
    let response = await fetch(url);
    if (response.ok) {
        let jsonData = await response.json();
        return jsonData;
    }
    else {
        alert("Укажите город в блоке поиска");
    }
}


function convertPressure(value) {
    return (value / 1.33).toFixed();
}


Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}


function getHoursString(dateTime) {
    let date = new Date(dateTime);
    let hours = date.getHours().pad();

    return hours;
}


function getValueWithUnit(value, unit) {
    return `${value}${unit}`;
}


function getTemperature(value) {
    var roundedValue = value.toFixed();
    return getValueWithUnit(roundedValue, temperatureUnit);
}


function render(data) {
    renderForecast(data);
    renderDetails(data);
}


function renderForecast(data) {
    let forecastDataContainer = document.querySelector('.forecast');
    let forecasts = '';

    for (let i = 0; i < 6; i++) {
        let item = data.list[i];

        let icon = item.weather[0].icon;
        let temp = getTemperature(item.main.temp);
        let hours = (i == 0 ? 'Сейчас' : getHoursString(item.dt * 1000));

        let template = `<div class="forecast__item">
        <div class="forecast__time">${hours}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__temperature">${temp}</div>
      </div>`;
        forecasts += template;
    }
    forecastDataContainer.innerHTML = forecasts;
}


function renderDetails(data) {
    let item = data.list[0];
    let pressureValue = convertPressure(item.main.pressure);
    let pressure = getValueWithUnit(pressureValue, pressureUnit);
    let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
    let feels_like = getTemperature(item.main.feels_like);
    let wind = getValueWithUnit(item.wind.speed, windUnit);

    renderDetailsItem('feelslike', feels_like);
    renderDetailsItem('humidity', humidity);
    renderDetailsItem('pressure', pressure);
    renderDetailsItem('wind', wind);
}


function renderDetailsItem(className, value) {
    let container = document.querySelector(`.${className}`).querySelector('.details__value');
    container.innerHTML = value;
}


function isDay(data) {
    let sunrise = data.city.sunrise * 1000;
    let sunset = data.city.sunset * 1000;

    let now = Date.now();
    return (now > sunrise && now < sunset);
}


function start() {
    getData().then(data => {
        currentData = data;
        render(data);
    })
}


function transition() {
    document.documentElement.classList.add('transition');
    setTimeout(function () {
        document.documentElement.classList.remove('transition');
    }, 4000)
}
