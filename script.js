$(document).ready(function() {
    const APIkey = "39a1d34577f4801b22aafca38b9e1e96";
    var weatherIconCode = '';
    var inputResponse = '';
    var history = [];



//Gets UV Index - called by city submission ajax req.
function getUVIndex() {
    var lat = inputResponse.coord.lat;
    var lon = inputResponse.coord.lon;
    var urlUVIndex =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIkey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;
    console.log('hello!')

  $.ajax({
    url: urlUVIndex,
    method: "GET",
  }).then(function(r) {
    console.log(r);

    //Hey! this is the UV Index :D
    var uvIndex = r.value;
    console.log(uvIndex);
  });
}


function getForecast() {
    
    var city = inputResponse.name;
    var forecastURL =
      'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIkey;

    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function(r) {
        console.log(r);
        console.log('hey, im a forecast'); 
        console.log(r.list[3]);   
        console.log(r.list[11]);
        console.log(r.list[19]);
        console.log(r.list[27]);
        console.log(r.list[35]);
        var weatherURL =
          "http://openweathermap.org/img/w/" + weatherIconCode + ".png";
          $("#weatherDisplay").attr("src", weatherURL);
    });
}

//this happens first
$("#locationForm").on("submit", function (e) {
    e.preventDefault();
    var locationInput = $("#locationInput").val();
    var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    locationInput +
    "&appid=" +
    APIkey;

    console.log(locationInput);

    $.ajax({
    url: queryURL,
    method: "GET",
    }).then(function (response) {
    console.log(response);

    //grab Kelvin and convert to F
    inputResponse = response;
    var kelvin = response.main.temp;
    var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
    weatherIconCode = response.weather[0].icon;
    
    

    console.log(temp);

    //humidity
    var humidity = response.main.humidity;

    //wind speed
    var windSpeed = response.wind.speed;
    
    history.push(response.name);
    console.log(history);

    getUVIndex();

    getForecast();
    });
});






});

