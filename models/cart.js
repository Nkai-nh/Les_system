const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Product = require("./product");

const Cart = sequelize.define(
  "Cart",
  {
    user_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    prod_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    is_possible_to_order: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    tableName: "Cart",
    timestamps: false,
  }
);
Cart.belongsTo(User, { foreignKey: "user_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });
module.exports = Cart;
