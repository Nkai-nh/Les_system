const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const ProvidedUser = sequelize.define('ProvidedUser', {
    user_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    provider: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'ProvidedUsers',
    timestamps: false,
});
ProvidedUser.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ProvidedUser, { foreignKey: 'user_id' });
module.exports = ProvidedUser;