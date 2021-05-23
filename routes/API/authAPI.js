const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const dbHelper = require("../../server/utils/dbHelper");
const googleClientId =
  "678350980728-ovb0o4qai1kcfqohoe0qrnhbso20vua3.apps.googleusercontent.com";

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "callHistory",
        model: "call",
      })
      .select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login details" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login details" }] });
      }

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

router.post("/google", async (req, res) => {
  try {
    const client = new OAuth2Client(googleClientId);
    const googleAuth = async (token) => {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();

      // tell the client that the user is verified and authenticated

      const { sub, email, name, picture } = payload;
      const userId = sub;

      return {
        userId,
        email,
        fullName: name,
        photoUrl: picture,
        verified: true,
      };
    };

    const authenticationResponse = await googleAuth(req.body.tokenId);

    let user = await User.findOne({ email: authenticationResponse.email });

    if (!authenticationResponse.verified) {
      throw new Error("the user is not verified by Google!");
    }

    if (!user) {
      const { firstName, lastName } = dbHelper.splitName(
        authenticationResponse.fullName
      );
      user = new User({
        firstName,
        lastName,
        email: authenticationResponse.email,
        password: dbHelper.generateRandomPassword(),
        imageAddress: authenticationResponse.photoUrl,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();
    }

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
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const email = req.body.email;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        const url = `https://telemoji.herokuapp.com/forgotPassword/${token}`;

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "telemoji.verify@gmail.com",
            pass: "Tole1234567",
          },
        });

        var mailOptions = {
          from: "telemoji.verify@gmail.com",
          to: email,
          subject: "Reset your password",
          text:
            "	Reset Password\n A password reset event has been triggered. The password reset window is limited to two hours.\n If you do not reset your password within two hours, you will need to submit a new request.\n To complete the password reset process, visit the following link: " +
            url,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.status(200).json({ msg: `Email sent to ${email}` });
          }
        });
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post(
  "/changePassword",
  [
    check(
      "password",
      "Password must be minimum 6 letters long, and no more then 20"
    ).isLength({ min: 6, max: 20 }),
    check("password", "Password must contain at least one letter").matches(
      /([a-zA-Z])+([ -~])*/
    ),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { password } = req.body;
      const user = await User.findById(req.user.id);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.json("password changed!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
