/**
 * Created by Nikhil S on 05-Nov-16.
 */

module.exports = function (app) {
    "use strict";

    var widgets = [
        {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": "2", "text": "GIZMODO"},
        {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
        {"_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"},
        {"_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum muspi meroL</p>"},
        {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": "4", "text": "Lorem ipsum"},
        {"_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100", "url": "https://youtu.be/AM2Ivdi9c4E", "text": "Sample Video"},
        {"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        var newId = generateNewId();
        var newWidget = {
            "_id": newId,
            "pageId": pageId
        };
        for (var key in widget) {
            newWidget[key] = widget[key];
        }
        widgets.push(newWidget);
        res.send(cloneObject(newWidget));
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var result = [];
        for (var wg in widgets) {
            if (pageId === widgets[wg].pageId) {
                result.push(cloneObject(widgets[wg]));
            }
        }
        res.send(result);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        for (var wg in widgets) {
            if (widgetId === widgets[wg]._id) {
                res.send(cloneObject(widgets[wg]));
                return;
            }
        }
        res.send('0');
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for (var wg in widgets) {
            var existingWidget = widgets[wg];
            if (widget.pageId !== existingWidget.pageId) {
                continue;
            }
            if (widgetId === existingWidget._id) {
                for (var key in widget) {
                    existingWidget[key] = widget[key];
                }
                res.send(true);
                return;
            }
        }
        res.send('0');
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
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
        res.send(widgetIdFound);
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}