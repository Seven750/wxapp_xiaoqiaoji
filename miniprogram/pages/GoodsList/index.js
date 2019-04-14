import pinyin from "../../miniprogram_npm/pinyin4js/index.js"
const app = getApp()
const goodsname=[]

Page({
  data: {
    goods:[],
    names:[],
    alphabet: [],
  },
  onLoad() {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    const alphabet = [];
    console.log(app.globalData)
    const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    console.log(pinyin.convertToPinyinString('厦门你好大厦厦门', '', pinyin.FIRST_LETTER))
    //从云函数中拿到属于用户自己的数据
    wx.cloud.callFunction({
      name:"GetGoodsList",
      data:{
        userid:app.globalData.openid,
      },
      success:res=>{
        console.log(res.result.data);
        const length_name = res.result.data.length;
        for(let i = 0;i<length_name;i++)
        {
          goodsname.push(res.result.data[i].GoodName);
        }
        that.setData({
          names:goodsname,
          goods:res.result.data
        },function(){
          //每个字母都循环的比较NAMES里面是否有符合的
          list.split('').forEach((initial) => {
            const cells = goodsname.filter(function (name) {
              return name.toUpperCase().charAt(0) == initial
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
          })
          this.setData({
            alphabet,
          }, () => wx.hideLoading())
        })
      },
      fail:err=>console.log(err),
      conplete:()=>console.log(1)
    })
  },
  onChange(e) {
    console.log('onChange', e.detail)
  },
  onselect(e){
    console.log(e)
    wx.navigateTo({
      url: '../AddGoods/index',
    })
  }
})
