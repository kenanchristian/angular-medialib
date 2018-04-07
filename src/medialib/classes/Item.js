angular.module("medialib")

.factory("MedialibItem", (MedialibManager, MedialibStorage, $q) => class MedialibItem {
  constructor(options = {}) {
    Object.assign(this, options)
  }

  resolve(type = "thumb") {
    const store = MedialibManager.stores[this.storeId]
    return $q.resolve(this[type] || store[type](this))
  }

  cache(key, resolvable) {
    return MedialibStorage.cacheBlob(`${this.storeId}-${this.id}-${key}`, () => resolvable(this))
  }

  export() {
    return {
      id: this.id,
      storeId: this.storeId,
      title: this.title,
      description: this.description,
      src: this.src,
      thumb: this.thumb
    }
  }
})
