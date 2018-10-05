import "./drag.scss"

angular.module("medialib-drag", ["medialib"])

.directive("medialibDrag", (MedialibManager, $timeout) => ({
  restrict: "A",
  link(scope, element) {
    element.attr("draggable", "true")
    element.bind("dragstart", () => {
      MedialibManager.dragInfo = { element, item: scope.item }
      element.addClass("dragging")
      $timeout(() => {
        MedialibManager.dragging = true
      })
    })
    element.bind("dragend", () => {
      element.removeClass("dragging")
      $timeout(() => {
        MedialibManager.dragging = false
      })
    })
  }
}))

.directive("medialibDrop", MedialibManager => ({
  restrict: "A",
  scope: {
    medialibDrop: "&"
  },
  link(scope, element) {
    element.bind("dragover", (event) => {
      event.dataTransfer.dropEffect = "link"
      event.preventDefault()
      return false
    })

    element.bind("dragenter", () => {
      element.addClass("medialib-drag-over")
    })

    element.bind("dragleave", () => {
      element.removeClass("medialib-drag-over")
    })

    element.bind("drop", (event) => {
      element.removeClass("medialib-drag-over")
      MedialibManager.dragInfo.target = angular.element(event.target)
      scope.medialibDrop(MedialibManager.dragInfo)
      event.preventDefault()
      event.stopPropagation()
      return false
    })
  }
}))

.run((MedialibManager) => {
  MedialibManager.addItemDecorator({
    id: "drag",
    compile(element) {
      element[0].querySelector(".medialib-card").setAttribute("medialib-drag", "item")
    }
  })
})
