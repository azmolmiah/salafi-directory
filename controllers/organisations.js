const ErrorResponse = require("../utils/errorResponse");
const Organisation = require("../models/Organisation");
const asyncHandler = require("../middleware/async");

// @desc    Get all organisations
// @route   GET /api/v1/organisations
// @access  Public
exports.getOrganisations = asyncHandler(async (req, res, next) => {
  // Copy  query
  const reqQuery = { ...req.query };
  //Fields to exclude
  const removeFields = ["page", "limit"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  // Finding resource
  let query = Organisation.find(JSON.parse(queryStr)).populate("classes");

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Organisation.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const organisations = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    pagination,
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
  const organisation = await Organisation.findById(req.params.id);
  if (!organisation) {
    return next(
      new ErrorResponse(`Resource not found with the ID: ${req.params.id}`, 400)
    );
  }
  organisation.remove();
  res.status(200).json({
    success: true,
    data: {},
    msg: `Deleted organisation: ${req.params.id}`,
  });
});
