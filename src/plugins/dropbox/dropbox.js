angular.module("medialib-dropbox", ["medialib"])

.factory("MedialibDropbox", (MedialibStorage, MedialibItem, MedialibFolder) => ({
  generatePath(folder) {
    if (!folder) { return null }
    const ids = folder.id.split("/")
    const titles = folder.path.split("/")
    return titles.map((title, i) => {
      const id = ids.slice(0, i + 1).join("/")
      const path = titles.slice(0, i + 1).join("/")
      return new MedialibFolder({ storeId: "dropbox", id, title: title || "Dropbox", path })
    })
  },

  fetchFolder(folder = {}) {
    const dbx = new Dropbox.Dropbox({ accessToken: MedialibStorage.get("dropbox-access-token") })
    return dbx.filesListFolder({ path: folder.id || "", include_media_info: true }).then((response) => {
      const folders = []
      const items = []
      for (const entry of response.entries) {
        if (entry[".tag"] === "folder") {
          folders.push(new MedialibFolder({ storeId: "dropbox", id: entry.path_lower, title: entry.name, path: entry.path_display }))
        }else {
          items.push(new MedialibItem({ storeId: "dropbox", id: entry.id, title: entry.name }))
        }
      }
      return { folders, items }
    })
  },

  resolver(size, format = "jpeg") {
    return function(item) {
      const dbx = new Dropbox.Dropbox({ accessToken: MedialibStorage.get("dropbox-access-token") })
      return dbx.filesGetThumbnail({ path: item.id, format, size }).then(response => response.fileBlob)
    }
  }
}))

.run(($window, MedialibManager, MedialibDropbox, MedialibConfig, MedialibStorage, MedialibIcons) => {
  // OAuth Authentication
  const oauthMatch = $window.location.href.match(/medialib-oauth=dropbox#access_token=([a-zA-Z0-9_-]+)&/)
  if (oauthMatch) {
    $window.location.hash = ""
    MedialibStorage.set("dropbox-access-token", oauthMatch[1])
  }

  const authenticate = function() {
    if (MedialibStorage.get("dropbox-access-token")) { return true }
    const dbx = new Dropbox.Dropbox({ clientId: MedialibConfig.dropbox.clientId })
    const authUrl = dbx.getAuthenticationUrl(`${$window.location.href}?medialib-oauth=dropbox`)
    $window.location.href = authUrl
    return false
  }

  MedialibManager.addStore({
    id: "dropbox",
    title: "Dropbox",
    icon: MedialibIcons.dropbox,
    items: [],
    folders: [],
    load(folder) {
      if (!authenticate()) { return false }
      this.path = MediaLibDropbox.generatePath(folder)
      return MediaLibDropbox.fetchFolder(folder).then(({ folders, items }) => {
        this.folders = folders
        this.items = items
      })
    },
    thumb(item) {
      return item.cache("thumb", MediaLibDropbox.resolver("w256h256"))
    },
    src(item) {
      return item.cache("src", MediaLibDropbox.resolver("w1024h768"))
    }
  })
})
