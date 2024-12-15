const express = require('express');
const blogController = require("../controllers/blogController.js")
const router = express.Router();
const uploadBlogs = require('../middlewares/uploadMiddlewareBlogs.js'); 
const { authenticate } = require('../middlewares/authMiddleware.js');
   
router.get('/all', blogController.getAllBlog);
router.post('/write-blogs', uploadBlogs.single('image_url'), blogController.writeBlog);
router.get("/:blogId", blogController.getDetailsBlog); // Lấy chi tiết bài viết
router.post("/comments", authenticate , blogController.createComment); // Lấy chi tiết bài viết
router.delete("/comments/:comment_id", authenticate, blogController.deleteComment); // Lấy chi tiết bài viết
router.get('/:blog_id/comments', blogController.getAllCommentsForBlog);
module.exports = router;