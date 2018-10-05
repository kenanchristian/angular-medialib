import "./zoom.scss"
import mediumZoom from "../../../node_modules/medium-zoom/dist/medium-zoom.es.js"

angular.module("medialib-zoom", ["medialib"])

.directive("medialibZoom", (MedialibManager, $rootScope) => ({
  restrict: "A",
  link(scope, element) {
    scope.item.zoom = mediumZoom(element[0], { margin: 48, background: "transparent", container: ".medialib-zoom-wrapper", scrollOffset: 10 })
    scope.item.zoom.addEventListeners("hide", () => {
      $rootScope.$broadcast("medialib-zoom:hide")
    })
    scope.item.zoom.addEventListeners("shown", () => {
      $rootScope.$broadcast("medialib-zoom:shown", { item: scope.item })
    })
    scope.item.zoom.load = function() {
      element.addClass("zoom-loading")
      scope.item.resolve("src").then((src) => {
        element.removeClass("zoom-loading")
        element.attr("data-zoom-target", src)
        scope.item.zoom.show()
      })
    }
  }
}))

.run(($timeout, MedialibManager, MedialibIcons) => {
  MedialibManager.addImageDecorator({
    id: "zoom",
    compile(element) {
      element[0].querySelector("img").setAttribute("medialib-zoom", "")
    }
  })

  MedialibManager.addComponent({
    template: `
      <div class="medialib-zoom-wrapper" ng-class="{ visible: visible }">
        <header>{{ item.title }}</header>
        <div class="medialib-zoom-spacer"></div>
        <div class="medialib-zoom-prev" ng-click="prev(item)"></div>
        <div class="medialib-zoom-next" ng-click="next(item)"></div>
        <footer>{{ item.description }}</footer>
      </div>`,
    link(scope) {
      scope.$on("medialib-zoom:shown", (event, { item }) => {
        $timeout(() => {
          scope.item = item
          scope.visible = true
        })
      })

      scope.$on("medialib-zoom:hide", () => {
        $timeout(() => {
          scope.item = null
          scope.visible = false
        })
      })

      scope.prev = function(item) {
        item.zoom.hide()
        MedialibManager.performAction(MedialibManager.getItemBefore(item), "zoom")
      }

      scope.next = function(item) {
        item.zoom.hide()
        MedialibManager.performAction(MedialibManager.getItemAfter(item), "zoom")
      }
    }
  })

  MedialibManager.addAction({
    id: "zoom",
    title: "Zoom",
    icon: MedialibIcons.actionZoom,
    perform(item) {
      item.zoom.load()
    }
  })
})
