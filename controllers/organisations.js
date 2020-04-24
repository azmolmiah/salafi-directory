// @desc    Get all organisations
// @route   GET /api/v1/organisations
// @access  Public
exports.getOrganisations = (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
};

// @desc    Get single organisation
// @route   GET /api/v1/organisations/:id
// @access  Public
exports.getOrganisation = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Get organisation" });
};

// @desc    Create new organisation
// @route   POST /api/v1/organisations
// @access  Private
exports.createOrganisation = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Created new organisation" });
};

// @desc    Update organisation
// @route   PUT /api/v1/organisations/:id
// @access  Private
exports.updateOrganisation = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Updated organisation: ${req.params.id}` });
};

// @desc    Delete organisation
// @route   DELETE /api/v1/organisations/:id
// @access  Private
exports.deleteOrganisation = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Deleted organisation: ${req.params.id}` });
};
