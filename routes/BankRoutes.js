const express = require("express");
const BankModel = require("../model/BankModel");
const authenticateUser = require("../middleware/authenticateUser");
const BankRoute = express.Router();

BankRoute.get("/banks", authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;

    // console.log(userID);
    if (!userID) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    // console.log(userID);
    // console.log(userID);
    const banks = await BankModel.find({ userID: userID });
    // console.log(banks);

    if (!banks.length) {
      return res.status(404).json({ message: "No banks found for this user" });
    }

    res.status(200).json(banks);
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BankRoute.get("/banks/all", authenticateUser,async (req, res) => {
  const id =req.user.id
  console.log(id)
  try {
    const banks = await BankModel.find({adminId:id});
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
BankRoute.post("/banks", authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const { name } = req.user;
    const { date } = req.body;
    const adminId = req.user.adminId;
    console.log(adminId);
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }
    const existingBank = await BankModel.findOne({ userID, date });

    if (existingBank) {
      return res
        .status(409)
        .json({ error: "A bank record for this date already exists" });
    }

    const bankData = { ...req.body, name, userID, adminId };
    const bank = new BankModel(bankData);
    await bank.save();

    res.status(201).json(bank);
  } catch (error) {
    console.error("Error creating bank:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BankRoute.put("/banks/:id", authenticateUser, async (req, res) => {
  try {
    const updatedBank = await BankModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // console.log(updatedBank);

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.status(200).json(updatedBank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = BankRoute;
