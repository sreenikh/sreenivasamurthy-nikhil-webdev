/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server.js")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var model = {};

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        findWebsiteObjectIdsForUser: findWebsiteObjectIdsForUser,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel
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

    function findUserByCredentials(username, password) {
        return UserModel.find({username: username, password: password});
    }

    function findWebsiteObjectIdsForUser(userId) {
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    return user.websites;
                }
            );
    }

    function updateUser(userId, user) {
        return UserModel.update({
            _id: userId
        }, {
            $set: {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }});
    }

    function deleteUser(userId) {
        return UserModel.remove({_id: userId});
    }

    /*function deleteUser(userId) {
        //return UserModel.remove({_id: userId});
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    var count = 0;
                    user.websites.forEach(function (websiteId) {
                        console.log("COUNT " + count);
                        model
                            .websiteModel
                            .deleteWebsite(websiteId)
                            .then(function (response) {
                                count++;
                                console.log(__filename);
                                console.log(count);
                                console.log(websiteId);
                                /!*if (user.websites.length === count) {
                                    return UserModel
                                        .remove({_id: userId})
                                }*!/
                            });
                    });
                    while (0 !== count) {
                        if (0 === count) {
                            return UserModel.remove({_id: userId});
                        }
                    }
                });
    }*/

    function setModel(_model) {
        model = _model;
    }
};