const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");
 
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prod_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prod_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prod_percent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    best_seller: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
  },
  {
    tableName: "Products",
    timestamps: false,
  }
);
 
// connect category
Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Product;
