//引入全局对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrl: "",
    username: "点击登陆"
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
              console.log(res)
              this.setData({
                username:res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  
  onGetUserInfo: function (e) {
    this.onGetOpenid();
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        username:e.detail.userInfo.nickName,
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
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