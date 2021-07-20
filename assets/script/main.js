//API key for easy recall. Normally would hide senstive info but its a weather API. ::shrugs::
const APIkey = '25e58f3366c8c00378ddd7ecaf34643b'
// function kicked off by button clicks when the document is ready
$(document).ready(function(){
    $('#searchBtn').on('click', function(){
        //collects user input and stores it in searchInput for API calls.
        let searchInput = $('#searchInput').val()
        getWeather(searchInput)
        createHistoryBtnEl(searchInput)
        getForcast(searchInput)
    })
    //Initial call to API for current weather.
    const getWeather = (searchInput) => {
        $.ajax({
            type: 'Get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${APIkey}&units=imperial`,
            dataType: 'json',
            success: function(data){
                //Creating HTML Elements and populating with data from API
                let title = $(`<h2 class="card-title">${searchInput}</h2>`) //add date to title
                let card = $(`<div class='card'></div>`)
                let wind = $(`<p class='card-text'>Wind Speed: ${Math.ceil(data.wind.speed)} mph</p>`)
                let humidity = $(`<p class='card-text'>Humidty: ${data.main.humidity}%</p>`)
                let temp = $(`<p class='card-text'>Temp: ${Math.ceil(data.main.temp)}°F</p>`)
                let icon = $(`<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'>`)
                let cardBody =$(`<div class='card-body'>`)
                title.append(icon)
                cardBody.append(title, temp, wind, humidity)
                card.append(cardBody)
                $('#current').empty()
                $('#current').append(card)
                getUV(data.coord.lat, data.coord.lon)

            }
        })
    }
    const getForcast = (searchInput) =>{
        $.ajax({
            type: 'GET',
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${APIkey}&units=imperial`,
            dataType: 'json',
            success: function(data){
                //Grabbing forecast class, adding a header, appending div class row to append to in for loop
                $('#forecast').html('<h3 class="mt-3>Forecast</h3>').append('<div class="row"')
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
            $.ajax({
                type: 'GET',
                url: `https://api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`,
                dataType: 'json',
                success: function (data){
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
    function btnclick(e){
        let historyText = e.currentTarget.innerText
        getWeather(historyText)
        getForcast(historyText)
    }
    let historyArry;
    
    function storeHistory(){
        historyArry = []
        $( "li" ).each(function( index ) {
            // let historyArry;
            historyArry.push($( this ).text())
        });
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