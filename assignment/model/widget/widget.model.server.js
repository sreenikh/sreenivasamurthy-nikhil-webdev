/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server.js")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var model = {};

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget,
        setModel: setModel
    };
    return api;

    function createWidget(pageId, widget) {
        return WidgetModel
            .create(widget)
            .then(
                function (newWidget) {
                    return model
                        .pageModel
                        .findPageById(pageId)
                        .then(
                            function (page) {
                                page.widgets.push(newWidget);
                                newWidget._page = page._id;
                                newWidget.save();
                                page.save();
                                return newWidget;
                            },
                            function (error) {
                                console.log(__filename);
                                console.log(error);
                            }
                        );
                },
                function (error) {
                    console.log(__filename);
                    console.log(error);
                });
    }

    function findAllWidgetsForPage(pageId) {
        return model
            .pageModel
            .findWidgetObjectIdsForPage(pageId)
            .then(
                function (listOfWidgetObjectIds) {

                    var listOfWidgetIds = [];
                    var count = 0;

                    listOfWidgetObjectIds.forEach(function (widgetId) {
                        listOfWidgetIds.push(widgetId.valueOf());
                    });

                    var listOfWidgets = [];
                    count = 0;

                    return recursiveFormationOfList(count, listOfWidgetIds, listOfWidgets);

                    function recursiveFormationOfList(currentCount, inputListOfWidgetsIds, widgetAccumulator) {
                        if (currentCount === inputListOfWidgetsIds.length) {
                            return widgetAccumulator;
                        } else {
                            return WidgetModel
                                .findById(inputListOfWidgetsIds[currentCount])
                                .then(
                                    function (widget) {
                                        widgetAccumulator.push(widget);
                                        return recursiveFormationOfList(currentCount + 1, inputListOfWidgetsIds, widgetAccumulator);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }
                    }
                },
                function (error) {
                }
            );
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget) {
        return WidgetModel.update(
            {_id: widgetId},
            {$set: widget}
        );
    }

    function deleteWidget(widgetId) {
        return model
            .widgetModel
            .findWidgetById(widgetId)
            .then(
                function (widget) {
                    var pageId = widget._page;
                    return WidgetModel
                        .remove({_id: widget._id})
                        .then(
                            function (response) {
                                model
                                    .pageModel
                                    .findPageById(pageId.valueOf())
                                    .then(
                                        function (page) {
                                            const index = page.widgets.indexOf(widget._id);
                                            page.widgets.splice(index, 1);
                                            return page.save();
                                        },
                                        function (error) {
                                        }
                                    );
                            },
                            function () {

                            });
                }
            );

    }
    
    function reorderWidget(pageId, startIndex, endIndex) {
        return model
            .pageModel
            .findPageById(pageId)
            .then(
                function (page) {
                    page.widgets.splice(endIndex, 0, page.widgets.splice(startIndex, 1)[0]);
                    page.save();
                    return page;
                },
                function (error) {
                    console.log(__filename);
                    console.log(error);
                }
            );
    }

    function setModel(_model) {
        model = _model;
    }
}