import template from "./medialib-modal.html.js"

angular.module("medialib")

.directive("medialibModal", MedialibManager => ({
  restrict: "E",
  scope: {},
  template,
  transclude: true,
  link(scope) {
    MedialibManager.modal = true
    scope.onBackdropClicked = function($event) {
      if ($event.target.classList.contains("medialib-backdrop")) {
        MedialibManager.opened = false
      }
    }
  },
  controller() {
    return MedialibManager
  },
  controllerAs: "manager"
}))
