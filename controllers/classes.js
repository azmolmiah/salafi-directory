const ErrorResponse = require("../utils/errorResponse");
const Class = require("../models/Class");
const Organisation = require("../models/Organisation");
const asyncHandler = require("../middleware/async");

// @desc    Get all classes
// @route   GET /api/v1/classes
// @route   GET /api/v1/organisations/:organisationId/classes
// @access  Public
exports.getClasses = asyncHandler(async (req, res, next) => {
  if (req.params.organisationId) {
    const classes = await Class.find({
      organisation: req.params.organisationId,
    });
    return res
      .status(200)
      .json({ success: true, count: classes.length, data: classes });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
exports.createClass = asyncHandler(async (req, res, next) => {
  // Add the bootcamp id from params into the body
  req.body.organisation = req.params.organisationId;
  req.body.user = req.user.id;

  // Find by Id and check if it exists
  const organisation = await Organisation.findById(req.params.organisationId);

  if (!organisation) {
    return next(
      new ErrorResponse(
        `No organisation found with the id of: ${req.params.id}`
      )
    );
  }

  // Make sure publisher / admin is organisation owner
  if (organisation.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to create class`,
        401
      )
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

  // Make sure publisher / admin is class owner
  if (singleClass.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to update class ${req.params.id}`,
        401
      )
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

  // Make sure publisher / admin is class owner
  if (singleClass.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to delete class ${req.params.id}`,
        401
      )
    );
  }

  //Use remove for middleware
  await singleClass.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
