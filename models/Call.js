//changes we need to do :
// add : friend requests the user sent

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
});

module.exports = Call = mongoose.model("call", CallSchema);
