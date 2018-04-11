export default `
<div class="medialib-sidebar" ng-class="{ active: manager.sidebar }">
  <div class="medialib-navbar">
    <span class="medialib-navbar-library-title">Media Library</span>
  </div>
  <a href class="medialib-sidebar-item" ng-click="manager.setStore(store.id); manager.hideSidebar()" ng-class="{ active: store === manager.currentStore }" ng-repeat="(identifier, store) in manager.stores">
    <img ng-src="{{ store.icon }}">
    <span>{{ store.title }}</span>
  </a>
</div>
<div class="medialib-main" ng-class="{ loading: loading }">
  <div class="medialib-navbar">
    <a ng-click="manager.toggleSidebar()" class="medialib-bars"></a>
    <medialib-breadcrumb store="manager.currentStore"></medialib-breadcrumb>
    <div class="medialib-navbar-info">
      <span>{{ manager.currentStore.items.length }} items available</span>
    </div>
    <a href ng-click="manager.close()" class="medialib-close" ng-if="manager.modal">×</a>
  </div>
  <medialib-store store="manager.currentStore" medialib-filedrop="onFileDrop(files)"></medialib-store>
  <div class="medialib-footer"></div>
</div>
<medialib-transactions></medialib-transactions>`
