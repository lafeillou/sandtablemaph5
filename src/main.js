import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 地图用到的样式
import 'leaflet/dist/leaflet.css'

Vue.config.productionTip = false

window.Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
