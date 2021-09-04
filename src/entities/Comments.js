const { sequelize, sequel } = require("../../config/database");


const Comment = sequelize.define('Comments', {
    id: {
        type: sequel.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    body: {
        type: sequel.DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Comments',
    underscored: true
});

module.exports = { Comment }