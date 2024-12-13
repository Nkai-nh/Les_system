const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true, // Hình ảnh có thể không bắt buộc
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Mặc định chưa được duyệt
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Blogs",
    timestamps: false,
  }
);

Blog.belongsTo(User, { foreignKey: "author_id" });
User.hasMany(Blog, { foreignKey: "author_id" });

module.exports = Blog;