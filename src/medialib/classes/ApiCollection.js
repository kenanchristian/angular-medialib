angular.module("medialib")

.factory("MedialibApiCollection", ($http, MedialibUtil, MedialibCollection) => class MedialibApiCollection extends MedialibCollection {
  constructor(url, methods, options = {}, ...items) {
    super(...items)
    this.url = url
    this.methods = methods
    this.headers = options.headers
  }

  load(method, params = {}) {
    const config = this.methods[method]
    let path = config.path

    path = path.replace(/:([a-z0-9_]+)/, (match, key) => {
      const value = params[key]
      if (params[key]) {
        delete (params[key])
      }
      return value
    })

    return $http({
      url: `${this.url}/${path}`,
      method: config.method,
      headers: Object.assign({}, this.headers, config.headers),
      params: Object.assign({}, config.params, params)
    }).then((response) => {
      const data = config.responseKey ? response.data[config.responseKey] : response.data
      return data.map(config.transform).map(MedialibUtil.mapItem)
    }).then(items => this.clear().add(...items))
  }

  post(path, params = {}, headers = {}) {
    return $http.post(`${this.url}/${path}`, params, {
      headers: Object.assign({}, this.headers, headers)
    }).then(response => response.data)
  }

  patch(path, params = {}, headers = {}) {
    return $http.patch(`${this.url}/${path}`, params, {
      headers: Object.assign({}, this.headers, headers)
    }).then(response => response.data)
  }

  upload(url, file, options = {}) {
    return $http.put(url, file.originalFile, {
      headers: Object.assign({}, this.headers, options.headers),
      transformRequest: angular.identity
    })
  }
})
