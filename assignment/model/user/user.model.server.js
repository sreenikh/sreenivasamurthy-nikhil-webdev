/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        updateUser: updateUser,
        deleteUser: deleteUser
    };
    return api;

    function createUser(user) {
        // Prevalidation to be done
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByUsername(username) {
        return UserModel.find({username: username});
    }

    function updateUser(userId, user) {
        return UserModel.update({
            _id: userId
            }, {
            $set: {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName
            }});
    }

    function deleteUser(userId) {
        return UserModel.remove({_id: userId});
    }
};