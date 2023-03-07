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

// History of cities searched
let history = [];

// Loads previously searched cities
$(window).on("load",loadlastCity);

// API Key
let APIKey = "455419fbacd85967af11809073040f3e";

if (curCity.text() === "") {
    curCity.css("display", "none");
}

// Will run necessary events when these buttons are clicked
searchBtn.click(function() {
    currentWeather(searchCity.val());
});

clearBtn.on("click", function(event) {
    clearHistory(event);
});


// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<history.length; i++){
        if(c.toUpperCase()===history[i]){
            return -1;
        }
    }
    return 1;
}

// Function to handle displaying Current Day
function currentWeather(city) {
    let currentDay = dayjs().format("MM/DD/YYYY");
    // URL for a request
    "api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}"
    let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${APIKey}`;
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
            // Adds city name to localstorage to be retrieved later
            if(data.cod==200){
                history=JSON.parse(localStorage.getItem("cityname"));
                if (history==null){
                    history=[];
                    history.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(history));
                    addToList(city);
                }
                else {
                    if(find(city)>0){
                        history.push(city.toUpperCase());
                        localStorage.setItem("cityname",JSON.stringify(history));
                        addToList(city);
                    }
                }
            }
        })
}

// Function to handle displaying forecast for next 5 days
function forecast(cityid) {
    let dayOver = false;
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityid}&units=imperial&APPID=${APIKey}`
    fetch(forecastURL).
        then(function(response) {
            return response.json();
        }).then(function(data) {
            for (i=0;i<5;i++){
                let date = dayjs((data.list[((i+1)*8)-1].dt)*1000).format("MM/DD/YYYY");
                let iconcode= data.list[((i+1)*8)-1].weather[0].icon;
                let iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
                let temp= data.list[((i+1)*8)-1].main.temp;
                let humidity= data.list[((i+1)*8)-1].main.humidity;
                let windSpeed= data.list[((i+1)*8)-1].wind.speed;
            
                $("#futDate"+i).html(date);
                $("#futImg"+i).html("<img src="+iconurl+">");
                $("#futTemp"+i).html(" " + temp + " °F");
                $("#futHumidity"+i).html(" " + humidity+"%");
                $("#futWindspeed"+i).html(" " + windSpeed+" m/s");
            }
        })
}

// Add the passed city on the search history
function addToList(c){
    let listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(".list-group").append(listEl);
    console.log(listEl);
}

// Gets passed cities from storage
function loadlastCity(){
    $("ul").empty();
    let prevCity = JSON.parse(localStorage.getItem("cityname"));
    if(prevCity!==null){
        prevCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<prevCity.length;i++){
            addToList(prevCity[i]);
        }
        city=prevCity[i-1];
        currentWeather(city);
    }
}

// display the past search when the list group item is clicked in search history
function invokePastSearch(event){
    let liEl = event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }
}

//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    history=[];
    localStorage.removeItem("cityname");
    document.location.reload();
}

$(document).on("click",invokePastSearch);