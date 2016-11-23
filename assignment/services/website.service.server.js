/**
 * Created by Nikhil S on 30-Oct-16.
 */

module.exports = function (app, model) {
    "use strict";

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);
    
    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;
        var websiteWithDeveloperId = {
            "name": website.name,
            "description": website.description,
            "developerId": userId
        };
        model
            .websiteModel
            .findWebsitesByUserIdAndName(userId, websiteWithDeveloperId.name)
            .then(
                function (listOfWebsites) {
                    if (0 !== listOfWebsites.length) {
                        res.send('0');
                    } else {
                        model
                            .websiteModel
                            .createWebsite(websiteWithDeveloperId)
                            .then(
                                function (newWebsite) {
                                    res.json(newWebsite);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            )
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        model
            .websiteModel
            .findAllWebsitesForUser(userId)
            .then(
                function (listOfWebsites) {
                    res.json(listOfWebsites);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (website) {
                    res.json(website);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        model
            .websiteModel
            .findWebsiteById(websiteId)
            .then(
                function (existingWebsite) {
                    model
                        .websiteModel
                        .findWebsitesByUserIdAndName(existingWebsite.developerId, website.name)
                        .then(
                            function (listOfWebsites) {
                                if (0 === listOfWebsites.length) {
                                    model
                                        .websiteModel
                                        .updateWebsite(websiteId, website)
                                        .then(
                                            function (response) {
                                                res.send(true);
                                            },
                                            function (error) {
                                                res.sendStatus(400).send(error);
                                            }
                                        )
                                } else if (1 === listOfWebsites.length) {
                                    var firstWebsite = listOfWebsites[0];
                                    if (firstWebsite._id.equals(existingWebsite._id)) {
                                        model
                                            .websiteModel
                                            .updateWebsite(websiteId, website)
                                            .then(
                                                function (response) {
                                                    res.send(true);
                                                },
                                                function (error) {
                                                    res.sendStatus(400).send(error);
                                                }
                                            );
                                    } else {
                                        res.send('0');
                                    }
                                } else {
                                    res.send(false);
                                }
                            },
                            function (error) {
                                res.sendStatus(400).send(error);
                            }
                        )
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        model
            .websiteModel
            .deleteWebsite(websiteId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }
}