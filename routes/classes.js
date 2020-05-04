const express = require("express");
const { getClasses, getClass, addClass } = require("../controllers/classes");
const router = express.Router({ mergeParams: true });

router.route("/").get(getClasses).post(addClass);
router.route("/:id").get(getClass);

module.exports = router;
