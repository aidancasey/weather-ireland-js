# weather-ireland-js

Simple APIs to return weather forecast informaion from around Ireland using Met Eireanns Forecast API https://data.gov.ie/dataset/met-eireann-weather-forecast-api

[![Build Status](https://travis-ci.com/aidancasey/weather-ireland-js.svg?branch=master)](https://travis-ci.com/aidancasey/weather-ireland-js)

## Intro

Simple Javascript friendly abstraction layer on top of Met Eireanns XML based weather forecast service

## Installation

```javascript
	npm install weather-ireland-js
```

## How to Use

```javascript
const weatherAPI = require("weather-ireland-js");

// call pass a valid latitude and longitude parameter
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

//find current forecast
let obj = forecast.find(
  (o) =>
    DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours > 0 &&
    DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours <= 1
);
console.log("******_____********");
console.log("The current weather forecast is...");
console.log(obj);
console.log("******_____********");
```

## Test

```javascript
	npm run test
```

## Usage and Crediting Met Eireann in your app..

TBD
