const wishlistRepository = require('../repositories/wishlistRepository');
const { validateWishlistItem } = require('../utils/validation');

async function listItems(req, res) {
  const wishlist = await wishlistRepository.getWishlistItemsByUser(req.user.id);
  res.json(wishlist);
}

async function createItem(req, res, next) {
  const validation = validateWishlistItem(req.body);

  if (!validation.isValid) {
    return next({ status: 400, message: 'Invalid wishlist item.', details: validation.errors });
  }

  const item = await wishlistRepository.createWishlistItem(req.user.id, validation.value);
  res.status(201).json({ item });
}

async function updateItem(req, res, next) {
  const validation = validateWishlistItem(req.body);

  if (!validation.isValid) {
    return next({ status: 400, message: 'Invalid wishlist item.', details: validation.errors });
  }

  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId) || itemId < 1) {
    return next({ status: 400, message: 'Invalid item id.' });
  }

  const updatedItem = await wishlistRepository.updateWishlistItem(req.user.id, itemId, validation.value);
  if (!updatedItem) {
    return next({ status: 404, message: 'Wishlist item not found.' });
  }

  res.json({ item: updatedItem });
}

async function deleteItem(req, res, next) {
  const itemId = Number(req.params.id);
  if (!Number.isInteger(itemId) || itemId < 1) {
    return next({ status: 400, message: 'Invalid item id.' });
  }

  const deleted = await wishlistRepository.deleteWishlistItem(req.user.id, itemId);
  if (!deleted) {
    return next({ status: 404, message: 'Wishlist item not found.' });
  }

  res.status(204).send();
}

module.exports = {
  listItems,
  createItem,
  updateItem,
  deleteItem
};

