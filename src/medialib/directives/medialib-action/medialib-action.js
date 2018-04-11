angular.module("medialib")

.directive("medialibAction", MedialibManager => ({
  restrict: "E",
  scope: {
    actionId: "=",
    item: "=",
    icon: "@"
  },
  template: `<i ng-click="performAction($event)" class="mli action-{{ actionId }}" ng-class="{ 'active': manager.config.core.defaultAction === actionId }" ng-style="{ 'background-image': 'url(' + icon + ')' }"></i>`,
  link(scope) {
    scope.performAction = function($event) {
      MedialibManager.performAction(scope.item, scope.actionId)
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
