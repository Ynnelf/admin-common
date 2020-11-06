import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const deniedPerms = store.getters && store.getters.deniedPerms

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value

      var hasPermission = false

      if (deniedPerms.includes('no-denied-perm')) {
        hasPermission = true
      } else {
        hasPermission = !deniedPerms.some(deniedPerm => {
          return permissions.includes(deniedPerm)
        })
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(
        `need perms! Like v-permission="['GET /aaa','POST /bbb']"`
      )
    }
  }
}
