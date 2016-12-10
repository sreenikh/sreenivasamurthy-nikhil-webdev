/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var PageSchema = mongoose.Schema({
        name: String,
        _website: {type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'},
        title: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'WidgetModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "assignment.page"});
    return PageSchema;
};