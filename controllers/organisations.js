const ErrorResponse = require("../utils/errorResponse");
const Organisation = require("../models/Organisation");
const asyncHandler = require("../middleware/async");

// @desc    Get all organisations
// @route   GET /api/v1/organisations
// @access  Public
exports.getOrganisations = asyncHandler(async (req, res, next) => {
  const organisations = await Organisation.find(req.query);
  res.status(200).json({
    success: true,
    count: organisations.length,
    data: organisations,
  });
});

// @desc    Get single organisation
// @route   GET /api/v1/organisations/:id
// @access  Public
exports.getOrganisation = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.findById(req.params.id);
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: organisation });
});

// @desc    Create new organisation
// @route   POST /api/v1/organisations
// @access  Private
exports.createOrganisation = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.create(req.body);
  res.status(201).json({
    success: true,
    data: organisation,
  });
});

// @desc    Update organisation
// @route   PUT /api/v1/organisations/:id
// @access  Private
exports.updateOrganisation = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: organisation });
});

// @desc    Delete organisation
// @route   DELETE /api/v1/organisations/:id
// @access  Private
exports.deleteOrganisation = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.findByIdAndDelete(req.params.id);
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted organisation: ${req.params.id}`,
  });
});
