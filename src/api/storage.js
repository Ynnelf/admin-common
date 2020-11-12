const PREFIX_AUTH = '/upas'

export const uploadPathImg =
  process.env.VUE_APP_BASE_API + PREFIX_AUTH + '/common/upload' // 通用图片上传地址

export const uploadPathVideo =
  process.env.VUE_APP_BASE_API + PREFIX_AUTH + '/video/upload' // 通用视频上传地址

export const uploadPathAppFile =
  process.env.VUE_APP_BASE_API + PREFIX_AUTH + '/app_version/upload' // App版本包上传地址
