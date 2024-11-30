const express = require("express");
const { register, login,loginManager, getUserInfo, updateUserInfo, changePassword } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login-manager", loginManager);
router.get("/info", authenticate, getUserInfo);
router.put("/update", authenticate, updateUserInfo);
router.post("/change_pass", authenticate, changePassword);
module.exports = router;
