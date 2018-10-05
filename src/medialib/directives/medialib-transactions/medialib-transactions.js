import "./medialib-transactions.scss"
import template from "./medialib-transactions.html.js"

angular.module("medialib")

.directive("medialibTransactions", MedialibManager => ({
  restrict: "E",
  scope: {},
  template,
  link(scope, element) {
    scope.$watch("manager.transactions.length", (value) => {
      if (value > 0) {
        element.addClass("active")
      }else {
        element.removeClass("active")
      }
    })
  },
  controller() {
    return MedialibManager
  },
  controllerAs: "manager"
}))
