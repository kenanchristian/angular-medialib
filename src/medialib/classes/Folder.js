angular.module("medialib")

.factory("MedialibFolder", () => class MedialibFolder {
  constructor(options = {}) {
    Object.assign(this, options)
  }
})
