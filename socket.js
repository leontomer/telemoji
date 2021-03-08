module.exports = (server) => {
  const socket = require("socket.io");
  const io = socket(server);

  const users = {};

  io.on("connection", (socket) => {
    if (!users[socket.id]) {
      users[socket.id] = { name: "" };
    }
    socket.on("new username", (userdata) => {
      users[socket.id] = { name: userdata };
      io.sockets.emit("allUsers", users);
    });

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
};
