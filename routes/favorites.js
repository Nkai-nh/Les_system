const express = require('express');
const router = express.Router();
const productFavoriteController = require('../controllers/productFavoriteController');

// Lấy tất cả sản phẩm yêu thích của người dùng
router.get('/:user_id', productFavoriteController.getAllFavorites);

// Thêm sản phẩm yêu thích
router.post('/', productFavoriteController.addFavorite);

// Xóa sản phẩm yêu thích
router.delete('/delete/:id', productFavoriteController.removeFavorite);

module.exports = router;