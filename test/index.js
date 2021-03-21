const assert = require("assert");
const weatherAPI = require("../index.js");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

describe("getForecast", function () {
  it("should return a array of weather forecasts when passed valid latitude and longitude points", async function () {
    var forecast = await weatherAPI.getForecast(54.7210798611, -8.7237392806);
    assert.equal(
      forecast.length > 0,
      true,
      "multiple forecast items should be returned in the array"
    );
  });
});

describe("getForecast", function () {
  it("should return the current forecast for bishopstown", async function () {
    var forecast = await weatherAPI.getForecast(51.878, -8.5326); //bishopstown
    // var forecast = await weatherAPI.getForecast(54.2766, -8.4761); //sligo
    //var forecast = await weatherAPI.getForecast(52.3558, -7.6903); //clonmel

    var now = DateTime.local();

    let obj = forecast.find(
      (o) =>
        DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours > 0 &&
        DateTime.fromISO(o.to).diff(now, ["hours"]).toObject().hours <= 1
    );
    console.log("******_____********");
    console.log("Current weather forecast is...");
    console.log(obj);
    console.log("******_____********");

    assert.equal(obj != null, true, "forecast is returned");
  });
});

describe("convertToDate", function () {
  it("should convert the forecast API date formated string to a valid date that can be compare for equality", async function () {
    var stringDate = "2021-03-20T08:00:00Z";
    var date1 = weatherAPI.convertToDate(stringDate);
    var date2 = weatherAPI.convertToDate(stringDate);

    assert.equal(date1 == date2, true, "dates are same");
  });
});

describe("convertXMLResponse", function () {
  it("should return a array of weather forecasts when passed a valid a sample xml response", async function () {
    const data = fs.readFileSync(
      path.resolve(__dirname, "../test/sample-response.xml"),
      {
        encoding: "utf8",
        flag: "r",
      }
    );
    var forecast = weatherAPI.convertXMLResponse(data);

    assert.equal(
      forecast.length == 107,
      true,
      "there should be 107 weather forecsast readings"
    );

    var targetDate = weatherAPI.convertToDate("2021-03-20T08:00:00Z");

    let obj = forecast.find((o) => o.to == targetDate);

    assert.equal(obj.rain_mm, "0.0", "verifying rainfall mm result");
    assert.equal(obj.pressure, "1036.8", "verifying pressure result");
    assert.equal(obj.cloudiness_percentage, "99.9", "verifying cloudiness");
    assert.equal(obj.windSpeed_mps, "1.9", "verifying wind speed");
    assert.equal(obj.weatherSymbol_number, "4", "verifying weather symbol");
    assert.equal(
      obj.weatherSymbol_descriptionID,
      "Cloud",
      "verifying weatherSymbol_descriptionID"
    );

    /*           
            <time datatype="forecast" from="2021-03-20T08:00:00Z" to="2021-03-20T08:00:00Z">
            <location altitude="9" latitude="54.7211" longitude="-8.7237">
              <temperature id="TTT" unit="celsius" value="7.6"/>
              <windDirection id="dd" deg="316.4" name="NW"/>
              <windSpeed id="ff" mps="1.9" beaufort="2" name="Svak vind"/>
              <globalRadiation value="12.7" unit="W/m^2"/>
              <humidity value="98.7" unit="percent"/>
              <pressure id="pr" unit="hPa" value="1036.8"/>
              <cloudiness id="NN" percent="99.9"/>
              <lowClouds id="LOW" percent="99.9"/>
              <mediumClouds id="MEDIUM" percent="0.0"/>
              <highClouds id="HIGH" percent="8.9"/>
              <dewpointTemperature id="TD" unit="celsius" value="7.4"/>
            </location>
        </time>
        <time datatype="forecast" from="2021-03-20T07:00:00Z" to="2021-03-20T08:00:00Z">
            <location altitude="9" latitude="54.7211" longitude="-8.7237">
              <precipitation unit="mm" value="0.0" minvalue="0.0" maxvalue="0.0" probability="0.0"/>
        <symbol id="Cloud" number="4"/>
            </location>
        </time> */
  });
});
