function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function trimValue(value) {
  return String(value || '').trim();
}

function validateSignup(payload) {
  const name = trimValue(payload.name);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');
  const errors = [];

  if (name.length < 2 || name.length > 80) {
    errors.push('Name must be between 2 and 80 characters.');
  }

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { name, email, password }
  };
}

function validateLogin(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');
  const errors = [];

  if (!isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { email, password }
  };
}

function validateWishlistItem(payload) {
  const name = trimValue(payload.name);
  const imageUrl = trimValue(payload.imageUrl);
  const productLink = trimValue(payload.productLink);
  const price = Number(payload.price);
  const errors = [];

  if (name.length < 1 || name.length > 140) {
    errors.push('Item name must be between 1 and 140 characters.');
  }

  if (!imageUrl || !isLikelyUrl(imageUrl)) {
    errors.push('A valid image URL is required.');
  }

  if (!productLink || !isLikelyUrl(productLink)) {
    errors.push('A valid product link is required.');
  }

  if (Number.isNaN(price) || price < 0) {
    errors.push('Price must be a valid non-negative number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      name,
      imageUrl,
      productLink,
      price: Number(price.toFixed(2))
    }
  };
}

function isLikelyUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

module.exports = {
  validateSignup,
  validateLogin,
  validateWishlistItem
};

