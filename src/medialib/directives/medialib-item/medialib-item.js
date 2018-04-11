import template from "./medialib-item.html.js"

angular.module("medialib")

.directive("medialibItem", (MedialibConfig, MedialibManager) => ({
  restrict: "E",
  scope: {
    item: "="
  },
  template,
  compile(element, attr, transclude) {
    // Initialize actions
    for (const decorator of Object.values(MedialibManager.itemDecorators)) {
      if (decorator.compile) {
        decorator.compile(element, attr, transclude)
      }
    }
    return this.link
  },
  link(scope, element, attr) {
    scope.item.element = element[0]

    scope.$watch(() => {
      for (const [className, selector]of Object.entries(MedialibManager.itemClassSelectors)) {
        element[0].classList.toggle(className, selector(scope.item))
      }
    })

    // Initialize actions
    for (const action of Object.values(MedialibManager.actions)) {
      if (action.init) {
        action.init(scope.item)
      }
    }

    // Inject item decorators
    for (const decorator of Object.values(MedialibManager.itemDecorators)) {
      if (decorator.link) {
        decorator.link(scope, element, attr)
      }
    }

    scope.onCardClick = function($event, item) {
      if (MedialibConfig.core.defaultAction != null) {
        MedialibManager.performAction(item, MedialibConfig.core.defaultAction)
      }
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
