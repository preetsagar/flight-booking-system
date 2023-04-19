const Flight = require("../Model/Flightodel");
const AppError = require("../Utils/AppError");

exports.addFlight = async (req, res, next) => {
  try {
    const body = {
      flightNumber: req.body.flightNumber,
      from: req.body.from,
      to: req.body.to,
      departureTime: req.body.departureTime,
      arrivalTime: req.body.arrivalTime,
    };
    const flight = await Flight.create(body);
    res.status(201).json({
      status: "Success",
      data: flight,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.removeFlight = async (req, res, next) => {
  try {
    const flightNumber = req.body.flightNumber;
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      return next(new AppError("No flight Exists with this Flight Number", 400));
    }
    await Flight.findOneAndDelete({ flightNumber });
    res.status(204).json({
      status: "Success",
      data: "Successfully Deleted the Flight Details",
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
