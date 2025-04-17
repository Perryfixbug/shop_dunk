const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { auth } = require('../middleware/auth');

router.use(auth); // Apply auth middleware to all routes in this file
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateCartItem);
router.delete('/:id', cartController.removeCartItem);

module.exports = router;