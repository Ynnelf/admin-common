import Vue from 'vue'
import cacheMixin from '@/mixins/cacheMixin'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import * as filters from '@/filters'
import * as CommonFunc from '@/utils/commonFunc'
import * as directives from '@/directive'
import permission from '@/directive/permission/index.js' // 权限判断指令
import VueBus from './vue-bus'
import Print from '@/utils/print' // 打印

/* import components from '../components/global'
Object.keys(components).forEach(key => {
  Vue.component(`${key}`, components[key])
})
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.prototype.$cookies = Cookies

Vue.prototype.$commonFunc = CommonFunc

Vue.mixin(cacheMixin)

Vue.use(VueBus)

Vue.use(Print)

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.directive('permission', permission)
