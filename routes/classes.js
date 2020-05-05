const express = require("express");
const {
  getClasses,
  getClass,
  addClass,
  updateClass,
  deleteClass,
} = require("../controllers/classes");
const router = express.Router({ mergeParams: true });

router.route("/").get(getClasses).post(addClass);
router.route("/:id").get(getClass).put(updateClass).delete(deleteClass);

module.exports = router;
