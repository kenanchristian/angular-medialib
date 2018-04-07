angular.module("medialib")

.factory("MedialibCollection", () => class MedialibCollection extends Array {
  add(...items) {
    for (const item of items) {
      if (!this.contains(item)) {
        this.push(item)
      }
    }
    return this
  }

  clear() {
    this.length = 0
    return this
  }

  remove(...items) {
    for (const item of items) {
      const index = this.index(item)
      if (index !== -1) {
        this.splice(index, 1)
      }
    }
    return this
  }

  index(item) {
    return this.findIndex(i => i.id === item.id)
  }

  contains(item) {
    return this.index(item) !== -1
  }

  export() {
    return this.map(i => i.export())
  }
})
