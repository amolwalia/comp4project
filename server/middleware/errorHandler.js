function notFoundHandler(_req, _res, next) {
  next({ status: 404, message: 'Route not found.' });
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong.';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: message,
    details: err.details || null
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

