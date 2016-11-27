/**
 * Created by Nikhil S on 05-Nov-16.
 */

module.exports = function (app, model) {
    "use strict";

    var multer = require('multer'); // npm install multer --save
    var mime = require('mime'); // npm install mime --save
        var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            //cb(null, __dirname+'/../../public/assignment/uploads')
            cb(null, '/assignment/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '_' + Date.now() + '.' + mime.extension(file.mimetype));
        }
    });
    var upload = multer({storage: storage});

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/page/:pageId/widget', predecessorToRepositionWidget);
    app.put('/api/page/:pageId/widget?initial=index1&final=index2', repositionWidget);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post('/api/upload', upload.single('imageFile'), uploadImage);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        model
            .widgetModel
            .createWidget(pageId, widget)
            .then(
                function (newWidget) {
                    res.json(newWidget);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        model
            .widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function (listOfWidgets) {
                    res.json(listOfWidgets);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        model
            .widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    res.json(widget);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )

    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        model
            .widgetModel
            .updateWidget(widgetId, widget)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
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

        model
            .widgetModel
            .updateWidget(widgetId, {url: '/assignment/uploads/' + filename})
            .then(
                function (response) {
                    var url = '/assignment/index.html#/user/' + userId + '/website/' + websiteId + '/page/' + pageId + '/widget/' + widgetId;
                    res.redirect(url);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        model
            .widgetModel
            .deleteWidget(widgetId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function predecessorToRepositionWidget(req, res) {
        var query = req.query;
        if (query.initial && query.final) {
            repositionWidget(req, res);
        } else {
            res.send('0');
        }
    }

    function repositionWidget(req, res) {
        var startIndex = req.query.initial;
        var endIndex = req.query.final;
        var pageId = req.params.pageId;
        model
            .widgetModel
            .reorderWidget(pageId, startIndex, endIndex)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
}