/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", websiteListController);

    /*function websiteListController($scope) {
        var websites = [
            {"_id": 123, "name": "Facebook", "description": "Most popular social networking website"},
            {"_id": 234, "name": "Wikipedia", "description": "World's encyclopedia"}
        ];
        $scope.websites = websites;
    }*/

    function websiteListController($routeParams, WebsiteService) {
        var vm = this;
        //var userId = $routeParams.uid;
        var userId = parseInt($routeParams['uid']); // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        console.log(websites);
        vm.websites = websites;
    }
})();