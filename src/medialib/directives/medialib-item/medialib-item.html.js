export default `
<div class="medialib-title">
  <span>{{ item.title }}</span>
</div>
<div class="medialib-card" ng-click="onCardClick($event, item)">
  <medialib-image item="item"></medialib-image>
  <div class="medialib-actions">
    <medialib-action ng-repeat="(actionName, action) in manager.actions" action-id="action.id" icon="{{ action.icon }}" item="item"></medialib-action>
  </div>
</div>`
