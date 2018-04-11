angular.module("medialib")

.factory("MedialibTransaction", (MedialibFile, MedialibUtil, MedialibIcons, $timeout, $q) => class MedialibTransaction {
  constructor(originalFile) {
    this.id = MedialibUtil.uuid()
    this.file = new MedialibFile(originalFile)
    this.progress = 0
    this.title = `Storing ${this.file.name}`
    this.message = "loading ..."
    this.status = "working"
    this.dismissed = false
  }

  resolve() {
    return this.file.read()
  }

  update({ progress, message }) {
    if (this.status === "failed") { return $q.reject("cancelled") }
    this.progress = progress
    this.message = message
    return $q.resolve()
  }

  complete(entry = {}) {
    if (this.status === "failed") { return $q.reject("cancelled") }
    this.progress = 100
    this.status = "complete"
    $timeout(2500).then(() => {
      this.dismissed = true
    })
    return $q.resolve(MedialibUtil.mapItem(entry))
  }

  dismiss() {
    this.dismissed = true
  }

  fail(dismiss = false) {
    this.progress = 0
    this.status = "failed"
    if (dismiss) {
      this.dismiss()
    }
  }
})
