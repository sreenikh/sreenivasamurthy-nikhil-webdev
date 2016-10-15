/**
 * Created by Nikhil S on 13-Oct-16.
 */

(function() {
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html"
            })
            // .when("/profile", {
            //     templateUrl: "views/user/profile.view.client.html"
            // })
            .when("/website/new", {
                templateUrl: "views/website/website-new.html"
            })
            .when("/website/:wid", {
                templateUrl: "views/website/website-edit.html"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/user/:uid/website", {
                templateUrl: "views/website/website-list.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/login"
            });
    }
})();