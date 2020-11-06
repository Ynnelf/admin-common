export default {
  // 删除页面缓存，填坑keepAlive缓存顽固问题(参数两次参数不一致时删除缓存)
  beforeRouteLeave(to, from, next) {
    // console.log(this, 'is leaving  ' + from.name)
    // 离开当前页面时执行，form为当前页面
    const that = this
    window['delCache' + from.name] = function() {
      // console.log('开始执行删除函数', that)
      // 存储删除缓存事件，暴力删除缓存
      if (that.$vnode && that.$vnode.data.keepAlive) {
        if (
          that.$vnode.parent &&
          that.$vnode.parent.componentInstance &&
          that.$vnode.parent.componentInstance.cache
        ) {
          if (that.$vnode.componentOptions) {
            const key =
              that.$vnode.key == null
                ? that.$vnode.componentOptions.Ctor.cid +
                  (that.$vnode.componentOptions.tag
                    ? `::${that.$vnode.componentOptions.tag}`
                    : '')
                : that.$vnode.key

            const cache = that.$vnode.parent.componentInstance.cache
            const keys = that.$vnode.parent.componentInstance.keys

            if (cache[key]) {
              if (keys.length) {
                const index = keys.indexOf(key)
                if (index > -1) {
                  keys.splice(index, 1)
                }
              }
              // console.log('删除缓存');
              delete cache[key]
              that.$destroy()
            }
          }
        }
      }
      window['delCache' + from.name] = false // 删除函数
    }
    next()
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to, 'is entering ' + to.name)
    // 这里to为当前页面,进入页面时执行
    if (to.meta.keepAlive) {
      const query = window['keepAlive' + to.name] // 获取上一次参数
      let delCache = window['delCache' + to.name]
      // 判断两次访问此页面时参数是否一致，不一致则使用新页面
      if (delCache) {
        // 正向对比
        for (const t in query) {
          if (to.query[t] !== query[t]) {
            // console.log('参数不一致')
            delCache() // 删除缓存
            delCache = false
            break
          }
        }
      }
      if (delCache) {
        // 反向对比
        for (const t in to.query) {
          if (to.query[t] !== query[t]) {
            // console.log('参数不一致')
            delCache() // 删除缓存
            delCache = false
            break
          }
        }
      }

      window['keepAlive' + to.name] = to.query // 替换成当前页面参数
    }
    next()
  },
  methods: {
    openPage(option, blank = false) {
      const routeData = this.$router.resolve(option)
      blank
        ? window.open(routeData.href)
        : (window.location.href = routeData.href)
    }
  }
}
