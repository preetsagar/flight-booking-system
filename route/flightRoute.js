const express = require("express");
const authController = require("./../controller/authController");
const flightController = require("./../controller/flightController");

const route = express.Router();

route.post("/", flightController.addFlight).delete("/", flightController.removeFlight);

module.exports = route;
