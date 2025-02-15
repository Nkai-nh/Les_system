const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { Op, Sequelize } = require('sequelize');
const { formatResponse } = require("../utils/responseFormatter");
const OrderDetail = require('../models/orderDetail');
const Image = require('../models/image');
const Category = require('../models/category');
const Coupons = require("../models/coupons")
const Blog = require("../models/blog")
const sequelize = require('../config/database');



///////------------Quản lý product----------------//////

// Lấy tất cả sản phẩm
async function getAllProducts(req, res) {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Image,
                    as: 'images', // Đảm bảo alias này cũng đúng
                },
                {
                    model: Category,
                    attributes: ['category_id', 'name'] // Lấy category_id và name
                }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error); // Log chi tiết lỗi
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
}
// Chỉnh sửa sản phẩm

const addProduct = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { category_id, prod_name, prod_description, price, cost, quantity, discount, prod_percent, best_seller, ratings, expiration_date, usage_instructions, benefits, origin, additional_info } = req.body;

        // Kiểm tra nếu có thiếu dữ liệu quan trọng
        if (!prod_name || !price || !cost || !quantity) {
            return res.status(400).json({ message: 'Thông tin sản phẩm không đầy đủ' });
        }

        // Tạo sản phẩm mới
        const newProduct = await Product.create({
            category_id,
            prod_name,
            prod_description,
            price,
            cost,
            quantity,
            discount,
            prod_percent,
            best_seller,
            ratings,
            expiration_date,
            usage_instructions, benefits, origin, additional_info
        });


        // Kiểm tra nếu có ảnh tải lên
        if (req.files && req.files.length > 0) {
            console.log('Các ảnh đã tải lên:', req.files);
            // Lưu thông tin hình ảnh
            const imagePromises = req.files.map(async (file) => {
                const imageUrl = file.path;  // Đường dẫn đến ảnh đã tải lên
                return await Image.create({
                    product_id: newProduct.id,  // Liên kết ảnh với sản phẩm
                    url: imageUrl,
                });
            });

            // Chờ tất cả các ảnh được lưu vào cơ sở dữ liệu
            await Promise.all(imagePromises);
        } else {
            console.log('Không có ảnh nào được tải lên');
        }

        // Trả về thông báo thành công
        res.status(201).json({
            message: 'Sản phẩm đã được thêm thành công!',
            product: newProduct,
        });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm' });
    }
};
async function updateProduct(req, res) {
    try {
        const productId = req.params.id;
        console.log('productID',productId)
        const {
            prod_name,
            category_id,
            prod_description,
            price,
            cost,
            quantity,
            discount,
            prod_percent,
            best_seller,
            ratings,
            expiration_date,
            usage_instructions,
            benefits,
            origin,
            additional_info
        } = req.body;

        const images = req.files; // Các file ảnh sẽ được lưu vào req.files
        console.log('Dữ liệu hình ảnh mới:', images);

        // Tìm sản phẩm theo ID
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Cập nhật thông tin sản phẩm
        await product.update({
            prod_name,
            category_id,
            prod_description,
            price,
            cost,
            quantity,
            discount,
            prod_percent,
            best_seller,
            ratings,
            expiration_date,
            usage_instructions, benefits, origin, additional_info
        });

        // Kiểm tra nếu có ảnh mới
        if (images && images.length > 0) {
            // Xóa hình ảnh cũ
            await Image.destroy({ where: { product_id: productId } });

            // Thêm hình ảnh mới vào cơ sở dữ liệu
            await Promise.all(images.map(image => {
                return Image.create({
                    product_id: productId,
                    url: image.path, // Lưu đường dẫn tới file ảnh đã tải lên
                });
            }));
        }

        // Lấy lại sản phẩm sau khi cập nhật, bao gồm cả hình ảnh
        const updatedProduct = await Product.findByPk(productId, {
            include: [{ model: Image, as: 'images' }]
        });

        res.json({
            message: 'Cập nhật sản phẩm thành công',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
}

// Xoá sản phẩm
async function deleteProduct(req, res) {
    const productId = req.params.id;
    try {
        // Xóa tất cả các bản ghi liên quan trong bảng orderdetails
        await OrderDetail.destroy({
            where: { product_id: productId }
        });
        // Kiểm tra xem sản phẩm có hình ảnh hay không
        const images = await Image.findAll({
            where: { product_id: productId }
        });

        // Nếu có hình ảnh, xóa chúng
        if (images.length > 0) {
            await Image.destroy({
                where: { product_id: productId }
            });
        }

        // Xóa sản phẩm
        const deletedProduct = await Product.destroy({
            where: { id: productId }
        });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại"
            });
        }

        return res.status(200).json({
            message: "Sản phẩm đã được xóa thành công"
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xoá sản phẩm', error });
    }
}

//add cateegory
const addCategory = async (req, res) => {
    try {
        const { category_id, name, description, slug } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!category_id || !name) {
            return res.status(400).json({ message: 'category_id và name là bắt buộc.' });
        }

        // Tạo danh mục mới
        const newCategory = await Category.create({
            category_id,
            name,
            description,
            slug,
            created_at: new Date() // Hoặc bạn có thể bỏ qua nếu sử dụng defaultValue
        });

        return res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi thêm danh mục.' });
    }
};

// get all category
const getAllCategory = async (req, res) => {
    try {
        const categoriesWithProductCount = await Category.findAll({
            attributes: [
                'category_id',
                'name',
                'description',
                'slug',
                [sequelize.fn('COUNT', sequelize.col('Products.category_id')), 'productCount']
            ],
            include: [{
                model: Product,
                attributes: [] // Không cần lấy thông tin sản phẩm
            }],
            group: ['Category.category_id'], // Nhóm theo category_id
            raw: true // Trả về kết quả thô
        });

        return res.status(200).json(categoriesWithProductCount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi lấy số lượng sản phẩm theo danh mục.' });
    }
};
// delete category
const deleteCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        const deletedCategory = await Category.destroy({
            where: { category_id }
        });

        if (deletedCategory) {
            return res.status(200).json({ message: 'Danh mục đã được xóa thành công.' });
        } else {
            return res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi xóa danh mục.' });
    }
};



///////----------Quản lý Order ---------------/////
// Lấy danh sách tất cả đơn hàng
async function getAllOrders(req, res) {
    try {
        // Lấy danh sách tất cả các đơn hàng, bao gồm chi tiết sản phẩm và thông tin người dùng
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email", "phone"], // Chỉ lấy các trường cần thiết
                },
                {
                    model: Product,
                    as: "products", // Alias đã định nghĩa trong quan hệ
                    through: {
                        model: OrderDetail,
                        attributes: ["quantity", "price"], // Lấy số lượng và giá của từng sản phẩm trong đơn hàng
                    },
                },
            ],
        });

        // Trả về danh sách đơn hàng
        res.status(200).json({
            success: true,
            message: "Fetched all orders successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};

// Xem chi tiết một đơn hàng

async function getOrderById(req, res) {
    const { id } = req.params; // Get order ID from route params
    try {
        const order = await Order.findOne({
            where: { id },
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id', 'prod_name', 'price', 'quantity'],
                    through: { attributes: ['quantity', 'price'] }, // Include OrderDetails fields
                },
                {
                    model: User,
                    attributes: ['name', 'email', 'phone'], // Include user info
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Cập nhật trạng thái đơn hàng
async function updateOrderStatus(req, res) {
    try {
        const orderId = req.params.id;
        const { orderStatus } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Cập nhật trạng thái đơn hàng
        await order.update({ orderStatus });
        res.json({ message: 'Cập nhật trạng thái đơn hàng thành công', order });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng', error });
    }
}

// Xoá đơn hàng
async function deleteOrder(req, res) {
    try {
        const orderId = req.params.id;

        await OrderDetail.destroy({
            where: {
                order_id: orderId,
            }
        });

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        await order.destroy();
        res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Không thể xóa đơn hàng do có chi tiết đơn hàng liên quan' });
        } else {
            res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error });
        }
    }
}

const addCoupon = async (req, res, next) => {
    try {
        const { product_id, coupons_percent, start_date, end_date, code } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!product_id || !coupons_percent || !start_date || !end_date || !code) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Tạo coupon mới
        const newCoupon = await Coupons.create({
            product_id,
            coupons_percent,
            start_date,
            end_date,
            code
        });

        res.status(201).json(newCoupon);
    } catch (error) {
        next(error);
    }
};


const getActiveCoupons = async (req, res, next) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Query for coupons where the end_date is greater than the current date
        const activeCoupons = await Coupons.findAll({
            where: {
                end_date: {
                    [Op.gt]: currentDate, // Filter coupons with end_date after the current date
                },
            },
        });

        // Return the active coupons
        res.status(200).json(activeCoupons);
    } catch (error) {
        next(error); // Forward the error to the error-handling middleware
    }
};

