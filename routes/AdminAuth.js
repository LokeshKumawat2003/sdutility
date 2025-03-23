const express = require("express");
const AdminSignupModel = require("../model/AdminSignup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticateUser");
const UserModel = require("../model/UserModel");
require("dotenv").config();

const AdminAuthRoute = express.Router();

// Admin Signup
AdminAuthRoute.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await AdminSignupModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new AdminSignupModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

// Admin Login
AdminAuthRoute.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminSignupModel.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.TOKEN, { expiresIn: "24h" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

AdminAuthRoute.get("/admin/user", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.find({adminId:req.user.id});

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

AdminAuthRoute.get("/admin/userAll", authenticateUser, async (req, res) => {
  try {
    const users = await AdminSignupModel.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

// Delete an Admin User
AdminAuthRoute.delete("/admin/user/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await AdminSignupModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

module.exports = AdminAuthRoute;
