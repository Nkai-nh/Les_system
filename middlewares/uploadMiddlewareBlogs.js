// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file
const blogsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blogs/'); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file
    }
});

// Bộ lọc file (chỉ chấp nhận các định dạng được cho phép)
const blogsFileFilter = (req, file, cb) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Định dạng file không được hỗ trợ'), false);
    }
};

// Khởi tạo Multer cho hình ảnh phản hồi
const uploadBlogs = multer({
    storage: blogsStorage,
    fileFilter: blogsFileFilter,
});


module.exports = uploadBlogs;
