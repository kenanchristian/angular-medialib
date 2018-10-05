import "./medialib-folder.scss"
import template from "./medialib-folder.html.js"

angular.module("medialib")

.directive("medialibFolder", MedialibManager => ({
  restrict: "E",
  scope: {
    folder: "="
  },
  template,
  link(scope, element) {
    scope.folder.element = element[0]
    scope.onFolderClick = function($event, folder) {
      MedialibManager.currentStore.folder = folder
      $event.stopPropagation()
      $event.preventDefault()
      return false
    }
  },
  controller() {
    return MedialibManager
  },
  controllerAs: "manager"
}))
