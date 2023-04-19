class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message || "Not Passed Error Message in AppError";
    this.statusCode = statusCode || 500;
  }
}

module.exports = AppError;
