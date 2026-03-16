const express = require('express');

const wishlistController = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);
router.get('/', asyncHandler(wishlistController.listItems));
router.post('/', asyncHandler(wishlistController.createItem));
router.put('/:id', asyncHandler(wishlistController.updateItem));
router.delete('/:id', asyncHandler(wishlistController.deleteItem));

module.exports = router;

