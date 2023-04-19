const express = require("express");
const authController = require("./../controller/authController");
const flightController = require("./../controller/flightController");

const route = express.Router();

route
  .post("/", authController.checkLogin, authController.checkAdmin, flightController.addFlight)
  .delete("/", authController.checkLogin, authController.checkAdmin, flightController.removeFlight)
  .post("/search", authController.checkLogin, flightController.searchFlights);
//   .post("/book", authController.checkLogin, flightController.bookFlight);

module.exports = route;
