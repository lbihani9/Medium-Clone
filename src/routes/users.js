const route = require('express').Router()
const { createUser, loginUser } = require('../controllers/users');

// HTTP Method /api/users/*

route.post('/', async (req, res) => {
    try {
        const user = await createUser(req.body.user);
        
        return res.send(user);
    } catch (e) {
        return res.status(422).json({
            errors: {
                body: ['Could not create user.', e.message]
            }
        });
    }
});

route.post('/login', async (req, res) => {
    try {
        const user = await loginUser(req.body.user);
        res.send(user);

    } catch (e) {
        return res.status(422).json({
            errors: {
                body: ['Login Failed', e.message]
            }
        });
    }
});


module.exports.usersRoute = route;
