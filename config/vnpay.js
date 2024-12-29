require('dotenv').config();

module.exports = {
    vnp_TmnCode: process.env.VNP_TMN_CODE,  // Lấy từ biến môi trường
    vnp_HashSecret: process.env.VNP_HASH_SECRET,  // Lấy từ biến môi trường
    vnp_Url: process.env.VNP_URL,  // URL thanh toán
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,  // URL nhận kết quả
    vnp_NotifyUrl: process.env.VNP_NOTIFY_URL,  // URL thông báo kết quả thanh toán
};