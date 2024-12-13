
const Image = require('../models/image');
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const FeedBack = require('../models/productFeedback');
const ImageFeedback = require('../models/imageFeedBack');
const ProductFeedback = require('../models/productFeedback');



exports.getAllFeedback = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: 'product_id không hợp lệ' });
        }

        const feedbacks = await ProductFeedback.findAll({
            where: { product_id: productId },
            include: [
                {
                    model: User,
                    attributes: ['name','avatar'],
                    required: true,
                },
                {
                    model: ImageFeedback,
                    attributes: ['url'],
                    required: false,
                    as: 'images',
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'Không có phản hồi nào cho sản phẩm này' });
        }

        const feedbackList = feedbacks.map(feedback => ({
            id: feedback.id,
            user_name: feedback.User.name,
            avatar: feedback.User.avatar,
            createdAt: feedback.createdAt,
            content: feedback.content,
            rating: feedback.rating,
            images: feedback.images ? feedback.images.map(image => image.url) : [],
        }));

        res.status(200).json({
            message: 'Danh sách phản hồi',
            feedbacks: feedbackList,
        });
    } catch (error) {
        console.error("Lỗi khi lấy phản hồi:", error);
        next(error);
    }
};

// Hàm viết phản hồi mới
exports.writeFeedback = async (req, res, next) => {
    try {
        const { product_id, rating, content, user_id, order_id } = req.body;

        // Kiểm tra xem người dùng có thể đánh giá sản phẩm này không
        const order = await Order.findOne({ where: { user_id, id: order_id } });
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

        // Upload hình ảnh nếu có
        if (req.files) {
            const imageFeedbacks = req.files.map(file => ({
                feedback_id: newFeedback.id,
                url: `uploads/feedbacks/${file.filename}` // Lưu đường dẫn hình ảnh phản hồi
            }));

            await ImageFeedback.bulkCreate(imageFeedbacks); // Tạo nhiều bản ghi hình ảnh
        }

        res.status(201).json({ message: 'Feedback đã được gửi thành công', feedback: newFeedback });

    } catch (error) {
        console.error(error);
        next(error);
    }
};