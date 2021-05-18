const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
var nodemailer = require("nodemailer");

router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").normalizeEmail().isEmail(),
    check(
      "password",
      "Password must be minimum 6 letters long, and no more then 20"
    ).isLength({ min: 6, max: 20 }),
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

router.get("/allUsers", async (req, res) => {
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
  } catch (error) {}
});

//
router.post("/contact", auth, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.id);

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "telemoji.verify@gmail.com",
        pass: "Tole1234567",
      },
    });

    var mailOptions = {
      from: "telemoji.verify@gmail.com",
      to: "telemoji.verify@gmail.com",
      subject: "user contact",
      text: `user ${user.email} has contact us. his message:\n ${message}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({ msg: `Email sent to ${email}` });
      }
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});
//

router.post("/image", auth, async (req, res) => {
  try {
    const { id, imageAddress } = req.body;
    let user = await User.findOne({ email: id });
    user.imageAddress = imageAddress;

    await user.save();

    res.status(200).json({ msg: "done" });
  } catch (error) {
    console.error(error);
  }
});

router.post(
  "/editDetails",
  auth,

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //here in password to compare user current password entered and real password use the compare from login api: const isMatch = await bcrypt.compare(password, user.password);
      const { firstName, lastName, currentPassword, password } = req.body;
      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "entered wrong password" }] });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      if (password) {
        if (password.length < 6 || password.length > 20) {
          return res.status(400).json({
            errors: [
              {
                msg: "Password must be minimum 6 letters long, and no more then 20",
              },
            ],
          });
        }
        const regex = /([a-zA-Z])+([ -~])*/;
        if (!regex.test(password))
          return res.status(400).json({
            errors: [{ msg: "Password must contain at least one letter" }],
          });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      await user.save();
      res.json("user edited successfully");
      //if passwords do not match return res.error else continuo
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
