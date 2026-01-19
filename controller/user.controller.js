const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateCsrfToken } = require("../config/csrf.config");
const session = require("express-session");
dotenv.config();

exports.profile = async (req, res) => {
  res.json("this is profile page");
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.token.userId;

    if (id !== userId) {
      return res.status(401).json("sorry. unauthorized");
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json("user not found");
    }
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "failed to destroy the session" });
        }

        return res.status(200).json({ message: "user deleted successfully" });
      });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
