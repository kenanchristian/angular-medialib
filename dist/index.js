angular.module("mediaApp", ["medialib", "medialib-unsplash", "medialib-favourites", "medialib-zoom", "medialib-selection", "medialib-drag", "medialib-magloft"])

.config((MedialibConfigProvider) => {
  MedialibConfigProvider.setOptions({ defaultAction: "zoom" })
  MedialibConfigProvider.setPluginOptions("unsplash", { accessKey: "af4272e24414cc3877ac5da002d02c9b2a9ec3ea4837ca3543f20c31f2b12598" })
})

.controller("AppController", ($scope, MedialibManager, $timeout) => {
  $scope.onMedialibDrop = function(item, target) {
    MedialibManager.opened = false
    target.addClass("loading")
    item.resolve("src").then((src) => {
      target.on("load", () => { target.removeClass("loading") })
      target.attr("src", src)
    })
  }

  $timeout(() => {
    MedialibManager.sidebar = true
    MedialibManager.open()
  }, 1000)

  return MedialibManager
})
