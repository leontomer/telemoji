const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  available: {
    type: Boolean,
  },
  about: {
    type: String,
  },
  imageAddress: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  friendList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  callHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "call",
    },
  ],

  thirdPartyAuthentication: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
