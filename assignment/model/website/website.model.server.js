/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server.js")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var model = {};
    
    var api = {
        createWebsite: createWebsite,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        findPageObjectIdsForWebsite: findPageObjectIdsForWebsite,
        findWebsitesByUserIdAndName: findWebsitesByUserIdAndName,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel: setModel
    };
    return api;
    
    function createWebsite(userId, website) {
        return WebsiteModel
            .create(website)
            .then(
                function (newWebsite) {
                    return model
                        .userModel
                        .findUserById(userId)
                        .then(
                            function (user) {
                                user.websites.push(newWebsite);
                                newWebsite._user = user._id;
                                user.save();
                                newWebsite.save();
                                return newWebsite;
                            },
                            function (error) {
                            }
                        );
                },
                function () {

                });
    }

    function findAllWebsitesForUser(userId) {
        return model
            .userModel
            .findWebsiteObjectIdsForUser(userId)
            .then(
                function (listOfWebsiteObjectIds) {
                    return WebsiteModel
                        .find({_id: {$in: listOfWebsiteObjectIds}});
                },
                function (error) {
                }
            );
    }

    function findPageObjectIdsForWebsite(websiteId) {
        return WebsiteModel
            .findById(websiteId)
            .then(
                function (website) {
                    return website.pages;
                }
            );
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function findWebsitesByUserIdAndName(userId, name) {
        return WebsiteModel.find({_user: userId, name: name});
    }
    
    function updateWebsite(websiteId, website) {
        return WebsiteModel.update(
            {_id: websiteId},
            {$set: {
                name: website.name,
                description: website.description
            }}
        );
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel
            .findById(websiteId)
            .then(
                function (website) {
                    var count = 0;
                    var listOfPageIds = [];

                    website.pages.forEach(function (page) {
                        listOfPageIds.push(page.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfPages(count, listOfPageIds);

                    function recursiveDeletionOfPages(currentCount, inputListOfPageIds) {
                        if (currentCount === inputListOfPageIds.length) {
                            return model
                                .websiteModel
                                .findWebsiteById(websiteId)
                                .then(
                                    function (website) {
                                        var userId = website._user;
                                        return WebsiteModel
                                            .remove({_id: website._id.valueOf()})
                                            .then(
                                                function (response) {
                                                    model
                                                        .userModel
                                                        .findUserById(userId.valueOf())
                                                        .then(
                                                            function (user) {
                                                                const index = user.websites.indexOf(website._id);
                                                                user.websites.splice(index, 1);
                                                                return user.save();
                                                            },
                                                            function (error) {
                                                            }
                                                        );
                                                },
                                                function () {

                                                });
                                    }
                                );
                        } else {
                            return model
                                .pageModel
                                .deletePage(inputListOfPageIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfPages(currentCount + 1, inputListOfPageIds);
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