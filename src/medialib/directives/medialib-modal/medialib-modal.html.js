export default `
<div class="medialib-backdrop" ng-class="{ opened: manager.opened, dragging: manager.dragging }" ng-click="onBackdropClicked($event)">
  <ng-transclude></ng-transclude>
</div>`
