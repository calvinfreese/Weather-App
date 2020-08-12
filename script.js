$(document).ready(function() {
    const APIkey = "39a1d34577f4801b22aafca38b9e1e96";
    var weatherIconCode = '';
    var inputResponse = '';
    var history = [];




function loadLastSearch() {
  if (localStorage.length != 0 ) {
    for(i=0; i < localStorage.length; i++){
      var values = localStorage.getItem("key_" + i)
      var locationInput = values.replace(/"/g, "")   ; ;
      console.log(locationInput)
      var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationInput +
      "&appid=" +
      APIkey;

      $.ajax({
      url: queryURL,
      method: "GET",
      }).then(function (response) {

      inputResponse = response;
      weatherIconCode = response.weather[0].icon;
      var weatherURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png"; 

      var currentDate = moment().format("L");
      //grab Kelvin and convert to F
      var kelvin = response.main.temp;
      var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
      //humidity
      var humidity = response.main.humidity;
      //wind speed
      var windSpeed = response.wind.speed;
      
      $('.current-location').text(`${response.name} ${currentDate}`);
      $('#weatherDisplay').attr('src', weatherURL);
      $('.current-temp').text('Temp: ' + temp  + ' F');
      $('.current-humidity').text('Humidity: ' + humidity + '%');
      $('.wind-speed').text('Wind Speed: ' + windSpeed +' mph');

      getUVIndex();

      getFiveDayForecast();
    
    });
      
      
    }
  
  }

}

loadLastSearch();

    
   


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
    

  $.ajax({
    url: urlUVIndex,
    method: "GET",
  }).then(function(r) {
    

    //Hey! this is the UV Index :D
    var uvIndex = r.value;
    $('.current-uv-index').text('UV Index: ' + uvIndex);
    if (uvIndex >= 8) {
      $('.current-uv-index').attr('class', 'current-uv-index very-high-uv');
    } else if (uvIndex < 8 && uvIndex >= 6) {
      $(".current-uv-index").attr("class", "current-uv-index high-uv");
    } else if (uvIndex < 6 && uvIndex >= 3) {
      $(".current-uv-index").attr("class", "current-uv-index mod-uv"); 
    } else {
      $(".current-uv-index").attr("class", "current-uv-index low-uv");
    }
    
  });
}

//Gets Five day forecast
function getFiveDayForecast() {
    
    var city = inputResponse.name;
    var forecastURL =
      'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIkey;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (r) {
      
      var forecastList = r.list;

      //loop through forecast days, grab time index time @ 12p for each day, and print info to forecast cards in html
      for (i = 4; i < forecastList.length; i += 8) {
        
        var forecastIcon = forecastList[i].weather[0].icon
        var weatherURL =
          "http://openweathermap.org/img/w/" + forecastIcon + ".png";
        $("#weatherDisplay").attr("src", weatherURL);
        var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        var forecastDate = forecastList[i].dt_txt;
        var kelvin = forecastList[i].main.temp;
        var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        var forecastDateFormat = moment(forecastDate).format("L");
        var humidity = forecastList[i].main.humidity;
        
        if(i == 4) {
          $(".forecast1-date").text(forecastDateFormat);
          $(".forecast1-img").attr("src", weatherURL);
          $(".forecast1-temp").text("Temp: " + temp + " F");
          $(".forecast1-humidity").text(
            "Humidity: " + humidity
          );
        } else if (i == 12) {
          $(".forecast2-date").text(forecastDateFormat);
          $(".forecast2-img").attr("src", weatherURL);
          $(".forecast2-temp").text("Temp: " + temp + ' F');
          $(".forecast2-humidity").text(
            "Humidity: " + humidity
          );
        } else if (i == 20) {
          $(".forecast3-date").text(forecastDateFormat);
          $(".forecast3-img").attr("src", weatherURL);
          $(".forecast3-temp").text("Temp: " + temp + " F");
          $(".forecast3-humidity").text(
            "Humidity: " + humidity
          );
        } else if (i == 28) {
          $(".forecast4-date").text(forecastDateFormat);
          $(".forecast4-img").attr("src", weatherURL);
          $(".forecast4-temp").text("Temp: " + temp + " F");
          $(".forecast4-humidity").text(
            "Humidity: " + humidity
          );
        } else if (i == 36) {
          $(".forecast5-date").text(forecastDateFormat);
          $(".forecast5-img").attr("src", weatherURL);
          $(".forecast5-temp").text("Temp: " + temp + " F");
          $(".forecast5-humidity").text('Humidity: ' + humidity);
        }

        
      }
    });
}

