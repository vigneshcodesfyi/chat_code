const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  getAllUser,
  logout,
} = require("../controller/User.controller.js");
const authendication = require("../middleware/auth.middleware.js");
const { messageModel } = require("../models/userModel.js");

router.post("/user/register", register);
router.post("/user/verifyOTP", verifyOTP);
router.post("/user/login", login);

router.get("/user/getAllUser", authendication, getAllUser);

router.post("/user/logout", authendication, logout);

router.get(
  "/user/messages/:receiverID:senderID",
  authendication,
  async (req, res) => {
    const { senderID, receiverID } = req.params;
    console.log(senderID, receiverID);
    console.log("came into server");
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
  console.log("came into message folder");
  const { senderID, receiverID, messageContent } = req.body;
  console.log(senderID, receiverID, messageContent);
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
module.exports = router;
