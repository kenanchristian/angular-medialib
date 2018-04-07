angular.module("medialib")

.factory("MedialibManager", ($rootScope, $compile, MedialibConfig) => ({
  stores: {},
  actions: {},
  currentItem: null,
  currentStore: null,
  components: [],
  decorators: [],
  storeDecorators: [],
  itemDecorators: [],
  imageDecorators: [],
  itemClassSelectors: {},
  sidebar: false,
  config: MedialibConfig,
  itemMap: {},
  addItemMapper(id, ItemType) {
    this.itemMap[id] = ItemType
  },
  addDecorator(decorator) {
    this.decorators[decorator.id] = decorator
  },
  addStoreDecorator(decorator) {
    this.storeDecorators[decorator.id] = decorator
  },
  addItemDecorator(decorator) {
    this.itemDecorators[decorator.id] = decorator
  },
  addImageDecorator(decorator) {
    this.imageDecorators[decorator.id] = decorator
  },
  addItemClassSelector(id, itemClassSelector) {
    this.itemClassSelectors[id] = itemClassSelector
  },
  addStore(store) {
    this.stores[store.id] = store
    return store
  },
  addAction(action) {
    this.actions[action.id] = action
    return action
  },
  setStore(storeId) {
    this.currentStore = this.stores[storeId]
  },
  toggleSidebar() {
    this.sidebar = !this.sidebar
  },
  showSidebar() {
    this.sidebar = true
  },
  hideSidebar() {
    this.sidebar = false
  },
  performAction(item, id) {
    this.actions[id].perform(item)
  },
  getItemAfter(item) {
    const index = this.currentStore.items.indexOf(item) + 1
    if (index >= this.currentStore.items.length) {
      return this.currentStore.items[0]
    }
    return this.currentStore.items[index]
  },
  getItemBefore(item) {
    const index = this.currentStore.items.indexOf(item) - 1
    if (index < 0) {
      return this.currentStore.items[this.currentStore.items.length - 1]
    }
    return this.currentStore.items[index]
  },
  addComponent(component) {
    component.scope = $rootScope.$new(true)
    component.element = $compile(component.template)(component.scope)
    this.components.push(component)
    return component
  },
  open() {
    this.opened = true
    if (this.currentStore == null) {
      this.setStore(Object.keys(this.stores)[0])
    }
  },
  close() {
    this.opened = false
  }
}))
