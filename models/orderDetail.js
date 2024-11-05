const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');
const Product = require('./product');

const OrderDetail = sequelize.define('OrderDetail', {
    product_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    order_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
   
}, {
    tableName: 'OrderDetails',
    timestamps: false,
});
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id' });
Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
Product.hasMany(OrderDetail, { foreignKey: 'product_id' });
module.exports = OrderDetail;