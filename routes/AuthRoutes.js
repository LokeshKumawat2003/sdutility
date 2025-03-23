const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");
const authenticateUser = require("../middleware/authenticateUser");
require("dotenv").config();
const AuthRoute = express.Router();
AuthRoute.post("/signup", authenticateUser, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      adminId: req.user.id,
    });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
AuthRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, name: user.name ,adminId:user.adminId},
      process.env.TOKEN,
      {
        expiresIn: "24h",
      }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
AuthRoute.get("/user", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
AuthRoute.get("/userAll", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
AuthRoute.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
module.exports = AuthRoute;
