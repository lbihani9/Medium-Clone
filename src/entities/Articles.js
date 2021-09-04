const { sequelize, sequel } = require('../../config/database');
const { User } = require('./Users');

// sequelize automatically adds timestamp by-default.

const Article = sequelize.define('Article', {
    id: {
        type: sequel.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    slug: {
        type: sequel.DataTypes.STRING,
        allowNull: false
    },
    
    title: {
        type: sequel.DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: sequel.DataTypes.STRING,
        allowNull: true
    },

    body: {
        type: sequel.DataTypes.TEXT,
        allowNull: false
    },

}, {

    tableName: 'Articles',
    underscored: true

});

module.exports = { Article };