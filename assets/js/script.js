// Variables for search bar
let searchBtn = $("#search-button");
let clearBtn = $("#clear-history");
let searchCity = $("#searched-city");

// Variables for items being displayed
let curCity = $("#current-city");
let temperature = $("#temperature");
let humidity = $("#humidity");
let windSpeed = $("#wind-speed");
let uvIndex = $("#uv-index");

// API Key
let APIKey = "455419fbacd85967af11809073040f3e";

if (curCity.text() === "") {
    curCity.css("display", "none");
}

// Will run necessary events when these buttons are clicked
searchBtn.click(function() {
    currentWeather(searchCity.val());
});

clearBtn.click(function() {
    console.log("cleared");
});

function currentWeather(city) {
    // URL for a request
    let requestURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    fetch(requestURL).
        then(function(response) {
            return(response.json());
        }).then(function(data) {
            console.log(data);
            curCity.text(data.name);
            let tempF = Math.round(((data.main.temp - 273.15) * 1.80 + 32));
            temperature.text(" " + tempF + " F");
            curCity.css("display", "block");
        })
}