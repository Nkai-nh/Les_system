const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate ,authorize} = require("../middlewares/authMiddleware");
const {
  getOrders,
  confirmOrder,
  resolveComplaint,
  viewReport,
  checkOrderStatus,
} = require("../controllers/orderManageController");
const router = express.Router();

router.get("/all",authenticate, orderController.getAllOrders);
router.post("/add", authenticate, orderController.addOrder);
router.post("/payment-with-momo", orderController.paymentWithMomo);
router.post("/callback-with-momo", orderController.callbackMomo);

router.get("/manage/all",authenticate,  authorize(["manager"]), getOrders);
router.post("/manage/confirm/:id",authenticate, authorize(["manager"]), confirmOrder);
router.get("/manage/complaints/:id", authenticate, authorize(["manager"]),resolveComplaint);
router.get("/manage/status/:id", authenticate, authorize(["manager"]),checkOrderStatus);
 
router.get("/manage/view-report",authenticate, authorize(["manager"]), viewReport);
module.exports = router;
