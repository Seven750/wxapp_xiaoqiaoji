// miniprogram/pages_person/pages/client_order/index.js
var openid = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    client:[],
    actionRotate:false,
    items: [{
      type: 'radio',
      label: '订单类别',
      value: 'orders',
      children: [{
        label: '进货',
        value: 'purchase',
      }, {
        label: '售出',
        value: 'sales',
      }, {
        label: '现结',
        value: 'paidorder',
      },{
      label: '赊账',
      value: 'unpaidorder',
      },{
      label: '已收账',
      value: 'complete',
      },{
      label: '全部订单',
      value: 'allorder',
      },],
      groups: ['001'],
    }, {
      type: 'sort',
      label: '时间',
      value: 'time',
      groups: ['002'],
    }, {
      type: 'sort',
      label: '金额',
      value: 'money',
      groups: ['003'],
    }],
    orders: "",
    status: true,
    msg: {
      icon: '../../../../images/iconfont-order.png',
      title: '您还没有该客户相关的订单',
      text: '可以点击右方按钮添加新的订单'
    },
    localfiles:[],
    current:["0"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const db = wx.cloud.database();
    db.collection("Order").where({
      clientname:options.client
    }).limit(10).get().then(res => {
      if (res.data == "")
        this.setData({
          orders: res.data,
          client: options.client,
          status: false
        })
      else {
        if (res.data[0].Files == "")
          this.setData({
            orders: res.data,
            client: options.client
          })
        else {
          const picfiles = []
          const files = res.data[0].Files
          for (let i = 0; i < files.length; i++) {
            const pic_src = files[i].fileID
            picfiles.push(pic_src)
          }
          this.setData({
            localfiles: picfiles,
            orders: res.data,
            client: options.client
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChangefilter: function (e) {
    const { checkedItems } = e.detail
    const params = {}
    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'orders') {
          const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
          params.sort = n.value
          params.type = selected
        } else if (n.value === 'time') {
          params.sort = n.value
          params.type = n.sort === 1 ? 'timeasc' : 'timedesc'
        } else if (n.value === 'money') {
          params.sort = n.value
          params.type = n.sort === 1 ? 'moneyasc' : 'moneydesc'
        }
      }
    })
    this.getRepos(params)
  },
  querycate: function (type) {
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid,
      clientname: this.data.client,
      category: type
    }).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  querytype: function (type) {
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid,
      clientname: this.data.client,
      paymentType: type
    }).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  querytimeandmoney: function (fieldName, order) {
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid,
      clientname: this.data.client
    }).orderBy(fieldName, order).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  getRepos: function (params = {}) {
    const that = this;
    if (params.type == "purchase") {
      this.querycate("进货")
    } else if (params.type == "sales") {
      console.log("00000")
      this.querycate("售出")
    } else if (params.type == "paidorder") {
      this.querytype("现结")
    } else if (params.type == "unpaidorder") {
      this.querytype("赊账")
    } else if (params.type == "complete") {
      this.querytype("已收账")
    }else if (params.type == "allorder") {
      const db = wx.cloud.database();
      db.collection("Order").where({
        _openid: openid,
        clientname: that.data.client
      }).limit(10).get().then(res => {
        this.setData({
          orders: res.data
        })
      })
    } else if (params.type == "timeasc") {
      this.querytimeandmoney("createTime", "asc")
    } else if (params.type == "timedesc") {
      this.querytimeandmoney("createTime", "desc")
    } else if (params.type == "moneyasc") {
      this.querytimeandmoney("total_amount", "asc")
    } else if (params.type == "moneydesc") {
      this.querytimeandmoney("total_amount", "desc")
    }
  },
  onChangeaccordion: function (e) {
    var current = [];
    current.push(e.detail.key)
    if (e.detail.key != null && e.detail.key != "") {
      const files = this.data.orders[parseInt(e.detail.key)].Files;
      if (files == "")
      {
        this.setData({
        current: current
        })
        return;
      }
      const picfiles = []
      for (let i = 0; i < files.length; i++) {
        const pic_src = files[i].fileID
        picfiles.push(pic_src)
      }
      this.setData({
        localfiles: picfiles,
        current: current
      })
      return
    } else {
      this.setData({
        current: []
      })
    }
  },
  PreviewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.localfiles // 需要预览的图片http链接列表
    })
  },
  onClick(e) {
    wx.navigateTo({
      url: '../../../pages_order/pages/AddSalesOrders/index?client='+this.data.client,
    })
  },
})