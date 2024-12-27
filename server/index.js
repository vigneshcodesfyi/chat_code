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

  socket.on("register", (userID) => {
    userSocketMap[userID] = socket.id;
    console.log(`User ${userID} connected with socket id: ${socket.id}`);
  });

  socket.on("status", (userID) => {
    userSocketMap[userID] = socket.id;
    console.log(userSocketMap[userID]);
    io.emit("statusUpdate", userID, true);

    console.log(`${userID} is online`);
  });

  socket.on("join", (userID) => {
    userSocketMap[userID] = socket.id; // Add user to the map
    console.log(`User ${userID} joined with socket ID ${socket.id}`);
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    const recipientSocketId = userSocketMap[data.receiverID];
    console.log(
      data.receiverID +
        "the data is sen to the receiver from the " +
        data.senderID
    );
    console.log(recipientSocketId);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("receive_message", data);

      console.log(`Message sent to user ${data.receiverID}`);
    } else {
      console.log(`Recipient with ID ${data.receiverID} not connected`);
    }
  });

  socket.on("disconnect", () => {
    for (const userID in userSocketMap) {
      if (userSocketMap[userID] === socket.id) {
        delete userSocketMap[userID];
        io.emit("statusUpdate", userID, false);

        console.log(`User ${userID} disconnected`);
        break;
      }
    }
  });
});

// Start the server
httpServer.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
