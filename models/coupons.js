
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");

const Coupons = sequelize.define(
  "Coupons",
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
    coupons_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Coupons",
    timestamps: false,
  }
);

// connect product
Product.hasMany(Coupons, { foreignKey: "product_id" });
Coupons.belongsTo(Product, { foreignKey: "product_id" });

module.exports = Coupons;