const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").normalizeEmail().isEmail(),
    check(
      "password",
      "Password must be minimum 6 letters long, and no more then 20"
    ).isLength({ min: 8, max: 20 }),
    check("password", "Password must contain at least one letter").matches(
      /([a-zA-Z])+([ -~])*/
    ),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);

router.get("/finduser", async (req, res) => {
  const otherEmail = req.query.email;
  try {
    const otherUser = await User.findOne({ email: otherEmail }).select(
      "-password"
    );

    res.json({ other: otherUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/addfriend", async (req, res) => {
  try {
    console.log("friend req");
    const { userEmail, userFriendEmail } = req.body;
    const friend = await User.findOne({ email: userFriendEmail }).select(
      "-password"
    );
    const user = await User.findOne({ email: userEmail }).select("-password");

    friend.friendRequests.push(user._id);
    console.log(user);
    await friend.save();
    console.log(friend);
    res.json({ friend });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/removeFriend", async (req, res) => {
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

router.get("/pendingFriendRequests", async (req, res) => {
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

router.post("/approveFriend", async (req, res) => {
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
router.post("/rejectFriend", async (req, res) => {
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
  } catch (e) {}
});

router.get("/friendList", async (req, res) => {
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

router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find({}).select("-passwords");

    res.json({ users });
  } catch {
    console.error(err);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

router.post("/about", async (req, res) => {
  try {
    const { id, about } = req.body;

    const user = await User.findById(id);

    user.about = about;
    await user.save();

    res.json("ok");
  } catch (error) {}
});

router.post("/image", async (req, res) => {
  try {
    const { id, imgAdrss } = req.body;

    const user = await User.findById(id);

    user.imageAddress = imgAdrss;
    await user.save();

    res.json("ok");
  } catch (error) {}
});

module.exports = router;
