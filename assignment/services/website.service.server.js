/**
 * Created by Nikhil S on 30-Oct-16.
 */

module.exports = function (app) {
    "use strict";

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Facebook Description"},
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Tweeter Description"},
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Gizmodo Description"},
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Tic Tac Toe Description"},
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Checkers Description"},
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Chess Description"}
    ];

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);
    
    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;
        for (var w in websites) {
            if (userId !== websites[w].developerId) {
                continue;
            }
            if (website.name === websites[w].name) {
                res.send('0');
                return;
            }
        }
        var newId = generateNewId();
        var newWebsite = {
            "_id": newId,
            "name": website.name,
            "description": website.description,
            "developerId": userId};
        websites.push(newWebsite);
        res.send(cloneObject(newWebsite));
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        var result = [];
        for (var w in websites) {
            if (userId === websites[w].developerId) {
                result.push(cloneObject(websites[w]));
            }
        }
        res.send(result);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        for (var w in websites) {
            if (websiteId === websites[w]._id) {
                res.send(cloneObject(websites[w]));
                return;
            }
        }
        res.send('0');
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        for (var w in websites) {
            var existingWebsite = websites[w];
            if (website.developerId !== existingWebsite.developerId) {
                continue;
            }
            if (websiteId === existingWebsite._id) {
                var websiteExists = false;
                for (var w2 in websites) {
                    if (website.name === websites[w2].name && websiteId !== websites[w2]._id) {
                        websiteExists = true;
                    }
                }
                if (!websiteExists) {
                    existingWebsite.name = website.name;
                    existingWebsite.description = website.description;
                    res.send(true);
                    return
                } else {
                    res.send(false);
                    return;
                }
            }
        }
        res.send('0');
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var websiteIdFound = false;
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
        res.send(websiteIdFound);
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}