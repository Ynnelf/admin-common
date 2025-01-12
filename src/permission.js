import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permission judge function
function hasPermission(deniedPerms, permissions) {
  if (!permissions) return true
  return !deniedPerms.some(deniedPerm => permissions.indexOf(deniedPerm) >= 0)
}

const whiteList = ['/login', '/LoginForDeveloper', '/auth-redirect'] // no redirect whitelist
let reloadFunc = false

router.beforeEach((to, from, next) => {
  const authkey = to.query.authkey
  if (authkey && authkey !== getToken()) {
    store.commit('SET_TOKEN', authkey)
    setToken(authkey)
    reloadFunc = function() {
      window.location.href = window.location.href
        .split('authkey')[0]
        .slice(0, -1)
      window.reload()
    }
  }
  NProgress.start() // start progress bar
  if (getToken()) {
    if (!store.getters.token) {
      store.commit('SET_TOKEN', getToken())
    }
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.deniedPerms.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('actionGetUserInfo')
          .then(({ deniedPerms }) => {
            store.dispatch('GenerateRoutes', { deniedPerms }).then(() => {
              // 根据perms权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          })
          .catch(err => {
            store.dispatch('actionFedLogout').then(() => {
              Message.error(err || '权限验证失败，请重新登录！')
              next({ path: '/' })
            })
          })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.deniedPerms, to.meta.perms)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true } })
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
  if (reloadFunc) {
    reloadFunc()
    reloadFunc = false
  }
})
