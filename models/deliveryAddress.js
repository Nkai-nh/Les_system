const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    detail_address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    province: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    district: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    ward: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'DeliveryAddresses',
    timestamps: false
});
DeliveryAddress.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(DeliveryAddress, { foreignKey: 'user_id' });
module.exports = DeliveryAddress;