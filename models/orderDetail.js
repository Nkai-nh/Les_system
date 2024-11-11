const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");
const Product = require("./product");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    product_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    tableName: "OrderDetails",
    timestamps: false,
  }
);

Product.belongsToMany(
  Order,
  {
    through: OrderDetail,
    foreignKey: "product_id",
    otherKey: "order_id",
     as: 'orders'
  }
)

Order.belongsToMany(
  Product,
  {
    through: OrderDetail,
    foreignKey: "order_id",
    otherKey: "product_id",
    as: 'products'
  }
)


module.exports = OrderDetail;
