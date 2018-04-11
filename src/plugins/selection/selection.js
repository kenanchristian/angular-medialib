angular.module("medialib-selection", ["medialib"])

.config((MedialibConfigProvider) => {
  MedialibConfigProvider.setPluginOptions("selection", { maxSelectionSize: 1 })
})

.run((MedialibManager, MedialibConfig, MedialibIcons) => {
  MedialibManager.selection = []
  const ctrl = {
    selection: MedialibManager.selection,
    select(item) {
      const exists = (this.selection.find(i => i.id === item.id) != null)
      const limitReached = (MedialibConfig.selection.maxSelectionSize !== 0 && this.selection.length >= MedialibConfig.selection.maxSelectionSize)
      if (exists) {
        this.deselect(item)
      }else {
        if (limitReached) {
          this.deselect(this.selection[0])
        }
        this.selection.push(item)
      }
    },
    deselect(item) {
      const index = this.selection.findIndex(i => i.id === item.id)
      if (index !== -1) {
        this.selection.splice(index, 1)
      }
    }
  }

  MedialibManager.addItemClassSelector("selected", item => MedialibManager.selection.find(i => item.id === i.id) != null)

  MedialibManager.addComponent({
    target: ".medialib-footer",
    template: `
      <div class="medialib-selection-panel" ng-show="ctrl.selection.length > 0">
        <div class="medialib-selection-thumbnails">
          <div class="medialib-selection-thumbnail" ng-repeat="item in ctrl.selection" ng-click="ctrl.deselect(item)">
            <img title="{{ item.title }}" ng-src="{{ item.thumb || item.src }}" />
          </div>
        </div>
      </div>`,
    link($scope) {
      $scope.ctrl = ctrl
    }
  })

  MedialibManager.addAction({
    id: "select",
    title: "Select",
    icon: MedialibIcons.actionSelect,
    perform: ctrl.select.bind(ctrl)
  })
})
