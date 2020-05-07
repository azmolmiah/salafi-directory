const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Store = require("../models/Store");
const asyncHandler = require("../middleware/async");

// @desc    Get all stores
// @route   GET /api/v1/stores
// @access  Public
exports.getStores = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single store
// @route   GET /api/v1/stores/:id
// @access  Public
exports.getStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: store });
});

// @desc    Create new store
// @route   POST /api/v1/stores
// @access  Private
exports.createStore = asyncHandler(async (req, res, next) => {
  const store = await Store.create(req.body);
  res.status(201).json({
    success: true,
    data: store,
  });
});

// @desc    Update store
// @route   PUT /api/v1/stores/:id
// @access  Private
exports.updateStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!store) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: store });
});

// @desc    Delete store
// @route   DELETE /api/v1/stores/:id
// @access  Private
exports.deleteStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  store.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted resource: ${req.params.id}`,
  });
});

// @desc    Upload photo for store
// @route   PUT /api/v1/stores/:id/logo
// @access  Private
exports.storeLogoUpload = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);
  // Check if centre exist
  if (!store) {
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
  file.name = `${store.slug}-logo${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Store.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
