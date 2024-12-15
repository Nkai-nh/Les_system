const Blog = require("../models/blog");
const CommentBlogs = require("../models/commentBlogs");
const User = require("../models/user");
const { formatResponse } = require("../utils/responseFormatter");


// Lấy tất cả các bài viết đã được duyệt
exports.getAllBlog = async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
            where: { is_approved: true }, // Chỉ lấy bài đã được duyệt
        });

        return res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            data: blogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json(formatResponse(false, "Error fetching blogs"));
    }
};

// Người dùng tạo một bài viết mới
exports.writeBlog = async (req, res, next) => {
    const { title, content, author_id } = req.body;

    try {
        // Kiểm tra các trường bắt buộc
        if (!title || !content || !author_id) {
            return res.status(400).json(formatResponse(false, "Title, content, and author_id are required."));
        }

        // Lấy đường dẫn file từ req.file
        const image_url = req.file ? req.file.path : null;

        // Tạo bài viết
        const newBlog = await Blog.create({
            title,
            content,
            author_id,
            image_url,
            is_approved: false,
        });

        return res.status(201).json(formatResponse("Blog created successfully, waiting for approval", newBlog));
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json(formatResponse(false, "Error creating blog"));
    }
};

// Lấy chi tiết một bài viết
exports.getDetailsBlog = async (req, res, next) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findOne({
            where: { id: blogId, is_approved: true }, // Chỉ lấy bài đã được duyệt
            attributes: ["id", "title", "content", "image_url", "created_at", "author_id"],
        });

        if (!blog) {
            return res.status(404).json(formatResponse(false, "Blog not found or not approved"));
        }

        return res.status(200).json(formatResponse("Blog retrieved successfully", blog));
    } catch (error) {
        console.error("Error fetching blog details:", error);
        return res.status(500).json(formatResponse(false, "Error fetching blog details"));
    }
};

// Hàm viết comment
exports.createComment = async (req, res, next) => {
    try {
        console.log("User in request:", req.user); // Kiểm tra giá trị của req.user
        const { blog_id, content } = req.body;
        const author_id = req.user.id;

        if (!blog_id || !content) {
            return res.status(400).json({ success: false, message: "Blog ID and content are required" });
        }

        const comment = await CommentBlogs.create({ blog_id, content, author_id });

        return res.status(201).json({ success: true, message: "Comment created successfully", data: comment });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ success: false, message: "Error creating comment" });
    }
};


// Hàm xoá comment của chính mình
exports.deleteComment = async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        const author_id = req.user.id; // ID người dùng lấy từ token hoặc session

        // Tìm comment cần xoá
        const comment = await CommentBlogs.findOne({
            where: {
                id: comment_id,
                author_id, // Đảm bảo chỉ xoá comment của chính người dùng
            },
        });

        // Nếu không tìm thấy comment hoặc không thuộc quyền sở hữu
        if (!comment) {
            return res.status(404).json(formatResponse(false, "Comment not found or unauthorized"));
        }

        // Xoá comment
        await comment.destroy();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json(formatResponse(false, "Error deleting comment"));
    }
};

exports.getAllCommentsForBlog = async (req, res, next) => {
    try {
        const { blog_id } = req.params;
        console.log('Received request for comments on blog ID:', blog_id);

        if (!blog_id) {
            return res.status(400).json({ success: false, message: "Blog ID is required" });
        }

        const comments = await CommentBlogs.findAll({
            where: { blog_id },
            include: [
                { model: User, attributes: ['id', 'name'] } // Include user details if needed
            ],
        });

        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, message: "Error fetching comments" });
    }
};