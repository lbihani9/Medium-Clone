const { User } = require('../entities/Users');
const { hashPassword, matchPassword } = require('../../utils/password');
const { sanitizeFields } = require('../../utils/security');
const { sign } = require('../../utils/jwt');

async function createUser(data) {

    if (!data.username) {
        throw new Error('username not found.');
    }
    if (!data.email) {
        throw new Error('email not found.');
    }
    if (!data.password) {
        throw new Error('password not found.');
    }

    try {
        const password = await hashPassword(data.password);

        const user = await User.create({
            username: data.username,
            email: data.email,
            password: password
        });

        user.dataValues.token = await sign(user);
        return await sanitizeFields(user);
        
    } catch (e) {
        throw e;
    }
}

async function loginUser(data) {

    // check data validation.
    if (!data.email) {
        throw new Error('email not found.');
    }
    if (!data.password) {
        throw new Error('password not found.');
    }

    // check if email exists
    const user = await User.findOne({ 
        where: { 
            email: data.email 
        } 
    });
    if (user === null) {
        throw new Error('No user exists with this email id.');
    }

    // check if password matches
    const passmatch = await matchPassword(user.password, data.password);
    if (passmatch === false) {
        throw new Error('Incorrect Password.');
    }

    user.dataValues.token = await sign(user);
    return await sanitizeFields(user);
}


// @GET       /api/user
async function getUserByEmail(email) {
    const user = await User.findOne({ 
        where: { 
            email: email 
        } 
    });
    if (user === null) {
        throw new Error('No user exists with this email id');
    }

    user.dataValues.token = await sign(user);
    return await sanitizeFields(user);
}

// @PATCH  /api/user
async function updateUserDetails(data, email) {
    const [metadata, updatedUser] = await User.update(data, { 
        returning: true,
        where: { 
            email: email 
        } 
    });
    
    if (!updatedUser) {
        throw new Error('Couldn\'t update the details.');
    }

    updatedUser.dataValues.token = await sign(updatedUser);
    return await sanitizeFields(updatedUser);
}

module.exports = { createUser, loginUser, getUserByEmail, updateUserDetails };