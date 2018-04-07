angular.module("medialib-googledrive", ["medialib"])

.factory("MedialibGoogleDrive", ($q, MedialibConfig, MedialibStorage, MedialibItem, MedialibFolder) => ({
  authenticate() {
    const deferred = $q.defer()
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: MedialibConfig.googledrive.apiKey,
        clientId: MedialibConfig.googledrive.clientId,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: "https://www.googleapis.com/auth/drive.readonly"
      }).then(() => {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          deferred.resolve()
        }else {
          gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
            if (isSignedIn) {
              deferred.resolve()
            }else {
              deferred.reject()
            }
          })
          gapi.auth2.getAuthInstance().signIn()
        }
      })
    })
    return deferred.promise
  },

  fetchFolder(folder = {}) {
    const email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail()
    const q = `('${folder.id || "root"}' in parents) and ('${email}' in owners) and (mimeType contains 'image/' or mimeType contains 'video/' or mimeType = 'application/vnd.google-apps.folder')`
    const fields = "nextPageToken, files(id, name, mimeType, thumbnailLink, webContentLink, parents)"
    const spaces = "drive"
    const corpora = "user"
    const orderBy = "folder, name"
    const pageSize = 40
    return gapi.client.drive.files.list({ q, fields, corpora, spaces, orderBy, pageSize }).then(({ result }) => {
      const folders = []
      const items = []
      for (const entry of result.files) {
        if (entry.mimeType === "application/vnd.google-apps.folder") {
          folders.push(new MedialibFolder({ storeId: "googledrive", id: entry.id, title: entry.name, parents: entry.parents }))
        }else {
          items.push(new MedialibItem({ storeId: "googledrive", id: entry.id, title: entry.name, thumb: entry.thumbnailLink, src: entry.webContentLink }))
        }
      }
      return { folders, items }
    })
  }
}))

.run((MedialibManager, MedialibGoogleDrive, MedialibIcons) => {
  MedialibManager.addStore({
    id: "googledrive",
    title: "Google Drive",
    icon: MedialibIcons.googledrive,
    items: [],
    folders: [],
    load(folder) {
      return MedialibGoogleDrive.authenticate().then(() => MedialibGoogleDrive.fetchFolder(folder).then(({ folders, items }) => {
        this.folders = folders
        this.items = items
      }))
    }
  })
})
