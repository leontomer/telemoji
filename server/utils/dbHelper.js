const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const convertEmailToId = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail }).select("-password");

    return user._id;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { convertEmailToId };
