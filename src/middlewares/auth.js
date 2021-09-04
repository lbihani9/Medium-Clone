const { verify } = require("../../utils/jwt");

async function authByToken(req, res, next) {
    const authHeader = req.header('Authorization').split(' ');

    if (!authHeader) {
        return res.status(401).json({
            errors: {
                body: ['Authorization failed', 'Not Authorization Header']
            }
        });
    }

    if (authHeader[0] !== 'Token') {
        return res.status(401).json({
            errors: {
                body: ['Authorization failed', 'Token missing']
            }
        });
    }

    const token = authHeader[1];
    try {
        const user = await verify(token);
        if (!user) {
            throw new Error('No user found in token');
        }
        
        user.token = token;
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).json({
            errors: {
                body: ['Authorization failed', e.message]
            }
        });
    }

}

module.exports = { authByToken };