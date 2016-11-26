/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    "use strict";

    var mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/wam-fall-2016');

    var userModel = require("./user/user.model.server.js")();
    var websiteModel = require("./website/website.model.server.js")();
    var pageModel = require("./page/page.model.server.js")();
    //var widgetModel = require("./widget/widget.model.server")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel,
        pageModel: pageModel
        //widgetModel: widgetModel
    };

    userModel.setModel(model);
    websiteModel.setModel(model);
    pageModel.setModel(model);
    //widgetModel.setModel(model)

    return model;
};