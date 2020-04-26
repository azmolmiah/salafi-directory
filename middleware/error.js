const errorHandler = (err, req, res, next) => {
  // log to console for dev
  console.log(err.stack);

  res
    .status(err.statusCode)
    .json({ success: false, error: err.message || "Server error" });
};

module.exports = errorHandler;
