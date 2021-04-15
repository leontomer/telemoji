const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");

const updateClientFriendList = (clientIdToUpdate) => {
  if (users[clientIdToUpdate]) {
    const userToUpdate = users[clientIdToUpdate];
    io.to(userToUpdate.socketId).emit("friendListUpdate");
  }
};

const updateClientFriendRequestList = (clientIdToUpdate) => {
  if (users[clientIdToUpdate]) {
    const userToUpdate = users[clientIdToUpdate];
    io.to(userToUpdate.socketId).emit("friendRequestListUpdate");
  }
};

router.post("/addfriend", auth, async (req, res) => {
  try {
    const userID = req.user.id;
    const { friendReuqestID } = req.body;
    const friend = await User.findById(friendReuqestID).select("-password");
    const user = await User.findById(userID).select("-password");

    friend.friendRequests.push(user._id);
    await friend.save();
    updateClientFriendRequestList(friend._id);
    res.json({ friend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/removeFriend", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { userFriendId } = req.body;
    const friend = await User.findById(userFriendId).select("-password");
    const user = await User.findById(userId).select("-password");

    user.friendList = user.friendList.filter((friend) => {
      return friend.toString() !== userFriendId.toString();
    });
    friend.friendList = friend.friendList.filter(
      (friend) => friend.toString() !== userId.toString()
    );

    await friend.save();
    await user.save();
    updateClientFriendList(friend._id);
    res.status(200).json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.get("/pendingFriendRequests", auth, async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email })
      .select("-password")
      .populate("friendRequests");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/approveFriend", auth, async (req, res) => {
  try {
    const { userFriendEmail } = req.body;
    const friend = await User.findOne({ email: userFriendEmail }).select(
      "-password"
    );
    const user = await User.findById(req.user.id).select("-password");

    const updatedFriendRequests = user.friendRequests.filter((f) => {
      return f.toString() !== friend._id.toString();
    });

    user.friendRequests = updatedFriendRequests;

    if (friend.friendList.indexOf(user._id) < 0) {
      friend.friendList.push(user._id);
      await friend.save();
    }

    if (user.friendList.indexOf(friend._id) < 0) {
      await user.friendList.push(friend._id);
    }

    await user.save();
    updateClientFriendList(friend._id);
    updateClientFriendList(user._id);
    res.status(200).json({});
  } catch (e) {
    console.error(e);
  }
});
router.post("/rejectFriend", auth, async (req, res) => {
  try {
    const { userFriendEmail } = req.body;
    const friend = await User.findOne({ email: userFriendEmail }).select(
      "-password"
    );
    const user = await User.findById(req.user.id).select("-password");
    console.log("user.friendRequests", user.friendRequests);
    const updatedFriendRequests = user.friendRequests.filter(
      (f) => f.toString() !== friend._id.toString()
    );
    console.log("updatedFriendRequests", updatedFriendRequests);
    user.friendRequests = updatedFriendRequests;
    console.log("user.friendRequests", user.friendRequests);

    await user.save();
    res.status(200).json({});
  } catch (e) {}
});

router.get("/friendList", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("friendList");

    res.json({ friendList: user.friendList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.get("/allUsers", auth, async (req, res) => {
  try {
    const users = await User.find({}).select("-passwords");
    res.json({ users });
  } catch {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

module.exports = router;
