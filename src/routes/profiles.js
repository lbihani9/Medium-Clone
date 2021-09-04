const { getProfileByUsername, followUser, unfollowUser } = require('../controllers/profiles');
const { authByToken } = require('../middlewares/auth');

const route = require('express').Router();

// @GET   /api/profiles/{username}
route.get('/:username', authByToken, async (req, res) => {
    try {
        const profile = await getProfileByUsername(req.params.username, req.user);
        return res.status(200).json({ profile });

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }
});

// @POST      /api/profiles/{username}/follow
route.post('/:username/follow', authByToken, async (req, res) => {
    try {
        const profile = await followUser(req.params.username, req.user);
        return res.status(200).json({ profile });

    } catch(e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }
});

// @DELETE     /api/profiles/{username}/follow
route.delete('/:username/follow', authByToken, async (req, res) => {
    try {
        await unfollowUser(req.params.username, req.user.username);
        return res.sendStatus(200)

    } catch (e) {
        const error = JSON.parse(e.message);
        return res.status(error.status).json({
            errors: {
                body: [error.message]
            }
        });
    }

});


module.exports.profilesRoute = route;