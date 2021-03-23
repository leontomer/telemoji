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
  friendRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
