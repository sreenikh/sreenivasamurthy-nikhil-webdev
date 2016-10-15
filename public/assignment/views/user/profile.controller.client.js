/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function() {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController);

    function profileController($routeParams, UserService) {
        var vm = this;

        var userId = parseInt($routeParams.uid);

        var user = UserService.findUserById(userId);

        if (null != user) {
            vm.user = user;
        }
    }
})();