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
        return UserModel
            .findById(userId)
            .then(
                function (user) {
                    var count = 0;
                    var listOfWebsiteIds = [];

                    user.websites.forEach(function (website) {
                        listOfWebsiteIds.push(website.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfWebsites(count, listOfWebsiteIds);

                    function recursiveDeletionOfWebsites(currentCount, inputListOfWebsiteIds) {
                        if (currentCount === inputListOfWebsiteIds.length) {
                            return UserModel.remove({_id: userId});
                        } else {
                            return model
                                .websiteModel
                                .deleteWebsite(inputListOfWebsiteIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfWebsites(currentCount + 1, inputListOfWebsiteIds);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }

                    }
                },
                function (error) {

                });
    }

    function setModel(_model) {
        model = _model;
    }
};