/**
 * Created by Nikhil S on 13-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController);
    
    /*function loginController($scope) {
        $scope.hello = ("Hello from loginController");
    }*/

    // vm means view model
    function loginController($location, UserService) {
        var vm = this;
        //vm.hello = "Hello from LoginController"
        vm.login = login;

        function login (username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if (null === user) {
                console.log("User not found");
                vm.error = "No such user";
            } else {
                $location.url("/user/" + user._id);
            }
        }
    }
})();