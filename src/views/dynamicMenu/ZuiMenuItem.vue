<template>
  <div>
    <el-submenu
      v-if="menuData.children && menuData.children.length"
      :key="menuData.id"
      :index="menuData.path"
    >
      <template slot="title">
        <span>{{ menuData.name }}</span>
      </template>
      <zui-menu-item
        v-for="childData in menuData.children"
        :key="childData.id"
        :menuData="childData"
      />
    </el-submenu>
    <el-menu-item
      v-else
      :key="menuData.id"
      :index="menuData.path"
    >
      <span slot="title">{{ menuData.name }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'ZuiMenuItem',
  props: {
    menuData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
</style>
