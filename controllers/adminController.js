const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { Op, Sequelize } = require('sequelize');
const { formatResponse } = require("../utils/responseFormatter");
const OrderDetail = require('../models/orderDetail');
const Image = require('../models/image');

//////----------Quản lý người dùng-------------////

// Lấy danh sách người dùng
async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'created_at'],
        });
        res.status(200).json({
            success: true,
            data: users,
            message: 'Danh sách người dùng đã được lấy thành công.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy danh sách người dùng', error });
    }
}
// Thay đổi quyền người dùng
async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body; // Role mới: 'user', 'manager', hoặc 'admin'

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    }

    if (!['user', 'manager', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Role không hợp lệ' });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        user.role = role;
        await user.save();
        res.json({ message: 'Cập nhật quyền người dùng thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật quyền người dùng', error });
    }
}
// Xóa người dùng
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        await user.destroy();
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa người dùng', error });
    }
}
// update user
async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { name, email, phone, role, default_address } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }
        if (!['user', 'manager', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role không hợp lệ' });
        }
        await user.update({ name, email, phone, role, default_address });
        res.json({ message: 'Cập nhật thông tin user thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật user', error });
    }
}


///////------------Quản lý product----------------//////

// Lấy tất cả sản phẩm
async function getAllProducts(req, res) {
    try {
        const products = await Product.findAll({
            include: [
                {model: Image,
                as: 'images',}
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
}

// Thêm sản phẩm mới
async function addProduct(req, res) {
    try {
        const {category_id,prod_name,prod_description,price,cost,quantity,prod_percent,best_seller,ratings,expiration_date,images } = req.body;

        const newProduct = await Product.create({category_id,prod_name,prod_description,price,cost,quantity,prod_percent,best_seller,ratings,expiration_date,});

                const createdImages = [];

        // Kiểm tra và thêm hình ảnh nếu có
        if (images && images.length > 0) {
            const uniqueImages = [...new Set(images)];

            const imagePromises = uniqueImages.map(async url => {
                const newImage = await Image.create({
                    product_id: newProduct.id,
                    url,
                });
                createdImages.push(newImage); // Lưu lại hình ảnh đã tạo
            });
            await Promise.all(imagePromises);
        }

        return res.status(201).json({
            message: "Sản phẩm đã được tạo thành công",
            product: {
                ...newProduct.toJSON(), // Chuyển đổi thành đối tượng JSON
                images: createdImages // Thêm hình ảnh vào phản hồi
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo sản phẩm",
            error: error.message,
        });
    }
}

// Chỉnh sửa sản phẩm
async function updateProduct(req, res) {
    try {
        const productId = req.params.id;
        const {
            prod_name,
            category_id,
            prod_description,
            price,
            cost,
            quantity,
            prod_percent,
            best_seller,
            ratings,
            expiration_date,
            images
        } = req.body;

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
            prod_percent,
            best_seller,
            ratings,
            expiration_date
        });

        // Cập nhật hình ảnh nếu có
        if (images && images.length > 0) {
            // Xóa hình ảnh cũ
            await Image.destroy({
                where: { product_id: productId }
            });

            // Thêm hình ảnh mới
            await Promise.all(images.map(image =>
                Image.create({ product_id: productId, url: image })
            ));
        }

        // Lấy lại sản phẩm cùng với hình ảnh
        const updatedProduct = await Product.findByPk(productId, {
            include: [{ model: Image, as: 'images' }] // Đảm bảo rằng mô hình Image đã được định nghĩa đúng
        });

        res.json({
            message: 'Cập nhật sản phẩm thành công',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error); // Ghi log lỗi để dễ dàng debug
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


///////----------Quản lý Order ---------------/////
// Lấy danh sách tất cả đơn hàng
async function getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll();
            res
                .status(200)
                .json(formatResponse("Orders retrieved successfully", orders));
        } catch (error) {
            next(error);
        }

}

// Xem chi tiết một đơn hàng
async function getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error });
    }
}


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



////////-----------Báo cáo doanh thu---------------///////
async function getSalesReport(req, res) {
    try {
        // Giả sử chúng ta tính tổng doanh thu từ bảng Order
        const totalRevenue = await Order.sum('total'); // là tổng giá trị đơn hàng
        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'ERROR', error });
    }
}

