angular.module("medialib")

.factory("MedialibLocalCollection", (MedialibCollection, MedialibStorage, MedialibUtil) => class MedialibLocalCollection extends MedialibCollection {
  constructor(key, ...items) {
    super(...items)
    this.key = key
  }

  load() {
    const items = MedialibStorage.get(this.key, [])
    this.clear().add(...items.map(MedialibUtil.mapItem))
    return this
  }

  save() {
    MedialibStorage.set(this.key, this.export())
    return this
  }
})
