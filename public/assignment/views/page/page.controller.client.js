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
        var pages = PageService.findPageByWebsiteId(websiteId);
        vm.pages = pages;

        vm.enlistWidgets = enlistWidgets;
        vm.enlistWebsites = enlistWebsites;
        vm.navigateToEditPage = navigateToEditPage;
        vm.navigateToAddPage = navigateToAddPage;
        vm.navigateToProfile = navigateToProfile;

        function navigateToAddPage(page) {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + "/new");
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
    
    function NewPageController() {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pages = PageService.findPageByWebsiteId(websiteId);
        vm.pages = pages;
    }
    
    function EditPageController() {
        
    }
})();