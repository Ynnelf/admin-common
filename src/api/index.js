import request from '@/utils/request'
import AxiosClass from '@/utils/AxiosClass'
const PREFIX_AUTH = '/upas'
const PREFIX_CUSTOMER = '/customer'

/** ***********  登录与授权 start   *************/

export const apiLogin = async (account, password) => {
  const data = {
    account,
    password
  }
  return request({
    url: PREFIX_AUTH + '/auth/login',
    method: 'post',
    data
  })
}

export const apiLogout = () => {
  return request({
    url: PREFIX_AUTH + '/auth/logout',
    method: 'post'
  })
}

export const apiGetUserInfo = () => {
  return request({
    url: PREFIX_AUTH + '/user/info',
    method: 'get'
  })
}

/** ***********  登录与授权 end    *************/

/** ***********  系统管理相关 start  *************/

export const apiUpdatePassword = params => {
  return request({
    url: PREFIX_AUTH + '/user/password',
    method: 'post',
    params
  })
}

export const apiListAdmin = params => {
  return request({
    url: PREFIX_AUTH + '/user/list',
    method: 'get',
    params
  })
}

export const apiCreateAdmin = params => {
  return request({
    url: PREFIX_AUTH + '/user/add',
    method: 'put',
    params
  })
}

export const apiUpdateAdmin = data => {
  return request({
    url: PREFIX_AUTH + '/user/roles/update',
    method: 'post',
    data
  })
}

export const apiDeleteAdmin = ({ id }) => {
  return request({
    url: PREFIX_AUTH + `/user/${id}`,
    method: 'delete'
  })
}

export const apiAllRoles = params => {
  return request({
    url: PREFIX_AUTH + '/role/all',
    method: 'get',
    params
  })
}

export const apiRoleList = data => {
  return request({
    url: PREFIX_AUTH + '/role/list',
    method: 'post',
    data
  })
}

export const apiGetRole = ({ id }) => {
  return request({
    url: PREFIX_AUTH + `/role/${id}`,
    method: 'get'
  })
}

export const apiCreateRole = params => {
  return request({
    url: PREFIX_AUTH + '/role/add',
    method: 'put',
    params
  })
}

export const apiUpdateRole = data => {
  return request({
    url: PREFIX_AUTH + '/role/update',
    method: 'post',
    data
  })
}

export const apiDeleteRole = ({ id }) => {
  return request({
    url: PREFIX_AUTH + `/role/${id}`,
    method: 'Delete'
  })
}

export const apiAllPermissions = params => {
  return request({
    url: PREFIX_AUTH + '/permission/all',
    method: 'get',
    params
  })
}

export const apiRolePermission = ({ id }) => {
  return request({
    url: PREFIX_AUTH + `/permission/role/${id}`,
    method: 'get'
  })
}

export const apiUpdatePermission = data => {
  return request({
    url: PREFIX_AUTH + '/role/permission/update',
    method: 'post',
    data
  })
}

export const apiRoleOptions = params => {
  return request({
    url: PREFIX_AUTH + '/role/list',
    method: 'get',
    params
  })
}

export const apiDeviceIdList = data => {
  return request({
    url: PREFIX_CUSTOMER + '/device/list',
    method: 'post',
    data
  })
}

/** *********** 系统管理相关 end   *************/

/** ***********  文件上传 操作 start  *************/

export const apiUploadImage = data => {
  return new AxiosClass({ contentType: 'multipart/form-data' }).request({
    url: PREFIX_AUTH + '/common/upload',
    method: 'post',
    data
  })
}

export const apiUploadVideo = data => {
  return new AxiosClass({ contentType: 'multipart/form-data' }).request({
    url: PREFIX_AUTH + '/video/upload',
    method: 'post',
    data
  })
}

/** ***********  文件上传 操作 end  *************/

/** *********** 版本管理 start   ***************/

// 应用列表
export const apiAppList = params => {
  return request({
    url: PREFIX_AUTH + '/menu/getMenus',
    method: 'get',
    params
  })
}

// 版本列表
export const apiVersionList = data => {
  return request({
    url: PREFIX_AUTH + '/app_version/list',
    method: 'post',
    data
  })
}

// 添加或更新版本
export const apiSaveVersion = data => {
  return request({
    url: PREFIX_AUTH + '/app_version/save',
    method: 'post',
    data
  })
}

// 上传新版本
export const apiUploadVersion = (data, params) => {
  return request({
    url: PREFIX_AUTH + '/app_version/upload',
    method: 'post',
    data,
    params
  })
}

// 根据 id 获取版本信息
export const apiVersionInfo = params => {
  return request({
    url: PREFIX_AUTH + '/app_version/get',
    method: 'post',
    params
  })
}
/** *********** 版本管理 end   ***************/

/** *********** 协议管理 end   ***************/
// 查询协议
export const apiProtocolInfo = params => {
  return request({
    url: PREFIX_AUTH + '/protocol/admin/info',
    method: 'get',
    params
  })
}

// 保存协议
export const apiSaveProtocol = data => {
  return request({
    url: PREFIX_AUTH + '/protocol/admin/save',
    method: 'post',
    data
  })
}
/** *********** 协议管理 end   ***************/
