const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateCsrfToken } = require("../config/csrf.config");
const session = require("express-session");
const Post = require("../models/post.model");
dotenv.config();

exports.profile = async (req, res) => {
  res.json({ data: req.token });
};
exports.allUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(200).json({ message: "No user" });
    }
    res
      .status(200)
      .json({ message: "users fetched successfully", data: users });
  } catch (error) {}
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, role } = req.token;

    if (id !== userId) {
      return res.status(401).json("sorry. unauthorized");
    }
    if (role === "admin") {
      const adminCount = await User.find({ role: "admin" }).countDocuments();
      if (adminCount < 2) {
        return res.status(403).json({
          message:
            "sorry you can't delete your profile. please assign your admin role to another person ",
        });
      }
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json("user not found");
    }

    await Post.deleteMany({ author: user._id });

    if (req.session) {
      return req.session.destroy((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "failed to destroy the session" });
        }

        return res.status(200).json({
          message:
            "user deleted successfully and post related to this is deleted",
        });
      });
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignRoleForm = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ csrfToken: generateCsrfToken(req, res) });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error in assignroleform ${error.message}` });
  }
};
exports.assignRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role, status } = req.body;
    const allowedRole = ["admin", "user", "author"];
    const allowedStatus = ["active", "blocked"];

    if (role && !allowedRole.includes(role)) {
      return res.status(400).json({ message: "invalid role" });
    }

    if (status && !allowedStatus.includes(status)) {
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
