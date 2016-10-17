/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("WebsiteService", websiteService);

    function websiteService() {
        var idSet = new Set();
        var lastCreatedId = 1000;

        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Facebook Description"},
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Tweeter Description"},
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Gizmodo Description"},
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Tic Tac Toe Description"},
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Checkers Description"},
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Chess Description"}
        ];

        for (var w in websites) {
            idSet.add(websites[w]._id);
        }

        var api = {
            createWebsite: createWebsite,
            findWebsitesForUser: findWebsitesForUser,
            findWebsiteById: findWebsiteById,
            updateWebsite: updateWebsite,
            deleteWebsite: deleteWebsite
        };
        return api;

        function generateNewId() {
            var newId = (lastCreatedId + 1).toString();
            lastCreatedId += 1;
            return newId;
        }

        function createWebsite(userId, website) {
            console.log(userId)
            for (var w in websites) {
                if (website.name === websites[w].name) {
                    return null;
                }
            }
            var newId = generateNewId();
            var newWebsite = {
                "_id": newId,
                "name": website.name,
                "description": website.description,
                "developerId": userId};
            websites.push(newUser);
            return newWebsite;
        }

        function findWebsitesForUser(uid) {
            var result = [];
            for (var w in websites) {
                if (uid === websites[w].developerId) {
                    result.push(cloneObject(websites[w]));
                }
            }
            return result;
        }

        function findWebsiteById(websiteId) {
            for (var w in websites) {
                if (websiteId === websites[w]._id) {
                    return cloneObject(websites[w]);
                }
            }
            return null;
        }

        function updateWebsite(websiteId, website) {
            for (var w in websites) {
                var existingWebsite = websites[w];
                if (website.developerId !== existingWebsite.developerId) {
                    continue;
                }
                if (websiteId === existingWebsite._id) {
                    if ((null === findWebsiteByName(website.name, website.developerId)) && ("" !== website.name)) {
                        existingWebsite.name = website.name;
                        existingWebsite.description = website.description;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        function deleteWebsite(websiteId) {
            var u = null;
            var websiteIdFound = false;
            for (var w in websites) {
                if (websiteId === websites[w]._id) {
                    websiteIdFound = true;
                    break;
                }
            }
            if (websiteIdFound) {
                websites.splice(w, 1);
            }
            return websiteIdFound;
        }

        function findWebsiteByName(name, uid) {
            for (var w in websites) {
                if (uid !== websites[w].developerId) {
                    continue;
                }
                if (name === websites[w].name) {
                    return cloneObject(websites[w]);
                }
            }
            return null;
        }

        function cloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }
    }
})();

/*var websites = [
 {_id: 100, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 101, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 102, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 103, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 104, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 105, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 106, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 107, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 108, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 109, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 110, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 111, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 109, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 110, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 111, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 112, uid: 123, name: "Facebook", description: "Most popular social networking website"},
 {_id: 113, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 114, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
 {_id: 201, uid: 234, name: "Facebook", description: "Most popular social networking website"},
 {_id: 202, uid: 234, name: "Wikipedia", description: "World's encyclopedia"},
 {_id: 301, uid: 345, name: "Facebook", description: "Most popular social networking website"},
 {_id: 302, uid: 345, name: "Twitter", description: "Powerful short tweets / broadcasts"}
 ];*/