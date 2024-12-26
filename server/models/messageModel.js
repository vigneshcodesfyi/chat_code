const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderID: String,
  receiverID: String,
  timestamp: String,
  messageContent: String,
});

const messageModel = new mongoose.model("Message", messageSchema);

module.exports = messageModel;
