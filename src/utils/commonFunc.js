import { Message } from 'element-ui'

export const getTimeStr = (date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const spanOverOneYear = (startTime, endTime) => {
  const minSecDiff = new Date(endTime).getTime() - new Date(startTime).getTime()
  const dayDiff = minSecDiff / (24 * 60 * 60 * 1000)
  if (dayDiff > 365) {
    Message.error('订单时间跨度不能超过一年！')
    return true
  } else {
    return false
  }
}

export const alertError = error => {
  if (error === 'error') {
    // 这种情况是request那边传递过来的  已经被捕获错误了
    return
  }
  let msgReturn
  if (error.data && error.data.message) {
    msgReturn = error.data.message
  } else if (error.message) {
    msgReturn = error.message
  } else {
    msgReturn = '访问出错，请联系系统管理员或稍后重试'
  }
  let myErrMsg = msgReturn
    ? msgReturn.substr(0, 100)
    : '访问出错，请联系系统管理员或稍后重试'
  if (msgReturn.length > 100) {
    myErrMsg += '...'
  }
  Message.error(myErrMsg)
}

export const notifySuccess = (response, successMsg) => {
  let msgText = '操作成功'
  if (successMsg) {
    msgText = successMsg
  } else if (response && response.data && response.data.message) {
    msgText = response.data.message
  } else if (response && response.message) {
    msgText = response.message
  }
  Notification.success({
    title: '成功',
    message: msgText
  })
}

export const convertStrToArr = str => {
  if (!str) {
    return []
  }
  const from = str.indexOf('[')
  const to = str.indexOf(']')
  const newStr = str.substring(from + 1, to)
  if (newStr.startsWith("'")) {
    return str.split("'").slice(1, -1)
  } else {
    return JSON.parse(str)
  }
}

export const formValidate = async formRef => {
  return new Promise((resolve, reject) => {
    formRef.validate((valid, fails) => {
      if (!valid) {
        const message = Object.keys(fails).map(key => {
          return fails[key][0].message
        })
        Message({
          message: message[0],
          type: 'error',
          duration: 2000
        })
        resolve(false)
      }
      resolve(true)
    })
  })
}

// 垂直方向1080p
export const isY1080p = file => {
  return new Promise((resolve, reject) => {
    const url = window.URL || window.webkitURL
    const img = new Image()
    img.onload = function() {
      const perfect = 1920 / 1080
      const reality = img.height / img.width
      const offset = 0.5
      const allowRange = [perfect - offset, perfect + offset]
      const isSizeValid = reality <= allowRange[1] && reality >= allowRange[0]
      isSizeValid ? resolve(reality) : reject(reality)
    }
    img.src = url.createObjectURL(file)
  }).then(
    sizeValue => {
      return { isSizeValid: true, sizeValue }
    },
    sizeValue => {
      return { isSizeValid: false, sizeValue }
    }
  )
}

// 水平方向1080p
export const isX1080p = file => {
  return new Promise((resolve, reject) => {
    const url = window.URL || window.webkitURL
    const img = new Image()
    img.onload = function() {
      const perfect = 1920 / 1080
      const reality = img.width / img.height
      const offset = 0.5
      const allowRange = [perfect - offset, perfect + offset]
      const isSizeValid = reality <= allowRange[1] && reality >= allowRange[0]
      isSizeValid ? resolve(reality) : reject(reality)
    }
    img.src = url.createObjectURL(file)
  }).then(
    sizeValue => {
      return { isSizeValid: true, sizeValue }
    },
    sizeValue => {
      return { isSizeValid: false, sizeValue }
    }
  )
}
