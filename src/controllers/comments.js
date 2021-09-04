const { User } = require('../entities/Users');
const { Article } = require('../entities/Articles');
const { Follower } = require('../entities/Followers');
const { Comment } = require('../entities/Comments');


function generateError(status, message) {
    const error = { status, message };
    return JSON.stringify(error);
}

// @GET    /articles/{slug}/comments/{id}
async function getAllCommentsOnArticle(slug, id) {
    // id is articleId.
    let article;
    try {
        article = await Article.findOne({
            where: {
                slug: slug
            }
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
    if (!article) {
        throw new Error(generateError(404, 'requested article doesn\'t exist'));
    }
    if (article.dataValues.id !== Number(id)) {
        throw new Error(generateError(400, 'slug and it\'s corresponding id doesn\'t match'));
    }

    try {
        const comments = await Comment.findAll({
            where: {
                articleId: Number(id),
            },
            include: [{
                model: User,
                attributes: ['username', 'bio', 'image', 'followerCount']
            }]
        });
        return comments;

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
}

// @POST    /articles/{slug}/comments
async function addComment(slug, authenticatedUser, body) {
    let article;
    try {
        article = await Article.findOne({
            where: {
                slug: slug
            }
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

    if (!article) {
        throw new Error(generateError(404, 'Article doesn\'t exist'));
    }

    try {
        const comment = await Comment.create({
            body: body.comment.body,
        });

        const commentWritter = await User.findOne({
            where: {
                email: authenticatedUser.email
            }
        });

        // These 2 methods are automatically created by Sequelize ORM.
        commentWritter.addComments(comment);
        article.addComments(comment);

        comment.dataValues.author = {
            username: commentWritter.dataValues.username,
            bio: commentWritter.dataValues.bio,
            image: commentWritter.dataValues.image,
            followerCount: commentWritter.dataValues.followerCount,
        };
        return comment;

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

}

// @DELETE    /articles/{slug}/comments/{id}
async function deleteCommentById(slug, id, authenticatedUser) {
    // here, id is equal to comment's id.
    let article, comment;
    try {
        article = await Article.findOne({
            where: {
                slug: slug
            }
        });

        comment = await Comment.findOne({
            where: {
                id: id
            }
        });

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

    if (!article) {
        throw new Error(generateError(404, 'Requested article doesn\'t exist'));
    }
    if (!comment) {
        throw new Error(generateError(404, 'Comment doesn\'t exist'));
    }
    if (comment.dataValues.userEmail !== authenticatedUser.email) {
        throw new Error(generateError(403, 'You aren\'t authorized to delete this comment'));
    }

    try {
        await Comment.destroy({
            where: {
                id: id,
                userEmail: authenticatedUser.email
            }
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
}

module.exports = { addComment, deleteCommentById, getAllCommentsOnArticle };