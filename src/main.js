import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import '@/plugins/vue-extend' // 扩展

// Vue.config.productionTip = false

let instance = null
function render(props = {}) {
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app') // 挂载到自己的html中 基座会拿到这个挂载后的 html 将其插入进入
}

export const bootstrap = async props => {}

export const mount = async props => {
  render(props)
}

export const unmount = async props => {
  instance.$destroy()
}

if (window.__POWERED_BY_QIANKUN__) {
  /* eslint-disable no-undef */
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
} else {
  render()
}
