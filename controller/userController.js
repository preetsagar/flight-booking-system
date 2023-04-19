const User = require("../Model/UserModel");
const AppError = require("../Utils/AppError");

exports.getAllUsers = (req, res, next) => {
  res.status(200).json({
    status: "Success",
    message: "Heyyyy",
  });
};
