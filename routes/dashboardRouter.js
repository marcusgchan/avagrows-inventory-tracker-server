const axios = require("axios");
const dashboardRouter = require("express").Router();
const authenticate = require("../authenticate");

let WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=49.2608724&lon=-123.113952&appid=d81dc0a224128db1f3e4801161d1a725";

dashboardRouter.get("/", authenticate, (req, res) => {
  axios
    .get(WEATHER_URL)
    .then((result) => {
      res.send(result.data);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

module.exports = dashboardRouter;
