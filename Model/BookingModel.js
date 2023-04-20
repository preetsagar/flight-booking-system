const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  flightNumber: {
    type: String,
  },
  date: {
    type: String,
  },
  noOfSeats: {
    type: Number,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
