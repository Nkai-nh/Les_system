const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Images",
    timestamps: false,
  }
);
Image.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Image, { foreignKey: "product_id", as: "images" });

module.exports = Image;
