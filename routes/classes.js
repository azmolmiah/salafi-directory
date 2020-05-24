const express = require("express");
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
} = require("../controllers/classes");

const Class = require("../models/Class");
const router = express.Router({ mergeParams: true });

// Middleware
const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Class, {
      path: "organisation",
      select: "name description",
    }),
    getClasses
  )
  .post(protect, createClass);

router
  .route("/:id")
  .get(getClass)
  .put(protect, updateClass)
  .delete(protect, deleteClass);

module.exports = router;
