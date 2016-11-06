/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";
    
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    
    function WidgetService($http) {
        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget,
            repositionWidget: repositionWidget
        };
        return api;

        function createWidget(pageId, widget) {
            var url = '/api/page/' + pageId + '/widget';
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(pageId) {
            var url = '/api/page/' + pageId + '/widget';
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            var url = '/api/widget/' + widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            var url = '/api/widget/' + widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId) {
            var url = '/api/widget/' + widgetId;
            return $http.delete(url);
        }

        function repositionWidget(pageId, startIndex, endIndex) {
            var url = '/api/page/' + pageId + '/widget' + '?initial=' + startIndex + '&final=' + endIndex;
            return $http.put(url);
        }
    }
})();