const dbHelper = require("./server/utils/dbHelper");
module.exports = () => {
  global.users = {};

  io.on("connection", (socket) => {
    global.socket = socket;

    socket.on("login", (userdata) => {
      users[userdata.id] = { socketId: socket.id, name: userdata.firstName };
      io.sockets.emit("allUsers", users);
    });

    io.sockets.emit("allUsers", users);

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.sockets.emit("allUsers", users);
    });

    socket.on("logout", () => {
      delete users[socket.id];
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

    socket.on("addFriend", (data) => {
      console.log(data);
      const FriendId = dbHelper.convertEmailToId(data.userFriendEmail);
      if (users[FriendId]) {
        const userToAdd = users[FriendId];
        io.to(userToAdd.socketId).emit("friendRequestReceived", {
          from: data.userId,
        });
      }
    });
  });
};
