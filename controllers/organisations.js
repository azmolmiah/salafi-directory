const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Organisation = require("../models/Organisation");
const asyncHandler = require("../middleware/async");

// @desc    Get all organisations
// @route   GET /api/v1/organisations
// @access  Public
exports.getOrganisations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  res.status(200).json({ success: true, data: centre });
});

// @desc    Create new organisation
// @route   POST /api/v1/organisations
// @access  Private
exports.createOrganisation = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published centre
  const publishedOrganisation = await Organisation.findOne({
    user: req.user.id,
  });

  // Only one Organisation per publisher
  if (publishedOrganisation) {
    return next(
      new ErrorResponse(
        `Publisher: ${req.user.id} has already created a organisation`,
        400
      )
    );
  }

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
  let organisation = await Organisation.findById(req.params.id);
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }

  // Make sure publisher is organisation owner
  if (organisation.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to update organisation ${req.params.id}`,
        401
      )
    );
  }

  organisation = await Organisation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: organisation });
});

// @desc    Delete organisation
// @route   DELETE /api/v1/organisations/:id
// @access  Private
exports.deleteOrganisation = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.findById(req.params.id);
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  // Make sure publisher is organisation owner
  if (organisation.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to delete organisation ${req.params.id}`,
        401
      )
    );
  }
  organisation.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted resource: ${req.params.id}`,
  });
});

// @desc    Upload photo for organisation
// @route   PUT /api/v1/organisations/:id/logo
// @access  Private
exports.organisationLogoUpload = asyncHandler(async (req, res, next) => {
  const organisation = await Organisation.findById(req.params.id);
  // Check if organisation exist
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  // Make sure publisher is organisation owner
  if (organisation.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `Publisher ${req.user.id} is not authorised to upload to centre ${req.params.id}`,
        401
      )
    );
  }
  // Check if file attached
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }
  const file = req.files.file;
  // Make sure file is an image type
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }
  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  // Create custom file name
  file.name = `${organisation.slug}-logo${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Organisation.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
