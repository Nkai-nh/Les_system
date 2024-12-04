
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const Image = require("./image");
const User = require("./user");
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

ProductFeedback.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ProductFeedback, { foreignKey: "user_id" });

// ProductFeedback.belongsTo(Product, { foreignKey: "product_id" });
// Product.hasMany(ProductFeedback, { foreignKey: "product_id", as: "feedback" });

// ProductFeedback.belongsTo(Product, { foreignKey: "feedback_id" });
// Product.hasMany(ProductFeedback, { foreignKey: "feedback_id", as: "feeedback" });

// ProductFeedback.belongsTo(ImageFeedback, { foreignKey: "image_id" });
// ImageFeedback.hasMany(ProductFeedback, { foreignKey: "image_id", as: "feedbackImages" });
// ProductFeedback.belongsTo(Image, { foreignKey: "image_id" });
// Image.hasMany(ProductFeedback, { foreignKey: "image_id", as: "feedbackImages" });
ProductFeedback.hasMany(ImageFeedback, { foreignKey: "feedback_id", as: "images" });
ImageFeedback.belongsTo(ProductFeedback, { foreignKey: "feedback_id" });

module.exports = ProductFeedback;