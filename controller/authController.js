const User = require("../Model/UserModel");
const AppError = require("../Utils/AppError");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const user = await User.create(data);
    const token = await JWT.sign(user.email, process.env.JWT_SECRET);
    res.status(201).json({
      status: "Success",
      data: "New user Created",
      token,
    });
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please Provide Email And Password", 401));
    }

    // find User with the given Id
    const user = await User.findOne().select("+password");
    if (!user) {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }

    // Check Password Matches or not
    if (await bcrypt.compare(password, user.password)) {
      // Send the JWT TOKEN
      const token = await JWT.sign(user.email, process.env.JWT_SECRET);
      res.status(201).json({
        status: "Success",
        data: "Logged In",
        token,
      });
    } else {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};
