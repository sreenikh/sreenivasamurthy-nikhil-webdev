/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var WebsiteSchema = mongoose.Schema({
        name: String,
        developerId: String,
        description: String
    }, {collection: "website"});
    return WebsiteSchema;
};