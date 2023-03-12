const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const socket = require("socket.io");
require("dotenv").config();

const AuthRoute = require("./Routes/AuthRoute.js");
const UserRoute = require("./Routes/UserRoute.js");
const MessageRoute = require("./Routes/MessageRoute.js");
const ChatRoute = require("./Routes/ChatRoute.js");

//Routes

//Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const CONNECTION = process.env.MONGO_DB;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

//usage of routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://fsd-hey-chat-application-frontend.vercel.app",

    credentials: true,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //add new User
  socket.on("new-user-add", (newUserId) => {
    //if user in not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    io.emit("get-users", activeUsers);
  });

  //send message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  // Socket.on
});
