/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var WebsiteSchema = mongoose.Schema({
        name: String,
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        description: String,
        pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'PageModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "assignment.website"});
    return WebsiteSchema;
};