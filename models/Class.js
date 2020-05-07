const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a class title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    duration: {
      type: String,
      enum: ["Daily", "Weekly"],
      required: [true, "Please add a duration"],
    },
    days: {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      required: [true, "Please add day(s)"],
    },
    setTime: {
      type: Date,
      required: [true, "Please set a time for the class"],
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Children"],
    },
    centre: {
      type: mongoose.Schema.ObjectId,
      ref: "Centre",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", ClassSchema);
