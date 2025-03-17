let btnsrch=document.getElementById("srch");

let logo1="./drop-silhouette.png";
let logo2="./wind.png";
let logo3="./temperature (1).png";
let logo4="./temperature.png";
let logo5="./rising-sun.png";
let logo6="./sunset.png";

// Remove OpenWeather key as we're using WeatherAPI now
btnsrch.addEventListener("click",function(){
    let input=document.getElementById("city").value;
    getData(input);
})

async function getData(city){
    let url = `http://localhost:3000/api/weather/${city}`;

    try {
        let res = await fetch(url);
        let data = await res.json();
        getLocationBysrch(data);
    } catch(err) {
        console.log(err);
    }
}

async function getLocationBysrch(data) {
    let lat = data.coord.lat;
    let long = data.coord.lon;

    let urlDays = `http://localhost:3000/api/forecast/${lat}/${long}`;
    try {
        let resday = await fetch(urlDays);
        let dataDays = await resday.json();

        let frm = document.querySelector("#gmap_canvas");
        frm.src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        
        // Create a combined data array with current weather and forecast
        const combinedData = [{
            temp: data.temp,
            description: data.description,
            icon: data.icon,
            current: data.current,
            location: data.location
        }, ...dataDays.daily];

        appendBysrch(combinedData, data.coord.lat, data.coord.lon);
    } catch(err) {
        console.log(err);
    }
}

async function appendBysrch(data, lat, long) {
    // Clear existing content
    document.querySelector(".days").innerHTML = "";
    document.querySelector("#temp").innerHTML = "";
    document.querySelector("#detl").innerHTML = "";
    document.querySelector(".popltn").innerHTML = "";

    // Display current day's weather
    let temp = document.createElement("h3");
    temp.innerText = `${data[0].temp}°C`;
    document.querySelector("#temp").append(temp);

    let div_img = document.createElement("div");
    div_img.innerHTML = `<img src="${data[0].icon}" alt="weather icon">`;
    document.querySelector("#temp").append(div_img);

    let detl = document.createElement("h5");
    detl.innerText = data[0].description;
    document.querySelector("#detl").append(detl);

    // Create weather details with more information
    createWeatherDetail("Humidity", `${data[0].current.humidity}%`, logo1);
    createWeatherDetail("Wind Speed", `${data[0].current.wind_kph} km/h`, logo2);
    createWeatherDetail("Wind Direction", data[0].current.wind_dir, logo3);
    createWeatherDetail("Pressure", `${data[0].current.pressure_mb} mb`, logo4);
    createWeatherDetail("Precipitation", `${data[0].current.precip_mm} mm`, logo5);
    createWeatherDetail("Cloud Cover", `${data[0].current.cloud}%`, logo6);

    // Display location details (simplified)
    let popltn = document.createElement("h2");
    popltn.innerText = "Location Details";
    document.querySelector(".popltn").append(popltn);

    let locationDiv = document.createElement("div");
    locationDiv.innerHTML = `
        <p><strong>Latitude:</strong> ${data[0].location.lat}°</p>
        <p><strong>Longitude:</strong> ${data[0].location.lon}°</p>
    `;
    document.querySelector(".popltn").append(locationDiv);

    // Make elements visible
    document.querySelector(".temp-cont").classList.add("visible");
    document.querySelector("#detl").classList.add("visible");
    document.querySelector(".popltn").classList.add("visible");

    // Display forecast for next 6 days
    document.querySelector(".days").classList.add("visible");
    for(let i = 1; i < data.length; i++) {
        let Card_div = document.createElement("div");
        Card_div.className = "forecast-card";

        let Card_divO = document.createElement("h4");
        Card_divO.innerText = data[i].day;
        Card_div.append(Card_divO);

        let Card_divT = document.createElement("div");
        Card_divT.className = "first";
        Card_divT.innerHTML = `
            <div>
                <img src="${data[i].icon}" alt="weather icon">
            </div>
            <h5>${data[i].temp}°C</h5>
        `;
        Card_div.append(Card_divT);

        let Card_divTh = document.createElement("div");
        Card_divTh.className = "dy-temp";
        Card_divTh.innerHTML = `
            <span>Min: ${data[i].temp_min}°C</span>
            <span>Max: ${data[i].temp_max}°C</span>
        `;
        Card_div.append(Card_divTh);

        document.querySelector(".days").append(Card_div);
    }
}

