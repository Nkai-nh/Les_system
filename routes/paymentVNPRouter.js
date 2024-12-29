const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route yêu cầu thanh toán VNPay
router.post("/vnp", paymentController.createPayment);  // Yêu cầu thanh toán VNPay

// Route nhận kết quả thanh toán từ VNPay
router.get("/vnpay_return", paymentController.handlePaymentResult);  // Nhận kết quả thanh toán từ VNPay

module.exports = router;