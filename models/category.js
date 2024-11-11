const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue : DataTypes.NOW
    },
}, {
    tableName: 'Categories',
    timestamps: false,
});

module.exports = Category;