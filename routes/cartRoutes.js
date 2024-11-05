const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate); 

router.post('/add', cartController.addToCart);
router.put('/update/:productId', cartController.updateCartItem);
router.put('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.get('/all', cartController.getAllCartItems);
module.exports = router;