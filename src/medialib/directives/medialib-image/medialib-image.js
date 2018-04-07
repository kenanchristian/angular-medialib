angular.module("medialib")

.directive("medialibImage", MedialibManager => ({
  restrict: "E",
  scope: {
    item: "="
  },
  template: `<img ng-if="src" ng-csp ng-src="{{ src }}">`,
  compile(element, attr, transclude) {
    for (const decorator of Object.values(MedialibManager.imageDecorators)) {
      if (decorator.compile) {
        decorator.compile(element, attr, transclude)
      }
    }
    return this.link
  },
  link(scope, element, attr) {
    for (const decorator of Object.values(MedialibManager.imageDecorators)) {
      if (decorator.link) {
        decorator.link(scope, element, attr)
      }
    }

    element.addClass("loading")
    scope.item.resolve("thumb").then((src) => {
      element.removeClass("loading")
      scope.src = src
    })
  }
}))
