angular.module("mediaApp", ["medialib", "medialib-unsplash", "medialib-local", "medialib-magloft", "medialib-googledrive", "medialib-dropbox", "medialib-favourites", "medialib-zoom", "medialib-selection", "medialib-drag"])

.config((MedialibConfigProvider) => {
  MedialibConfigProvider.setOptions({ defaultAction: "zoom" })
  MedialibConfigProvider.setPluginOptions("unsplash", { accessKey: "af4272e24414cc3877ac5da002d02c9b2a9ec3ea4837ca3543f20c31f2b12598" })
  MedialibConfigProvider.setPluginOptions("dropbox", { clientId: "2eh8suyt7ddh0in" })
  MedialibConfigProvider.setPluginOptions("googledrive", { clientId: "351460212248-bs0r9mp0mrpq3v3323ls2gear1ioh7s9.apps.googleusercontent.com", apiKey: "AIzaSyBbMPy8MdmZk-MQPs5USyqfTeBgvnzWgZE" })
})

.controller("AppController", ($scope, MedialibManager) => {
  $scope.onMedialibDrop = function(item, target) {
    MedialibManager.opened = false
    target.addClass("loading")
    item.resolve("src").then((src) => {
      target.on("load", () => { target.removeClass("loading") })
      target.attr("src", src)
    })
  }
  return MedialibManager
})
