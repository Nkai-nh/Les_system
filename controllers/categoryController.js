const Category = require('../models/category');
const { formatResponse } = require('../utils/responseFormatter');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(formatResponse('Categories retrieved successfully', categories));
    } catch (error) {
        next(error);
    }
};