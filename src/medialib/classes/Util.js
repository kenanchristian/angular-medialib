angular.module("medialib")

.factory("MedialibUtil", (MedialibManager, MedialibItem) => ({
  uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  },
  mapItem(entry) {
    const ItemType = MedialibManager.itemMap[entry.storeId]
    if (ItemType) {
      return new ItemType(entry)
    }
    return new MedialibItem(entry)
  }
}))
