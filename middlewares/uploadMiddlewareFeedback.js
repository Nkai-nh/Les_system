const multer = require('multer');

// Cấu hình lưu trữ cho hình ảnh phản hồi
const feedbackStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/feedbacks/'); // Đường dẫn thư mục lưu trữ hình ảnh phản hồi
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
    },
});

// Bộ lọc file (chỉ chấp nhận các định dạng được cho phép)
const feedbackFileFilter = (req, file, cb) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Định dạng file không được hỗ trợ'), false);
    }
};

// Khởi tạo Multer cho hình ảnh phản hồi
const uploadFeedback = multer({
    storage: feedbackStorage,
    fileFilter: feedbackFileFilter,
});

// Export middleware Multer
module.exports = uploadFeedback;
