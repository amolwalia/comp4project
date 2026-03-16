const jwt = require('jsonwebtoken');

const cookieName = process.env.COOKIE_NAME || 'wishlist_orb_token';
const isProduction = process.env.NODE_ENV === 'production';

function getCookieSameSite() {
  if (process.env.COOKIE_SAME_SITE) {
    return process.env.COOKIE_SAME_SITE;
  }

  // Render usually serves the frontend and API from different origins,
  // so production cookies need SameSite=None to be sent with fetch().
  return isProduction ? 'none' : 'lax';
}

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
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: getCookieSameSite(),
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

function clearAuthCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: getCookieSameSite(),
    secure: isProduction
  });
}

module.exports = {
  createToken,
  attachAuthCookie,
  clearAuthCookie
};
