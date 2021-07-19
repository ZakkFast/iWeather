const APIkey = '25e58f3366c8c00378ddd7ecaf34643b'
// function kicked off by button clicks when the document is ready
$(document).ready(function(){
    $('#searchBtn').on('click', function(){
        console.log('button click ln4')
        let searchInput = $('#searchInput').val()
        console.log(searchInput, 'searchInput 6')
        // $('#searchInput').val('')

        getWeather(searchInput)
        createHistoryBtnEl(searchInput)
    })
    const getWeather = (searchInput) => {
        console.log(searchInput, 'searchInput')
        $.ajax({
            type: 'Get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${APIkey}&units=imperial`,
            dataType: 'json',
            success: function(data){
                let title = $(`<h2 class="card-title">${searchInput}</h2>`) //add date to title
                let card = $(`<div class='card'></div>`)
                let wind = $(`<p class='card-text'>Wind Speed: ${data.wind.speed} mph</p>`)
                let humidity = $(`<p class='card-text'>Humidty: ${data.main.humidity}</p>`)
                let temp = $(`<p class='card-text'>Temp: ${data.main.temp} °F</p>`)
                // http://openweathermap.org/img/w/" + iconcode + ".png"
                let icon = $(`<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'>`)
                let cardBody =$(`<div class='card-body'>`)

                title.append(icon)
                cardBody.append(title, temp, wind, humidity)
                card.append(cardBody)
                $('#current').empty()
                $('#current').append(card)

            }
        })
    }
    function createHistoryBtnEl (searchInput){
        var li = $('<li>').addClass('list-group-item list-group-item-action').text(searchInput)
        li.on('click', btnclick)
        $('.history').append(li)
    }
    
    function btnclick(e){
        console.log('btn clicked ln 34', e.currentTarget.innerText)
        let historyText = e.currentTarget.innerText
        getWeather(historyText)
    }
})


// $('#history').on('click', 'li', function(){
//     getWeather($(this).text())
// })
// let makeLi = (text) => {
//     var li = $('<li>').addClass('list-group-item').text(text)
//     $('#history').append(li)
// }

// let history = JSON.parse(window.localStorage.getItem('#history')) || [];

// if(history.length > 0) {
//     getWeather(history[history.length - 1])
// }

// for (i = 0; i <history.length; i++) {
//     makeLi(history[i])
// }


//Call API for current weather

    //create html elements 

    //apppend elements

    //call forcast and uvindex

//Call API for UV Index

    //do something with html elements

//Call API for 5 day forcast
    //Loop through.. something?

    //Define HTML elements

    //Append HTML elements

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