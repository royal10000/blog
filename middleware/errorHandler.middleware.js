const mongoose = require("mongoose");
const multer = require("multer");

const ErrorHandler = (err, req, res, next) => {
  console.log(err);
  // Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      message: `${field} must be unique`,
    });
  }

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  // CSRF error
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  // Default (do NOT leak internal messages)
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = ErrorHandler;
