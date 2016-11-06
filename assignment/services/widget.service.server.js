/**
 * Created by Nikhil S on 05-Nov-16.
 */

module.exports = function (app) {
    "use strict";

    var widgets = [
        {"_id": "123", "widgetType": "HEADER", "pageId": "321", "index": 0, "size": "4", "text": "Lorem ipsum"},
        {"_id": "234", "widgetType": "HEADER", "pageId": "321", "index": 1, "size": "2", "text": "GIZMODO"},
        {"_id": "345", "widgetType": "IMAGE", "pageId": "321", "index": 2, "width": "100", "url": "http://lorempixel.com/400/200/", "text": "Sample Image"},
        {"_id": "456", "widgetType": "HTML", "pageId": "321", "index": 3, "text": "<p>Lorem ipsum muspi meroL</p>"},
        {"_id": "567", "widgetType": "HEADER", "pageId": "321", "index": 4, "size": "4", "text": "Lorem ipsum"},
        {"_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "index": 5, "width": "100", "url": "https://youtu.be/AM2Ivdi9c4E", "text": "Sample Video"},
        {"_id": "789", "widgetType": "HTML", "pageId": "321", "index": 6, "text": "<p>Lorem ipsum</p>"}
    ];

    var multer = require('multer'); // npm install multer --save
    var mime = require('mime'); // npm install mime --save
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname+'/../../public/assignment/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '_' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({storage: storage});

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/page/:pageId/widget', function (req, res) {
        var query = req.query;
        if (query.initial && query.final) {
            repositionWidget(req, res);
        } else {
            res.send('0');
        }
    });
    app.put('/api/page/:pageId/widget?initial=index1&final=index2', repositionWidget);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post('/api/upload', upload.single('imageFile'), uploadImage);

    var sortByKey = function (key) {
        return function (item1, item2) {
            var operand1 = item1[key];
            var operand2 = item2[key];
            if (operand1 > operand2) {
                return 1;
            } else if (operand1 < operand2) {
                return -1;
            } else {
                return 0;
            }
        };
    };

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        var newId = generateNewId();

        function findAllWidgetsForPageByReference(pid) {
            var result = [];
            for (var wg in widgets) {
                if (pageId === widgets[wg].pageId) {
                    result.push(widgets[wg]);
                }
            }
            return result;
        }

        var newIndex = findAllWidgetsForPageByReference(pageId).length;

        var newWidget = {
            "_id": newId,
            "pageId": pageId,
            "index": newIndex
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
        var key = 'index';
        result.sort(sortByKey(key));
        res.send(result);
    }

    function findWidgetById(req, res) {
        console.log('');
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

    function uploadImage(req, res) {
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var widgetId = req.body.widgetId;
        var imageFile = req.file;

        var originalname  = imageFile.originalname; // file name on user's computer
        var filename      = imageFile.filename;     // new file name in upload folder
        var path          = imageFile.path;         // full path of uploaded file
        var destination   = imageFile.destination;  // folder where file is saved to
        var size          = imageFile.size;
        var mimetype      = imageFile.mimetype;

        for (var wg in widgets) {
            var existingWidget = widgets[wg];
            if (pageId !== existingWidget.pageId) {
                continue;
            }
            if (widgetId === existingWidget._id) {
                existingWidget.url = '/assignment/uploads/' + filename;
                break;
            }
        }

        var url = '/assignment/index.html#/user/' + userId + '/website/' + websiteId + '/page/' + pageId + '/widget/' + widgetId;
        res.redirect(url);
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
        function findAllWidgetsForPageByReference(pid) {
            var result = [];
            for (var wg in widgets) {
                if (pageId === widgets[wg].pageId) {
                    result.push(widgets[wg]);
                }
            }
            return result;
        }
        if (widgetIdFound) {
            var pageId = widgets[wg].pageId;
            widgets.splice(wg, 1);
            var key = 'index';
            var widgetsForPage = findAllWidgetsForPageByReference(pageId).sort(sortByKey(key));
            for (var wg in widgetsForPage) {
                widgetsForPage[wg].index = wg;
            }
        }
        res.send(widgetIdFound);
    }

    function repositionWidget(req, res) {
        var startIndex = req.query.initial;
        var endIndex = req.query.final;
        var pageId = req.params.pageId;

        function findAllWidgetsForPageByReference(pid) {
            var result = [];
            for (var wg in widgets) {
                if (pageId === widgets[wg].pageId) {
                    result.push(widgets[wg]);
                }
            }
            return result;
        }

        var key = 'index';
        var widgetsForPage = findAllWidgetsForPageByReference(pageId).sort(sortByKey(key));
        widgetsForPage.splice(endIndex, 0, widgetsForPage.splice(startIndex, 1)[0]);
        for (var wg in widgetsForPage) {
            widgetsForPage[wg].index = wg;
        }

        res.send(true);
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}