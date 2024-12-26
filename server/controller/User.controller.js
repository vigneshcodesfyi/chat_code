const sendVerificationCode = require("../middleware/email/sendVerificationCode.js");
const { userModel, messageModel } = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== cpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    sendVerificationCode(email, verificationCode);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verificationcode: verificationCode,
      isVerified: false,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp || otp.length !== 6) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const user = await userModel.findOne({ verificationcode: otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.verificationcode = null;
    user.token = jwt.sign({ id: user._id, email: user.email }, "secretkey");
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.token = jwt.sign({ id: user._id, email: user.email }, "secretkey", {
      expiresIn: "1h",
    });
    user.isOnline = true;
    await user.save();

    res.cookie("jwt", user.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    console.log(user.token);
    return res
      .status(200)
      .json({ message: "Login successful", token: user.token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout User
const logout = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (user) {
      user.isOnline = false;
      user.token = null;
      res.clearCookie("jwt", { httpOnly: true });
      await user.save();
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Fetch All Users Except Current User
const getAllUser = async (req, res) => {
  const currentUserId = req.user.id;
  console.log(currentUserId);
  try {
    const users = await userModel.find({ _id: { $ne: currentUserId } }, "name");
    const user = await userModel.find({ _id: currentUserId });
    console.log(user[0].name);
    console.log(user[0]._id);
    const name = user[0].name;
    const userid = currentUserId;

    console.log(name);
    res.status(200).json({ users, name, userid });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,

  logout,
  getAllUser,
};
