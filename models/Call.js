
const mongoose = require("mongoose");
const CallSchema = new mongoose.Schema({
  callerName: {
    type: String,
    required: true,
  },
  callerImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  callStats: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "callStats",
  }
});

module.exports = Call = mongoose.model("call", CallSchema);
