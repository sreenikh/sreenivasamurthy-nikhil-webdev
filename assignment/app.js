/**
 * Created by Nikhil S on 28-Oct-16.
 */

module.exports = function (app) {
    require("./services/user.service.server.js")(app);
    require("./services/website.service.server.js")(app);
}