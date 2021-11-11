const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const { Follower } = require("../entities/Followers");
const { User } = require("../entities/Users");

function generateError(status, message) {
    const error = { status, message };
    return JSON.stringify(error);
}

// @GET      /profiles/{username}
async function getProfileByUsername(requestedUser, authenticatedUser) {
    let user;
    try {
        user = await User.findOne({
            where: {
                username: requestedUser
            },
            attributes: ['email', 'username', 'bio', 'image', 'followerCount']
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
    if (!user) {
        throw new Error(generateError(404, 'Requested User doesn\'t exist'));
    }

    try {
        let following = true;
        const followerEntry = await Follower.count({
            where: {
                userEmail: user.dataValues.email,
                followerEmail: authenticatedUser.email
            }
        });

        if (!followerEntry) {
            following = false;
        }

        delete user.dataValues.email;
        user.dataValues.following = following;
        const profile = user.dataValues;

        return profile;
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
}

// @POST     /profiles/{username}/follow
async function followUser(requestedUser, authenticatedUser) {

    let userToBeFollowed;
    try {
        userToBeFollowed = await User.findOne({
            where: {
                username: requestedUser
            },
            attributes: ['email', 'username', 'bio', 'image', 'followerCount']
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

    if (!userToBeFollowed) {
        throw new Error(generateError(404, 'Requested User doesn\'t exist'));
    }
    
    const user = await User.findByPk(authenticatedUser.email);

    await userToBeFollowed.addFollowers(user);
    
    delete userToBeFollowed.dataValues.email;
    userToBeFollowed.dataValues.following = true;

    return userToBeFollowed.dataValues;
}


// @DELETE     /profiles/{username}/follow
async function unfollowUser(requestedUser, authenticatedUser) {

    let userBeingUnfollowed;
    try {
        userBeingUnfollowed = await User.findOne({
            where: {
                username: requestedUser
            },
            attributes: ["email", "username", "bio", "image", "followerCount"]
        });

    } catch (e) {
        throw new Error(generateError(422, e.message));
    }
    if (!userBeingUnfollowed) {
        throw new Error(generateError(404, 'Requested User doesn\'t exist'));
    }
    
    const user = await User.findByPk(authenticatedUser.email);

    await userBeingUnfollowed.removeFollowers(user);
}


module.exports = { getProfileByUsername, followUser, unfollowUser };
