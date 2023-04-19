const express = require("express");
const morgan = require("morgan");
const userRoute = require("./route/userRoute");
const globalErrorController = require("./controller/globalErrorController");

const app = express();

// To print the request in the console
app.use(morgan("dev"));
// add the body to the request body
app.use(express.json());

app.use("/api/users", userRoute);

// Handling Global ERROR
app.use(globalErrorController);

module.exports = app;
