const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./db.js");
const authRoutes = require("./routes/auth.routes.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();
dbConnect();

const app = express();
const httpServer = createServer(app); // Create an HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // React app URL
    credentials: true,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    httpOnly: true,
    origin: "http://localhost:5173", // React app URL
    credentials: true,
  })
);

app.use("/auth", authRoutes); // Auth routes for user authentication

// This map will store the socket ids for each user
const userSocketMap = {}; // Store socket.id by user ID

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register a user by storing their socket ID
  socket.on("register", (userID) => {
    userSocketMap[userID] = socket.id; // Map userID to socket id
    console.log(`User ${userID} connected with socket id: ${socket.id}`);
  });
  socket.setMaxListeners(0);
  // Handle sending messages
  const userSocketMap = {}; // Store socket IDs keyed by user IDs

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Assume userID is passed during connection (you can customize based on your authentication)
    socket.on("join", (userID) => {
      userSocketMap[userID] = socket.id; // Add user to the map
      console.log(`User ${userID} joined with socket ID ${socket.id}`);
    });

    // Handle message sending
    socket.on("send_message", (data) => {
      console.log("Message received:", data);

      const recipientSocketId = userSocketMap[data.receiverID]; // Get the recipient's socket ID

      if (recipientSocketId) {
        // Emit to the recipient's socket
        socket.to(recipientSocketId).emit("receive_message", data);
        console.log(`Message sent to user ${data.receiverID}`);
      } else {
        console.log(`Recipient with ID ${data.receiverID} not connected`);
      }
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      // Remove user from the map when they disconnect
      for (const userID in userSocketMap) {
        if (userSocketMap[userID] === socket.id) {
          delete userSocketMap[userID];
          console.log(`User ${userID} disconnected`);
          break;
        }
      }
    });
  });
});

// Start the server
httpServer.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
