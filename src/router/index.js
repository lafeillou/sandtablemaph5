import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // webview里面不执行这个路由，很奇怪
  // {
  //   path: '/',
  //   name: 'DZMap',
  //   component: DZMap
  // }
]

const router = new VueRouter({
  routes
})

export default router
