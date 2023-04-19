const express = require("express");
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");

const route = express.Router();

route.get("/", userController.getAllUsers);
route.post("/signUp", authController.signUp);
route.post("/login", authController.login);

module.exports = route;
