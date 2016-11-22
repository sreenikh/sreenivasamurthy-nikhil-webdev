/**
 * Created by Nikhil S on 14-Nov-16.
 */

module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server/js")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);
    
    var api = {
        createWebsite: createWebsite
    };
    return api;
    
    function createWebsite() {
        
    }
}