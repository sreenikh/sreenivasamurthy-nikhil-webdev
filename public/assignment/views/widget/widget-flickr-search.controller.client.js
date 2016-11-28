/**
 * Created by Nikhil S on 27-Nov-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);

    function FlickrImageSearchController($routeParams, $location, FlickrService, WidgetService) {
        var vm = this;

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        vm.navigateToEditWidget = navigateToEditWidget;
        vm.navigateToProfile = navigateToProfile;

        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        var widgetId = $routeParams.wgid;

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    var data = response.data;
                    data = data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            var widget = {url: url};
            WidgetService
                .updateWidget(widgetId, widget)
                .success(function (response) {
                    if (true === response) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                    } else {
                        alert("Widget was not updated");
                    }
                })
                .error(function (error) {
                });
        }

        function navigateToEditWidget() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId);
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();