const express = require('express');
const { authenticate, authorize} = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();




// quản lý uswer
router.get('/users',authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id', authenticate, authorize('admin'), adminController.updateUserRole);
router.delete('/users/:id', authenticate, authorize('admin'), adminController.deleteUser);
router.put('/users-update/:id', authenticate, authorize('admin'), adminController.updateUser);


// quản lý product
router.get('/products', authenticate, authorize('admin'), adminController.getAllProducts);
router.post('/products', upload.array('images',5), authenticate, authorize('admin'), adminController.addProduct);
router.put('/products/:id', upload.array('images', 5), authenticate, authorize('admin'), adminController.updateProduct);
router.delete('/products/:id', authenticate, authorize('admin'), adminController.deleteProduct);
router.post('/add-category', authenticate, authorize('admin'), adminController.addCategory);
router.get('/getAll-category', authenticate, authorize('admin'), adminController.getAllCategory);
router.delete('/delete-category/:category_id', authenticate, authorize('admin'), adminController.deleteCategory);

// Quản lý đơn hàng
router.get('/orders',authenticate, authorize('admin'), adminController.getAllOrders);
router.get('/orders/:id',authenticate, authorize('admin'), adminController.getOrderById);
router.put('/orders/:id/status',authenticate, authorize('admin'), adminController.updateOrderStatus);
router.delete('/orders/:id',authenticate, authorize('admin'), adminController.deleteOrder);

// Xem báo cáo
router.get('/reports/sales', authenticate, authorize('admin'), adminController.getSalesReport);
// Route để lấy tổng số đơn hàng
router.get('/reports/total-orders', authenticate, authorize('admin'), adminController.getTotalOrders);
router.get('/reports/total-members', authenticate, authorize('admin'), adminController.getTotalMembers);
// router.get('/reports/sales/monthly', authenticate, authorize('admin'), adminController.getMonthlySalesReport);
router.get('/reports/sales/quarterly', authenticate, authorize('admin'), adminController.getQuarterlySalesReport);
router.get('/reports/sales/yearly', authenticate, authorize('admin'), adminController.getYearlySalesReport);
router.get('/reports/sales/monthly', authenticate, authorize('admin'), adminController.getMonthlyRevenue); // Lấy doanh thu hàng tháng
// Router cho phân bổ doanh thu
router.get('/reports/sales/distribution', authenticate, authorize('admin'), adminController.getRevenueDistribution); // Lấy dữ liệu phân bổ doanh thu

// Router cho lượng khách hàng hàng tháng
router.get('/reports/customers/monthly', authenticate, authorize('admin'), adminController.getMonthlyCustomers); // Lấy dữ liệu lượng khách hàng hàng tháng

router.get('/reports/activity', authenticate, authorize('admin'), adminController.getActivityReport);
router.get('/table', authenticate, authorize('admin'), adminController.getAllTables);

//add coupon
router.post("/coupons/create", authenticate, authorize('admin'), adminController.addCoupon)
router.get("/coupons/getAll", authenticate, authorize('admin'), adminController.getAllCoupons)
router.get("/coupons/active", authenticate, authorize('admin'), adminController.getActiveCoupons)
router.delete("/coupons/delete/:id", authenticate, authorize('admin'), adminController.deleteCoupon)

//blogs
router.get("/all-blogs", authenticate, authorize('admin'), adminController.getAllBlogsAdmin)
router.get("/details-blogs/:blogId", authenticate, authorize('admin'), adminController.getDetailsBlogAdmin)
router.delete("/delete-blogs/:blogId", authenticate, authorize('admin'), adminController.deleteBlogAdmin)
router.put("/approve/:blogId", authenticate, authorize('admin'), adminController.approveBlogAdmin)
router.get("/search-blogs", authenticate, authorize('admin'), adminController.searchBlogs)


module.exports = router;