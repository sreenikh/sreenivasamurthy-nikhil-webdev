/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);
    
    function PageListController($routeParams, $location, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pages = PageService.findPagesByWebsiteId(websiteId);
        vm.pages = pages;

        vm.enlistWidgets = enlistWidgets;
        vm.enlistWebsites = enlistWebsites;
        vm.navigateToEditPage = navigateToEditPage;
        vm.navigateToAddPage = navigateToAddPage;
        vm.navigateToProfile = navigateToProfile;

        function navigateToAddPage(page) {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + "new");
        }

        function navigateToEditPage(page) {
            var pid = page._id;
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pid);
        }

        function enlistWidgets(page) {
            var pid = page._id;
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pid + "/widget");
        }

        function enlistWebsites() {
            $location.url("/user/" + userId + "/website");
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
    
    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        var pages = PageService.findPagesByWebsiteId(websiteId);
        var currentPage = PageService.findPageById(pageId);
        vm.pages = pages;
        vm.currentPage = currentPage;

        vm.enlistPages = enlistPages;
        vm.navigateToProfile = navigateToProfile;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function enlistPages() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
        }

        function updatePage(page) {
            var updateSuccess = PageService.updatePage(pageId, page);
            if (!updateSuccess) {
                alert("Page name either exists or is null. Please choose a different one.");
                currentPage.name = PageService.findPageById(currentPage._id).name;
                document.getElementById("pageName").value = currentPage.name;
            } else {
                pages = PageService.findPagesByWebsiteId(websiteId);
                vm.pages = pages;
                alert("Update was successful")
            }
        }

        function deletePage(page) {
            var deletionSuccess = PageService.deletePage(page._id);
            if (deletionSuccess) {
                pages = PageService.findPagesByWebsiteId(websiteId);
                vm.pages = pages;
                $location.url("/user/" + userId + "/website/" + websiteId + "/page");
            } else {
                alert("Deletion failed");
            }
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        var pages = PageService.findPagesByWebsiteId(websiteId);
        var currentPage = PageService.findPageById(pageId);
        vm.pages = pages;
        vm.currentPage = currentPage;

        vm.enlistPages = enlistPages;
        vm.navigateToProfile = navigateToProfile;
        vm.addPage = addPage;

        function enlistPages() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
        }

        function addPage(page) {
            var addition = PageService.createPage(websiteId, page);
            if (null == addition) {
                alert("Page name either exists or is null. Please choose a different one.");
            } else {
                pages = PageService.findPagesByWebsiteId(websiteId);
                vm.pages = pages;
                document.getElementById("pageName").value = "";
                document.getElementById("pageTitle").value = "";
            }
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();