//Adds historical searches as list items on page and stores them to localStorage
function appendHistory() {
  var listGroup = $('.list-group');
  loadStorage();
  // var button = $('button');
  listGroup.empty();
  for (i = 0; i < history.length; i++) {
    listGroup.prepend(
      `<li class='list-group-item list-group-item-action historical-search'> ${history[i]} </li>`
      
    );
    localStorage.setItem("key_"+ i, JSON.stringify(history[i]));
  }
  
}


function loadStorage() {
  var listGroup = $(".list-group");
  
  for (i=0; i < localStorage.length; i++) {
    var storedSearches = localStorage.getItem("key_" + i);
    storedSearches = storedSearches.replace(/"/g, '');
    listGroup.prepend(
      `<li class='list-group-item list-group-item-action historical-search'> ${storedSearches} </li> ` );
      
       
  }
}

loadStorage();




//this happens first
$("#locationForm").on("submit", function (e) {
    e.preventDefault();
    var locationInput = $("#locationInput").val();
    var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    locationInput +
    "&appid=" +
    APIkey;

    

    $.ajax({
    url: queryURL,
    method: "GET",
    }).then(function (response) {
    

    
    inputResponse = response;
    weatherIconCode = response.weather[0].icon;
    var weatherURL = "http://openweathermap.org/img/w/" + weatherIconCode + ".png"; 

    var currentDate = moment().format("L");
    //grab Kelvin and convert to F
    var kelvin = response.main.temp;
    var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
    //humidity
    var humidity = response.main.humidity;
    //wind speed
    var windSpeed = response.wind.speed;
    
    $('.current-location').text(`${response.name} ${currentDate}`);
    $('#weatherDisplay').attr('src', weatherURL);
    $('.current-temp').text('Temp: ' + temp  + ' F');
    $('.current-humidity').text('Humidity: ' + humidity + '%');
    $('.wind-speed').text('Wind Speed: ' + windSpeed +' mph');



    history.push(response.name);
    

    getUVIndex();

    getFiveDayForecast();

    appendHistory();

    $('#locationInput').val('');
    });
});




$(document).on("click", ".historical-search", function () {
  var locationInput = $(this).text();
  
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    locationInput +
    "&appid=" +
    APIkey;

  

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    

    inputResponse = response;
    weatherIconCode = response.weather[0].icon;
    var weatherURL =
      "http://openweathermap.org/img/w/" + weatherIconCode + ".png";

    var currentDate = moment().format("L");
    //grab Kelvin and convert to F
    var kelvin = response.main.temp;
    var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
    //humidity
    var humidity = response.main.humidity;
    //wind speed
    var windSpeed = response.wind.speed;

    $(".current-location").text(`${response.name} ${currentDate}`);
    $("#weatherDisplay").attr("src", weatherURL);
    $(".current-temp").text("Temp: " + temp + " F");
    $(".current-humidity").text("Humidity: " + humidity + "%");
    $(".wind-speed").text("Wind Speed: " + windSpeed + " mph");

    

    getUVIndex();

    getFiveDayForecast();

    
  });








});

$("#clear-history").on("click", function (e) {
  
  localStorage.clear();
  $('.list-group').empty();
});


});

