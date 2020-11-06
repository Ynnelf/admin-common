import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.perms判断是否与当前用户权限匹配
 * @param deniedPerms
 * @param route
 */
function hasPermission(deniedPerms, route) {
  if (route.meta && route.meta.perms) {
    return !deniedPerms.some(deniedPerm =>
      route.meta.perms.includes(deniedPerm)
    )
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param deniedPerms
 */
function filterAsyncRouter(routes, deniedPerms) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRouter(tmp.children, deniedPerms)
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp)
      }
    } else {
      if (hasPermission(deniedPerms, tmp)) {
        res.push(tmp)
      }
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { deniedPerms } = data
        let accessedRouters
        if (deniedPerms.includes('no-denied-perm')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, deniedPerms)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
