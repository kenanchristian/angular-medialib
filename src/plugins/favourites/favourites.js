import "./favourites.scss"

angular.module("medialib-favourites", ["medialib"])

.directive("medialibFavourite", () => ({
  restrict: "E",
  scope: {
    favourites: "=",
    item: "="
  },
  template: `<i class="mli" ng-class="{ active: favourites.contains(item) }"></i>`
}))

.run(($document, MedialibManager, MedialibLocalCollection, MedialibIcons) => {
  const collection = new MedialibLocalCollection("favourites-collection")
  collection.load()

  MedialibManager.addItemClassSelector("favourite", item => MedialibManager.stores.favourites.items.contains(item))

  MedialibManager.addItemDecorator({
    id: "favourite",
    compile(element) {
      const card = element[0].querySelector(".medialib-card")
      const mark = angular.element("<medialib-favourite>")
      mark.attr("item", "item")
      mark.attr("favourites", "manager.stores.favourites.items")
      card.appendChild(mark[0])
    }
  })

  MedialibManager.addStore({
    id: "favourites",
    title: "Favourites",
    icon: MedialibIcons.favourites,
    items: collection
  })

  MedialibManager.addAction({
    id: "favourite",
    title: "Favourite",
    icon: MedialibIcons.actionFavourite,
    perform(item) {
      const store = MedialibManager.stores.favourites
      if (store.items.contains(item)) {
        store.items.remove(item)
      }else {
        store.items.add(item)
      }
      store.items.save()
    }
  })
})
