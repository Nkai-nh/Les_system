

const multer = require('multer');

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Đường dẫn thư mục lưu trữ
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
    },
});

// Bộ lọc file (chỉ chấp nhận các định dạng được cho phép)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Định dạng file không được hỗ trợ'), false);
    }
};

// Khởi tạo Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

// Export middleware Multer
module.exports = upload;

