angular.module("medialib")

.directive("medialibFiledrop", (MedialibManager, $parse) => ({
  restrict: "A",
  compile($element, attr) {
    const fn = $parse(attr.medialibFiledrop)
    return function medialibFiledropHandler(scope, element) {
      element.on("dragover", (event) => {
        element.addClass("ng-drag-over")
        event.preventDefault()
        event.stopPropagation()
      })

      element.on("dragenter", (event) => {
        element.addClass("ng-drag-over")
        event.preventDefault()
        event.stopPropagation()
      })

      element.on("dragleave", () => {
        element.removeClass("ng-drag-over")
      })

      element.on("drop", (event) => {
        element.removeClass("ng-drag-over")
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
          scope.$apply(() => {
            fn(scope, { $event: event, files: event.dataTransfer.files })
          })
        }
      })
    }
  }
}))
