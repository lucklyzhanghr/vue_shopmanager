import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(Router)

// 去除vue重复点击警告
const routerPush = Router.prototype.push
Router.prototype.push = function push (location: string) {
  return routerPush.call(this, location).catch(error => error)
}
const routerReplace = Router.prototype.replace
Router.prototype.replace = function replace (location: string) {
  return routerReplace.call(this, location).catch(error => error)
}

export default new Router({
  routes: [
    { path: '/', redirect: '/login', meta: { title: '登录' } },
    { path: '/login', component: Login, meta: { title: '登录' } },
    {
      path: '/home',
      component: Home,
      meta: { title: 'Home' },
      redirect: '/users',
      children: [
        {
          path: '/users',
          component: () => import('@/components/Users.vue'),
          meta: { title: '用户列表' }
        },
        {
          path: '/roles',
          component: () => import('@/components/rights/Roles.vue'),
          meta: { title: '角色列表' }
        },
        {
          path: '/rights',
          component: () => import('@/components/rights/Rights.vue'),
          meta: { title: '权限列表' }
        },
        {
          path: '/roles',
          component: () => import('@/components/rights/Roles.vue'),
          meta: { title: '角色列表' }
        }
      ]
    }
  ]
})
