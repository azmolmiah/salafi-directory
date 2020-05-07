const mongoose = require("mongoose");

const OpeningTimesSchema = new mongoose.Schema(
  {
    openinDayRanges: {
      start: Number,
      end: Number,
    },
    openingTimeRanges: {
      start: String,
      end: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OpeningTimes", OpeningTimesSchema);
