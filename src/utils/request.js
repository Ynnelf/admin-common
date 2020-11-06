import axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { appCode } from '@/config'
axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60 * 1000, // request timeout
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Litemall-Admin-Token']为自定义key 请根据实际情况自行修改
      config.headers['ZYL-UPAS-TOKEN'] = getToken()
    }
    config.headers['ZYL-BIZ-TYPE'] = appCode
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.ok) {
      return response
    }
    if (res.code === '401') {
      MessageBox.alert(
        res.message || '系统内部错误，请联系管理员维护',
        '错误',
        {
          confirmButtonText: '确定',
          type: 'error'
        }
      )
      return Promise.reject('error')
    } else if (res.code === '501') {
      MessageBox.alert('登录超时，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('actionFedLogout').then(() => {
          location.reload()
        })
      })
      return Promise.reject('error')
    } else if (res.code === '502') {
      MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === '503') {
      MessageBox.alert('请求业务目前未支持', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === '504') {
      MessageBox.alert('更新数据已经失效，请刷新页面重新操作', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === '505') {
      MessageBox.alert('更新失败，请再尝试一次', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === '506') {
      MessageBox.alert('没有操作权限，请联系管理员授权', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '登录连接超时（后台不能连接，请联系系统管理员）',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
