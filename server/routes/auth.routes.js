const express = require("express");
const router = express.Router();
const {
  register,
  status,
  verifyOTP,
  login,
  getgroup,
  getAllUser,
  logout,
} = require("../controller/User.controller.js");
const authendication = require("../middleware/auth.middleware.js");
const { messageModel, groupModel } = require("../models/userModel.js");
router.post("/user/register", register);
router.post("/user/verifyOTP", verifyOTP);
router.post("/user/login", login);
router.get("/user/status", status);

router.get("/user/getAllUser", authendication, getAllUser);
router.get("/user/getgroup", getgroup);

router.post("/user/logout", authendication, logout);

router.get(
  "/user/messages/:receiverID/:senderID",
  authendication,
  async (req, res) => {
    const { senderID, receiverID } = req.params;
    try {
      const messages = await messageModel
        .find({
          $or: [
            { senderID, receiverID },
            { senderID: receiverID, receiverID: senderID },
          ],
        })
        .sort({ timestamp: 1 }); // Ensure messages are sorted by timestamp (oldest first)

      res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);
router.post("/messages/send", async (req, res) => {
  const { senderID, receiverID, messageContent } = req.body;
  if (!senderID || !receiverID || !messageContent) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = new messageModel({
      senderID,
      receiverID,
      messageContent,
    });

    const savedMessage = await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", savedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

router.post("/group/create", async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Name and members are required." });
    }

    const newGroup = new groupModel({ name, members });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully.", group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating group." });
  }
});

module.exports = router;
