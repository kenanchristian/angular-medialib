angular.module("medialib-magloft", ["medialib"])

.factory("MagloftItem", (MedialibItem) => {
  let id = 0
  return class MagloftItem extends MedialibItem {
    constructor(url) {
      id += 1
      super({ storeId: "magloft", id: `magloft-${id}`, title: `Image ${id}`, description: `Description for image #${id}`, thumb: url, src: url })
    }
  }
})

.run((MedialibManager, MedialibIcons, MagloftItem) => {
  MedialibManager.addStore({
    id: "magloft",
    title: "MagLoft",
    icon: MedialibIcons.magloft,
    items: [],
    load() {
      this.items = [
        "https://cdn.magloft.com/assets/account/magloft/images/portal/plans/free.jpg",
        "https://cdn.magloft.com/assets/account/magloft/images/portal/plans/premium.jpg",
        "https://cdn.magloft.com/assets/account/magloft/images/portal/plans/professional.jpg",
        "https://cdn.magloft.com/assets/account/magloft/images/portal/plans/standard.jpg",
        "https://cdn.magloft.com/assets/account/magloft/images/portal/plans/starter.jpg"
      ].map(url => new MagloftItem(url))
    }
  })
})
