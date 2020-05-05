const ErrorResponse = require("../utils/errorResponse");
const Class = require("../models/Class");
const Organisation = require("../models/Organisation");
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

// @desc    Get single class
// @route   GET /api/v1/class
// @route   GET /api/v1/classes/:id
// @access  Public
exports.getClass = asyncHandler(async (req, res, next) => {
  const singleClass = await Class.findById(req.params.id);

  if (!singleClass) {
    return next(
      new ErrorResponse(`No class found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: singleClass,
  });
});

// @desc    Add class
// @route   POST /api/v1/organisations/:organisationId/classes
// @access  Private
exports.addClass = asyncHandler(async (req, res, next) => {
  // Add the bootcamp id from params into the body
  req.body.organisation = req.params.organisationId;

  // Find by Id and check if it exists
  const organisation = await Organisation.findById(req.params.organisationId);

  if (!organisation) {
    return next(
      new ErrorResponse(`No organisation found with id of: ${req.params.id}`)
    );
  }

  const singleClass = await Class.create(req.body);

  res.status(200).json({
    success: true,
    data: singleClass,
  });
});

// @desc    Update class
// @route   PUT /api/v1/classes/:id
// @access  Private
exports.updateClass = asyncHandler(async (req, res, next) => {
  let singleClass = await Class.findById(req.params.id);
  // Find by Id and check if it exists
  if (!singleClass) {
    return next(
      new ErrorResponse(`No class found with id of: ${req.params.id}`)
    );
  }

  singleClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: singleClass,
  });
});

// @desc    Delete class
// @route   DELETE /api/v1/classes/:id
// @access  Private
exports.deleteClass = asyncHandler(async (req, res, next) => {
  const singleClass = await Class.findById(req.params.id);

  if (!singleClass) {
    return next(
      new ErrorResponse(`No class found with id of: ${req.params.id}`)
    );
  }

  //Use remove for middleware
  await singleClass.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
