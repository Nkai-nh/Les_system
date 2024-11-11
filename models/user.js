const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    registration_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    confirmation_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "user",
    },
    subject: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    default_address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

module.exports = User;
