import VueRouter, { Route } from 'vue-router'
import Rollbar from 'rollbar'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $rollbar: Rollbar
  }
}
