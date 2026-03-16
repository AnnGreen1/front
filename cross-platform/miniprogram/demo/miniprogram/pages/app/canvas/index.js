// pages/app/canvas/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initCanvas()
  },
  // 初始化 Canvas
  async initCanvas() {
    const query = wx.createSelectorQuery()
    query
      .select('#progressCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec(async (res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 适配高清屏
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        this.ctx = ctx
        this.canvas = canvas

        this.drawProgress(80)
      })
  },
  // 绘制半圆环
  drawProgress(percent) {
    const {
      ctx,
      canvas
    } = this
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height) // 清空画布

    const centerX = 150 // 圆心X坐标
    const centerY = 150 // 圆心Y坐标
    const radius = 100 // 圆环半径
    const lineWidth = 20 // 圆环宽度

    // 1. 绘制灰色背景圆环
    ctx.beginPath()
    ctx.strokeStyle = '#d6e1ff'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.stroke()

    // 2. 绘制彩色进度圆环（渐变）
    // const gradient = ctx.createLinearGradient(0, 0, 300, 0);
    // gradient.addColorStop(0, '#36D1DC');
    // gradient.addColorStop(1, '#5B86E5');

    ctx.beginPath()
    ctx.strokeStyle = '#3264ed'
    ctx.lineWidth = lineWidth
    const endAngle = Math.PI + (Math.PI * percent) / 100
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle, false)
    ctx.stroke()

    // 3. 绘制中心文字
    ctx.fillStyle = '#3264ed'
    ctx.font = 'bolder 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`80分`, centerX, centerY)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})