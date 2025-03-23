const express = require("express");
const MessageModel = require("../model/RepostModel");
const authenticateUser = require("../middleware/authenticateUser");

const MessageRoute = express.Router();

MessageRoute.post("/message", authenticateUser, async (req, res) => {
  const adminId = req.user.adminId;
  console.log(adminId);
  try {
    const { title, message, emailUser } = req.body;
    if (!title || !message || !emailUser) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newMessage = new MessageModel({ title, message, emailUser, adminId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

MessageRoute.get("/message", authenticateUser, async (req, res) => {
  const id = req.user.id;
  console.log(id);
  try {
    const messages = await MessageModel.find({ adminId: id });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
MessageRoute.delete("/message/:id", async (req, res) => {
  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = MessageRoute;
