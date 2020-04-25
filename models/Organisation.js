const mongoose = require("mongoose");

const OrganisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters."],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add description"],
    maxlength: [500, "Description cannot be more than 500 characters."],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
  },
  social: {
    twitter: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    instagram: { type: String },
    pinterest: { type: String },
    telegram: { type: String },
  },
  broadcast: {
    mixlr: { type: String },
    soundcloud: { type: String },
  },
  type: {
    type: String,
    enum: ["markaz", "school", "pilgrimage", "charity"],
    default: "markaz",
    required: [true, "Please select a type"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Organisation", OrganisationSchema);
