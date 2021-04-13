
module.exports = () => {
  global.users = {};
  clientIdToSocketId = {}

  io.on("connection", (socket) => {
    global.socket = socket;

    socket.on("login", (userdata) => {
      users[userdata.id] = { socketId: socket.id, name: userdata.firstName };
      clientIdToSocketId[socket.id] = userdata.id
      io.sockets.emit("allUsers", users);
    });

    io.sockets.emit("allUsers", users);

    socket.on("disconnect", () => {
      delete users[clientIdToSocketId[socket.id]];
      delete clientIdToSocketId[socket.id];
      io.sockets.emit("allUsers", users);
    });

    socket.on("logout", () => {
      delete users[clientIdToSocketId[socket.id]];
      delete clientIdToSocketId[socket.id];
      io.sockets.emit("allUsers", users);
    });

    socket.on("callUser", (data) => {
      const callToUser = users[data.userToCall];
      io.to(callToUser.socketId).emit("callInit", {
        signal: data.signalData,
        to: data.fromUser,
      });
    });

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};
