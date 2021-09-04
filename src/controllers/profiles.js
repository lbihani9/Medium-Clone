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

    let userBeingFollowed;
    try {
        userBeingFollowed = await User.findOne({
            where: {
                username: requestedUser
            },
            attributes: ['email', 'username', 'bio', 'image', 'followerCount']
        });
    } catch (e) {
        throw new Error(generateError(422, e.message));
    }

    if (!userBeingFollowed) {
        throw new Error(generateError(404, 'Requested User doesn\'t exist'));
    }

    const count = await Follower.count({
        where: {
            userEmail: userBeingFollowed.dataValues.email,
            followerEmail: authenticatedUser.email
        }
    });

    // follow only when already not following
    if (count == 0) {
        try {
            const transaction = await sequelize.transaction();
            const [metadata, updatedRow] = await User.update({
                followerCount: userBeingFollowed.dataValues.followerCount + 1
            }, {
                returning: true,
                where: {
                    username: requestedUser
                }
            }, { transaction });

            const userFollowing = await User.findByPk(authenticatedUser.email);

            // This method was automatically added by Sequelize ORM.
            userBeingFollowed = updatedRow;
            await userBeingFollowed.addFollower(userFollowing);

            await transaction.commit();

        } catch (e) {
            await transaction.rollback();
            throw new Error(generateError(500, 'Unexpected error occured'));
        }
    }
    delete userBeingFollowed.dataValues.email;
    userBeingFollowed.dataValues.following = true;

    const profile = userBeingFollowed.dataValues;

    return profile;
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

    const count = await Follower.count({
        where: {
            userEmail: userBeingUnfollowed.dataValues.email,
            followerEmail: authenticatedUser.email
        },
    });

    // delete only when already following
    if (count != 0) {
        try {
            const transaction = await sequelize.transaction();
            const [metadata, updatedRow] = await User.update({
                followerCount: userBeingUnfollowed.dataValues.followerCount - 1
            }, {
                where: {
                    username: requestedUser
                }
            }, { transaction });

            const userUnfollowing = await User.findAndCountAll(authenticatedUser.email);

            userBeingUnfollowed.removeFollower(userUnfollowing, { transaction });

            userBeingUnfollowed = updatedRow;
            await transaction.commit();

        } catch (e) {
            await transaction.rollback();
            throw new Error(generateError(500, "Unexpected error occured"));
        }
    }

}


module.exports = { getProfileByUsername, followUser, unfollowUser };