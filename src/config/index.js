export const cropOption = {
  img: '', // 图片url地址
  info: true, // 是否显示剪裁框的大小信息
  infoTrue: true, // 截图信息展示是否是真实的输出宽高（false:数值表示 截图框的宽高    true:数值表示 截图框中图片的真实大小）
  outputSize: '1', // 裁剪生成的图片的质量
  outputType: 'jpg', // 裁剪生成的图片的格式
  canScale: true, // 能否通过滚轮缩放图片
  canMove: true, // 能否拖动图片
  canMoveBox: true, // 能否拖动截图框
  fixedBox: false, // 截图框固定大小
  fixed: true, // 截图框固定比例
  fixedNumber: [1080, 1920], // 截图框的宽高比例
  autoCrop: true, // 是否自动生成截图框
  autoCropWidth: '300px', // 截图框宽度
  autoCropHeight: '534px', // 截图框高度
  centerBox: true, // 截图框固定大小
  enlarge: 1, // 是否按照截图框比例输出 默认为1
  original: false, // 上传图片一开始显示是否按原始比例渲染
  full: true, // 是否输出原图分辨率的截图（长宽比还是截图框的，但分辨率是原图的，而不是截图框的宽高）
  high: true // 是否根据dpr生成适合屏幕的高清图片
}

export const appCode = 'ADMIN-UPAS'
