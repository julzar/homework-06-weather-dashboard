$(document).ready(function() {

    // Variables
    const baseURL = 'https://api.openweathermap.org/data/2.5/'
    const apiKey = '&APPID=3f0192e4f37df4bc3e14bbbadfa0d0f3'
    const units = '&units=imperial'

    const currentDay = moment().format("dddd, Do, h:mm A")
    

    // Gets previously searched cities from local storage and renders them to the page. Only displays unique searches.
    function renderSearchedCities () {
        let unique = new Set(JSON.parse(localStorage.getItem('searchedCities')))
        let searchedUnique = [...unique]

        for (let i = 0; i < 8; i++) {

            if (searchedUnique[i] !== undefined) {
                let searchedRow = `
                <div class="row rounded btn-secondary searched-row">
                <p>${searchedUnique[i]}</p>
                </div>
                `
                $('#search-col').append(searchedRow)
            }
        }
    }

    renderSearchedCities();

    // Renders weather data based on API call response.
    function renderWeather(weatherData) {
        let displayBlock = `
            <h3>${weatherData.name} (${currentDay}) <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></h3>
            <p>Temperature: ${weatherData.main.temp} \xB0F</p>
            <p>Humidity: ${weatherData.main.humidity}%</p>
            <p>Wind Speed: ${weatherData.wind.speed} MPH</p>
        `
        $('#weather-display').html(displayBlock).addClass('border-grey')
       
    }

    // Sets level class for UV index (low-extreme).
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

    // Renders UVI data. gets level class by calling setUVClass().
    function renderUVI(UVData) {
        let uvIndex = `<p>UV Index: <span class="${setUVClass(UVData.value)} rounded">${UVData.value}</span></p>`
        $('#weather-display').append(uvIndex)
    }

    // Renders 5 day forecast data. 
    function renderForecast(forecastData) {
        $('.forecast-title').show()
        let forecastBlock = `
            <div class="col rounded m-1 border-grey">
                <h6>${forecastData.dt_txt.substring(5, 10)} <img src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png"></h6>
                <p>Temp: ${forecastData.main.temp} \xB0F</p>
                <p>Humidity ${forecastData.main.humidity}%</p>
            </div>    
        `
        $('#forecast-display').append(forecastBlock)
    }
    
    // Queries api for weather/UVI/forecast data using input value. Adds input value to local storage.
    function getWeatherData (input) {
        $.ajax({
            url: `${baseURL}weather?q=${input + units + apiKey}`,
            method: 'GET'
        }).done(function(weatherResponse) {
            let searchedC = JSON.parse(localStorage.getItem('searchedCities'))
            if (searchedC == null) {
                searchedC = []
            }
            searchedC.unshift(input)
            localStorage.setItem('searchedCities', JSON.stringify(searchedC))

            renderWeather(weatherResponse)

            // Uses location data from first ajax Response to get UV index for that location. Calls renderUVI.
            $.ajax({
                url: `${baseURL}uvi?${apiKey + units}&lat=${weatherResponse.coord.lat}&lon=${weatherResponse.coord.lon}`,
                method: 'GET'
            }).then(function(UVIResponse) {
                renderUVI(UVIResponse)
            })
            // Uses location data from first ajax Response to get 5 day forecast for that location. Calls renderForecast() for each day.
            $.ajax({
                url: baseURL + 'forecast?q=' + input + units + apiKey,
                method: 'GET'
            }).then(function(forecastResponse) {
                $('#forecast-display').empty()
                
                for (let i = 0; i < forecastResponse.list.length; i += 8) {
                    renderForecast(forecastResponse.list[i])
                }
            })

        // Ajax request failed.
        }).fail(function(xhr, status, error) {
            let errorMessage = `${xhr.status} : ${xhr.statusText}`
            alert(`Error -  ${errorMessage}`)
        })
    }

    // On search button click, calls getWeatherData() using search input field value.
    $('#search-btn').on('click', function() {
        let searchInput = $('#city-search').val().trim()
        // Formats search inputs so that each word has proper case. Found @ https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
        searchInput = searchInput.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')

        getWeatherData(searchInput);
    });

    // Calls getWeatherData() on clicking a location search history element, using that location.
    $('.searched-row').on('click', function(event) {
        event.stopPropagation()
        getWeatherData($(this).text().trim())
    });

    
// End of script    
});
