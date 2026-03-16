const bcrypt = require('bcrypt');

const userRepository = require('../repositories/userRepository');
const { attachAuthCookie, clearAuthCookie, createToken } = require('../services/authService');
const { validateLogin, validateSignup } = require('../utils/validation');

async function signup(req, res, next) {
  const validation = validateSignup(req.body);

  if (!validation.isValid) {
    return next({ status: 400, message: 'Invalid signup data.', details: validation.errors });
  }

  const existingUser = await userRepository.findUserByEmail(validation.value.email);
  if (existingUser) {
    return next({ status: 409, message: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(validation.value.password, 12);
  const user = await userRepository.createUser({
    name: validation.value.name,
    email: validation.value.email,
    passwordHash
  });

  await userRepository.createDefaultWishlistSettings(user.id);

  const token = createToken(user);
  attachAuthCookie(res, token);

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}

async function login(req, res, next) {
  const validation = validateLogin(req.body);

  if (!validation.isValid) {
    return next({ status: 400, message: 'Invalid login data.', details: validation.errors });
  }

  const user = await userRepository.findUserByEmail(validation.value.email);
  if (!user) {
    return next({ status: 401, message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(validation.value.password, user.password_hash);
  if (!passwordMatches) {
    return next({ status: 401, message: 'Invalid email or password.' });
  }

  const token = createToken(user);
  attachAuthCookie(res, token);

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}

function logout(_req, res) {
  clearAuthCookie(res);
  res.status(204).send();
}

function me(req, res) {
  res.json({
    user: req.user
  });
}

module.exports = {
  signup,
  login,
  logout,
  me
};

