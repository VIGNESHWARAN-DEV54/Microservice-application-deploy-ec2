const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/', productController.getAllProducts);
router.get('/seed', productController.seedProducts);
router.post('/seed', productController.seedProducts);
router.get('/search/:name', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
