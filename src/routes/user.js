const route = require('express').Router();
const { hashPassword } = require('../../utils/password');
const { getUserByEmail, updateUserDetails } = require('../controllers/users');
const { authByToken } = require('../middlewares/auth');
// @HTTP-method /api/user

route.get('/', authByToken, async (req, res) => {

    try {
        const user = await getUserByEmail(req.user.email);
        if (!user) {
            res.setStatus(404);
            throw new Error('No such user found');
        }

        return res.json({ user });
    } catch (e) {
        const status = res.status ? res.status : 422;
        return res.status(status).json({
            errors: {
                body: [e.message]
            }
        });
    }
});

route.patch('/', authByToken, async (req, res) => {

    try {
        const user = await getUserByEmail(req.user.email);
        let updatedUser = {};

        if (!user) {
            res.setStatus(404);
            throw new Error('No such user found');
        }

        if (req.body.user) {
            const username = req.body.user.username ? req.body.user.username : user.username;
            const bio = req.body.user.bio ? req.body.user.bio : user.bio;
            const image = req.body.user.image ? req.body.user.image : user.image;

            if (req.body.user.password) {
                const newPass = await hashPassword(req.body.user.password);
                updatedUser = await updateUserDetails({ username, bio, image, newPass }, user.email);
            }
            else {
                const pass = user.password;
                updatedUser = await updateUserDetails({ username, bio, image, pass }, user.email);
            }

            return res.status(201).json(updatedUser);
        }
        else {
            throw new Error('Received empty user body');
        }
    } catch (e) {
        const status = res.statusCode ? res.statusCode : 422;
        return res.status(status).json({
            errors: {
                body: [e.message]
            }
        })
    }

});

module.exports.userRoute = route;