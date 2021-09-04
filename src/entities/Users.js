const { sequelize, sequel } = require('../../config/database');

const User = sequelize.define('User', {

    email: {
        type: sequel.DataTypes.STRING,
        primaryKey: true
    },

    username: {
        type: sequel.DataTypes.STRING,
        unique: true
    },

    password: {
        type: sequel.DataTypes.STRING,
        allowNull: false
    },

    bio: {
        type: sequel.DataTypes.TEXT,
        allowNull: true
    },

    image: {
        type: sequel.DataTypes.STRING,
        allowNull: true
    },

    followerCount: {
        type: sequel.DataTypes.INTEGER,
        defaultValue: 0
    }

}, {

    tableName: 'Users',
    timestamps: false,
    underscored: true
});



module.exports = { User };