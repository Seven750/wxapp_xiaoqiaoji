const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {avatarUrl:"https://thumbnail0.baidupcs.com/thumbnail/2e376c0508638c7fa8a5daaba768fefb?fid=8299455-250528-882646043003665&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-pFenDS%2fQOtTtl4GgwSER5ne2234%3d&expires=8h&chkbd=0&chkv=0&dp-logid=2661807499546171009&dp-callid=0&time=1556186400&size=c1280_u720&quality=90&vuk=8299455&ft=image&autopolicy=1"
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
              // app.globalData.username = res.userInfo.nickName;
              app.globalData.userInfo = res.userInfo
              wx.switchTab({
                url: '../Person/index'
              })
              // this.setData({
              //   username: res.userInfo.nickName,
              //   userInfo: res.userInfo
              // })
            }
          })
        }
      }
    })
  },


  onGetUserInfo: function (e) {
    this.onGetOpenid();
    if (!this.data.logged && e.detail.userInfo) {
      wx.setStorage({
        key: "logged",
        data:true
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid);
        app.globalData.openid = res.result.openid;
        wx.switchTab({
          url: '../Person/index'
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.reLaunch({
          url: '../Login/index',
        })
      }
    })
  },
})