/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/wam-fall-2016');

    var userModel = require("./user/user.model.server.js")();
    var websiteModel = require("./website/website.model.server.js")();

    var model = {
        userModel: userModel,
        websiteModel: websiteModel
        // pageModel: pageModel,
        // widgetModel: widgetModel
    };
    return model;
};