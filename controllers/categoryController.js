const Category = require('../models/category');
const Product = require('../models/product');
const { formatResponse } = require('../utils/responseFormatter');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(formatResponse('Categories retrieved successfully', categories));
    } catch (error) {
        next(error);
    }
};

// API để lấy tất cả sản phẩm theo category
exports.getAllProductsByCategory = async (req, res, next) => {
    const { categoryId } = req.params;

    console.log('Category ID:', categoryId); // Logging categoryId

    try {
        const products = await Product.findAll({
            where: { category_id: categoryId },
            include: [{ model: Category, attributes: ['name'] }]
        });

        if (products.length === 0) {
            return res.status(404).json(formatResponse('Không tìm thấy sản phẩm cho danh mục này.', []));
        }

        return res.status(200).json(formatResponse('Products retrieved successfully', products));
    } catch (error) {
        console.error(error);
        next(error);
    }
};