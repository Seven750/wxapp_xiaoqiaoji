
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/21f0a14536e86c99dfa384ca549e25993a89dae58bfe9f16ababaed1057be527c7fd6f200634cf4c744e27b9302c9bad?pictype=scale&from=30013&version=3.3.3.3&uin=2474539280&fname=Cover.jpg&size=750"
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.switchTab({
                url: '../Person/index'
              })
            }
          })
        }
      }
    })
  },


  onGetUserInfo: function (e) {
    const that =this;
    if (e.detail.errMsg =="getUserInfo:fail auth deny")
    {
      that.openConfirm();
    } else if (e.detail.errMsg == "getUserInfo:ok")
        that.onGetOpenid();
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        wx.switchTab({
          url: '../Person/index'
        })
      },
      fail: err => {
        wx.showModal({
          title: '登陆失败',
          content: '请检查您的网络',
          showCancel: false,
          confirmText: "确定",
        })
        wx.reLaunch({
          url: '../Login/index',
        })
      }
    })
  },
  openConfirm:function(){
    wx.showModal({
      title: '重新授权',
      content: '需要您的基本账号信息来使用主要功能，否则会导致程序无法使用',
      showCancel: false,
      confirmText: "授权",
      success: res => {
        if (res.confirm) {
          console.log("用户点击了确定")
          wx.openSetting({
            success:(res)=>{
              wx.switchTab({
                url: '../Person/index'
              })
            }
          })
        }
      }
    })
  }
})