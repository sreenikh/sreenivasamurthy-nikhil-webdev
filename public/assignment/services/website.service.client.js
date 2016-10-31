/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("WebsiteService", websiteService);

    function websiteService($http) {
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
            if ("" === website.name) {
                return null;
            }
            /*for (var w in websites) {
                if (userId !== websites[w].developerId) {
                    continue;
                }
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
            websites.push(newWebsite);
            return newWebsite;*/
            var url = '/api/user/' + userId + "/website";
            return $http.post(url, website);
        }

        function findWebsitesForUser(userId) {
            /*var result = [];
            for (var w in websites) {
                if (uid === websites[w].developerId) {
                    result.push(cloneObject(websites[w]));
                }
            }
            return result;*/
            var url = '/api/user/' + userId + '/website';
            return $http.get(url);
        }

        function findWebsiteById(websiteId) {
            /*for (var w in websites) {
                if (websiteId === websites[w]._id) {
                    return cloneObject(websites[w]);
                }
            }
            return null;*/
            var url = '/api/website/' + websiteId;
            return $http.get(url);
        }

        function updateWebsite(websiteId, website) {
            /*for (var w in websites) {
                var existingWebsite = websites[w];
                if (website.developerId !== existingWebsite.developerId) {
                    continue;
                }
                if (websiteId === existingWebsite._id) {
                    if ((website.developerId === existingWebsite.developerId) ||
                            ((null === findWebsiteByName(website.name, website.developerId)))) {
                        existingWebsite.name = website.name;
                        existingWebsite.description = website.description;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;*/
            var url = '/api/website/' + websiteId;
            return $http.put(url, website);
        }

        function deleteWebsite(websiteId) {
            /*var websiteIdFound = false;
            var w = null;
            for (w in websites) {
                if (websiteId === websites[w]._id) {
                    websiteIdFound = true;
                    break;
                }
            }
            if (websiteIdFound) {
                websites.splice(w, 1);
            }
            return websiteIdFound;*/
            var url = '/api/website/' + websiteId;
            return $http.delete(url);
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