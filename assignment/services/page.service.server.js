/**
 * Created by Nikhil S on 31-Oct-16.
 */

module.exports = function (app) {
    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "title": "Title 1"},
        { "_id": "432", "name": "Post 2", "websiteId": "456", "title": "Title 2"},
        { "_id": "543", "name": "Post 3", "websiteId": "456", "title": "Title 3"}
    ];

    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var page = req.body;
        for (var p in pages) {
            if (websiteId !== pages[p].websiteId) {
                continue;
            }
            if (page.name === pages[p].name) {
                res.send('0');
                return;
            }
        }
        var newId = generateNewId();
        var newPage = {
            "_id": newId,
            "name": page.name,
            "title": page.title,
            "websiteId": websiteId
        };
        pages.push(newPage);
        res.send(cloneObject(newPage));
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var result = [];
        for (var p in pages) {
            if (websiteId === pages[p].websiteId) {
                result.push(cloneObject(pages[p]));
            }
        }
        res.send(result);
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        for (var p in pages) {
            if(pageId === pages[p]._id) {
                res.send(cloneObject(pages[p]));
                return;
            }
        }
        res.send('0');
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        for (var p in pages) {
            var existingPage = pages[p];
            if (page.websiteId !== existingPage.websiteId) {
                continue;
            }
            if (pageId === existingPage._id) {
                var pageExists = false;
                for (var p in pages) {
                    if (page.name === pages[p].name && pageId !== pages[p]._id) {
                        pageExists = true;
                    }
                }
                if (!pageExists) {
                    existingPage.name = page.name;
                    existingPage.title = page.title;
                    res.send(true);
                    return
                } else {
                    res.send(false);
                    return;
                }
            }
        }
        res.send('0');
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        var pageIdFound = false;
        var p = null;
        for (p in pages) {
            if (pageId === pages[p]._id) {
                pageIdFound = true;
                break;
            }
        }
        if (pageIdFound) {
            pages.splice(p, 1);
        }
        res.send(pageIdFound);
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
}