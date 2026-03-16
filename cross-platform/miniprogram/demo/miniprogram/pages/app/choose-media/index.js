// pages/app/choose-media/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    videoSrc:''
  },
  chooseMedia() {
    wx.chooseMedia({
      count: 1,
      media: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log("success", res)
        if (res.type === 'video') {
          this.setData({
            videoSrc: res.tempFiles[0].tempFilePath
          })
        }
        if (res.type === 'image') {
          this.setData({
            imgSrc: res.tempFiles[0].tempFilePath
          })
        }
      },
      fail: (res) => {
        console.log("fail", res)
      },
      complete: (res) => {
        console.log("complete", res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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