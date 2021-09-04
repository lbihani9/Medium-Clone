const { Article } = require("../entities/Articles");
const { Comment } = require("../entities/Comments");
const { Follower } = require("../entities/Followers");
const { User } = require("../entities/Users");

function generateError(status, message) {
    const error = { status, message }
    return JSON.stringify(error);
}

// @POST   /articles
async function addArticleToDB(authenticatedUser, content) {

    if (!content.title || !content.description || !content.body) {
        throw new Error(generateError(422, 'One or more of title, description, body is missing'));
    }

    try {
        const slug = content.title.split(" ").join("-");
        const article = await Article.create({
            slug: slug,
            title: content.title,
            description: (content.description !== 'undefined') ? content.description : 'Not Available',
            body: content.body,
            userEmail: authenticatedUser.email
        });

        const user = await User.findOne({
            where: {
                username: authenticatedUser.username
            },
            attributes: ['username', 'bio', 'image', 'followerCount']
        });

        article.dataValues.author = user.dataValues;
        /* {
            username: user.dataValues.username,
            bio: user.dataValues.bio,
            image: user.dataValues.image,
            followerCount: user.dataValues.followerCount
        }; */
        return article;

    } catch (e) {
        throw new Error(generateError(422, e.message));

    }
}

// Gets All recent articles.
// @GET      /articles
async function getAllArticles(limit, requestedUser, authenticatedUser) {
    let user;

    try {
        user = await User.findOne({
            where: {
                username: requestedUser.username
            },
            attributes: ['email', 'username', 'bio', 'image', 'followerCount']

        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

    if (!user) {
        throw new Error(generateError(404, "Requested user doesn\'t exist"));
    }

    try {
        const listOfArticles = [];

        const articles = await Article.findAll({
            where: {
                userEmail: user.dataValues.email
            },
            limit: limit
        });

        const requestedUserEmail = user.dataValues.email;
        delete user.dataValues.email;

        for (let article of articles) {
            const count = await Follower.count({
                where: {
                    userEmail: requestedUserEmail,                                      //user.dataValues.email,
                    followerEmail: authenticatedUser.email
                }
            });
            const following = (count != 0) ? true : false;

            article.dataValues.author = user.dataValues
            article.dataValues.author.following = following;
            /* {
                username: user.dataValues.username,
                bio: user.dataValues.bio,
                image: user.dataValues.image,
                following: following
            } */
            delete article.dataValues.userEmail;
            delete article.dataValues.UserEmail;

            listOfArticles.push(article);
        }
        return listOfArticles;

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

}

// @GET     /articles/{slug}
async function getArticleBySlug(slug, authenticatedUser) {

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
        throw new Error(generateError(404, 'No such article exist'));
    }

    try {
        const user = await User.findOne({
            where: {
                email: article.dataValues.userEmail
            },
            attributes: ['email', 'bio', 'image', 'username']
        });

        const count = await Follower.count({
            where: {
                userEmail: user.dataValues.email,
                followerEmail: authenticatedUser.email
            }
        });

        const following = (count != 0) ? true : false;
        delete user.dataValues.email;

        article.dataValues.author = user.dataValues;
        article.dataValues.author.following = following;
        /* {
            username: user.username,
            bio: user.bio,
            image: user.dataValues.image,
            followerCount: user.dataValues.followerCount,
            following: following
        } */

        return article;

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
}

// @DELETE      /articles/{slug}
async function deleteArticle(slug, authenticatedUser) {
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
        throw new Error(generateError(404, 'Requested Article doesn\'t exist'));
    }
    if (article.dataValues.userEmail !== authenticatedUser.email) {
        throw new Error(generateError(403, 'You aren\'t authorized to delete this article'));
    }

    try {
        await Article.destroy({
            where: {
                slug: slug,
                userEmail: authenticatedUser.email
            }
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
}

module.exports = { getAllArticles, deleteArticle, getArticleBySlug, addArticleToDB };