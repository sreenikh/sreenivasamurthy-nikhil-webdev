/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("EditWebsiteController", EditWebsiteController);

    /*function WebsiteListController($scope) {
        var websites = [
            {"_id": 123, "name": "Facebook", "description": "Most popular social networking website"},
            {"_id": 234, "name": "Wikipedia", "description": "World's encyclopedia"}
        ];
        $scope.websites = websites;
    }*/

    function WebsiteListController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.editWebsite = editWebsite;
        vm.enlistPages = enlistPages;

        //var userId = $routeParams.uid;
        var userId = $routeParams['uid']; // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        console.log(websites);
        vm.websites = websites;

        function editWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
            console.log(website);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }
    }
    
    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.editWebsite = editWebsite;
        vm.enlistPages = enlistPages;
        vm.updateWebsite = updateWebsite;

        var userId = $routeParams['uid']; // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        console.log(websites);
        vm.websites = websites;

        function editWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
            console.log(website);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }

        var websiteId = $routeParams['wid'];
        console.log(websiteId);

        var currentWebsite = WebsiteService.findWebsiteById(websiteId);
        vm.currentWebsite = currentWebsite;

        function updateWebsite(website) {
            var updateSuccess = WebsiteService.updateWebsite(websiteId, website);
            if (!updateSuccess) {
                alert("User name either exists or is null. Please choose a different one.");
                currentWebsite.name = WebsiteService.findWebsiteById(currentWebsite._id).name;
                document.getElementById("websiteName").value = currentWebsite.name;
            } else {
                websites = WebsiteService.findWebsitesForUser(userId);
                vm.websites = websites;
                alert("Update was successful!")
            }
        }
    }
})();