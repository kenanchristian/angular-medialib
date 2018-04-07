import template from "./medialib.html.js"

angular.module("medialib")

.directive("medialib", (MedialibManager, $q, MedialibFile) => ({
  restrict: "E",
  scope: {},
  template,
  compile(element, attr, transclude) {
    for (const decorator of Object.values(MedialibManager.decorators)) {
      if (decorator.compile) {
        decorator.compile(element, attr, transclude)
      }
    }
    return this.link
  },
  link(scope, element, attr) {
    // inject components
    for (const component of MedialibManager.components) {
      const target = component.target ? element[0].querySelector(component.target) : element[0]
      component.link(component.scope, component.element)
      target.appendChild(component.element[0])
    }

    // Inject decorators
    for (const decorator of Object.values(MedialibManager.decorators)) {
      if (decorator.link) {
        decorator.link(scope, element, attr)
      }
    }

    scope.$watch("manager.currentStore.id + manager.currentStore.folder.id", (hash, oldHash) => {
      if (hash === oldHash) { return }
      if (MedialibManager.currentStore.hash === hash) { return }
      if (MedialibManager.currentStore.load) {
        scope.loading = true
        MedialibManager.currentStore.hash = hash
        $q.when(MedialibManager.currentStore.load(MedialibManager.currentStore.folder), () => {
          scope.loading = false
        })
      }
    })

    scope.onFileDrop = function(files) {
      if (MedialibManager.currentStore.drop) {
        MedialibManager.currentStore.drop(Array.from(files).map(file => new MedialibFile(file)))
      }
    }
  },
  controller() {
    return MedialibManager
  },
  controllerAs: "manager"
}))
