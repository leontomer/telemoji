
const mongoose = require("mongoose");
const CallStatsSchema = new mongoose.Schema({
    happy: {
        type: Number,
        default: 0
    },
    sad: {
        type: Number,
        default: 0
    },
    disgust: {
        type: Number,
        default: 0
    },
    suprise: {
        type: Number,
        default: 0
    },
    fear: {
        type: Number,
        default: 0
    },
    neutral: {
        type: Number,
        default: 0
    },
    angry: {
        type: Number,
        default: 0
    },
    startCall: {
        type: Date
    },
    endCall: {
        type: Date,
        default: Date.now
    },
});

module.exports = CallStats = mongoose.model("callStats", CallStatsSchema);
