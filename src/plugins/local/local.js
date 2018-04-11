angular.module("medialib-local", ["medialib"])

.run(($q, MedialibManager, MedialibItem, MedialibIcons, MedialibLocalCollection, MedialibStorage, MedialibUtil) => {
  const collection = new MedialibLocalCollection("local-collection")

  MedialibManager.addStore({
    id: "local",
    title: "Local Storage",
    icon: MedialibIcons.local,
    items: collection,
    load() {
      collection.load()
    },
    drop(files) {
      return $q.all(files.map((file) => {
        const item = new MedialibItem({ storeId: "local", id: `local-${MedialibUtil.uuid()}`, title: file.name })
        return MedialibStorage.saveBlob(item.id, file.originalFile).then(() => {
          collection.add(item)
          return true
        })
      })).then(() => collection.save())
    },
    thumb(item) {
      return MedialibStorage.get(item.id)
    },
    src(item) {
      return MedialibStorage.get(item.id)
    }
  })
})
