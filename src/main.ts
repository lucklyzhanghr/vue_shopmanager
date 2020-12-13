import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

// 设置默认请求后台根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// Nprogress.set(0.6)

// 路由守卫
router.beforeEach((to, from, next) => {
  // Nprogress.inc()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 如果打开login页面则直接放行
  if (to.path === '/login') return next()
  // 其余打开任何页面都需检查token值
  if (!sessionStorage.getItem('token')) {
    document.title = '登录'
    return next('/login')
  }
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
