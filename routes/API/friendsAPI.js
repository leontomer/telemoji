const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Call = require('../../models/Call');
const CallStats = require('../../models/CallStats');

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
    if (friend.friendRequests.includes(user._id)) {
      return res.json({ friend });
    }
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
    const updatedFriendRequests = user.friendRequests.filter(
      (f) => f.toString() !== friend._id.toString()
    );
    user.friendRequests = updatedFriendRequests;

    await user.save();
    res.status(200).json({});
  } catch (e) { }
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

router.post("/callHistory", auth, async (req, res) => {
  try {
    const userID = req.user.id;
    const { userToCall } = req.body;
    const friend = await User.findById(userToCall)
    const user = await User.findById(userID)

    const usersCall = new Call({
      callerName: friend.firstName + " " + friend.lastName,
      callerImage: friend.imageAddress
    })
    const friendsCall = new Call({
      callerName: user.firstName + " " + user.lastName,
      callerImage: user.imageAddress
    })

    await usersCall.save();
    await friendsCall.save();

    user.callHistory.push(
      usersCall._id
    );
    friend.callHistory.push(
      friendsCall._id
    );

    await friend.save();
    await user.save();
    res.json({ callHistory: user.callHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.get("/callHistory", auth, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).populate({
      path: "callHistory",
      model: "call",
    }).select("-password");

    res.json({ callHistory: user.callHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/call-stats", auth, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID)
    const recentCallId = user.callHistory[user.callHistory.length - 1]
    const recentCall = await Call.findById(recentCallId);
    const { happy, sad, disgust, neutral, suprise, angry, fear } = req.body.emotionStats
    const newCallStats = new CallStats({
      happy, sad, disgust, neutral, suprise, angry, fear, startCall: recentCall.date
    })
    await newCallStats.save();
    recentCall.callStats = newCallStats._id;
    await recentCall.save();
  } catch (error) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
})

router.get("/call-stats/:callId", auth, async (req, res) => {
  try {
    const { callId } = req.params
    const callHistory = await Call.findById(callId);
    if (!callHistory.callStats) {
      return res.status(200).json({});
    }
    const callHistoryStats = await CallStats.findById(callHistory.callStats)
    res.status(200).json(callHistoryStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
})

module.exports = router;
