const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a class title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  duration: {
    type: String,
    enum: ["daily", "weekly"],
    required: [true, "Please add a duration"],
  },
  days: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: [true, "Please add a day"],
  },
  setTime: String,
  gender: {
    type: String,
    enum: ["men", "women", "children"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  organisation: {
    type: mongoose.Schema.ObjectId,
    ref: "Organisation",
    require: true,
  },
});

module.exports = mongoose.model("Class", ClassSchema);
