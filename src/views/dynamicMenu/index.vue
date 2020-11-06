<template>
  <div class="page-container">
    <h1>动态菜单</h1>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="false"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      @select="handleSelect"
    >
      <zui-menu-item
        v-for="menuItem in assignedMenus"
        :key="menuItem.id"
        :menuData="menuItem"
      />
    </el-menu>
  </div>
</template>

<script>
import ZuiMenuItem from './ZuiMenuItem'
import { mapGetters } from 'vuex'
export default {
  name: 'DynamicMenu',
  components: { ZuiMenuItem },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['assignedMenus'])
  },
  created() {
    console.log(this.assignedMenus, 1025)
    console.log(this.$store)
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      // this.$router.push({
      //   path: key,
      //   params: { data: 'query' }
      // })
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/.el-menu {
  width: 300px;
  overflow: hidden;
}
</style>
