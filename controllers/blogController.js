const Blog = require("../models/blog");
const { formatResponse } = require("../utils/responseFormatter");


exports.getAllBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findAll();
        res.status(200).json(formatResponse('Blog retrieved successfully', blog));
    } catch (error) {
        next(error);
    }
};