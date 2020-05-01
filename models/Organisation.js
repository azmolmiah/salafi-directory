const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

// Regex Validation messages
const urlValidation = {
  type: String,
  match: [
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    "Please use a valid URL with HTTP or HTTPS",
  ],
};

const OrganisationSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   auto: true,
  // },
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
  website: urlValidation,
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
    streetNumber: String,
    streetName: String,
    neighbourhood: String,
    city: String,
    county: String,
    postcode: String,
    country: String,
  },
  social: {
    twitter: urlValidation,
    facebook: urlValidation,
    youtube: urlValidation,
    instagram: urlValidation,
    pinterest: urlValidation,
    telegram: urlValidation,
  },
  broadcast: {
    mixlr: urlValidation,
    soundcloud: urlValidation,
    periscope: urlValidation,
  },
  type: {
    type: String,
    enum: ["markaz", "school", "pilgrimage", "charity", "dawa"],
    required: [
      true,
      "Please select a type from:- markaz, school, pilgrimage or charity",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create bootcamp slug from the name
OrganisationSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and create location field
OrganisationSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    streetNumber: loc[0].streetNumber,
    streetName: loc[0].streetName,
    neighbourhood: loc[0].extra.neighborhood,
    city: loc[0].city,
    county: loc[0].administrativeLevels.level2long,
    postcode: loc[0].zipcode,
    country: loc[0].country,
  };

  this.address = undefined;

  next();
});

module.exports = mongoose.model("Organisation", OrganisationSchema);
