
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:true,
    good:[],
    msg: {
      title: '您还没有低于临界值库存的货物'
    },
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
      console.log(res.data[0])
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

})