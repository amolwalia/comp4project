const jwt = require('jsonwebtoken');

const cookieName = process.env.COOKIE_NAME || 'wishlist_orb_token';

function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

function attachAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

function clearAuthCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
}

module.exports = {
  createToken,
  attachAuthCookie,
  clearAuthCookie
};

