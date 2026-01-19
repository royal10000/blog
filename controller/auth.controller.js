const dotenv=require("dotenv")
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateCsrfToken } = require("../config/csrf.config");
dotenv.config()
const jsonSecret=process.env.JWTSECRET



exports.loginForm = async (req, res) => {
  // res.json({message:"hello world"})
  res.status(200).json({ csrfToken: generateCsrfToken(req, res) });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "Email not found" });
  }
  if (user.status === "blocked") {
    return res
      .status(404)
      .json({ message: "sorry. This account has been blocked" });
  }
  // const hashedPassword = await bcrypt.hash(password, 10);
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res
      .status(404)
      .json({ message: "password don't match. Please Enter correct password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    jsonSecret,
    {
      expiresIn: "1h",
    },
  );
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "user is logged in", token: token });
};

exports.logOut = async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "logged out successfully" });
};

exports.signUpForm = async (req, res) => {
  res.json({ csrfToken: generateCsrfToken() });
};

exports.signUpUser = async (req, res) => {
  const { username, email, password } = req.body;
  const userCount = await User.countDocuments();
  const getUser = await User.findOne({ email });
  if (getUser) {
    res
      .status(400)
      .json({ message: "User is already exist. Please enter another gmail" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name: username,
    email,
    password: hashedPassword,
    role: userCount === 0 ? "admin" : "user",
  });

  await user.save();
  res.status(201).json({
    message: "user created successfully",
    role: user.role,
  });
};