const assert = require("assert");
const weatherAPI = require("../index.js");
const fs = require("fs");
const path = require("path");

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
      forecast.length > 0,
      true,
      "multiple forecast items should be returned in the array"
    );
  });
});
