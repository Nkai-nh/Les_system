const express = require("express");
const { register, login,loginManager, getUserInfo, updateUserInfo, changePassword, requestPasswordReset, resetPassword } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login-manager", loginManager);
router.get("/info", authenticate, getUserInfo);
router.put("/update", authenticate, updateUserInfo);
router.post("/change_pass", authenticate, changePassword);
router.post('/request-password-reset', requestPasswordReset); // Endpoint yêu cầu đặt lại mật khẩu
router.post('/reset-password', resetPassword); // Endpoint cập nhật mật khẩu mới
module.exports = router;
