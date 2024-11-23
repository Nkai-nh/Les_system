const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Đường dẫn tới file cấu hình database của bạn
const Order = require("./order");

const Invoice = sequelize.define(
  "Invoice",
  {
    orderId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "invoices",
  }
);

Invoice.hasMany(Order, {
  foreignKey: "orderId",
  as: "order",
});

Order.belongsTo(Invoice, {
  foreignKey: "orderId",
  as: "order",
});

module.exports = Invoice;
