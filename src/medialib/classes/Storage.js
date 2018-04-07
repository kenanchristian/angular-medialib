angular.module("medialib")

.factory("MedialibStorage", $q => ({
  get(key, defaultValue = null) {
    const value = localStorage.getItem(`medialib-${key}`)
    if (value == null) { return defaultValue }
    try {
      return angular.fromJson(value)
    }catch (e) {
      // empty
    }
    return defaultValue
  },
  set(key, value) {
    const data = angular.toJson(value)
    let result
    try {
      result = localStorage.setItem(`medialib-${key}`, data)
    }catch (e) {
      // empty
    }
    return result
  },
  cacheUrl(key, resolvable) {
    const result = this.get(key)
    if (result) {
      return $q.resolve(result)
    }
    return $q.resolve(resolvable()).then((response) => {
      this.set(key, response)
      return response
    })
  },
  cacheBlob(key, resolvable) {
    const result = this.get(key)
    if (result) {
      return $q.resolve(result)
    }
    return $q.resolve(resolvable()).then(blob => this.saveBlob(key, blob))
  },
  saveBlob(key, blob) {
    return this.readBlob(blob).then((data) => {
      this.set(key, data)
      return data
    })
  },
  readBlob(blob) {
    const deferred = $q.defer()
    const reader = new FileReader()
    reader.onload = function(event) {
      deferred.resolve(event.target.result)
    }
    reader.readAsDataURL(blob)
    return deferred.promise
  }
}))
