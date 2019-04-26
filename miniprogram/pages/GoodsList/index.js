import pinyin from "../../miniprogram_npm/tiny-pinyin/index"

const app = getApp()

Page({
  data: {
    actionRotate:false,
    names:[],
    alphabet: [],
    status:true,
    activeIndex:0,
    current: 1,
    msg1: {
      title: '空空如也',
      text: '暂时无数据,请先添加货物信息',
    },
  },
  onLoad() {
    if(this.data.alphabet=="")
    {
      this.getGoodsList();
    }
  },
  onShow(){

  },
  getGoodsList:function(){

    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    const alphabet = [];
    const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
    //从云函数中拿到属于用户自己的数据
    wx.cloud.callFunction({
      name: "GetGoodsList",
      data: {
        userid: app.globalData.openid,
      },
      success: res => {
        console.log(res);
        if(res.result=="无记录"){
          that.setData({
            status:false
          }, () => wx.hideLoading())

        }
        else{
          const goodsname = res.result;
          that.setData({
            names: goodsname,
          }, function () {
            //每个字母都循环的比较goodsname里面是否有符合的
            list.split('').forEach((initial) => {
              //如果是#字符的话，将符号开头的都放在#类里面
              if (initial == "#") {
                const cells = goodsname.filter(function (name) {
                  const P = pinyin.convertToPinyin(name).toUpperCase().charAt(0)
                  return !(/[a-zA-z]/.test(P))
                })
                if (cells != "")
                  alphabet.push({
                    initial,
                    cells
                  })
                else {
                  return;
                }
              } else {
                const cells = goodsname.filter(function (name) {
                  return pinyin.convertToPinyin(name).toUpperCase().charAt(0) == initial
                })
                if (cells != "")
                  alphabet.push({
                    initial,
                    cells
                  })
                else {
                  //如果某个字母开头的没有，则隐藏该首字母
                  return;
                }
              }
            })

            this.setData({
              alphabet,
            }, () => wx.hideLoading())
          })
        }
      },
      fail: err => console.log(err),
      conplete: () => console.log(1)
    })
  },
  onChange:function(e) {
    console.log('onChange', e.detail)
  },
  onselect:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../../pages_good/pages/ModifyGoods/index?GoodName='+e.currentTarget.id,
    })
  },
  onClick(e) {
    wx.navigateTo({
      url: '../../pages_good/pages/AddGoods/index',
    })
  },
 
})
