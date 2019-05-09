// miniprogram/pages_person/pages/warn_stock/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:true,
    good:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask: true

    })
    const that = this
    const db = wx.cloud.database();
    db.collection('data_status').field({
      stock: true,
    }).get().then(res=>{
      if (res.data[0].stock == 0) 
        that.setData({
          status: false
        }, res => wx.hideLoading())
      else{
        const stock = res.data[0].stock;
        db.collection("Goods").where({
          GoodReserve: db.command.lte(stock)
        }).field({
          GoodName:true,
          GoodReserve:true,
          GoodUnit:true
        }).get().then(res => {
          if(res.data=="")
            that.setData({
              status: false,
              good:res.data
            }, res => wx.hideLoading())
          else{
            that.setData({
              status: true,
              good: res.data
            }, res => wx.hideLoading())
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})