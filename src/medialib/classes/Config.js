angular.module("medialib")

.provider("MedialibConfig", function() {
  const options = { core: { defaultAction: null } }
  this.setPluginOptions = function(plugin, opts) {
    options[plugin] = Object.assign({}, options[plugin], opts)
  }
  this.setOptions = function(opts) {
    options.core = Object.assign({}, options.core, opts)
  }
  this.$get = function() {
    return options
  }
})
