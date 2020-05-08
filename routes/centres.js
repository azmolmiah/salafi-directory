const express = require("express");
const {
  getCentres,
  getCentre,
  createCentre,
  updateCentre,
  deleteCentre,
  centreLogoUpload,
} = require("../controllers/centres");
const Centre = require("../models/Centre");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const classRouter = require("./classes");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:centreId/classes", classRouter);

router.route("/:id/logo").put(protect, centreLogoUpload);

router
  .route("/")
  .get(
    advancedResults(Centre, { path: "classes", select: "title description" }),
    getCentres
  )
  .post(protect, createCentre);

router
  .route("/:id")
  .get(getCentre)
  .put(protect, updateCentre)
  .delete(protect, deleteCentre);

module.exports = router;
