module.exports = (err, req, res, next) => {
  //   console.log(err);
  res.status(err.statusCode).json({
    status: "Fail",
    Data: err.message,
  });
};
