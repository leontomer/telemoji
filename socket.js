
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
        from: data.fromUser,
        fromImageAddress: data.fromImageAddress,
        callerName: data.callerName
      });
    });

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on('endCallForUser', (data) => {
      const sendTo = users[data.id] ? users[data.id].socketId : data.id
      io.to(sendTo).emit("endCall");
    })
  });
};
