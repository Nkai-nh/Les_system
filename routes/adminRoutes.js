const express = require('express');
const { authenticate, authorize} = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();




// quản lý uswer
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id', authenticate, authorize('admin'), adminController.updateUserRole);
router.delete('/users/:id', authenticate, authorize('admin'), adminController.deleteUser);
router.put('/users-update/:id', authenticate, authorize('admin'), adminController.updateUser);


// quản lý product
router.get('/products', authenticate, authorize('admin'), adminController.getAllProducts);
router.post('/products', authenticate, authorize('admin'), adminController.addProduct);
router.put('/products/:id', authenticate, authorize('admin'), adminController.updateProduct);
router.delete('/products/:id', authenticate, authorize('admin'), adminController.deleteProduct);

// Quản lý đơn hàng
router.get('/orders',authenticate, authorize('admin'), adminController.getAllOrders);
router.get('/orders/:id',authenticate, authorize('admin'), adminController.getOrderById);
router.put('/orders/:id/status',authenticate, authorize('admin'), adminController.updateOrderStatus);
router.delete('/orders/:id',authenticate, authorize('admin'), adminController.deleteOrder);

// Xem báo cáo
router.get('/reports/sales', authenticate, authorize('admin'), adminController.getSalesReport);
router.get('/reports/sales/monthly', authenticate, authorize('admin'), adminController.getMonthlySalesReport);
router.get('/reports/sales/quarterly', authenticate, authorize('admin'), adminController.getQuarterlySalesReport);
router.get('/reports/sales/yearly', authenticate, authorize('admin'), adminController.getYearlySalesReport);

router.get('/reports/activity', authenticate, authorize('admin'), adminController.getActivityReport);

module.exports = router;