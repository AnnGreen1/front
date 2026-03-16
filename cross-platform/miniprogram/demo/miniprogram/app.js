import env from './env'
// app.js
App({
  // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch() {
    console.log("小程序启动后触发...")

    console.log(wx.env)

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  // 当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow() {

  },
  // 当小程序从前台进入后台，会触发 onHide
  onHide() {

  },
  // 当小程序发生脚本错误，或者 API 调用失败时，会触发 onError 并带上错误信息
  onError() {

  },
  globalData: {
    userInfo: null,
    env: env
  }
})