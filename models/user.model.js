const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [
      {
        validator: validator.isEmail,
        message: "Please provide a valid Email",
      },
      {
        validator: function (value) {
          return value.endsWith("@deu.ac.kr");
        },
        message: "only dongeui mail is required",
      },
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["admin", "author", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  language: {
    type: String,
    default: "en",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User =mongoose.model("User",UserSchema)


module.exports=User