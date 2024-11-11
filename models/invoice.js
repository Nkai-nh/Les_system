const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đường dẫn tới file cấu hình database của bạn

const Invoice = sequelize.define('Invoice', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders', 
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'invoices'
});

module.exports = Invoice;