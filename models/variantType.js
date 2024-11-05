const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');

// Define the VariantType model
const VariantType = sequelize.define(
  "VariantType",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required" },
        notEmpty: { msg: "Name should not be empty" },
      },
      trim: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Type is required" },
        notEmpty: { msg: "Type should not be empty" },
      },
      trim: true,
    },
  },
  {
    timestamps: false,
    tableName: "variant_types", // Đặt tên bảng nếu cần
  }
);

module.exports = VariantType;