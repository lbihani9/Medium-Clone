const { Article } = require('../src/entities/Articles');
const { User } = require('../src/entities/Users');
const { Follower } = require('../src/entities/Followers');
const { Comment } = require('../src/entities/Comments');

function setAssociations() {

    // One-To-Many relationship exist from User to Article.
    User.hasMany(Article, {
        onDelete: 'CASCADE'
    });
    Article.belongsTo(User, {
        foreignKey: 'userEmail'
    });

    /// Many-To-Many relationship exist between User to User. A User can follow many User, and a User can be followed by many other User.
    // by-default, cascading is used on delete, in case of many-to-many relation
    User.belongsToMany(User, {
        through: Follower,
        as: 'follower'
    });

    Article.hasMany(Comment, {
        onDelete: 'CASCADE'
    });
    Comment.belongsTo(Article, {
        foreignKey: 'articleId'                      //
    });

    // One-To-Many relationship exist from User to Comment.
    User.hasMany(Comment, {
        onDelete: 'CASCADE'
    });
    Comment.belongsTo(User, {
        foreignKey: 'userEmail'                      //
    });
}

module.exports = { setAssociations };