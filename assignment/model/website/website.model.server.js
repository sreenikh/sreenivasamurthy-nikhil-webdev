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
                    model
                        .userModel
                        .findUserById(userId)
                        .then(
                            function (user) {
                                user.websites.push(newWebsite);
                                newWebsite._user = user._id;
                                newWebsite.save();
                                return user.save();
                            },
                            function (error) {
                            }
                        );
                },
                function () {

                });
    }

    function findAllWebsitesForUser(userId) {
        //model.userModel.findWebsitesForUser(userId).then(function (websites) {console.log(websites);})
        //return WebsiteModel.find({developerId: userId});
        return model
            .userModel
            .findWebsiteObjectIdsForUser(userId)
            .then(
                function (listOfWebsiteObjectIds) {
                    return WebsiteModel
                        .find({_id: {$in: listOfWebsiteObjectIds}});
                    /*listOfWebsiteObjectIds.forEach(function (websiteObjectId) {
                        var result = [];
                        var count = 0;
                        WebsiteModel
                            .findById(websiteObjectId )
                            .then(
                                function (website) {
                                    console.log(__filename);
                                    console.log(website);
                                    result.push(website);
                                    count = count + 1;
                                    if (listOfWebsiteObjectIds.length == count) {
                                        return result;
                                    }
                                },
                                function (error) {
                                }
                            );
                        return result;
                    });*/
                },
                function (error) {
                }
            );
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function findWebsitesByUserIdAndName(userId, name) {
        return WebsiteModel.find({developerId: userId, name: name});
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
    
    /*function deleteWebsite(userId, websiteId) {
        return WebsiteModel
            .remove({_id: websiteId.valueOf()})
            .then(
                function (response) {
                    model
                        .userModel
                        .findUserById(userId.valueOf())
                        .then(
                            function (user) {
                                const index = user.websites.indexOf(websiteId);
                                user.websites.splice(index, 1);
                                return user.save();
                            },
                            function (error) {
                            }
                        );
                },
                function () {

                });
    }*/

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
            )

    }

    function setModel(_model) {
        model = _model;
    }
};