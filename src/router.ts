import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login', meta: { title: '登录' } },
    { path: '/login', component: Login, meta: { title: '登录' } },
    { path: '/home', component: Home, meta: { title: 'Home' } }
  ]
})
