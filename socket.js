module.exports = () => {

  const users = {};

  io.on("connection", (socket) => {
    global.socket = socket;
    if (!users[socket.id]) {
      users[socket.id] = { name: "", userId: "" };
    }
    socket.on("login", (userdata) => {
      users[socket.id] = { id: userdata._id, name: userdata.firstName };
      io.sockets.emit("allUsers", users);
    });

    socket.emit("yourID", socket.id);

    io.sockets.emit("allUsers", users);

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.sockets.emit("allUsers", users);
    });

    socket.on("logout", () => {
      delete users[socket.id];
      io.sockets.emit("allUsers", users);
    })

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
