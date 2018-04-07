import template from "./medialib-breadcrumb.html.js"

angular.module("medialib")

.directive("medialibBreadcrumb", MedialibManager => ({
  restrict: "E",
  scope: {
    store: "="
  },
  template,
  link(scope) {
    scope.onFolderClick = function(folder) {
      MedialibManager.currentStore.folder = folder
    }
  }
}))
