const { sequel, sequelize } = require("../../config/database");
const { User } = require("./Users");

const Follower = sequelize.define('Followers', {
    userEmail: {
        type: sequel.DataTypes.STRING,
        references: {
            model: User,
            key: 'email'
        }
    },

    followerEmail: {
        type: sequel.DataTypes.STRING,
        references: {
            model: User,
            key: 'email'
        }
    }
}, {
    tableName: 'Followers',
    timestamps: false,
    underscored: true
});

module.exports = { Follower };