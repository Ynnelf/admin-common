import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/LoginForDeveloper',
    component: () => import('@/views/login/LoginForDeveloper'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/errorPage/404')
      }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '应用管理', icon: 'component', affix: true }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // require service support
  base: '/app-common/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/dynamic-menu',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/dynamicMenu/index'),
  //       name: 'dynamicMenu',
  //       meta: { title: '动态菜单', icon: 'list' }
  //     }
  //   ]
  // },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'Menu',
        name: 'Menu',
        component: () => import('@/views/system/Menu'),
        meta: {
          title: '菜单配置',
          keepAlive: true
        }
      },
      {
        path: 'Auth',
        name: 'Auth',
        hidden: true,
        component: () => import('@/views/system/Auth'),
        meta: {
          perms: ['GET /upas/auth-tree/project/list'],
          title: '权限配置',
          keepAlive: true
        }
      },
      {
        path: 'Role',
        name: 'Role',
        component: () => import('@/views/system/Role'),
        meta: {
          perms: ['POST /upas/role/list'],
          title: '角色列表',
          keepAlive: true
        }
      },
      {
        path: 'Admin',
        name: 'Admin',
        component: () => import('@/views/system/Admin'),
        meta: {
          perms: ['GET /upas/user/list'],
          title: '用户列表',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    meta: {
      icon: 'tree',
      title: '版本管理'
    },
    children: [
      {
        path: 'VersionList',
        name: 'VersionList',
        component: () => import('@/views/version/VersionList'),
        meta: { title: '版本列表' }
      },
      {
        path: 'VersionCreate',
        name: 'VersionCreate',
        component: () => import('@/views/version/VersionCreate'),
        meta: { title: '添加版本' }
      },
      {
        path: 'VersionEdit',
        name: 'VersionEdit',
        hidden: true,
        component: () => import('@/views/version/VersionEdit'),
        meta: { title: '编辑版本' }
      }
    ]
  },
  {
    path: '/agreement',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Agreement',
        component: () => import('@/views/agreement/Agreement'),
        meta: { title: '协议管理' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    hidden: true,
    children: [
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/profile/Psw'),
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/icons',
    component: Layout,
    hidden: true, // 这个路由是为了方便查看自己引入的所有的svg icon
    redirect: '/icons/index',
    children: [
      {
        path: 'index',
        name: 'Icons',
        component: () => import('@/views/icons/index'),
        meta: { title: 'Icons', icon: 'icon' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
