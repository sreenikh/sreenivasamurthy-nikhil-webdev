/**
 * Created by Nikhil S on 27-Nov-16.
 */

(function () {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("FlickrService", FlickrService);

    function FlickrService($http) {
        var key = "6f80b3fc436f4dc106f650d689150473";
        var secret = "9a0bd082dfb286a3";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        var api = {
            searchPhotos: searchPhotos
        };
        return api;

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();