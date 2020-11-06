import request from '@/utils/request'
const PREFIX_AUTH = '/upas'

export const apiGetUserInfo = () => {
  return request({
    url: PREFIX_AUTH + '/user/info',
    method: 'get'
  })
}

// 应用列表
export const apiProjectList = () => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/project/list',
    method: 'get'
  })
}

// 添加应用
export const apiCreateProject = params => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/project/add',
    method: 'put',
    params
  })
}

// 更新应用
export const apiUpdateProject = data => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/project/update',
    method: 'post',
    data
  })
}

// 删除应用
export const apiDeleteProject = id => {
  return request({
    url: PREFIX_AUTH + `/auth-tree/project/${id}`,
    method: 'delete'
  })
}

// 获取应用权限树
export const apiProjectTree = params => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/project/getTreeByAppCode',
    method: 'get',
    params
  })
}

// 添加模块
export const apiCreateApiGroup = params => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/api-group/add',
    method: 'post',
    params
  })
}

// 修改模块
export const apiUpdateApiGroup = data => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/api-group/update',
    method: 'post',
    data
  })
}

// 删除模块
export const apiDeleteApiGroup = id => {
  return request({
    url: PREFIX_AUTH + `/auth-tree/api-group/${id}`,
    method: 'delete'
  })
}

// 模块排序
export const apiSortApiGroup = data => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/api-group/updateSequence',
    method: 'post',
    data
  })
}

// 添加接口
export const apiCreateAuthApi = params => {
  return request({
    url: PREFIX_AUTH + '/permission/add',
    method: 'put',
    params
  })
}

// 修改接口
export const apiUpdateAuthApi = data => {
  return request({
    url: PREFIX_AUTH + '/permission/update',
    method: 'post',
    data
  })
}

// 删除接口
export const apiDeleteAuthApi = id => {
  return request({
    url: PREFIX_AUTH + `/permission/${id}`,
    method: 'delete'
  })
}

// 删除接口
export const apiMultiDelAuthApi = params => {
  return request({
    url: PREFIX_AUTH + '/permission/deletePermissionIdes',
    method: 'delete',
    params
  })
}

// 获取所有应用的角色
export const apiAllProjectRoles = params => {
  return request({
    url: PREFIX_AUTH + '/auth-tree/project/appRoleTree',
    method: 'get',
    params
  })
}

// 添加菜单或权限
export const apiCreateMenuOrApi = params => {
  return request({
    url: PREFIX_AUTH + '/menu/add',
    method: 'put',
    params
  })
}

// 权限树列表 或者  单棵权限树
export const apiAppAuthTrees = params => {
  return request({
    url: PREFIX_AUTH + '/menu/getMenus',
    method: 'get',
    params
  })
}

// 添加菜单或接口
export const apiDeleteMenuOrApi = params => {
  return request({
    url: PREFIX_AUTH + '/menu/deleteMenuIdes',
    method: 'delete',
    params
  })
}

// 更新菜单或接口
export const apiUpdateMenuOrApi = data => {
  return request({
    url: PREFIX_AUTH + '/menu/update',
    method: 'post',
    data
  })
}

// 更新角色授权
export const apiUpdateRoleMenu = data => {
  return request({
    url: PREFIX_AUTH + '/role/menu/update',
    method: 'post',
    data
  })
}

// 获取角色授权信息
export const apiRoleMenus = ({ id }) => {
  return request({
    url: PREFIX_AUTH + `/menu/role/${id}`,
    method: 'get'
  })
}

// 给菜单树排序
export const apiSortMenu = data => {
  return request({
    url: PREFIX_AUTH + '/menu/updateSequence',
    method: 'post',
    data
  })
}
