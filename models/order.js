const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    paymentMethods: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_payment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    orderStatus: {
      //  enum
      type: DataTypes.ENUM(
        "progress",
        "pending",
        "shipping",
        "completed",
        "confirmed",
        "resolved",
        "canceled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    cancel_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "Orders",
    timestamps: false,
  }
);
Order.belongsTo(User, { foreignKey: "user_id" });
module.exports = Order;