const getAllCoupons = async (req, res, next) => {
    try {
        const discounts = await Coupons.findAll();
        res.status(200).json(discounts);
    } catch (error) {
        next(error);
    }
};
// Function to delete a coupon by ID
const deleteCoupon = async (req, res, next) => {
    try {
        // Get coupon ID from request parameters
        const couponId = req.params.id;

        // Try to delete the coupon
        const deletedCoupon = await Coupons.destroy({
            where: {
                id: couponId, // Condition to find the coupon by its ID
            },
        });

        // If the coupon was not found or deleted
        if (deletedCoupon === 0) {
            return res.status(404).json({
                message: "Coupon not found or already deleted",
            });
        }

        // Respond with a success message
        res.status(200).json({
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        next(error); // Forward the error to the error-handling middleware
    }
};

//------------------------manage blogs--------------------------//

// Lấy danh sách tất cả bài viết (kể cả chưa được duyệt)
const  getAllBlogsAdmin = async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
            attributes: ["id", "title", "content", "image_url", "is_approved", "created_at", "author_id"],
        });

        return res.status(200).json(formatResponse("Blogs retrieved successfully", blogs));
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json(formatResponse(false, "Error fetching blogs"));
    }
};

// Lấy chi tiết một bài viết (kể cả chưa được duyệt)
const getDetailsBlogAdmin = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findOne({
            where: { id: blogId },
            attributes: ["id", "title", "content", "image_url", "is_approved", "created_at", "author_id"],
        });

        if (!blog) {
            return res.status(404).json(formatResponse(false, "Blog not found"));
        }

        return res.status(200).json(formatResponse("Blog retrieved successfully", blog));
    } catch (error) {
        console.error("Error fetching blog details:", error);
        return res.status(500).json(formatResponse(false, "Error fetching blog details"));
    }
};

// Xóa một bài viết
const deleteBlogAdmin = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const result = await Blog.destroy({
            where: { id: blogId },
        });

        if (result === 0) {
            return res.status(404).json(formatResponse(false, "Blog not found"));
        }

        return res.status(200).json(formatResponse(true, "Blog deleted successfully"));
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json(formatResponse(false, "Error deleting blog"));
    }
};

// Duyệt một bài viết
const  approveBlogAdmin = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findOne({ where: { id: blogId } });

        if (!blog) {
            return res.status(404).json(formatResponse(false, "Blog not found"));
        }

        blog.is_approved = true; // Đánh dấu bài viết đã được duyệt
        await blog.save();

        return res.status(200).json(formatResponse("Blog approved successfully", blog));
    } catch (error) {
        console.error("Error approving blog:", error);
        return res.status(500).json(formatResponse(false, "Error approving blog"));
    }
};
module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    addCategory,
    getAllCategory,
    deleteCategory,
    addCoupon,
    getAllCoupons,
    getActiveCoupons,
    deleteCoupon,
    getAllBlogsAdmin,
    getDetailsBlogAdmin,
    deleteBlogAdmin,
    approveBlogAdmin
};