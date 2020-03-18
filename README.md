# homework-06-weather-dashboard

When the user enters a location to the input field and clicks search, the weather data for that location is displayed.

This includes the temperature, humidity, wind speed, and UV index. UV index color is determined by level, from 'low' (0-2)
to 'extreme' (11+)

The 5-day forecast for that location is also displayed (consisting of temperature and humidity).



Searched locations are formatted ('location' => 'Location') and saved to local storage.

The eight most recent unique searches are displayed as clickable buttons on page load.

Unique searches means that regardless of how many times a location is searched, there will never be more than one button for that location
(and it will only count as one search for the purpose of determining the most recent eight, though it will move to the top of the list).

If the user clicks one of these buttons, the weather/forecast for that location is displayed.
