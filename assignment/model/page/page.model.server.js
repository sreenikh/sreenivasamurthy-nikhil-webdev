/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server.js")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var model = {};

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findWidgetObjectIdsForPage: findWidgetObjectIdsForPage,
        findPageById: findPageById,
        findPagesByWebsiteIdAndName: findPagesByWebsiteIdAndName,
        updatePage: updatePage,
        deletePage: deletePage,
        setModel: setModel
    };
    return api;

    function createPage(websiteId, page) {
        return PageModel
            .create(page)
            .then(
                function (newPage) {
                    return model
                        .websiteModel
                        .findWebsiteById(websiteId)
                        .then(
                            function (website) {
                                website.pages.push(newPage);
                                newPage._website = website._id;
                                newPage.save();
                                website.save();
                                return newPage;
                            },
                            function (error) {
                            }
                        );
                },
                function () {

                });
    }

    function findAllPagesForWebsite(websiteId) {
        return model
            .websiteModel
            .findPageObjectIdsForWebsite(websiteId)
            .then(
                function (listOfPageObjectIds) {
                    return PageModel
                        .find({_id: {$in: listOfPageObjectIds}});
                },
                function (error) {
                }
            );
    }

    function findWidgetObjectIdsForPage(pageId) {
        return PageModel
            .findById(pageId)
            .then(
                function (page) {
                    return page.widgets;
                }
            );
    }

    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }

    function findPagesByWebsiteIdAndName(websiteId, name) {
        return PageModel.find({_website: websiteId, name: name});
    }

    function updatePage(pageId, page) {
        return PageModel.update(
            {_id: pageId},
            {$set: {
                name: page.name,
                description: page.description
            }}
        );
    }

    function deletePage(pageId) {
        return PageModel
            .findById(pageId)
            .then(
                function (page) {
                    var count = 0;
                    var listOfWidgetIds = [];

                    page.widgets.forEach(function (widget) {
                        listOfWidgetIds.push(widget.valueOf());
                    });

                    count = 0;

                    return recursiveDeletionOfWidgets(count, listOfWidgetIds);

                    function recursiveDeletionOfWidgets(currentCount, inputListOfWidgetIds) {
                        if (currentCount === inputListOfWidgetIds.length) {
                            return model
                                .pageModel
                                .findPageById(pageId)
                                .then(
                                    function (page) {
                                        var websiteId = page._website;
                                        return PageModel
                                            .remove({_id: page._id.valueOf()})
                                            .then(
                                                function (response) {
                                                    model
                                                        .websiteModel
                                                        .findWebsiteById(websiteId.valueOf())
                                                        .then(
                                                            function (website) {
                                                                const index = website.pages.indexOf(page._id);
                                                                website.pages.splice(index, 1);
                                                                return website.save();
                                                            },
                                                            function (error) {
                                                            }
                                                        );
                                                },
                                                function () {

                                                });
                                    }
                                );
                        } else {
                            return model
                                .widgetModel
                                .deleteWidget(inputListOfWidgetIds[currentCount])
                                .then(
                                    function (response) {
                                        return recursiveDeletionOfWidgets(currentCount + 1, inputListOfWidgetIds);
                                    },
                                    function (error) {
                                        return error;
                                    }
                                );
                        }

                    }
                },
                function (error) {

                });
    }

    function setModel(_model) {
        model = _model;
    }
}