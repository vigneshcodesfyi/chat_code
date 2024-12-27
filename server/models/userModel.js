const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  verificationcode: String,
  isVerified: String,
  isOnline: Boolean,
  token: String,
  profileImage: String,
  ForgetToken: String,
  createdAt: Date,
  updatedAt: Date,
});

const messageSchema = new mongoose.Schema({
  senderID: String,
  receiverID: String,
  timestamp: String,
  messageContent: String,
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const groupModel = mongoose.model("Group", groupSchema);

const userModel = mongoose.model("User", userSchema);
const messageModel = mongoose.model("Message", messageSchema);

module.exports = { userModel, messageModel, groupModel };
