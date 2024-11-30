
const Image = require('../models/image');
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const FeedBack = require('../models/productFeedback');


// exports.getALlFeedback = async (req,res,next)=>{
//     try {
//         const feedback = await FeedBack.findAll();
//         res.status(200).json(feedback)
//     } catch (error) {
//         next(error)
//     }
// }

exports.getALlFeedback = async (req, res, next) => {
    try {
        const { productId } = req.params; // Lấy productId từ URL params

        // Truy vấn feedbacks theo productId kèm theo thông tin người dùng và hình ảnh (nếu có)
        const feedbacks = await FeedBack.findAll({
            where: productId ? { product_id: productId } : {}, // Lọc theo productId nếu có
            include: [
                {
                    model: User,
                    attributes: ['name'],  // Lấy tên người dùng
                    required: true,         // Liên kết bắt buộc với người dùng
                },
                {
                    model: Image,
                    attributes: ['url'],    // Chỉ lấy url ảnh
                    required: false,        // Không bắt buộc có ảnh
                },
            ],
            order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
        });

        // Kiểm tra nếu không có phản hồi nào
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'Không có phản hồi nào' });
        }

        // Xử lý và trả về phản hồi dạng dễ đọc
        const feedbackList = feedbacks.map(feedback => ({
            id: feedback.id,
            user_name: feedback.User.name, // Tên người dùng
            createdAt: feedback.createdAt, // Ngày tạo
            content: feedback.content,     // Nội dung feedback
            rating: feedback.rating,       // Đánh giá
            images: feedback.Images ? feedback.Images.map(image => image.url) : [], // Trả về ảnh nếu có
        }));

        // Trả về kết quả
        res.status(200).json({
            message: 'Danh sách phản hồi',
            feedbacks: feedbackList,
        });
    } catch (error) {
        next(error);  // Xử lý lỗi
    }
};
// Hàm viết phản hồi mới
exports.writeFeedback = async (req, res, next) => {
    try {
        const { product_id, rating, content, user_id } = req.body;

        // Kiểm tra xem người dùng có thể đánh giá sản phẩm này không
        const order = await Order.findOne({ where: { user_id, id: req.body.order_id } });
        if (!order) {
            return res.status(400).json({ message: 'Không tìm thấy đơn hàng này' });
        }

        if (order.orderStatus !== 'confirmed') {
            return res.status(400).json({ message: 'Chỉ có thể đánh giá sau khi nhận hàng thành công' });
        }

        // Tạo một feedback mới
        const newFeedback = await FeedBack.create({
            product_id,
            user_id,
            rating,
            content,
        });

        // Nếu có hình ảnh kèm theo feedback
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => ({
                product_id,
                url: `/uploads/${file.filename}`,
            }));

            // Lưu thông tin hình ảnh vào cơ sở dữ liệu
            await Image.bulkCreate(images);

            // Cập nhật liên kết hình ảnh vào feedback
            await newFeedback.setImages(images);
        }

        res.status(201).json({ message: 'Feedback đã được gửi thành công', feedback: newFeedback });

    } catch (error) {
        console.error(error);
        next(error);
    }
};
