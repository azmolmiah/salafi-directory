const express = require("express");
const {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
} = require("../controllers/organisations");
const router = express.Router();

router.route("/").get(getOrganisations).post(createOrganisation);

router
  .route("/:id")
  .get(getOrganisation)
  .put(updateOrganisation)
  .delete(deleteOrganisation);

module.exports = router;
