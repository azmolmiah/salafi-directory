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

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:centreId/classes", classRouter);

router.route("/:id/logo").put(protect, centreLogoUpload);

router
  .route("/")
  .get(
    advancedResults(Centre, { path: "classes", select: "title description" }),
    getCentres
  )
  .post(protect, authorize("create", "publisher"), createCentre);

router
  .route("/:id")
  .get(getCentre)
  .put(protect, authorize("update", "publisher"), updateCentre)
  .delete(protect, authorize("delete", "publisher"), deleteCentre);

module.exports = router;
