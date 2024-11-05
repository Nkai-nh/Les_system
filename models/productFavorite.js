const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const User = require("./user");

const ProductFavorite = sequelize.define(
  "ProductFavorite",
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
  },
  {
    tableName: "ProductFavorites",
    timestamps: false,
  }
);
ProductFavorite.belongsTo(User, { foreignKey: "user_id" });
ProductFavorite.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = ProductFavorite;
