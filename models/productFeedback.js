
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
<<<<<<< HEAD
const Image = require("./image");
const User = require("./user");
=======
const ImageFeedback = require("./imageFeedBack");
>>>>>>> ed98f37953f1bbf50011b6e5c04940a63c6c7f4f

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

ProductFeedback.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductFeedback, { foreignKey: "product_id", as: "feeedback" });

ProductFeedback.belongsTo(Product, { foreignKey: "feedback_id" });
Product.hasMany(ProductFeedback, { foreignKey: "feedback_id", as: "feeedback" });

ProductFeedback.belongsTo(ImageFeedback, { foreignKey: "image_id" });
ImageFeedback.hasMany(ProductFeedback, { foreignKey: "image_id", as: "feedbackImages" });

module.exports = ProductFeedback;