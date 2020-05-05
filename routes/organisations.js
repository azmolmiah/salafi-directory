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

// Re-route into other resource routers
router.use("/:organisationId/classes", classRouter);

router.route("/:id/logo").put(organisationLogoUpload);

router
  .route("/")
  .get(advancedResults(Organisation, "classes"), getOrganisations)
  .post(createOrganisation);

router
  .route("/:id")
  .get(getOrganisation)
  .put(updateOrganisation)
  .delete(deleteOrganisation);

module.exports = router;
