/**
 * Created by Nikhil S on 28-Oct-16.
 */

module.exports = function (app, model) {
    "use strict";

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .findUserByUsername(user.username)
            .then(
                function (listOfExistingUsers) {
                    if (0 !== listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        model
                            .userModel
                            .createUser(user)
                            .then(
                                function (newUser) {
                                    res.send(newUser)
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        res.send(user);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && user.password === password) {
                            res.send(user);
                        } else {
                            res.send('0');
                        }
                    }
                }
            )

    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        model
            .userModel
            .findUserById(uid)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.uid;
        var user = req.body;
        model
            .userModel
            .findUserById(userId)
            .then(
                function (existingUser) {
                    if (existingUser) {
                        if (existingUser.username === user.username) {
                            model
                                .userModel
                                .updateUser(userId, user)
                                .then(
                                    function (response) {
                                        res.send(true);
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        } else {
                            model
                                .userModel
                                .findUserByUsername(user.username)
                                .then(
                                    function (listOfExistingUsers) {
                                        if (0 === listOfExistingUsers.length) {
                                            model
                                                .userModel
                                                .updateUser(userId, user)
                                                .then(
                                                    function (response) {
                                                        res.send(true);
                                                    },
                                                    function (error) {
                                                        res.sendStatus(400).send(error);
                                                    }
                                                );
                                        } else {
                                            res.send(false);
                                        }
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        }
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.uid;
        model
            .userModel
            .deleteUser(userId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
};