function createWeatherDetail(label, value, logo) {
    let div = document.createElement("div");
    div.setAttribute("class", "disdetl");

    let img_div = document.createElement("div");
    img_div.setAttribute("class", "img");

    let img = document.createElement("img");
    img.src = logo;
    let p = document.createElement("p");
    p.innerText = label;
    img_div.append(img, p);

    let pValue = document.createElement("p");
    pValue.innerText = value;

    div.append(img_div, pValue);
    document.querySelector("#detl").append(div);
}

function formatTime(timestamp) {
    const time = new Date(timestamp*1000);
    const [hour, minutes] = [time.getHours(), time.getMinutes()];
    const h = hour.toString();
    const m = minutes.toString();
    return `${h} : ${m.length<2 ? '0'+m : m}`;
}

function createForecastCard(dayData) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const cr_dy = new Date(dayData.dt*1000);
    const dayCrr = days[cr_dy.getDay()];

    let Card_divO = document.createElement("div");
    Card_divO.setAttribute("class", "forecast-card");
    
    let C_supT = document.createElement("sup");
    C_supT.innerText = "C"
    let C_day = document.createElement("h4");
    C_day.innerText = dayCrr;

    let card_div_class = document.createElement("div");
    card_div_class.setAttribute("class", "first");
    let C_temp = (dayData.temp.day-(273.15)).toFixed(2)

    let card_h5 = document.createElement("h5");
    card_h5.innerText = `${C_temp}°`;
    card_h5.append(C_supT)

    let divC_img_cont = document.createElement("div");
    let divC_img = document.createElement("img");
    divC_img.src = dayData.weather[0].icon;
    divC_img.alt = dayData.weather[0].main;
    divC_img_cont.append(divC_img);

    card_div_class.append(card_h5, divC_img_cont);

    // Min temp
    let card_temp_div = document.createElement("div");
    card_temp_div.setAttribute("class", "dy-temp")
    let cMint = document.createElement("p");
    cMint.innerText = "Min Temp"
    let cMintV = document.createElement("p");
    let C_tmin = (dayData.temp.min-(273.15)).toFixed(2)
    cMintV.innerText = `${C_tmin}°`
    cMintV.append(document.createElement("sup")).innerText = "C";
    card_temp_div.append(cMint, cMintV);

    // Max temp
    let card_temp_div2 = document.createElement("div");
    card_temp_div2.setAttribute("class", "dy-temp")
    let cMaxt = document.createElement("p");
    cMaxt.innerText = "Max Temp";
    let cMaxtV = document.createElement("p");
    let C_tmax = (dayData.temp.max-(273.15)).toFixed(2);
    cMaxtV.innerText = `${C_tmax}°`;
    cMaxtV.append(document.createElement("sup")).innerText = "C";
    card_temp_div2.append(cMaxt, cMaxtV);

    Card_divO.append(C_day, card_div_class, card_temp_div, card_temp_div2);
    document.querySelector(".days").append(Card_divO);
}

// Geolocation function
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(success);
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        liveLocationD(latitude, longitude);
    }
}

async function liveLocationD(lat, long) {
    try {
        // Get current weather data
        let weatherUrl = `http://localhost:3000/api/weather/${lat},${long}`;
        let weatherRes = await fetch(weatherUrl);
        let weatherData = await weatherRes.json();

        // Get forecast data
        let forecastUrl = `http://localhost:3000/api/forecast/${lat}/${long}`;
        let forecastRes = await fetch(forecastUrl);
        let forecastData = await forecastRes.json();

        // Update UI
        document.querySelector(".default").classList.add("defaultV");
        document.querySelector(".frame").classList.add("frameV");
        
        // Update map
        let frm = document.querySelector("#gmap_canvas");
        frm.src = `https://maps.google.com/maps?q=${weatherData.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        
        // Update city input
        document.querySelector("#city").value = weatherData.name;
        
        // Create a combined data array with current weather and forecast
        const combinedData = [{
            temp: weatherData.temp,
            description: weatherData.description,
            icon: weatherData.icon,
            current: weatherData.current,
            location: weatherData.location
        }, ...forecastData.daily];

        // Display weather data
        appendBysrch(combinedData, weatherData.coord.lat, weatherData.coord.lon);
    } catch(err) {
        console.log(err);
    }
}

getLocationWeather();
