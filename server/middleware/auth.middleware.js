const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel.js");

const authentication = async (req, res, next) => {
  try {
    // Retrieve the JWT token from the cookies
    console.log("came into authentication");
    const token = req.cookies.jwt;

    if (!token) {
      console.warn("Authentication failed: Token not provided");
      console.log("failed");
      return res.status(401).json({
        status: "error",
        message: "Authorization token is missing. Please log in again.",
      });
    }

    // Verify the JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "secretkey");
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).json({
        status: "error",
        message: "Failed to verify token. Please provide a valid token.",
      });
    }

    // Check if the token contains valid user data
    const { id: userId } = decodedToken;
    if (!userId) {
      console.error("Invalid token payload: no user ID found");
      return res.status(400).json({
        status: "error",
        message: "Invalid token structure. User ID is missing.",
      });
    }

    // Fetch the user from the database using the decoded user ID
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({
        status: "error",
        message: "User not found with the provided token.",
      });
    }

    // Attach the user to the request object for further use
    req.user = user;
    console.log("process ahs been ended");
    // Proceed to the next middleware
    next();
    console.log("it called the nexrt fucntion");
  } catch (error) {
    console.error("Unexpected error during authentication:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during authentication.",
      error: error.message,
    });
  }
};

module.exports = authentication;
