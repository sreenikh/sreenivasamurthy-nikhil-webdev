/**
 * Created by Nikhil S on 16-Oct-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);
    
    function PageService() {
        var idSet = new Set();
        var lastCreatedId = 1000;

        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456" },
            { "_id": "432", "name": "Post 2", "websiteId": "456" },
            { "_id": "543", "name": "Post 3", "websiteId": "456" }
        ];

        var api = {
            createPage: createPage,
            findPageByWebsiteId: findPageByWebsiteId,
            findPageById: findPageById,
            updatePage: updatePage,
            deleteWebsite: deletePage
        };
        return api;

        function generateNewId() {
            var newId = (lastCreatedId + 1).toString();
            lastCreatedId += 1;
            return newId;
        }

        function createPage(websiteId, page) {
            if ("" === page.name) {
                return null;
            }
            for (var p in pages) {
                if (websiteId !== pages[p].websiteId) {
                    continue;
                }
                if (page.name === pages[p].name) {
                    return null;
                }
            }
            var newId = generateNewId();
            var newPage = {
                "_id": newId,
                "name": page.name,
                "websiteId": websiteId};
            pages.push(newPage);
            return newPage;
        }
        
        function findPageByWebsiteId(websiteId) {
            var result = [];
            for (var p in pages) {
                if (websiteId === pages[p].websiteId) {
                    result.push(cloneObject(pages[p]));
                }
            }
            return result;
        }
        
        function findPageById(pageId) {
            for (var p in pages) {
                if(pageId === pages[p]._id) {
                    return cloneObject(pages[p]);
                }
            }
            return null;
        }

        function updatePage(pageId, page) {
            for (var p in pages) {
                var existingPage = page[p];
                if (page.websiteId !== existingPage.websiteId) {
                    continue;
                }
                if (pageId === existingPage._id) {
                    if ((page.websiteId === existingPage.websiteId) ||
                        ((null === findPageByName(page.name, page.websiteId)) && ("" !== page.name))) {
                        existingPage.name = page.name;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
        
        function deletePage(pageId) {
            var pageIdFound = false;
            for (var p in pages) {
                if (pageId === pages[p]._id) {
                    pageIdFound = true;
                    break;
                }
            }
            if (pageIdFound) {
                pages.splice(p, 1);
            }
            return pageIdFound;
        }

        function findPageByName(name, wid) {
            for (var p in pages) {
                if (wid !== pages[p].websiteId) {
                    continue;
                }
                if (name === pages[p].name) {
                    return cloneObject(pages[p]);
                }
            }
            return null;
        }

        function cloneObject(object) {
            return JSON.parse(JSON.stringify(object));
        }
    }
})();