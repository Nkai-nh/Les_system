const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImageFeedback = sequelize.define(
  "ImageFeedback",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    feedback_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ImageFeedbacks",
    timestamps: false,
  }
); 

module.exports = ImageFeedback;
