
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const ImageFeedback = require("./imageFeedBack");

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

ProductFeedback.belongsTo(Product, { foreignKey: "feedback_id" });
Product.hasMany(ProductFeedback, { foreignKey: "feedback_id", as: "feeedback" });

ProductFeedback.belongsTo(ImageFeedback, { foreignKey: "image_id" });
ImageFeedback.hasMany(ProductFeedback, { foreignKey: "image_id", as: "feedbackImages" });

module.exports = ProductFeedback;