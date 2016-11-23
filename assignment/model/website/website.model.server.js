/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server.js")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);
    
    var api = {
        createWebsite: createWebsite,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        findWebsitesByUserIdAndName: findWebsitesByUserIdAndName,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;
    
    function createWebsite(website) {
        return WebsiteModel.create(website)
    }

    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({developerId: userId});
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
    
    function deleteWebsite(websiteId) {
        return WebsiteModel.remove({_id: websiteId});
    }
};