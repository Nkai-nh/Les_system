const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Blog = require("./blog"); // Import mô hình Blog

// Mô hình CommentBlogs
const CommentBlogs = sequelize.define(
    "CommentBlogs",
    {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        blog_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "CommentBlogs", // Đổi tên bảng
        timestamps: false,
    }
);

// Thiết lập quan hệ
CommentBlogs.belongsTo(User, { foreignKey: "author_id" });
CommentBlogs.belongsTo(Blog, { foreignKey: "blog_id" });

module.exports = CommentBlogs;
