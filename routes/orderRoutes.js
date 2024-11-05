const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/all', authenticate, orderController.getAllOrders);
router.post('/add', authenticate, orderController.addOrder);
router.post('/payment-with-momo', orderController.paymentWithMomo);
router.post('/callback-with-momo', orderController.callbackMomo);
module.exports = router;