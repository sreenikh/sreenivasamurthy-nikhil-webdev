/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";
    
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);
    
    function WidgetService() {
        var idSet = new Set();
        var lastCreatedId = 1000;

        var widgets = [
            {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": "2", "text": "GIZMODO"},
            {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
            {"_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"},
            {"_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum muspi meroL</p>"},
            {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
            {"_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100", "url": "https://youtu.be/AM2Ivdi9c4E", "text": "Sample Video"},
            {"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];

        for (var wg in widgets) {
            idSet.add(widgets[wg]._id);
        }

        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget
        };
        return api;

        function generateNewId() {
            var newId = (lastCreatedId + 1).toString();
            lastCreatedId += 1;
            return newId;
        }

        function createWidget(pageId, widget) {
            var newId = generateNewId();
            var newWidget = {
                "_id": newId
            };
            for (var key in widget) {
                newWidget[key] = widget[key];
            }
            widgets.push(newWidget);
            return newWidget;
        }

        function findWidgetsByPageId(pageId) {
            var result = [];
            for (var wg in widgets) {
                if (pageId === widgets[wg].pageId) {
                    result.push(cloneObject(widgets[wg]));
                }
            }
            return result;
        }

        function findWidgetById(widgetId) {
            for (var wg in widgets) {
                if (widgetId === widgets[wg]._id) {
                    return cloneObject(widgets[wg]);
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            for (var wg in widgets) {
                var existingWidget = widgets[wg];
                if (widget.pageId !== existingWidget.pageId) {
                    continue;
                }
                if (widgetId === existingWidget._id) {
                    for (var key in widget) {
                        existingWidget[key] = widget[key];
                    }
                    return true;
                }
            }
            return false;
        }

        function deleteWidget(widgetId) {
            var widgetIdFound = false;
            var wg = null;
            for (wg in widgets) {
                if (widgetId === widgets[wg]._id) {
                    widgetIdFound = true;
                    break;
                }
            }
            if (widgetIdFound) {
                widgets.splice(wg, 1);
            }
            return widgetIdFound;
        }

        function cloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }
    }
})();