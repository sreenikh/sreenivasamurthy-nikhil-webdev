/**
 * Created by Nikhil S on 13-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    // vm means view model
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            //var user = UserService.findUserByCredentials(username, password);
            /*if (null === user) {
                console.log("User not found");
                vm.error = "Invalid username or password";
            } else {
                $location.url("/user/" + user._id);
            }*/
            var promise = UserService.findUserByCredentials(username, password);
            promise
                .success(function (user) {
                    if ('0' === user) {
                        vm.error = "Invalid username or password";
                    } else {
                        $location.url("/user/" + user._id);
                    }
                })
                .error(function (e) {
                    console.log(e);
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, firstName, lastName, password1, password2) {
            if (null === username || "" === username || undefined === username) {
                vm.usernameError = "Username cannot be empty";
                return;
            }
            if (null === firstName || "" === firstName || undefined === firstName) {
                vm.firstNameError = "First name cannot be empty";
                return;
            }
            if (undefined === password1 || undefined === password2 ||
                    null === password1 || null === password2 ||
                    "" === password1 || "" === password2) {
                vm.passwordError = "Empty Password(s)";
                document.getElementById("password1").value="";
                document.getElementById("password2").value="";
                return;
            }
            if (password1 !== password2) {
                vm.passwordError = "Passwords don't match!";
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
            /*var newlyCreatedUser = UserService.createUser(user);
            if (null == newlyCreatedUser) {
                vm.usernameError = "Username already exists. Try a different one.";
                document.getElementById("username").value = "";
                document.getElementById("password1").value = "";
                document.getElementById("password2").value = "";
            } else {
                $location.url("/user/" + newlyCreatedUser._id);
            }*/
            UserService
                .createUser(user)
                .success(function (newlyCreatedUser) {
                    if ('0' == newlyCreatedUser) {
                        vm.usernameError = "Username already exists. Try a different one.";
                        document.getElementById("username").value = "";
                        document.getElementById("password1").value = "";
                        document.getElementById("password2").value = "";
                    } else {
                        $location.url("/user/" + newlyCreatedUser._id);
                    }
                })
                .error(function (error) {

                });

        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.enlistWebsites = enlistWebsites;
        vm.saveProfile = saveProfile;
        vm.navigateToProfile = navigateToProfile;
        vm.unregisterUser = unregisterUser;

        //var userId = parseInt($routeParams.uid);
        var userId = $routeParams.uid;

        //var user = UserService.findUserById(userId);

        function init() {
            /*if (null != user) {
                vm.user = user;
            }*/
            UserService
                .findUserById(userId)
                .success(function (user) {
                    if ('0' !== user) {
                        vm.user = user;
                    }
                })
                .error(function (error) {
                });
        }
        init();

        function enlistWebsites(user) {
            if (null !== user) {
                $location.url("/user/" + user._id + "/website");
            }
        }

        function saveProfile(user) {
            if (null === username || "" === username || undefined === username) {
                vm.usernameError = "Username cannot be empty";
                return;
            }
            /*var updateSuccess = UserService.updateUser(userId, user);
            if (null == updateSuccess) {
                alert("Update failed!");
            } else {
                if (!updateSuccess) {
                    vm.usernameError = "User name either exists. Please choose a different one.";
                    user.username = UserService.findUserById(user._id).username;
                    document.getElementById("username").value = user.username;
                } else {
                    alert("Update was successful!");

                }
            }*/
            UserService
                .updateUser(userId, user)
                .success(function (response) {
                    console.log(response);
                    if ('0' === response) {
                        alert("Update failed");
                    } else if (true === response) {
                        alert("Update was successful");
                    } else if (false === response) {
                        alert("User name exists. Please choose a different one.");
                        init();
                    }
                })
                .error(function (error) {
                });
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function unregisterUser(user) {
            UserService
                .deleteUser(user._id)
                .success(function (response) {
                    $location.url("/login");
                    if (true === response) {
                        alert("User unregistered");
                    } else {
                        alert("User was not unregistered");
                    }
                })
                .error(function (error) {
                })
        }
    }
})();