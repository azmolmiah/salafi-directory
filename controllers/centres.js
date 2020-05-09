const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Centre = require("../models/Centre");
const asyncHandler = require("../middleware/async");

// @desc    Get all centres
// @route   GET /api/v1/centres
// @access  Public
exports.getCentres = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single centre
// @route   GET /api/v1/centres/:id
// @access  Public
exports.getCentre = asyncHandler(async (req, res, next) => {
  const centre = await Centre.findById(req.params.id);
  if (!centre) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: centre });
});

// @desc    Create new centre
// @route   POST /api/v1/centres
// @access  Private
exports.createCentre = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published centre
  const publishedCentre = await Centre.findOne({ user: req.user.id });

  // Only one centre per publisher
  if (publishedCentre) {
    return next(
      new ErrorResponse(
        `Publisher: ${req.user.id} has already created a centre`,
        400
      )
    );
  }

  const centre = await Centre.create(req.body);

  res.status(201).json({
    success: true,
    data: centre,
  });
});

// @desc    Update centre
// @route   PUT /api/v1/centres/:id
// @access  Private
exports.updateCentre = asyncHandler(async (req, res, next) => {
  const centre = await Centre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!centre) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: centre });
});

// @desc    Delete centre
// @route   DELETE /api/v1/centres/:id
// @access  Private
exports.deleteCentre = asyncHandler(async (req, res, next) => {
  const centre = await Centre.findById(req.params.id);
  if (!centre) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  centre.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted resource: ${req.params.id}`,
  });
});

// @desc    Upload photo for centre
// @route   PUT /api/v1/centres/:id/logo
// @access  Private
exports.centreLogoUpload = asyncHandler(async (req, res, next) => {
  const centre = await Centre.findById(req.params.id);
  // Check if centre exist
  if (!centre) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
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
  file.name = `${centre.slug}-logo${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Centre.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
