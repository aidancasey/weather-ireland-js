const axios = require("axios").default;
const convert = require("xml-js");
const { DateTime } = require("luxon");

function buildAPIRequestURL(lat, long) {
  var url =
    "http://metwdb-openaccess.ichec.ie/metno-wdb2ts/locationforecast?lat=" +
    lat +
    ";long=" +
    long;
  return url;
}

function convertToDate(stringDate) {
  stringDate = stringDate.replace("Z", ""); // xml format is like this 2021-03-20T08:00:00Z"
  stringDate = stringDate.replace("T", " ");
  var date = DateTime.fromFormat(stringDate, "yyyy-MM-dd HH:mm:ss");
  return date;
}

function convertXMLResponse(xml) {
  const data = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 2 }));
  var forecasts = [];
  var rainForecasts = [];
  data.weatherdata.product.time.forEach(function (item) {
    if (item.location.precipitation != null) {
      //precipitation forecast data
      var rainforecast = {};
      rainforecast.from = convertToDate(item._attributes.from);
      //console.log(rainforecast.from.toLocaleString(DateTime.DATETIME_MED));
      rainforecast.to = convertToDate(item._attributes.to);

      //if there is a max and min value lets  report the max value otherwise report the absolute value
      if (item.location.precipitation._attributes.maxvalue != 0) {
        rainforecast.rain_mm = item.location.precipitation._attributes.maxvalue;
      } else {
        rainforecast.rain_mm = item.location.precipitation._attributes.value;
      }
      //The weather symbol is derived from a combination of temperature, humidity, cloud cover, precipitation.
      rainforecast.weatherSymbol_descriptionID =
        item.location.symbol._attributes.id;
      rainforecast.weatherSymbol_number =
        item.location.symbol._attributes.number;
      rainForecasts.push(rainforecast);
    } else {
      //non precipitation forecast data
      var forecast = {};
      forecast.from = convertToDate(item._attributes.from);
      forecast.to = convertToDate(item._attributes.to);

      //Temperature:
      //The air temperature 2m above the ground is given in degrees Celsius.
      if (item.location.temperature != null) {
        forecast.temperature_celsius =
          item.location.temperature._attributes.value;
      }
      //Wind Direction and speed:
      //The direction of the wind is given in degrees from 0 to 360. The cardinal direction is also given i.e. southwest SW.
      if (item.location.windDirection != null) {
        forecast.windDirectionName =
          item.location.windDirection._attributes.name;
        forecast.windDirectionDegree_degrees =
          item.location.windDirection._attributes.degree;
      }

      if (item.location.windSpeed != null) {
        forecast.windSpeed_mps = item.location.windSpeed._attributes.mps;
      }
      //Pressure:
      //Pressure is given in units of hPa.
      if (item.location.pressure != null) {
        forecast.pressure = item.location.pressure._attributes.value;
      }
      //Cloud:
      //There is a general level of cloudiness called NN, with a maximum of 100. Then there are three types of cloud cover, Low, Medium and High; again they will have a maximum of 100. See here for further details. https://cloudatlas.wmo.int/clouds-definitions.html
      if (item.location.cloudiness != null) {
        forecast.cloudiness_percentage =
          item.location.cloudiness._attributes.percent;
      }
      // console.log(JSON.stringify(forecast));
      forecasts.push(forecast);
    }

    // merge all readings for same times in to a single result ( rain is seperate to the rest of the data in the XML response )
    rainForecasts.forEach(function (item) {
      let obj = forecasts.find((o) => o.to.toSeconds() == item.to.toSeconds());
      if (obj != null) {
        obj.rain_mm = item.rain_mm;
        obj.weatherSymbol_descriptionID = item.weatherSymbol_descriptionID;
        obj.weatherSymbol_number = item.weatherSymbol_number;
      }
    });
  });
  console.log(forecasts.length);
  return forecasts;
}

async function getForecast(latitude, longitude) {
  var url = buildAPIRequestURL(latitude, longitude);
  var readings = {};
  return axios
    .get(url)
    .then(function (response) {
      readings = convertXMLResponse(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
      console.log("done ski");
      return readings;
    });
}
module.exports.getForecast = getForecast;
module.exports.convertXMLResponse = convertXMLResponse;
module.exports.convertToDate = convertToDate;
