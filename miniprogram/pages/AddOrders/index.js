Page({

  /**
   * 页面的初始数据
   */
  data: {
    Order_ID:"S00000001",
    left: [{
      text: '取消',
      style: 'background-color: #ddd; color: white',
    },
    {
      text: '删除',
      style: 'background-color: #F4333C; color: white',
    }],
    types: ['货物1', '货物2', '货物3', '货物4', '货物5'],
    typeIndex: 3,
    Goods:[{
      specification:"个"
    },{
        specification:"吨"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },
  pickerChange(e) {
    const { value } = e.detail
    const { model } = e.currentTarget.dataset

    this.setData({
      [model]: value,
    })
  }
})