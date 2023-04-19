const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, "Flight Number is required"],
    unique: [true, "Flight Name must be unique"],
  },
  airLine: {
    type: String,
  },
  from: {
    type: String,
    required: [true, "Starting Point is required"],
  },
  to: {
    type: String,
    required: [true, "Destination is required"],
  },
  departureTime: {
    type: String,
    required: [true, "Daparture Time is required"],
  },
  arrivalTime: {
    type: String,
    required: [true, "Arrival Time is required"],
  },
  seatsAvailable: {
    type: Number,
    default: 60,
  },
  price: {
    type: Number,
    required: [true, "Price Must be Present"],
  },
  duration: {
    type: Number,
  },
  day: {
    type: Array,
  },
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
