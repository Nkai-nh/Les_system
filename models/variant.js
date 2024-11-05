const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const VariantType = require("./variantType");
const Product = require("./product");

const Variant = sequelize.define(
  "Variant",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required" },
        notEmpty: { msg: "Name should not be empty" },
      },
    },
    variantType_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "variants", // Đặt tên bảng nếu cần
  }
);

 
Product.belongsToMany(Variant, { through: 'ProductVariant', as: 'variants' ,timestamps: false});
Variant.belongsToMany(Product, { through: 'ProductVariant', as: 'products' ,timestamps: false});

Variant.belongsTo(VariantType, { foreignKey: "variantType_id" });
VariantType.hasMany(Variant, { foreignKey: "variantType_id", as: "variants" });

module.exports = Variant;
