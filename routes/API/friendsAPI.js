const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require("../../models/User");



router.post("/addfriend", auth, async (req, res) => {
    try {
        const userID = req.user.id
        const { friendReuqestID } = req.body;
        const friend = await User.findById(friendReuqestID).select(
            "-password"
        );
        const user = await User.findById(userID).select("-password");

        friend.friendRequests.push(user._id);
        console.log(user);
        await friend.save();
        console.log(friend);
        if (users[friend._id]) {
            const userToUpdate = users[friend._id];
            io.to(userToUpdate.socketId).emit("recieveFriendRequest", {
                requestFrom: user
            });
        }
        res.json({ friend });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: err.message }] });
    }
});

router.post("/removeFriend", auth, async (req, res) => {
    try {
        const { userId, userFriendId } = req.body;
        const friend = await User.findById(userFriendId).select("-password");
        const user = await User.findById(userId).select("-password");

        user.friendList = user.friendList.filter((friend) => {
            console.log(friend, userFriendId);
            return friend.toString() !== userFriendId.toString();
        });
        console.log(user.friendList);
        friend.friendList = friend.friendList.filter(
            (friend) => friend.toString() !== userId.toString()
        );

        await friend.save();
        await user.save();

        res.json({ user });
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
        const { userEmail, userFriendEmail } = req.body;
        const friend = await User.findOne({ email: userFriendEmail }).select(
            "-password"
        );
        const user = await User.findOne({ email: userEmail }).select("-password");

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
    } catch (e) {
        console.error(e);
    }
});
router.post("/rejectFriend", auth, async (req, res) => {
    try {
        const { userEmail, userFriendEmail } = req.body;
        const friend = await User.findOne({ email: userFriendEmail }).select(
            "-password"
        );
        const user = await User.findOne({ email: userEmail }).select("-password");

        const updatedFriendRequests = user.friendRequests.filter(
            (f) => f.toString() !== friend._id.toString()
        );
        user.friendRequests = updatedFriendRequests;

        await user.save();
    } catch (e) { }
});

router.get("/friendList", auth, async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email })
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

router.post("/about", auth, async (req, res) => {
    try {
        const { id, about } = req.body;

        const user = await User.findById(id);

        user.about = about;
        await user.save();

        res.json("ok");
    } catch (error) { }
});

router.post("/image", async (req, res) => {
    try {
        const { id, imgAdrss } = req.body;

        const user = await User.findById(id);

        user.imageAddress = imgAdrss;
        await user.save();

        res.json("ok");
    } catch (error) { }
});

module.exports = router;