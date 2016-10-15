/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);
    
    function userService() {
        var users = [
            {_id: 123, username: 'alice', password: '123', first: 'Alice', last: 'Wonderland'},
            {_id: 234, username: 'bob', password: '123', first: 'Bob', last: 'Dylan'},
            {_id: 345, username: 'charlie', password: '123', first: 'Charlie', last: 'Brown'}
        ];

        var api = {
            findUserByCredentials: findUserByCredentials,
            findUserById: findUserById
        };
        return api;

        function findUserByCredentials(username, password) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username && user.password === password) {
                    return user;
                }
            }
            return null;
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
    }
})();