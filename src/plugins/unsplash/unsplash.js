angular.module("medialib-unsplash", ["medialib"])

.run((MedialibManager, MedialibConfig, MedialibIcons, MedialibApiCollection) => {
  const transform = data => ({ storeId: "unsplash", id: data.id, title: data.id, src: data.urls.regular, thumb: data.urls.thumb })
  const headers = { "Authorization": `Client-ID ${MedialibConfig.unsplash.accessKey}` }
  const collection = new MedialibApiCollection("https://api.unsplash.com", {
    curated: {
      path: "photos/curated",
      method: "GET",
      params: { page: 1, per_page: 30, order_by: "latest" },
      headers,
      transform
    }
  })

  MedialibManager.addStore({
    id: "unsplash",
    title: "Unsplash",
    icon: MedialibIcons.unsplash,
    items: collection,
    load() {
      return collection.load("curated")
    }
  })
})
