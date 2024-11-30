const Category = require('../models/category');
const Product = require('../models/product');
const Image = require('../models/image');
const { formatResponse } = require('../utils/responseFormatter');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

exports.getAllCategories = async (req, res) => {
    try {
        const categoriesWithProductCount = await Category.findAll({
            attributes: [
                'category_id',
                'name',
                'description',
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


// API để lấy tất cả sản phẩm theo category
exports.getAllProductsByCategory = async (req, res, next) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.findAll({
            where: { category_id: categoryId },
            include: [
                { model: Category, attributes: ['name'] },
                { model: Image, as: 'images', attributes: ['url'] } // Ensure 'as' matches your association
            ],
        });

        if (!products || products.length === 0) {
            return res.status(404).json(formatResponse('Không tìm thấy sản phẩm cho danh mục này.', []));
        }

        return res.status(200).json(formatResponse('Products retrieved successfully', products));
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};