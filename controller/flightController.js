const Booking = require("../Model/BookingModel");
const Flight = require("../Model/Flightodel");
const AppError = require("../Utils/AppError");

exports.addFlight = async (req, res, next) => {
  try {
    const token = req.body.token;
    const body = {
      flightNumber: req.body.flightNumber,
      from: req.body.from,
      to: req.body.to,
      departureTime: req.body.departureTime,
      arrivalTime: req.body.arrivalTime,
      price: req.body.price,
      airLine: req.body.airline,
      duration: req.body.duration,
      day: req.body.day,
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

exports.searchFlights = async (req, res, next) => {
  try {
    // console.log(req.query);
    const { date, time, from, to } = req.query;
    const searchDate = new Date(`${date}T${time}`);
    searchDate.setHours(searchDate.getHours() + 5);
    searchDate.setMinutes(searchDate.getMinutes() + 30);

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);

    // CHeck weather date belongs to future or not
    const dateDiff = currentDate.getTime() - searchDate.getTime();
    if (dateDiff > 0) {
      console.log("Current Date is Greater");
      return res.status(400).json({
        status: "Fail",
        data: "Date Can't be past",
      });
    }

    // const flights = await Flight.find({ departureTime: { $gte: time }, day: 0 }).select("-day");
    const day = `day.${searchDate.getDay()}`;
    const flights = await Flight.find({
      departureTime: { $gte: time },
      day: {
        $elemMatch: {
          [searchDate.getDate()]: { $gt: 0 },
        },
      },
      from,
      to,
    }).select("-seatsAvailable");

    const flightResult = flights.map((ele) => {
      ele.availableSeats = ele.day[searchDate.getDate() - 1][searchDate.getDate()];
      ele.day = ele.day.slice(searchDate.getDate() - 1);
      return ele;
    });

    res.status(200).json({
      status: "Success",
      result: flights.length,
      data: flightResult,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.bookFlight = async (req, res, next) => {
  try {
    const { flightNumber, Date, noOfSeats } = req.body;
    const flight = await Flight.findOne({ flightNumber });
    availableSeats = flight.day[Date - 1][Date];

    // check seats availability
    if (availableSeats < noOfSeats) {
      return res.status(400).json({
        status: "Fail",
        data: `${noOfSeats} seats is on available on the particular Day`,
      });
    } else {
      var bookingDetails = await Booking.create({ user: req.user._id, flight: flight._id, date: Date, noOfSeats });
      const val = `day.${Date - 1}`;
      const data = await Flight.findOneAndUpdate(
        { flightNumber },
        { $set: { [val]: { [Date]: availableSeats - noOfSeats } } },
        { new: true, runValidators: true }
      );
      //   console.log(data);
    }
    res.status(200).json({
      status: "Success",
      data: bookingDetails,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.myBooking = async (req, res, next) => {
  try {
    const myBookings = await Booking.find({ user: req.user._id });
    res.status(200).json({
      status: "Success",
      result: myBookings.length,
      data: myBookings,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
