import pinyin from "../../../miniprogram_npm/tiny-pinyin/index"
Page({
  data: {
    names: [],
    alphabet: [],
    status: true,
    activeIndex: 0,
    current: 1,
    msg1: {
      title: '空空如也',
      text: '暂时无数据',
    },
  },
  onLoad() {
    
    if (this.data.alphabet == "") {
      this.getClientname();
    }
  },
  getClientname: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    const alphabet = [];
    const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
    //从云函数中拿到属于用户自己的数据
    const db = wx.cloud.database();
    db.collection('data_status').field({
      client: true
    }).get().then((res)=>{
      console.log(res)
      if (res.data[0].client == "") {
        that.setData({
          status: false
        }, () => wx.hideLoading())
      }else{
        const client = res.data[0].client;
        that.setData({
          names: client,
        }, function () {
          //每个字母都循环的比较goodsname里面是否有符合的
          list.split('').forEach((initial) => {
            //如果是#字符的话，将符号开头的都放在#类里面
            if (initial == "#") {
              const cells = client.filter(function (name) {
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
              const cells = client.filter(function (name) {
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
    }).catch(console.error)
  },
  onChange: function (e) {
    console.log('onChange', e.detail)
  },
  onselect: function (e) {
    console.log(e)
    const client = e.currentTarget.id
    wx.navigateTo({
      url: "../client_order/index?client="+client,
    })
  },
})
