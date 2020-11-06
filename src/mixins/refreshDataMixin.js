export default {
  data() {
    return {
      prevTimestamp: null,
      hasCached: false
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  activated() {
    this.visitedViews.forEach(tag => {
      if (tag.path === this.$route.path) {
        if (!tag.hasExisted && this.hasCached) {
          this.refreshData()
        }
        tag.hasExisted = true
      }
    })
    // 解决 Keepalive 组件没有删除成功的修补方法
    const currentTimestamp = this.$route.query.timestamp
      ? this.$route.query.timestamp
      : null
    if (currentTimestamp !== this.prevTimestamp) {
      this.prevTimestamp = currentTimestamp
      this.refreshData()
    }
  },
  deactivated() {
    this.hasCached = true
  },
  methods: {
    refreshData() {
      throw new Error('请重写refreshData方法')
    }
  }
}
