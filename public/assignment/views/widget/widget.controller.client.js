/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, $location, $sce, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;

        var widgets = WidgetService.findWidgetsByPageId(pageId);
        vm.widgets = widgets;

        vm.enlistPages = enlistPages;
        vm.navigateToAddWidget = navigateToAddWidget;
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;
        vm.navigateToEditWidget = navigateToEditWidget;
        vm.navigateToProfile = navigateToProfile;

        function enlistPages() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/");
        }

        function navigateToAddWidget() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + "new");
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYouTubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);
        }

        function navigateToEditWidget(widget) {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id);
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        var widgetId = $routeParams.wgid;
        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;
        vm.widgetId = widgetId;

        vm.widget = WidgetService.findWidgetById(widgetId);

        vm.enlistWidgets = enlistWidgets;
        vm.navigateToProfile = navigateToProfile;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function enlistWidgets() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function updateWidget() {
            var updateSuccess = WidgetService.updateWidget(vm.widgetId, vm.widget);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
            if (!updateSuccess) {
                alert("Widget was not updated");
            }
        }

        function deleteWidget() {
            var deletionSuccess = WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
            if (!deletionSuccess) {
                alert("Widget deletion was unsuccessful");
            }
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        var userId = $routeParams.uid;
        var websiteId = $routeParams.wid;
        var pageId = $routeParams.pid;
        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;

        vm.enlistWidgets = enlistWidgets;
        vm.addHeaderWidget = addHeaderWidget;
        vm.addHtmlWidget = addHtmlWidget;
        vm.addImageWidget = addImageWidget;
        vm.addYouTubeWidget = addYouTubeWidget;
        vm.navigateToProfile = navigateToProfile;

        function enlistWidgets() {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }

        function addHeaderWidget() {
            var widget = {"widgetType": "HEADER", "pageId": pageId, "size": 2, "text": ""};
            addWidget(widget);
        }

        function addHtmlWidget() {
            var widget = {"widgetType": "HTML", "pageId": pageId, "text": "<p>Lorem ipsum muspi meroL</p>"};
            addWidget(widget);
        }

        function addImageWidget() {
            var widget = {"widgetType": "IMAGE", "pageId": pageId, "width": "100%", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"};
            addWidget(widget);
        }

        function addYouTubeWidget() {
            var widget = {"widgetType": "YOUTUBE", "pageId": "321", "width": "100%", "url": "https://youtu.be/AM2Ivdi9c4E"};
            addWidget(widget);
        }

        function addWidget(widget) {
            var addition = WidgetService.createWidget(pageId, widget);
            if (null == addition) {
                alert("Widget name either exists or is null. Please choose a different one.");
            } else {
                $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + addition._id);
            }
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();