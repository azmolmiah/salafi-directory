const express = require("express");
const { getClasses } = require("../controllers/classes");
const router = express.Router({ mergeParams: true });

router.route("/").get(getClasses);

module.exports = router;
