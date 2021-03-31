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
axios.defaults.baseURL = glob.baseURL

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

// axios请求拦截器
axios.interceptors.request.use(
  config => {
    // 在请求头中增加携带token供后台进行验证
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 对响应数据进行拦截
axios.interceptors.response.use(
  response => {
    if (response.data.meta.msg.includes('无效token')) {
      Vue.prototype.$message.error(response.data.meta.msg)
      router.push('/login')
      return Promise.reject(response.data.meta.msg)
    } else if (!response.data.meta.msg.includes('成功')) {
      Vue.prototype.$message.error(response.data.meta.msg)
      return Promise.reject(response.data.meta.msg)
    } else {
      return response
    }
  },
  err => {
    // 当响应异常时做一些处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误(400)'
          break
        case 401:
          err.message = '未授权，请重新登录(401)'
          break
        case 403:
          err.message = '拒绝访问(403)'
          break
        case 404:
          err.message = '请求出错(404)'
          break
        case 408:
          err.message = '请求超时(408)'
          break
        case 500:
          err.message = '服务器错误(500)'
          break
        case 501:
          err.message = '服务未实现(501)'
          break
        case 502:
          err.message = '网络错误(502)'
          break
        case 503:
          err.message = '服务不可用(503)'
          break
        case 504:
          err.message = '网络超时(504)'
          break
        case 505:
          err.message = 'HTTP版本不受支持(505)'
          break
        default:
          err.message = `连接出错(${err.response.status})!`
      }
    } else {
      err.message = '连接服务器失败!'
    }

    return Promise.reject(err)
  }
)

router.afterEach(() => {
  Nprogress.done()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
