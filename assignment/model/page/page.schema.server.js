/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var PageSchema = mongoose.Schema({
        name: String,
        title: String,
        _website: {type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "page"});
    return PageSchema;
};