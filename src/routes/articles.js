const { getAllArticles,
    getArticleBySlug,
    addArticleToDB,
    deleteArticle,
} = require('../controllers/articles');

const { deleteCommentById,
    addComment,
    getAllCommentsOnArticle
} = require('../controllers/comments');

const { authByToken } = require('../middlewares/auth');
const route = require('express').Router()

// @GET    /api/articles
route.get('/', authByToken, async (req, res) => {
    try {
        const limit = (req.query.limit !== 'undefined') ? req.query.limit : 5;
        const articles = await getAllArticles(limit, req.query, req.user);
        return res.status(200).json({ articles });

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }
});

// @GET    /api/articles/{slug}
route.get('/:slug', authByToken, async (req, res) => {
    try {
        const article = await getArticleBySlug(req.params.slug, req.user);
        return res.status(200).json({ article });

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }

});

// @POST    /api/articles
route.post('/', authByToken, async (req, res) => {
    try {
        const article = await addArticleToDB(req.user, req.body.article);
        return res.status(201).json({ article });

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }
});

// @DELETE   /api/articles/{slug}
route.delete('/:slug', authByToken, async (req, res) => {
    try {
        await deleteArticle(req.params.slug, req.user);
        return res.sendStatus(200);

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }

});

// @GET     /api/{slug}/comments/{id}
route.get('/:slug/comments/:id', authByToken, async (req, res) => {
    try {
        const comments = await getAllCommentsOnArticle(req.params.slug, req.params.id);
        return res.status(200).send({ comments });
    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }

});

// @POST      /api/{slug}/comments
route.post('/:slug/comments', authByToken, async (req, res) => {
    try {
        const comment = await addComment(req.params.slug, req.user, req.body);
        return res.status(200).send({ comment });
    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }

});


// @DELETE     /api/{slug}/comments/{id}
route.delete('/:slug/comments/:id', authByToken, async (req, res) => {
    try {
        await deleteCommentById(req.params.slug, req.params.id, req.user);
        return res.sendStatus(200);
    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }
});



module.exports.articlesRoute = route;