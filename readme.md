# weather-ireland-js

Simple APIs to return weather forecast informaion from around Ireland using Met Eireanns Forecast API https://data.gov.ie/dataset/met-eireann-weather-forecast-api

[![Build Status](https://travis-ci.com/aidancasey/weather-ireland-js.svg?branch=master)](https://travis-ci.com/aidancasey/weather-ireland-js)

## Intro

Simple Javascript friendly abstraction layer on top of Met Eireanns XML based weather forecast service.
The world needs no more angle brackets !

## Installation

```javascript
npm install weather-ireland-js
```

## Getting Started

```javascript
const weatherAPI = require("weather-ireland-js");

// pass a valid latitude and longitude for anywhere in ireland
var forecasts = await weatherAPI.getForecast(54.7210798611, -8.7237392806);
forecasts.forEach((weatherForecast) => {
  console.log(weatherForecast);
});
```

## Current Weather Data

```javascript
var forecasts = await weatherAPI.getForecast(54.7210798611, -8.7237392806);
forecasts.forEach((weatherForecast) => {
  console.log(weatherForecast);
});

//how to the current forecast
let currentWather = forecast.find(
  (o) =>
    DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours > 0 &&
    DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours <= 1
);
console.log("The current weather forecast is...");
console.log(JSON.stringify(currentWeather));
```

## API Response Format

```javascript
[
{"from":"2021-03-25T00:00:00.000+00:00",
"to":"2021-03-25T00:00:00.000+00:00",
"temperature_celsius":"1.3",
"windDirectionName":"NW",
"windDirectionDegree_degrees":"329.6",
"windSpeed_mps":"0.9",
"windSpeed_kph":3.2399999999999998,
"pressure":"1017.9",
"cloudiness_percentage":"95.0",
"rain_mm":"0.0",
"weatherSymbol_descriptionID":"Cloud",
"weatherSymbol_number":"4"},
..
]
```

| Property                    | Description                                                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| from                        | Content Cell                                                                                                                                                                                                             |
| to                          | Content Cell                                                                                                                                                                                                             |
| temperature_celsius         | The air temperature 2m above the ground is given in degrees Celsius                                                                                                                                                      |
| windDirectionName           | The cardinal direction i.e. southwest SW.                                                                                                                                                                                |
| windDirectionDegree_degrees | The direction of the wind is given in degrees from 0 to 360                                                                                                                                                              |
| windSpeed_mps               | Wind speed metres per second                                                                                                                                                                                             |
| windSpeed_kph               | Wind speed kilometres per hour                                                                                                                                                                                           |
| pressure                    | Pressure is given in units of hPa                                                                                                                                                                                        |
| cloudiness_percentage       | The general level of cloudiness 0-100                                                                                                                                                                                    |
| rain_mm                     | predicted rainfall in millimetres (mm).                                                                                                                                                                                  |
| weatherSymbol_descriptionID | The WDB computes the weather symbol for this period of time                                                                                                                                                              |
| weatherSymbol_number        | The weather symbol is derived from a combination of temperature, humidity, cloud cover & precipitation ranges from 1-50 as per Norwegian Meteorological Institute - more info here https://github.com/amedia/meteo-icons |

## Test

```javascript
	npm run test
```

## Met Éireann Custom Open Data Licence

please refer to fill license agreement from Met Eireann here

https://www.met.ie/cms/assets/uploads/2018/05/Met-%C3%89ireann-Open-Data-Custom-Licence_Final.odt

TLDR-

- You must give appropriate credit to Met Éireann, provide a link to the licence, and indicate if changes were made.

- No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the licence permits.

- If you distribute or broadcast this data or use this data to create web content for the internet, you must also display our Weather Warnings. Please see here for details on how to access Weather Warnings: https://data.gov.ie/dataset/weather-warnings
