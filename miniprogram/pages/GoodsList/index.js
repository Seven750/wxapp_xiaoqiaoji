import pinyin from "../../miniprogram_npm/tiny-pinyin/index"

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
  onLoad:function() {
    this.getGoodsList();
  },
  onShow(){

  },
  getGoodsList:function(){
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    let name=[]
    const db = wx.cloud.database();
    var alphabet = [];
    const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
    db.collection("Goods").count().then(res=>{
      const times =parseInt(res.total/20)+1;
      db.collection("Goods").field({
        GoodName:true
      }).get().then(res=>{
        console.log(res)
        if(res.data=="")
        {
          that.setData({
            status: false
          }, () => {
            wx.hideLoading()
          })
        }
        else{
          for (let m = 0; m < res.data.length; m++) 
            name.push(res.data[m].GoodName)
          for (let i = 1; i < times; i++) {
            db.collection("Goods").field({
              GoodName: true
            }).get().then(res => {
              let name2 = []
              if (res.data != "")
                 for(let m = 0;m<res.data.length;m++) 
                    name.push(res.data[m].GoodName)
              name = name.concat(name2)
            })
          }
          that.setData({
            names: name,
          }, function () {
            //每个字母都循环的比较goodsname里面是否有符合的
            list.split('').forEach((initial) => {
              //如果是#字符的话，将符号开头的都放在#类里面
              if (initial == "#") {
                const cells = name.filter(function (name) {
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
                const cells = name.filter(function (name) {
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
      })
    })
  },
  onChange:function(e) {
    console.log('onChange', e.detail)
  },
  onselect:function(e){
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
