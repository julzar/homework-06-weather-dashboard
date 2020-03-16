$(document).ready(function() {

    // Variables
    const baseURL = 'https://api.openweathermap.org/data/2.5/';
    const apiKey = '&APPID=3f0192e4f37df4bc3e14bbbadfa0d0f3';
    const units = '&units=imperial'

    const currentDay = moment().format("dddd, Do, h:mm A");

    let uvi

    // Gets previously searched cities from local storage and renders them to the page. Only displays unique searches
    function renderSearchedCities () {
        let unique = new Set(JSON.parse(localStorage.getItem('searchedCities')))
        let searchedUnique = [...unique]

        for (let i = 0; i < 8; i++) {

            if (searchedUnique[i] !== undefined) {
                let searchedRow = `
                <div class="row rounded mb-1 btn-secondary searched-row">
                <p>${searchedUnique[i]}</p>
                </div>
                `
                $('#search-col').append(searchedRow)
            }
        }
    };

    renderSearchedCities();

    // renderWeather
    function renderWeather(weatherData) {
        let displayBlock = `
            <h3>${weatherData.name} (${currentDay}) <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></h3>
            <p>Temperature: ${weatherData.main.temp} \xB0F</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
        `
        $('#weather-display').html(displayBlock).addClass('border-grey')
       
    };

    function setUVClass(uvi) {
        if (uvi < 3) {
            return 'low'
        }
        else if (uvi < 6) {
            return 'moderate'
        }
        else if (uvi < 8) {
            return 'high'
        }
        else if (uvi < 11) {
            return 'very-high'
        }
        else {
            return 'extreme'
        }
    }
    
    function renderUVI(weatherData) {
        let uvIndex = `<p>UV Index: <span class="${setUVClass(weatherData.value)} rounded">${weatherData.value}</span></p>`
        $('#weather-display').append(uvIndex)
        console.log(uvIndex)
    }
    
    // Queries api for weather data using input value. Adds input value to local storage.
    function getWeatherData (input) {
        $.ajax({
            url: `${baseURL}weather?q=${input + units + apiKey}`,
            method: 'GET'
        }).done(function(response) {
            let searchedC = JSON.parse(localStorage.getItem('searchedCities'))
            if (searchedC == null) {
                searchedC = []
            }
            searchedC.unshift(input)
            localStorage.setItem('searchedCities', JSON.stringify(searchedC))

            renderWeather(response)
            // Uses location data from first ajax response to get UV index for that location. Calls renderUVI function.
            $.ajax({
                url: `${baseURL}uvi?${apiKey + units}&lat=${response.coord.lat}&lon=${response.coord.lon}`,
                method: 'GET'
            }).then(function(res) {
                renderUVI(res)
            })

        }).fail(function(xhr, status, error) {
            //Ajax request failed.
            let errorMessage = `${xhr.status} : ${xhr.statusText}`
            alert(`Error -  ${errorMessage}`);
        })

        // $.ajax({
        //     url: baseURL + 'forecast?q=' + input + units + apiKey,
        //     method: 'GET'
        // }).done(function(response) {
            // let searchedF = JSON.parse(localstorage.getItem('searchedForecast'))
            // if (searchedF == null || searchedF == undefined) {
            //     searchedF = {}
            // }
            // $.extend(searchedF, response)
            // localStorage.setItem('searchedForecast', JSON.stringify(searchedF))
            //console.log (response)
            // console.log(searchedF)
        // }).fail(function() {
        //     console.log(`failed`)
        //})
    };


    $('#search-btn').on('click', function() {
        let searchInput = $('#city-search').val().trim();
        // Formats search inputs so that each word has proper case. Found @ https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
        searchInput = searchInput.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

        getWeatherData(searchInput);
    });

    $('.searched-row').on('click', function(event) {
        event.stopPropagation()
        getWeatherData($(this).text().trim())
    });

    
// End of script    
});

// let options = {
//     APPID: '3f0192e4f37df4bc3e14bbbadfa0d0f3'
// }
// `${baseURL}/data/2.5/weather?q${$('#city-search').val()}${$.param(options)}`

{/* <p>${searchedUnique[i][0].toUpperCase() + searchedUnique[i].substring(1).toLowerCase()}</p> */}
