/**
 * Created by Nikhil S on 05-Nov-16.
 */

(function () {
    angular
        .module("jgaDirectives", [])
        .directive("sortableWidgets", sortableWidgets);

    function sortableWidgets() {

        function linker(scope, element, attributes) {
            var startIndex = -1;
            var endIndex = -1;
            element
                .sortable({
                    start: function (event, ui) {
                        startIndex = ($(ui.item).index());
                    },
                    stop: function (event, ui) {
                        endIndex = ($(ui.item).index());
                        var widgetId = $(ui.item).scope().widget._id;
                        scope.sortableWidgetsController.sortWidgets(widgetId, startIndex, endIndex);
                    }
                });
        }

        return {
            scope: {},
            link: linker,
            controller: sortableWidgetsController,
            controllerAs: 'sortableWidgetsController'
        };
    }
    
    function sortableWidgetsController(WidgetService, $routeParams) {
        var vm = this;
        vm.sortWidgets = sortWidgets;

        function sortWidgets(widgetId, startIndex, endIndex) {
            var pageId = $routeParams.pid;
            WidgetService
                .repositionWidget(pageId, startIndex, endIndex)
                .success(function (response) {
                })
                .error(function (error) {
                });
        }
    }
})();