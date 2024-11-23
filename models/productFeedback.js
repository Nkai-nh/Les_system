
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const Image = require("./image");

const ProductFeedback = sequelize.define(
  "ProductFeedback",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ProductFeedback",
    timestamps: true,
  }
);

ProductFeedback.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductFeedback, { foreignKey: "product_id", as: "feeedback" });

ProductFeedback.belongsTo(Image, { foreignKey: "image_id" });
Image.hasMany(ProductFeedback, { foreignKey: "image_id", as: "feedbackImages" });

module.exports = ProductFeedback;