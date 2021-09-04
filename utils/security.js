
async function sanitizeFields(user) {
    if (user.dataValues.password) {
        delete user.dataValues.password;
    }

    //console.log(user);
    return user;
}


module.exports = { sanitizeFields };