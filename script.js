var lat = 0;
var long = 0;
var cityArray = [];
//Openweather API Key
var APIkey = "166a433c57516f51dfab1f7edaed8413";

//Function for find UV value
function getUV(lat,long)
{
  var queryUV = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat="+ lat +"&lon="+ long;
  $.ajax({
        url: queryUV,
        method: "GET"
    }).then(function(response)
    {
      var UVval = response.value;
      $("#uvIndex").text("UV Index = " + UVval);
    })
}

function getweather(city)
{
  //Set variable for search url
  //queryURL for weather today
  //var queryURL1 ="api.openweathermap.org/data/2.5/weather?q=" + city;
  //queryURL for weather forecast
  var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
  $(".cityHeading").text(city);
  $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response)
    {   //console.log(response)
        var data = response.list[0];
        var date = data.dt_txt.split(" ")[0];
        var tempData = data.main.temp;
        //Convert to Celcius
        celcius(tempData);
        var humidData = data.main.humidity;
        
        var windData = data.wind.speed;
        //Convert to KM/h
        msConvert(windData);
        //Record Lat/Long to obtain UV results
        var lat = response.city.coord.lat;
        var long = response.city.coord.lon;
        
        $("#temperature").text("Temperature (Celsius) = " + cvalue);
        $("#humidity").text("Humidity(%) = " + humidData);
        $("#windSpeed").text("Wind(km/h) = " + windValue);
        //Function for UV
        getUV(lat,long);
        
    })
  

}
//5 day forecast
function forecast(city)
{
  var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
  var array = [];
  $(".card-deck").empty();
  //Grab data from Openweather
  $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response)
    {   
        //counter for keeping track of forecasted days
        counter = 0;
        //Increment by 8 each time as results are in 3 hour blocks, 8x3 = 24. Hence we take every 8th result for each day
        for (var i=0; i<33; i=i+8)
        { 
          var data = response.list[i];
          //console.log(data)
          //Date
          var date = data.dt_txt.split(" ")[0];
          
          //Weather thumbnail - sunny/rain/cloudy etc.
          var thumbnailTemp = data.weather[0].description;
          //Grab the icon details from response
          var iconCode = data.weather[0].icon;
          //console.log(iconCode.icon);
          //console.log("temp" + thumbnailTemp);
          //var thumbnail = thumbnailTemp.main;
          //icon(iconCode.icon);
          //let temp = weather_conditions.filter(function(e){return e.text === JSON.stringify(thumbnail)});
          //console.log("image source" + temp)
          //Temperature
          var forecastTemp= data.main.temp;
          celcius(forecastTemp);
          //Humidity
          var forecastHumid = data.main.humidity;
          //Create the cards for the next 5 days
          makeCard(date, cvalue,forecastHumid,iconCode);
        }
    })
    
}

startapp();
//Event Listener for Search Button
$("#searchButton").on("click",function()
{   
  
    
  //Jquery variables & set to localstorage
  var city = $("#searchTerm").val();
  //localStorage.setItem("storedCity",city);
  
  if (city)
  {
    //console.log(city)
    //$(".cityHeading").text(city);
      
    getweather(city);
    forecast(city);
    //Set City as "item onto Local Storage"
    
    cityArray.push(city);
    //console.log(JSON.stringify(cityArray))
    localStorage.setItem("cityName", cityArray);
    //console.log(localStorage.getItem("cityName"));
  }
  else
  {
    alert("Enter City!")
  }
  
})
    
//Create forecasted cards
function makeCard(date, forecastTemp, forecastHumid,iconCode)
{
    cardDiv = $("<div>");
    cardDiv.addClass("card forecastCard");
    dateDiv = $("<h5>");
    dateDiv.addClass("forecastDay");
    //console.log(date)
    dateDiv.text(date)
    //Generate URL for image source
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    console.log(iconURL);
    imgDiv = $("<img>");
    imgDiv.addClass("icons");
    imgDiv.attr("src", iconURL);
    tempDiv = $("<p>");
    tempDiv.addClass("forecastTemp");
    tempDiv.text("Temp(Celsius): " + forecastTemp);
    humidDiv = $("<p>");
    humidDiv.addClass("forecastHumid");
    humidDiv.text("Humidity: " + forecastHumid + "%");
    cardDiv.append(dateDiv);
    cardDiv.append(imgDiv);
    cardDiv.append(tempDiv);
    cardDiv.append(humidDiv);
    $(".card-deck").append(cardDiv);
}

//Converting raw temperature into celcius
function celcius(fvalue)
{
    //Kelvin to Celcius
    var cvalue_unrounded = fvalue - 273.15;
    //shows 2 decimal places only
    cvalue = cvalue_unrounded.toFixed(2);
    //Returns results as "cvalue" outside of this function
    return cvalue;
}


function msConvert(miliValue)
{
    
    //meters per sec to km/h
    var raw_value = miliValue * 3.6;
    windValue = raw_value.toFixed(2);
    return windValue; 
}
//This Variable Not require and not read in app. 
var weather_conditions = [
    {text:"clear sky", image: "./assets/image01.png"},
    {text:"few clouds", image: "./assets/image02.png"},
    {text:"scattered clouds", image: "./assets/image03.png"},
    {text:"broken clouds", image: "./assets/image04.png"},
    {text:"shower rain", image: "./assets/image09.png"},
    {text:"rain", image: "./assets/image10.png"},
    {text:"thunderstorm", image: "./assets/image11.png"},
    {text:"snow", image: "./assets/image13.png"},
    {text:"mist",image:"./assets/image50.png"}
];

function startapp()
{   
  //If there is already data in local storage
  if (localStorage)
    {
      //const array = localstorage.getItem("cityName");
      //console.log(array);
      //Iterate through all of local storage and add to search history bar
      for (var i=0;i<localStorage.length;i++)
      {
        
        //var key = localstorage.key(i);
        //var cityKey = localstorage.getItem(key)
        newList = $("<li>");
        newList.attr("value",localStorage.getItem("cityName"));
        //newList.attr("value",localStorage.getItem("cityKey"));
        newList.addClass("list-group-item searchCity");
        newList.text(localStorage.getItem("cityName"));
        //newList.text(localStorage.getItem("cityKey"));
        $(".historyCity").append(newList);
      }
    }
}

//Event Listener for Search History
$(".searchCity").on("click",function(){
    city = $(this).attr("value");
    console.log(city)
    getweather(city);
    forecast(city);
})
