/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    
    function UserService($http) {
        /*var idSet = new Set();
        var lastCreatedId = 1000;

        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

        for (var u in users) {
            idSet.add(users[u]._id);
        }*/

        var api = {
            createUser: createUser,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser
        };
        return api;

        /*function generateNewId() {
            var newId = (lastCreatedId + 1).toString();
            lastCreatedId += 1;
            return newId;
        }*/
        
        function createUser(user) {
            /*for (var u in users) {
                if (user.username === users[u].username) {
                    return null;
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
            return newUser;*/
            var url = '/api/user';
            return $http.post(url, user);
        }

        function findUserById(userId) {
            /*for (var u in users) {
                var user = users[u];
                if (user._id === userId) {
                    //return user;
                    return cloneObject(user);
                }
            }
            return null;*/
            var url = '/api/user/' + userId;
            return $http.get(url);
        }
        
        function findUserByUsername(username) {
            /*for (var u in users) {
                var user = users[u];
                if (user.username === username) {
                    //return user;
                    return cloneObject(user);
                }
            }
            return null;*/
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = '/api/user?username=' + username + '&password=' + password;
            return $http.get(url);
            /*for (var u in users) {
                var user = users[u];
                if (user.username === username && user.password === password) {
                    //return user;
                    return cloneObject(user);
                }
            }
            return null;*/
        }

        function updateUser(userId, user) {
            /*console.log(user);
            if ("" === user.username) {
                return false;
            }
            for (var u in users) {
                var tempUser = users[u];
                if (user._id === userId) {
                    var existentUser = findUserByUsername(user.username);
                    console.log(existentUser);
                    if (null === existentUser || (existentUser._id === userId)) {
                        tempUser.username = user.username;
                        tempUser.password = user.password;
                        tempUser.firstName = user.firstName;
                        tempUser.lastName = user.lastName;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return null;*/
            var url = '/api/user/' + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            /*var u = null;
            var userIdFound = False;
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
            return userIdFound;*/
            var url = '/api/user/' + userId;
            return $http.delete(url);
        }

        /*function cloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }*/
    }
})();