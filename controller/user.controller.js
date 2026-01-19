const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateCsrfToken } = require("../config/csrf.config");
dotenv.config();




exports.profile = async (req, res) => {
  res.json("this is profile page");
};

exports.assignRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role, status } = req.body;
    const allowedRole = ["admin", "user", "writer"];
    const allowedStatus = ["active", "blocked"];

    if (!role || !allowedRole.includes(role)) {
      return res.status(400).json({ message: "invalid role" });
    }

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "invalid status" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "uer not found" });
    }
    user.role = role;
    user.status = status;
    await user.save();
    res
      .status(200)
      .json({ message: "role changed successfully", data: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
