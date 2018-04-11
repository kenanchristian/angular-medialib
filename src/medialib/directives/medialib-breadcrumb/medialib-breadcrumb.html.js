export default `
<a ng-if="store.path" href class="medialib-breadcrum-item" ng-repeat="folder in store.path" ng-click="onFolderClick(folder)">
  <div class="medialib-breadcrumb-item-title">{{ folder.title }}</div>
</a>
<div class="medialib-breadcrum-item" ng-if="!store.path">
  <div class="medialib-breadcrumb-item-title">{{ store.title }}</div>
</div>`
