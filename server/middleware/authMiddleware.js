const jwt = require('jsonwebtoken');

const cookieName = process.env.COOKIE_NAME || 'wishlist_orb_token';

function requireAuth(req, _res, next) {
  const token = req.cookies[cookieName];

  if (!token) {
    return next({ status: 401, message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };
    return next();
  } catch (error) {
    return next({ status: 401, message: 'Session expired. Please log in again.' });
  }
}

module.exports = {
  requireAuth
};

