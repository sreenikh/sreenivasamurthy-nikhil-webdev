/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("EditWebsiteController", EditWebsiteController)
        .controller("NewWebsiteController", NewWebsiteController);

    function WebsiteListController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.navigateToEditWebsite = navigateToEditWebsite;
        vm.enlistPages = enlistPages;
        vm.navigateToAddWebsite = navigateToAddWebsite;
        vm.navigateToProfile = navigateToProfile;

        //var userId = $routeParams.uid;
        var userId = $routeParams['uid']; // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        vm.websites = websites;

        function navigateToEditWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }

        function navigateToAddWebsite() {
            $location.url("/user/" + userId + "/website/" + "new");
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
    
    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.navigateToEditWebsite = navigateToEditWebsite;
        vm.enlistPages = enlistPages;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        vm.navigateToAddWebsite = navigateToAddWebsite;
        vm.enlistWebsites = enlistWebsites;
        vm.navigateToProfile = navigateToProfile;

        var userId = $routeParams['uid']; // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        vm.websites = websites;

        function navigateToEditWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }

        var websiteId = $routeParams['wid'];

        var currentWebsite = WebsiteService.findWebsiteById(websiteId);
        vm.currentWebsite = currentWebsite;

        function updateWebsite(website) {
            var updateSuccess = WebsiteService.updateWebsite(websiteId, website);
            console.log(updateSuccess);
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

        function deleteWebsite(website) {
            var deletionSuccess = WebsiteService.deleteWebsite(website._id);
            if (deletionSuccess) {
                websites = WebsiteService.findWebsitesForUser(userId);
                vm.websites = websites;
                $location.url("/user/" + userId + "/website/");
            } else {
                alert("Deletion failed");
            }
        }

        function navigateToAddWebsite() {
            $location.url("/user/" + userId + "/website/" + "new");
        }

        function enlistWebsites() {
            if (null != userId) {
                $location.url("/user/" + userId + "/website");
            }
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.navigateToEditWebsite = navigateToEditWebsite;
        vm.enlistPages = enlistPages;
        vm.navigateToAddWebsite = navigateToAddWebsite;
        vm.addWebsite = addWebsite;
        vm.navigateToAddWebsite = navigateToAddWebsite;
        vm.enlistWebsites = enlistWebsites;
        vm.navigateToProfile = navigateToProfile;

        var userId = $routeParams['uid']; // better
        var websites = WebsiteService.findWebsitesForUser(userId);
        vm.websites = websites;

        function navigateToEditWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }

        function navigateToAddWebsite() {
            $location.url("/user/" + userId + "/website/" + "new");
        }

        function addWebsite(websiteName, websiteDescription) {
            var website = {name: vm.websiteName, description: vm.websiteDescription};
            var addition = WebsiteService.createWebsite(userId, website);
            if (null === addition) {
                alert("User name either exists or is null. Please choose a different one.");
            } else {
                websites = WebsiteService.findWebsitesForUser(userId);
                vm.websites = websites;
                document.getElementById("websiteName").value = "";
                document.getElementById("websiteDescription").value = "";
            }
        }

        function enlistWebsites() {
            if (null != userId) {
                $location.url("/user/" + userId + "/website");
            }
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();