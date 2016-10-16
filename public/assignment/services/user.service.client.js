/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("UserService", userService);
    
    function userService() {
        var idSet = new Set();
        idSet.add("123");
        idSet.add("234");
        idSet.add("345");
        var lastCreatedId = 1000;

        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

        var api = {
            createUser: createUser,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser
        };
        return api;

        function generateNewId() {
            var newId = (lastCreatedId + 1).toString();
            lastCreatedId += 1;
            return newId;
        }
        
        function createUser(user) {
            console.log(user);
            for (var u in users) {
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
            console.log(users);
            return newUser;
        }

        function findUserById(userId) {
            for (var u in users) {
                var user = users[u];
                if (user._id === userId) {
                    return user;
                }
            }
            return null;
        }
        
        function findUserByUsername(username) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username) {
                    return user;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username && user.password === password) {
                    return user;
                }
            }
            return null;
        }

        function updateUser(userId, user) {
            for (var u in users) {
                var tempUser = users[u];
                if (user._id === userId) {
                    tempUser.username = user.username;
                    tempUser.password = user.password;
                    tempUser.firstName = user.firstName;
                    tempUser.lastName = user.lastName;
                    break;
                }
            }
        }

        function deleteUser(userId) {
            var u = null;
            for (u in users) {
                var user = users[u];
                if (userId === user._id) {
                    break;
                }
            }
            users.splice(u, 1);
        }
    }
})();