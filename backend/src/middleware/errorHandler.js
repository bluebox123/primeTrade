function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
  });
}

module.exports = errorHandler;
