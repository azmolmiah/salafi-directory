const ErrorResponse = require("../utils/errorResponse");
const Class = require("../models/Class");
const asyncHandler = require("../middleware/async");

// @desc    Get all classes
// @route   GET /api/v1/classes
// @route   GET /api/v1/organisations/:organisationId/classes
// @access  Public
exports.getClasses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.organisationId) {
    query = Class.find({ organisation: req.params.organisationId });
  } else {
    query = Class.find();
  }

  const classes = await query;

  res.status(200).json({
    success: true,
    count: classes.length,
    data: classes,
  });
});
