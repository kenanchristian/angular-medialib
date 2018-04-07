import template from "./medialib-store.html.js"

angular.module("medialib")

.directive("medialibStore", (MedialibConfig, MedialibManager) => ({
  restrict: "E",
  scope: {
    store: "="
  },
  template,
  compile(element, attr, transclude) {
    for (const decorator of Object.values(MedialibManager.storeDecorators)) {
      if (decorator.compile) {
        decorator.compile(element, attr, transclude)
      }
    }
    return this.link
  },
  link(scope, element, attr) {
    for (const decorator of Object.values(MedialibManager.storeDecorators)) {
      if (decorator.link) {
        decorator.link(scope, element, attr)
      }
    }
  },
  controller() {
    return MedialibManager
  },
  controllerAs: "manager"
}))
