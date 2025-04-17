const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product.admin.controller');
const { auth, isAdmin } = require('../../middleware/auth');

router.use(auth);
router.use(isAdmin) 

router.get('/', productController.getProducts); // Get all products
router.post('/', productController.createProduct); // Create a new product
router.put('/:id', productController.updateProduct); // Update a product by ID
router.delete('/:id', productController.deleteProduct); // Delete a product by ID

module.exports = router;