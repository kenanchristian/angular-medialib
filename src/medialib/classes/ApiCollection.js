angular.module("medialib")

.factory("MedialibApiCollection", ($http, MedialibUtil, MedialibCollection) => class MedialibApiCollection extends MedialibCollection {
  constructor(url, methods, ...items) {
    super(...items)
    this.url = url
    this.methods = methods
  }

  load(method, params = {}) {
    const config = this.methods[method]
    return $http({
      url: `${this.url}/${config.path}`,
      method: config.method,
      headers: config.headers,
      params: Object.assign({}, config.params, params)
    }).then(response => response.data.map(config.transform).map(MedialibUtil.mapItem)).then(items => this.clear().add(...items))
  }
})