// Báo cáo doanh thu theo tháng
async function getMonthlySalesReport(req, res) {
    try {
        const month = req.query.month || new Date().getMonth() + 1; // Tháng hiện tại nếu không cung cấp
        const year = req.query.year || new Date().getFullYear(); // Năm hiện tại nếu không cung cấp

        const startDate = new Date(year, month - 1, 1); // Bắt đầu tháng
        const endDate = new Date(year, month, 1); // Kết thúc tháng (đầu tháng tiếp theo)

        const monthlyRevenue = await Order.sum('total', {
            where: {
                created_at: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            }
        });

        res.json({ month, year, monthlyRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy báo cáo doanh thu tháng', error });
    }
}

// Báo cáo doanh thu theo quý
async function getQuarterlySalesReport(req, res) {
    try {
        const quarter = req.query.quarter || Math.ceil((new Date().getMonth() + 1) / 3); // Quý hiện tại nếu không cung cấp
        const year = req.query.year || new Date().getFullYear(); // Năm hiện tại nếu không cung cấp

        const startMonth = (quarter - 1) * 3;
        const startDate = new Date(year, startMonth, 1); // Bắt đầu quý
        const endDate = new Date(year, startMonth + 3, 1); // Kết thúc quý (đầu tháng tiếp theo của quý)

        const quarterlyRevenue = await Order.sum('total', {
            where: {
                created_at: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            }
        });

        res.json({ quarter, year, quarterlyRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy báo cáo doanh thu quý', error });
    }
}

// Báo cáo doanh thu theo năm
async function getYearlySalesReport(req, res) {
    try {
        const year = req.query.year || new Date().getFullYear(); // Năm hiện tại nếu không cung cấp

        const startDate = new Date(year, 0, 1); // Bắt đầu năm
        const endDate = new Date(year + 1, 0, 1); // Kết thúc năm(đầu năm tiếp theo)

        const yearlyRevenue = await Order.sum('total', {
            where: {
                created_at: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            }
        });

        res.json({ year, yearlyRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy báo cáo doanh thu năm', error });
    }
}


///////------------ Báo cáo hoạt động----------////////

async function getActivityReport(req, res) {
    try {

        const [
            totalUsers,
            totalOrders,
            totalProducts,
            orderStatusCounts,
            productCategoryCounts,
            newUsersMonthly,
            dailyVisitors,
            weeklyVisitors
        ] = await Promise.all([
            User.count(),
            Order.count(),
            Product.count(),
            // Số lượng đơn hàng theo trạng thái
            Order.findAll({
                attributes: ['orderStatus', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['orderStatus'],
            }),
            // số lượng sp theo danh mục
            Product.findAll({
                attributes: ['category_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['category_id'],
            }),
            //số lượng người dùng theo tháng
            User.findAll({
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                group: [
                    Sequelize.fn('MONTH', Sequelize.col('created_at'))
                ],
            }),
            //khách hàng truy cập hằng ngày
            User.findAll({
                attributes: [
                    [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)), // Lấy dữ liệu của 30 ngày gần nhất
                    }
                },
                group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
                order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
            }),
            //khách hàng truy cập hằng tuần
            User.findAll({
                attributes: [
                    [Sequelize.fn('WEEK', Sequelize.col('created_at')), 'week'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                where: {
                    created_at: {
                        [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 90)), // Lấy dữ liệu của 90 ngày gần nhất
                    }
                },
                group: [Sequelize.fn('WEEK', Sequelize.col('created_at'))],
                order: [[Sequelize.fn('WEEK', Sequelize.col('created_at')), 'ASC']]
            }),
        ]);


        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            orderStatusCounts: orderStatusCounts || [],
            productCategoryCounts: productCategoryCounts || [],
            newUsersMonthly: newUsersMonthly || [],
            dailyVisitors,
            weeklyVisitors
        });
    } catch (error) {
        console.error('Error fetching activity report:', error);
        res.status(500).json({ message: 'ERROR', error: error.message });
    }
}



module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getSalesReport,
    getActivityReport,
    getMonthlySalesReport,
    getQuarterlySalesReport,
    getYearlySalesReport,
    updateUser,
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};