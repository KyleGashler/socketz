const express = require("express");
const app = express();
const http = require("http");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const serverState = {
  sessionId: {
    user1: "",
    user2: "",
    messages: {
      from: "",
      content: "",
    },
  },
};

app.get("/", (req, res) => {
  // sessionId = req.cookies('sessionId');
  // userName = req.cookies('userName');

  // if (!userName) {
  //     const newUser = Math.random(); //actually would have been the user's id from the admin service
  //     console.log('setting cookie');
  //     res.cookie('userName', newUser);
  // }

  // if (!sessionId) {
  //     const sessionId = Math.random(); //actually would have been the user's id from the admin service
  //     if (serverState[sessionId].user1) {
  //         serverState[sessionId].user2 = userName;
  //         throw new Error('OVERLOADED USERS FOR A SESSION');
  //     } else {
  //         serverState[sessionId].user1 = userName;
  //     }
  // }

  // res.cookie('name', 'express').send('cookie set'); //Sets name = express
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    io.emit("message", msg);
    console.log("message: " + msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Send a post to our admin "load balancer" service that the session has concluded
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
