import { apiLogin, apiLogout, apiGetUserInfo } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getMenuList = tree => {
  const menus = []
  tree.forEach(item => {
    if (item.checked === 1 && item.type === 1) {
      const menuItem = { id: item.id, name: item.name, path: item.path }
      if (item.children && item.children.length) {
        menuItem.children = getMenuList(item.children)
      }
      menus.push(menuItem)
    }
  })
  return menus
}

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '/app-common/static/avatar_default.png',
    introduction: '',
    roles: [],
    perms: [],
    assignedMenus: [],
    deniedPerms: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_DENIED_PERMS: (state, deniedPerms) => {
      state.deniedPerms = deniedPerms
    },
    SET_ASSIGNED_MENUS: (state, assignedMenus) => {
      state.assignedMenus = assignedMenus
    }
  },

  actions: {
    // 用户名登录
    actionLogin({ commit }, userInfo) {
      const username = userInfo.userName.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        apiLogin(username, password)
          .then(response => {
            console.log(response)
            const token = response.data.entity
            commit('SET_TOKEN', token)
            setToken(token)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 退出登录
    actionLogout({ commit, state }) {
      return new Promise((resolve, reject) => {
        apiLogout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMS', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    actionGetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        apiGetUserInfo(state.token)
          .then(response => {
            const data = response.data.entity
            const deniedPermList = data.deniedPermApis || []
            const deniedPerms = [] // note: perms must be a array! such as: ['GET /aaa','POST /bbb']
            try {
              deniedPermList.forEach(item => {
                deniedPerms.push(item.way + ' ' + item.path)
              })
            } catch (error) {
              console.error(error)
            }
            if (deniedPermList.length > 0) {
              // 验证返回的perms是否是一个非空数组
              commit('SET_DENIED_PERMS', deniedPerms)
            } else {
              deniedPerms.push('no-denied-perm') // 占个位  避免一个没有勾选任何权限的账号登录错误
              commit('SET_DENIED_PERMS', deniedPerms)
              // reject('getInfo: perms must be a non-null array !')
            }
            commit('SET_ROLES', data.roles)
            commit('SET_NAME', data.name)

            const treeMenus =
              (data.appInfoDto && data.appInfoDto.menuInfoDtos) || []
            const assignedMenus = getMenuList(treeMenus)
            commit('SET_ASSIGNED_MENUS', assignedMenus)

            resolve({ deniedPerms })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 前端 登出
    actionFedLogout({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限  这个方法没用过
    actionChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        apiGetUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_PERMS', data.perms)
          commit('SET_NAME', data.name)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
