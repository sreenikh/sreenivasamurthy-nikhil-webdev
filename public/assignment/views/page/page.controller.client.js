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

        function listOfPagesInit() {
            PageService
                .findPagesByWebsiteId(websiteId)
                .success(function (pages) {
                    vm.pages = pages;
                })
                .error(function (error) {
                });
        }
        listOfPagesInit();

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

        function currentPageInit() {
            PageService
                .findPageById(pageId)
                .success(function (currentPage) {
                    vm.currentPage = currentPage;
                })
                .error(function (error) {
                });
        }
        currentPageInit();

        vm.enlistPages = enlistPages;
        vm.navigateToProfile = navigateToProfile;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function enlistPages() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
        }

        function updatePage(page) {
            if ("" === page.name || null === page.name || undefined === page.name) {
                alert("Page name is null.");
                return;
            }
            PageService
                .updatePage(pageId, page)
                .success(function (response) {
                    if ('0' === response) {
                        alert("Update failed")
                        return;
                    } else if (true === response) {
                        alert("Update was successful");
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/")
                    } else if (false === response) {
                        alert("Page name exists. Please choose a different one.");
                        currentPageInit();
                        document.getElementById("pageName").value = vm.currentPage.name;
                        return;
                    }
                })
                .error(function (error) {
                });
        }

        function deletePage(page) {
            PageService
                .deletePage(page._id)
                .success(function (response) {
                    if (true === response) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page");
                    } else {
                        alert("Deletion failed");
                        return;
                    }
                })
                .error(function (error) {
                });
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

        function currentPageInit() {
            vm.currentPage = {name: "", title: ""};
        }
        currentPageInit();

        vm.enlistPages = enlistPages;
        vm.navigateToProfile = navigateToProfile;
        vm.addPage = addPage;

        function enlistPages() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
        }

        function addPage(page) {
            if ("" === page.name || null === page.name || undefined === page.name) {
                alert("Page name is null");
                return null;
            }
            PageService
                .createPage(websiteId, page)
                .success(function (page) {
                    if ('0' !== page) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
                    } else {
                        alert("Page name exists. Please choose a different one.");
                        document.getElementById("pageName").value = "";
                        return;
                    }
                })
                .error(function (error) {
                });
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();