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

// Function to handle displaying Current Day
function currentWeather(city) {
    let currentDay = dayjs().format("MM/DD/YYYY");
    // URL for a request
    "api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}"
    let requestURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${APIKey}`;
    fetch(requestURL).
        then(function(response) {
            return(response.json());
        }).then(function(data) {
            var weathericon= data.weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
            curCity.css("display", "block");
            curCity.html(data.name + " (" + currentDay + ") " + "<img src="+iconurl+"></img>");
            temperature.text(" " + data.main.temp + " °F");
            humidity.text(" " + data.main.humidity + "%");
            windSpeed.text(" " + data.wind.speed + " m/s");
            forecast(data.id);
        })
}

// Function to handle displaying forecast for next 5 days
function forecast(cityid) {
    let dayOver = false;
    let forecastURL = `api.openweathermap.org/data/2.5/forecast?id=${cityid}&APPID=${APIKey}`
    fetch(forecastURL).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            for (i=0;i<5;i++){
                // var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
                let date = dayjs((data.list[((i+1)*8)-1].dt)*1000).format("MM/DD/YYYY");
                console.log("date: " + date);
                var iconcode= data.list[((i+1)*8)-1].weather[0].icon;
                var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
                var temp= data.list[((i+1)*8)-1].main.temp;
                var humidity= data.list[((i+1)*8)-1].main.humidity;
            
                $("#futDate"+i).html(date);
                $("#futImg"+i).html("<img src="+iconurl+">");
                $("#futTemp"+i).html(temp+"&#8457");
                $("#futHumidity"+i).html(humidity+"%");
            }
        })
}