/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    
    function PageService($http) {
        var api = {
            createPage: createPage,
            findPagesByWebsiteId: findPagesByWebsiteId,
            findPageById: findPageById,
            updatePage: updatePage,
            deletePage: deletePage
        };
        return api;

        function createPage(websiteId, page) {
            var url = '/api/website/' + websiteId + '/page';
            return $http.post(url, page);
        }
        
        function findPagesByWebsiteId(websiteId) {
            var url = '/api/website/' + websiteId + '/page';
            return $http.get(url);
        }
        
        function findPageById(pageId) {
            var url = '/api/page/' + pageId;
            return $http.get(url);
        }

        function updatePage(pageId, page) {
            var url = '/api/page/' + pageId;
            return $http.put(url, page);
        }
        
        function deletePage(pageId) {
            var url = '/api/page/' + pageId;
            return $http.delete(url);
        }

        function cloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }
    }
})();