const User = require("../Model/UserModel");
const AppError = require("../Utils/AppError");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

exports.signUp = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const user = await User.create(data);
    const token = await JWT.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.password = undefined;
    res.status(201).json({
      status: "Success",
      data: user,
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
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }

    // Check Password Matches or not
    if (await bcrypt.compare(password, user.password)) {
      // Send the JWT TOKEN
      const token = await JWT.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      user.password = undefined;
      res.status(201).json({
        status: "Success",
        data: user,
        token,
      });
    } else {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please Provide Email And Password", 401));
    }

    // find User with the given Id
    const user = await User.findOne({ email }).select("+password +isAdmin");
    if (!user || !user.isAdmin) {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }

    // Check Password Matches or not
    if (await bcrypt.compare(password, user.password)) {
      // Send the JWT TOKEN
      const token = await JWT.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      user.password = undefined;
      res.status(201).json({
        status: "Success",
        data: user,
        token,
      });
    } else {
      return next(new AppError("Please Provide correct Email And Password", 401));
    }
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

exports.checkLogin = async (req, res, next) => {
  try {
    const token = req.body.token;
    // console.log(token);
    // Promisified the verify
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await User.findOne({ email: decoded.email }).select("+isAdmin");
    // console.log(user);
    if (!user) {
      throw "Please Login In";
    }
    // Add user to req body
    req.user = user;
    // Call the next middleware
    next();
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      Data: error.message,
    });
  }
};

exports.checkAdmin = async (req, res, next) => {
  try {
    // console.log(req.user);
    if (req.user.isAdmin) {
      return next();
    } else {
      throw "Please Log in As Admin";
    }
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      data: error.message || error,
    });
  }
};

exports.checkToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    return res.status(200).json({
      status: "Success",
      data: "Logged In",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
