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
            {_id: 100, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 101, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 102, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 103, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 104, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 105, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 106, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 107, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 108, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 109, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 110, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 111, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 109, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 110, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 111, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 112, uid: 123, name: "Facebook", description: "Most popular social networking website"},
            {_id: 113, uid: 123, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 114, uid: 123, name: "Twitter", description: "Powerful short tweets / broadcasts"},
            {_id: 201, uid: 234, name: "Facebook", description: "Most popular social networking website"},
            {_id: 202, uid: 234, name: "Wikipedia", description: "World's encyclopedia"},
            {_id: 301, uid: 345, name: "Facebook", description: "Most popular social networking website"},
            {_id: 302, uid: 345, name: "Twitter", description: "Powerful short tweets / broadcasts"}
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