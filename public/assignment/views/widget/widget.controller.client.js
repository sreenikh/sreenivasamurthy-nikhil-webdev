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

        function init() {
            WidgetService
                .findWidgetsByPageId(pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function (error) {
                });
        }
        init();

        vm.enlistPages = enlistPages;
        vm.navigateToAddWidget = navigateToAddWidget;
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;
        vm.checkSafeUrl = checkSafeUrl;
        vm.navigateToEditWidget = navigateToEditWidget;
        vm.navigateToProfile = navigateToProfile;
        vm.get16by9Height = get16by9Height;

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

        function checkSafeUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function navigateToEditWidget(widget) {
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id);
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }

        function get16by9Height(width) {
            return (parseInt(width) * 9) / 16;
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

        function init() {
            WidgetService
                .findWidgetById(widgetId)
                .success(function (widget) {
                    if ('0' !== widget) {
                        vm.widget = widget;
                    }
                })
                .error(function (error) {
                });
        }
        init();

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
            WidgetService
                .updateWidget(vm.widgetId, vm.widget)
                .success(function (response) {
                    if (true === response) {
                        init();
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                    } else {
                        alert("Widget was not updated");
                    }
                })
                .error(function (error) {
                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function (response) {
                    if (true === response) {
                        $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
                    } else {
                        alert("Widget deletion was unsuccessful");
                    }
                })
                .error(function (error) {
                });
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
            //var widget = {"widgetType": "HTML", "pageId": pageId, "text": "<p>Lorem ipsum muspi meroL</p>"};
            var widget = {"widgetType": "HTML", "text": "<p>Lorem ipsum muspi meroL</p>"};
            addWidget(widget);
        }

        function addImageWidget() {
            //var widget = {"widgetType": "IMAGE", "pageId": pageId, "width": "100%", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"};
            var widget = {"widgetType": "IMAGE", "width": "100%", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"};
            addWidget(widget);
        }

        function addYouTubeWidget() {
            //var widget = {"widgetType": "YOUTUBE", "pageId": "321", "width": "100%", "url": "https://youtu.be/AM2Ivdi9c4E"};
            var widget = {"widgetType": "YOUTUBE", "width": "100%", "url": "https://youtu.be/AM2Ivdi9c4E"};
            addWidget(widget);
        }

        function addWidget(widget) {
            WidgetService
                .createWidget(pageId, widget)
                .success(function (addition) {
                    $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + addition._id);
                })
                .error(function (error) {
                });
        }

        function navigateToProfile() {
            $location.url("/user/" + userId);
        }
    }
})();