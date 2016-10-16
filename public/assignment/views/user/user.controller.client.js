/**
 * Created by Nikhil S on 13-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController);

    // vm means view model
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if (null === user) {
                console.log("User not found");
                vm.error = "Invalid username or password";
            } else {
                $location.url("/user/" + user._id);
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, firstName, lastName, password1, password2) {
            if (password1 != password2) {
                alert("Passwords don't match!");
                document.getElementById("password1").value="";
                document.getElementById("password2").value="";
                return;
            }
            var user = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password1
            };
            var newlyCreatedUser = UserService.createUser(user);
            if (null == newlyCreatedUser) {
                alert("Username already exists. Try a different one.");
                document.getElementById("username").value = "";
                document.getElementById("password1").value = "";
                document.getElementById("password2").value = "";
            } else {
                $location.url("/user/" + newlyCreatedUser._id);
            }
        }
    }
})();