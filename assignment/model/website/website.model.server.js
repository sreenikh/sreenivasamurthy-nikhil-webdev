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
    }

    /*function deleteWebsite(websiteId) {
        return model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    var userId = website._user;
                    var count = 0;
                    console.log(__filename);
                    console.log(website.name);
                    console.log(website.pages);
                    if (0 === website.pages.length) {
                        return WebsiteModel
                            .remove({_id: website._id.valueOf()})
                            .then(
                                function (response) {
                                    return model
                                        .userModel
                                        .findUserById(userId.valueOf())
                                        .then(
                                            function (user) {
                                                console.log(__filename);
                                                console.log(user);
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
                    } else {
                        website.pages.forEach(function (pageId) {
                            model
                                .pageModel
                                .deletePage(pageId)
                                .then(
                                    function (response) {
                                        count++;
                                        if (websites.pages.length === count) {
                                            return WebsiteModel
                                                .remove({_id: website._id.valueOf()})
                                                .then(
                                                    function (response) {
                                                        return model
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
                                    }
                                )
                        });
                    }
                }
            );
    }*/

    function setModel(_model) {
        model = _model;
    }
};