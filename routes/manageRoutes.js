const express = require('express');
const { authenticate, authorize} = require('../middlewares/authMiddleware');
const manageController = require('../controllers/manageController');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();



// quản lý product
router.get('/products', authenticate, authorize('manager'), manageController.getAllProducts);
router.post('/products', upload.array('images',5), authenticate, authorize('manager'), manageController.addProduct);
router.put('/products/:id', upload.array('images', 5), authenticate, authorize('manager'), manageController.updateProduct);
router.delete('/products/:id', authenticate, authorize('manager'), manageController.deleteProduct);
router.post('/add-category', authenticate, authorize('manager'), manageController.addCategory);
router.get('/getAll-category', authenticate, authorize('manager'), manageController.getAllCategory);
router.delete('/delete-category/:category_id', authenticate, authorize('manager'), manageController.deleteCategory);

// Quản lý đơn hàng
router.get('/orders',authenticate, authorize('manager'), manageController.getAllOrders);
router.get('/orders/:id',authenticate, authorize('manager'), manageController.getOrderById);
router.put('/orders/:id/status',authenticate, authorize('manager'), manageController.updateOrderStatus);
router.delete('/orders/:id',authenticate, authorize('manager'), manageController.deleteOrder);

//add coupon
router.post("/coupons/create", authenticate, authorize('manager'), manageController.addCoupon)
router.get("/coupons/getAll", authenticate, authorize('manager'), manageController.getAllCoupons)
router.get("/coupons/active", authenticate, authorize('manager'), manageController.getActiveCoupons)
router.delete("/coupons/delete/:id", authenticate, authorize('manager'), manageController.deleteCoupon)

//blogs
router.get("/all-blogs", authenticate, authorize('manager'), manageController.getAllBlogsAdmin)
router.get("/details-blogs/:blogId", authenticate, authorize('manager'), manageController.getDetailsBlogAdmin)
router.delete("/delete-blogs/:blogId", authenticate, authorize('manager'), manageController.deleteBlogAdmin)
router.put("/approve/:blogId", authenticate, authorize('manager'), manageController.approveBlogAdmin)
router.get("/search-blogs", authenticate, authorize('manager'), manageController.searchBlogs)

module.exports = router;