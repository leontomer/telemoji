
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");

const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = { name: '' };
  }
  socket.on('new username', (userdata) => {
    users[socket.id] = { name: userdata }
    io.sockets.emit("allUsers", users);
  })

  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.sockets.emit("allUsers", users);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("server is running on port 5000"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}