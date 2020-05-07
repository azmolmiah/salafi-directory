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

router
  .route("/")
  .get(
    advancedResults(Class, { path: "centre", select: "name description" }),
    getClasses
  )
  .post(addClass);
router.route("/:id").get(getClass).put(updateClass).delete(deleteClass);

module.exports = router;
