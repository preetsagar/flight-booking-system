const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Configured the .env file
dotenv.config();

// Connect with the DataBase
const uri = process.env.DATABASE;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected With The DataBASE");

    //   After Connecting with the database now start listening
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting with the database", err);
  });
