/**
 * Created by Nikhil S on 14-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("WebsiteService", websiteService);

    function websiteService() {
        var websites = [
            {_id: 111, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 222, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 333, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 444, uid: 234, name: "Facebook", description: "Most popular social networking website"},
            {_id: 555, uid: 234, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 666, uid: 345, name: "Facebook", description: "Most popular social networking website"},
            {_id: 777, uid: 345, name: "Twitter", description: "Powerful short tweets / broadcasts"}
        ];

        var api = {
            findWebsitesForUser: findWebsitesForUser
        };
        return api;

        function findWebsitesForUser(uid) {
            console.log(uid);
            var result = [];
            for (var w in websites) {
                if (uid === websites[w].uid) {
                    result.push(websites[w]);
                }
            }
            return result;
        }
    }
})();