//API key for easy recall. Normally would hide senstive info but its a weather API. ::shrugs::
const APIkey = '25e58f3366c8c00378ddd7ecaf34643b'
// function kicked off by button clicks when the document is ready
$(document).ready(function(){
    $('#searchBtn').on('click', function(){
        //collects user input and stores it in searchInput for API calls.
        let searchInput = $('#searchInput').val()
        // console.log(searchInput, 'searchInput 6')
        //Clears form after submission
        // $('#searchInput').val('')
        // console.log(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${APIkey}&units=imperial`, 'tesdt')
        getWeather(searchInput)
        createHistoryBtnEl(searchInput)
        getForcast(searchInput)
    })
    //Initial call to API for current weather.
    const getWeather = (searchInput) => {
        // console.log(searchInput, 'searchInput')
        $.ajax({
            type: 'Get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${APIkey}&units=imperial`,
            dataType: 'json',
            success: function(data){
                // console.log(data)
                //Creating HTML Elements and populating with data from API
                let title = $(`<h2 class="card-title">${searchInput}</h2>`) //add date to title
                let card = $(`<div class='card'></div>`)
                let wind = $(`<p class='card-text'>Wind Speed: ${Math.ceil(data.wind.speed)} mph</p>`)
                let humidity = $(`<p class='card-text'>Humidty: ${data.main.humidity}%</p>`)
                let temp = $(`<p class='card-text'>Temp: ${Math.ceil(data.main.temp)}°F</p>`)
                let icon = $(`<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'>`)
                let cardBody =$(`<div class='card-body'>`)
                //console log for API data for testing purposes
                // console.log(data)
                //Appending elements to page
                title.append(icon)
                cardBody.append(title, temp, wind, humidity)
                card.append(cardBody)
                $('#current').empty()
                $('#current').append(card)
                // console.log(data)
                getUV(data.coord.lat, data.coord.lon)

            }
        })
    }
    const getForcast = (searchInput) =>{
        $.ajax({
            type: 'GET',
            //Use correct api dumbass
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${APIkey}&units=imperial`,
            dataType: 'json',
            success: function(data){
                //Grabbing forecast class, adding a header, appending div class row to append to in for loop
                $('#forecast').html('<h3 class="mt-3>Forecast</h3>').append('<div class="row"')
                // console.log(data, 'test2')
                // console.log(data.list[0].dt_txt)
                for(let i = 0; i < data.list.length; i += 8){
                        let col = $('<div class="col-md-2"></div>')
                        let card = $('<div class="card bg-primary text-white"</div>')
                        let body =$('<div class="card-body p-2"</div>')
                        let title = $('<h4 class="title-card"></h4>').text(new Date(data.list[i].dt_txt).toLocaleDateString())
                        let img = $(`<img src='http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png'>`)
                        let forTemp = $('<p class="card-text"></p>').text(`Temp: ${Math.ceil(data.list[i].main.temp_max)}°F`)
                        let forHumidity = $('<p class="card-text"></p>').text(`Humidty: ${data.list[i].main.humidity}%`)
                        let forWind = $('<p class="card-text"></p>').text(`Wind: ${data.list[i].wind.speed} MPH`)
                        
                        col.append(card.append(body.append(title, img, forTemp, forHumidity, forWind)));
                        $('#forecast').append(col);
                    }
                }
            })
        }
        const getUV = (lat, lon) => {
            // console.log(lon, lat)
            $.ajax({
                type: 'GET',
                url: `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`,
                dataType: 'json',
                success: function (data){
                    // console.log(data)
                    
                    // if data.value < 3 then change color to green
                    // else if data.value < 5 change to orange
                    // else change to red 
                    let color;
                    if(data.value < 3){
                        color = 'green'
                    }else if(data.value < 5){
                        color = 'orange'
                    } else {
                        color = 'red'
                    }

                    let uvIndex = $(`<span style='background-color: ${color}'></span>`).text(`UV: ${data.value}`)

                    $('#current .card-body').append(uvIndex)
                }
            })
        }
        
        //Function to create and append elements to history for recall
        function createHistoryBtnEl (searchInput){
            var li = $('<li>').addClass('list-group-item list-group-item-action').text(searchInput)
            li.on('click', btnclick)
            $('.history').append(li)
            storeHistory()
    }
    //Function to allow history li elements to be clicked and recall the api for current info and forcast.
    function btnclick(e){
        // console.log('btn clicked ln 34', e.currentTarget.innerText)
        //html tag is li, classname list, // listitem, 0, classlist// listitem 0 innertext
        let historyText = e.currentTarget.innerText
        getWeather(historyText)
        getForcast(historyText)
    }
    let historyArry;
    
    function storeHistory(){
        // let historyArry = JSON.parse(localStorage.getItem('historyArry')) || []
        historyArry = []
        $( "li" ).each(function( index ) {
            // let historyArry;
            historyArry.push($( this ).text())
        });
    //    localStorage.clear()
       localStorage.setItem('historyArry', JSON.stringify(historyArry))
    }
    
    function loadHistory(){
        historyArry = JSON.parse(localStorage.getItem('historyArry'))
        console.log(historyArry)
        for(i = 0; i < historyArry.length; i++) {
            var li = $('<li>').addClass('list-group-item list-group-item-action').text(historyArry[i])
            li.on('click', btnclick)
            $('.history').append(li)
        }
        if (historyArry.length > 0) {
            getWeather(historyArry[historyArry.length - 1]);
            getForcast(historyArry[historyArry.length - 1]);
            
        }
    }
    loadHistory()
    
    
})

/*
var array = JSON.parse(window.localStorage.getItem("itemsline")) || [];//the "|| []" replaces possible null from localStorage with empty array
var value = "some value";
if(array.indexOf(value) == -1){
    array.push(value);
    window.localStorage.setItem("itemsline", JSON.stringify(array));
*/
// storeHistory()


// let history = JSON.parse(window.localStorage.getItem('#history')) || [];





//Call API for UV Index

    //do something with html elements

//Store searches as History within localstorage








/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that 
city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of 
weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are 
favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon 
representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/