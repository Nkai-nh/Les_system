const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const User = require("./user");

const ProductReview = sequelize.define(
  "ProductReview",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ProductReviews",
    timestamps: false,
  }
);

ProductReview.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ProductReview, { foreignKey: "user_id" });
ProductReview.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductReview, { foreignKey: "product_id", as: "reviews" });

module.exports = ProductReview;
