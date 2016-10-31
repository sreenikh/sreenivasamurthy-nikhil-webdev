/**
 * Created by Nikhil S on 28-Oct-16.
 */

module.exports = function (app) {
    "use strict";

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];

    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.post('/api/user', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

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
        for (var u in users) {
            if (users[u].username === username) {
                res.send(cloneObject(users[u]));
                return;
            }
        }
        res.send('0');
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for (var u in users) {
            if (users[u].username === username && users[u].password === password) {
                res.send(cloneObject(users[u]));
                return;
            }
        }
        res.send('0');
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        for (var u in users) {
            if (users[u]._id === uid) {
                res.send(cloneObject(users[u]));
                return;
            }
        }
        res.send('0');
    }

    function createUser(req, res) {
        var user = req.body;
        for (var u in users) {
            if (user.username === users[u].username) {
                res.send('0');
                return;
            }
        }
        var newId = generateNewId();
        var newUser = {
            _id: newId,
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName};
        users.push(newUser);
        res.send(cloneObject(newUser));
        return;
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function updateUser(req, res) {
        var userId = req.params.uid;
        var user = req.body;
        for (var u in users) {
            var tempUser = users[u];
            if (user._id === userId) {
                //var existentUser = findUserByUsername(user.username);
                var url = '/api/user?username=' + user.username;
                var request = require('http');
                var userExists = false;
                for (var u2 in users) {
                    if (users[u2].username === user.username && users[u2]._id !== userId) {
                        userExists = true;
                        break;
                    }
                }
                if (userExists) {
                    res.send(false);
                    return;
                } else {
                    tempUser.username = user.username;
                    tempUser.password = user.password;
                    tempUser.firstName = user.firstName;
                    tempUser.lastName = user.lastName;
                    res.send(true);
                    return;
                }
            }
        }
        res.send('0');
    }

    function deleteUser(req, res) {
        var userId = req.params.uid;
        var u = null;
        var userIdFound = false;
        for (u in users) {
            var user = users[u];
            if (userId === user._id) {
                userIdFound = true;
                break;
            }
        }
        if (userIdFound) {
            users.splice(u, 1);
        }
        res.send(userIdFound);
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}