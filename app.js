const express = require("express");
const morgan = require("morgan");
const userRoute = require("./route/userRoute");
const globalErrorController = require("./controller/globalErrorController");
const flightRoute = require("./route/flightRoute");

const app = express();

// To print the request in the console
app.use(morgan("dev"));
// add the body to the request body
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
});

app.use("/api/users", userRoute);
app.use("/api/flights", flightRoute);
app.use("/*", (req, res, next) => {
  res.status(400).json({
    staus: "Fail",
    data: "No route matched",
  });
});

// Handling Global ERROR
app.use(globalErrorController);

module.exports = app;
