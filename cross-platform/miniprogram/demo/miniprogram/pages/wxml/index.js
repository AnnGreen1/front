// pages/wxml/index.js
Component({

  /**
   * 页面的初始数据
   */
  data: {
    time: (new Date()).toString(),
    name: 'world',
    ok: true,
    todo: [{
        label: '吃饭',
        status: true
      },
      {
        label: '睡觉',
        status: false
      },
      {
        label: '打豆豆',
        status: true
      }
    ],
    item: {
      index: 0,
      msg: 'this is a template',
      time: '2025-07-03'
    },
    value: '默认值'
  },
  methods: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    const appInstance = getApp()
    console.log(appInstance.globaData)
    console.log('onload')

    
    const query = this.createSelectorQuery()

    console.log(query)

    query.select('#tapTest').boundingClientRect(function (res) {
      console.log(res)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const query = this.createSelectorQuery()

    console.log(query)
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
    console.log('onShareAppMessage')
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
})