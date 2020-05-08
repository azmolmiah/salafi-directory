const express = require("express");
const {
  getClasses,
  getClass,
  addClass,
  updateClass,
  deleteClass,
} = require("../controllers/classes");

const Class = require("../models/Class");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Class, { path: "centre", select: "name description" }),
    getClasses
  )
  .post(protect, addClass);

router
  .route("/:id")
  .get(getClass)
  .put(protect, updateClass)
  .delete(protect, deleteClass);

module.exports = router;
