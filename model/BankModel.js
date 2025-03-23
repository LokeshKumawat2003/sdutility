const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
    trim: true,
  },
  timeIn: {
    type: String,
    required: true,
    trim: true,
  },
  timeOut: {
    type: String,
    trim: true,
    default: "",
  },
  date: {
    type: String,
    required: true,
    default: "",
  },
  userID: {
    type: String,
    required: true,
  },
   adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
});

const BankModel = mongoose.model("Bank", bankSchema);

module.exports = BankModel;
