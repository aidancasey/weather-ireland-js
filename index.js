const axios = require("axios").default;
const convert = require("xml-js");

function buildAPIRequestURL(lat, long) {
  var url =
    "http://metwdb-openaccess.ichec.ie/metno-wdb2ts/locationforecast?lat=" +
    lat +
    ";long=" +
    long;
  return url;
}

function convertXMLResponse(xml) {
  const data = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 2 }));
  var readings = [];
  data.weatherdata.product.time.forEach(function (item) {
    var forecast = {};
    forecast.from = item._attributes.from;
    forecast.to = item._attributes.to;

    //Temperature:
    //The air temperature 2m above the ground is given in degrees Celsius.
    if (item.location.temperature != null) {
      forecast.temperature = item.location.temperature._attributes.value;
    }
    //Wind Direction and speed:
    //The direction of the wind is given in degrees from 0 to 360. The cardinal direction is also given i.e. southwest SW.
    if (item.location.windDirection != null) {
      forecast.windDirectionName = item.location.windDirection._attributes.name;
      forecast.windDirectionDegree =
        item.location.windDirection._attributes.degree;
    }

    if (item.location.windSpeed != null) {
      forecast.windSpeed = item.location.windSpeed._attributes.mps;
    }
    //Pressure:
    //Pressure is given in units of hPa.
    if (item.location.pressure != null) {
      forecast.pressure = item.location.pressure._attributes.value;
    }
    //Cloud:
    //There is a general level of cloudiness called NN, with a maximum of 100. Then there are three types of cloud cover, Low, Medium and High; again they will have a maximum of 100. See here for further details. https://cloudatlas.wmo.int/clouds-definitions.html

    // console.log(JSON.stringify(forecast));
    readings.push(forecast);
  });
  return readings;
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
