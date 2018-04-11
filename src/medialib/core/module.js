angular.module("medialib", [])

.config(($compileProvider) => {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\/|data:application\//)
})
