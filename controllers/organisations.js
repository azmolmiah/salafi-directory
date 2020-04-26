const ErrorResponse = require("../utils/errorResponse");
const Organisation = require("../models/Organisation");

// @desc    Get all organisations
// @route   GET /api/v1/organisations
// @access  Public
exports.getOrganisations = async (req, res, next) => {
  try {
    const organisations = await Organisation.find();
    res.status(200).json({
      success: true,
      count: organisations.length,
      data: organisations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single organisation
// @route   GET /api/v1/organisations/:id
// @access  Public
exports.getOrganisation = async (req, res, next) => {
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) {
      return next(
        new ErrorResponse(
          `Organisation not found with the ID: ${req.params.id}`,
          400
        )
      );
    }
    res.status(200).json({ success: true, data: organisation });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new organisation
// @route   POST /api/v1/organisations
// @access  Private
exports.createOrganisation = async (req, res, next) => {
  try {
    const organisation = await Organisation.create(req.body);

    res.status(201).json({
      success: true,
      data: organisation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update organisation
// @route   PUT /api/v1/organisations/:id
// @access  Private
exports.updateOrganisation = async (req, res, next) => {
  try {
    const organisation = await Organisation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!organisation) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: organisation });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete organisation
// @route   DELETE /api/v1/organisations/:id
// @access  Private
exports.deleteOrganisation = async (req, res, next) => {
  try {
    const organisation = await Organisation.findByIdAndDelete(req.params.id);

    if (!organisation) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: {},
      msg: `Deleted organisation: ${req.params.id}`,
    });
  } catch (err) {
    next(err);
  }
};
