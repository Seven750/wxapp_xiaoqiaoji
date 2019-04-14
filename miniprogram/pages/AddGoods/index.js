// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    types: ['个', '斤', '100个','千克', '吨',"打","平方米","米"],
    typeIndex: 3,
    files: [],
    localfiles: [],
    GoodName:"",
    GoodPrice:"",
    GoodDescription:"",
    GoodReserve:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
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
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const path = res.tempFilePaths[0];
        const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/)
        var json={imageID:"",src:cloudPath,fileID:""}
        that.setData({
          files:that.data.files.concat(json),
          localfiles:that.data.localfiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  PreviewImage: function (e) {
    console.log(e.currentTarget.id);
    console.log(this.data.localfiles);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.localfiles // 需要预览的图片http链接列表
    })
  },
  Remove(e) {
    var that = this;
    const path = e.currentTarget.id;
    const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/);
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            //类似于java中的lambda表达式
            files: that.data.files.filter((n) =>n.src!==cloudPath),
            localfiles: that.data.localfiles.filter(function (localfiles){
              return localfiles != e.currentTarget.id;
            } )
          })
        }
      },
    })
  },
  GetGoodName:function(e){
    this.setData({
        GoodName:e.detail.value
    })
  },
  GetGoodPrice:function(e){
    this.setData({
      GoodPrice: e.detail.value
    })
  },
  GetGoodsDescription:function(e){
    this.setData({
      GoodDescription:e.detail.value
    })
  },
  GetGoodReserve:function(e){
    this.setData({
      GoodReserve:e.detail.value
    })
  },
  Open: function (e) {
    var that= this;
    wx.showActionSheet({
      itemList: ['预览',"删除"],
      success: function (res) {
        if (!res.cancel) {
          if(res.tapIndex==0){
            //如果点击预览，则执行下列函数
            that.PreviewImage(e);
          }
          else{
            //否则就是删除按钮
            console.log(e);
            that.Remove(e)
          }
        }
      }
    });
  },
  //添加到数据库当中
  onAdd: function () {
    var that=this;
    const db = wx.cloud.database();
    const length=that.data.localfiles.length;
    for(var j=0;j<length;j++)
    {
      var cloudPath=that.data.files[j].src;
      var filePath=that.data.localfiles[j];
      //作为一个变量，需要拼接字符串来完成
      var fileID="files["+j+"].fileID"; 
      var imageID="files["+j+"].imageID";
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('[上传文件] 成功：', res);
          that.setData({
            [fileID] :res.fileID
          })
          // wx.navigateTo({
          //   url: '../storageConsole/storageConsole'
          // })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '图片上传失败',
          })
        },
        complete: () => {
          wx.hideLoading()
          db.collection('Goods').add({
            data: {
              GoodName: that.data.GoodName,
              GoodPrice: that.data.GoodPrice,
              GoodDescription: that.data.GoodPrice,
              GoodReserve: that.data.GoodReserve,
              files: that.data.files
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id 可以当作索引
              this.setData({
                counterId: res._id,
                count: 1
              })
              wx.showToast({
                title: '新增记录成功',
              })
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }
      })
    }
  },
  SaveGood:function(e){
    // console.log(this.data.GoodName);
    // console.log(this.data.GoodPrice);
    // console.log(this.data.GoodDescription);
    // console.log(this.data.GoodReserve);
    console.log(this.data.files);
    console.log(this.data.localfiles)
  }

})