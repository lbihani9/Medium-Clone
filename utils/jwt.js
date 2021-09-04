const jwt = require('jsonwebtoken');
const jwtSecret = 'sorry-it-is-a-secret-can\'t-tell';

async function sign(user) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            username: user.dataValues.username,
            email: user.dataValues.email
        }, jwtSecret, (err, token) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(token);
            }
        });
    });
}

// returns the decoded value, if resolves.
async function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(decoded);
            }
        });
    });
}



// A small test for correctness.

/* async function test() {
    const payload = {username: "adac_fe", email: "qwe@gmail.com"};
    const token = await sign(payload);
    console.log(`Token: ${token}\npayload: ${payload}.`);

    const decodedString = await verify(token);
    const {username, email} = decodedString; 
    console.log("Are decoded string and payload same? :", (username === payload.username) && (email === payload.email));
}

test(); */

module.exports = { sign, verify };