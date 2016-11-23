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

        var userId = $routeParams['uid'];

        function init() {
            WebsiteService
                .findWebsitesForUser(userId)
                .success(function (websites) {
                    if ('0' !== websites) {
                        vm.websites = websites;
                    }
                })
                .error(function (error) {
                });
        }
        init();

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

        function listOfWebsitesInit() {
            WebsiteService
                .findWebsitesForUser(userId)
                .success(function (websites) {
                    if ('0' !== websites) {
                        vm.websites = websites;
                    }
                })
                .error(function (error) {
                });
        }
        listOfWebsitesInit();

        var websiteId = $routeParams['wid'];

        function currentWebsiteInit() {
            WebsiteService
                .findWebsiteById(websiteId)
                .success(function (website) {
                    if ('0' !== website) {
                        vm.currentWebsite = website;
                    }
                });
        }
        currentWebsiteInit();

        function navigateToEditWebsite(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid);
        }

        function enlistPages(website) {
            var wid = website._id;
            $location.url("/user/" + userId + "/website/" + wid + "/page");
        }

        function updateWebsite(website) {
            if ("" === website.name) {
                alert("User name is null.");
                currentWebsiteInit();
                document.getElementById("websiteName").value = vm.currentWebsite.name;
                return false;
            }
            WebsiteService
                .updateWebsite(websiteId, website)
                .success(function (response) {
                    if ('0' === response) {
                        alert("Update error occured");
                    } else if (true === response) {
                        currentWebsiteInit();
                        alert("Update was successful")
                        $location.url("/user/" + userId + "/website/");
                    } else if (false === response) {
                        alert("User name exists. Please choose a different one.");
                    }
                })
                .error(function (error) {
                });
        }

        function deleteWebsite(website) {
            WebsiteService
                .deleteWebsite(website._id)
                .success(function (response) {
                    if (true === response) {
                        listOfWebsitesInit();
                        $location.url("/user/" + userId + "/website/");
                    } else {
                        alert("Deletion failed");
                    }
                })
                .error(function (error) {
                });
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
        function listOfWebsitesInit() {
            WebsiteService
                .findWebsitesForUser(userId)
                .success(function (websites) {
                    if ('0' !== websites) {
                        vm.websites = websites;
                    }
                })
                .error(function (error) {
                });
        }
        listOfWebsitesInit();

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
            if (null === vm.websiteName || "" === vm.websiteName || undefined === vm.websiteName) {
                alert("Website name is null. Please enter a name");
                return;
            }
            WebsiteService
                .createWebsite(userId, website)
                .success(function (website) {
                    if ('0' === website) {
                        alert("Website was not created as the name already exists");
                        listOfWebsitesInit();
                        document.getElementById("websiteName").value = "";
                        document.getElementById("websiteDescription").value = "";
                    } else {
                        listOfWebsitesInit();
                        $location.url("/user/" + userId + "/website");
                    }
                })
                .error(function (error) {
                });
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