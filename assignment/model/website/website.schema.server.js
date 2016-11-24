/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require('mongoose');
    var WebsiteSchema = mongoose.Schema({
        name: String,
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        description: String,
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "website"});
    return WebsiteSchema;
};