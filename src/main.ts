import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// Nprogress.set(0.6)

// 路由守卫
router.beforeEach((to, from, next) => {
  // Nprogress.inc()
  Nprogress.start()
  next()
})

router.afterEach(() => {
  Nprogress.done()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
