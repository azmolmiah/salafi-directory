const express = require("express");
const {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
  organisationLogoUpload,
} = require("../controllers/organisations");
const Organisation = require("../models/Organisation");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const classRouter = require("./classes");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:organisationId/classes", classRouter);

router.route("/:id/logo").put(protect, organisationLogoUpload);

router
  .route("/")
  .get(
    advancedResults(Organisation, {
      path: "classes",
      select: "title description",
    }),
    getOrganisations
  )
  .post(protect, authorize("create", "publisher"), createOrganisation);

router
  .route("/:id")
  .get(getOrganisation)
  .put(protect, authorize("update", "publisher"), updateOrganisation)
  .delete(protect, authorize("delete", "publisher"), deleteOrganisation);

module.exports = router;
