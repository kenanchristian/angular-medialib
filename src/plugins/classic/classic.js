angular.module("medialib-classic", ["medialib"])

.factory("MedialibClassic", ($http, MedialibConfig, MedialibItem, MedialibFolder) => {
  const transform = entry => ({ storeId: "classic", id: entry.id, title: entry.name, thumb: entry.transformations.thumb, src: entry.url })
  const headers = { "X-Classic-Api-Key": MedialibConfig.classic.apiKey }

  return {
    fetchFolder(folder = {}) {
      return $http({ url: `${MedialibConfig.classic.baseUrl}/collections/${folder.id || "root"}`, method: "GET", headers }).then((response) => {
        const folders = response.data.collections.map(entry => new MedialibFolder({ storeId: "classic", id: entry.id, title: entry.name || "Classic", path: entry.path }))
        const items = response.data.images.map(entry => new MedialibItem(transform(entry)))
        return { folders, items, path: response.data.path }
      })
    },

    createPolicy(filename) {
      return $http.post(`${MedialibConfig.classic.baseUrl}/policies`, { filename }, { headers }).then(response => response.data)
    },

    upload(policy, file) {
      return $http.put(policy.url, file.originalFile, { headers: policy.headers, transformRequest: angular.identity })
    },

    updateImage(id, attributes) {
      return $http.patch(`${MedialibConfig.classic.baseUrl}/images/${id}`, attributes, { headers }).then(response => response.data)
    }
  }
})

.run((MedialibManager, MedialibIcons, MedialibCollection, MedialibClassic, MedialibFolder) => {
  MedialibManager.addStore({
    id: "classic",
    title: "Classic",
    icon: MedialibIcons.classic,
    folder: { id: "root" },
    items: new MedialibCollection(),
    folders: new MedialibCollection(),
    load(folder) {
      return MedialibClassic.fetchFolder(folder).then(({ folders, items, path }) => {
        this.path = path.map(entry => new MedialibFolder({ storeId: "classic", id: entry.id || "root", title: entry.name || "Classic" }))
        this.folders = new MedialibCollection(...folders)
        this.items = new MedialibCollection(...items)
      })
    },
    store(transaction, update, complete) {
      // Insert Transaction Item
      this.items.add(transaction)
      return update({ progress: 10, message: "Preparing upload ..." }).then(() =>

        // Generate Policy
        MedialibClassic.createPolicy(transaction.file.name).then(policy => update({ progress: 50, message: "Uploading File" }).then(() =>

        // Upload File
          MedialibClassic.upload(policy, transaction.file).then(() => update({ progress: 75, message: "Storing Metadata" }).then(() =>

          // Save Image
            MedialibClassic.updateImage(policy.id, { stored_at: new Date(), collection_id: this.folder.id }).then(entry => complete({ storeId: "classic", id: entry.id, title: entry.name, thumb: entry.transformations.thumb, src: entry.url }).then((item) => {
              // Replace Transaction Item
              this.items.replace(transaction, item)
            }))))))).catch(() => {
        this.items.remove(transaction)
      })
    }
  })
})
