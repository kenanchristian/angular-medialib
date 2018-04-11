angular.module("medialib")

.factory("MedialibFile", ($http, MedialibStorage) => class MedialibFile {
  constructor(originalFile) {
    this.originalFile = originalFile
  }

  read() {
    return MedialibStorage.readBlob(this.originalFile)
  }

  get name() {
    return this.originalFile.name
  }
})
