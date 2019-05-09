
Page({

  data: {
    _id:"",
    label:"",
    type:"",
    inputextra:"",
    add_status:false,
    stock_status:false,
    deadline_status:false,
    stock_value:0,
    deadline_value:0,
    actionRotate:true,
    actions: [
      {
        name: '返回',
        width: 100,
        color: '#80848f',
        width: 50,
        fontsize: '15'
      },
      {
        name: '删除',
        color: '#fff',
        fontsize: '15',
        width: 50,
        background: '#ed3f14'
      }
    ],
    detail:"",
    unit:[],
    discountoptions:[],
    newdiscountoptions:[],
    newunit:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    const detail = options.detail;
    if(detail=="unit")
      this.queryunit();
    if(detail == "discount")
      this.querydiscount();
    if (detail == "stock")
      this.querystock();
    if (detail =="deadline")
      this.querydeadline();
    this.setData({
      detail:options.detail
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.detail)

  },
  tipsmessage: function (text) {
    $wuxToptips().success({
      icon: 'cancel',
      hidden: false,
      text: text,
      duration: 2000,
      success() { },
    })
  },
  queryunit:function(e){
    const that = this;
    const db =wx.cloud.database();
    db.collection("data_status").field({
      goodUnit:true
    }).get().then(res=>{
      console.log(res)
      that.setData({
        unit:res.data[0].goodUnit,
        _id: res.data[0]._id
      }, res =>wx.hideLoading())
    })
  },
  querydiscount: function (e) {
    const that = this;
    const db = wx.cloud.database();
    db.collection("data_status").field({
      discountoptions: true
    }).get().then(res => {
      that.setData({
        discountoptions: res.data[0].discountoptions,
        _id: res.data[0]._id
      }, res => wx.hideLoading())
    })
  },
  querystock:function(e){
    const that = this;
    const db = wx.cloud.database();
    db.collection("data_status").field({
      stock: true
    }).get().then(res => {
      if (res.data[0].stock==0)
        this.setData({
          _id: res.data[0]._id,
        }, res => wx.hideLoading())
      else
        this.setData({
          stock_value: res.data[0].stock,
          _id: res.data[0]._id,
          stock_status:true
        }, res => wx.hideLoading())
    })
  },
  querydeadline:function(){
    const that = this;
    const db = wx.cloud.database();
    db.collection("data_status").field({
      deadline_time: true
    }).get().then(res => {
      if (res.data[0].deadline_time == 0)
        this.setData({
          _id: res.data[0]._id,
        }, res => wx.hideLoading())
      else
        this.setData({
          deadline_value: res.data[0].deadline_time,
          _id: res.data[0]._id,
          deadline_status: true
        }, res => wx.hideLoading())
    })
  },
  getstocknum:function(e){
    const value = e.detail.value;
    const db = wx.cloud.database();
    if(this.data.detail=="stock")
      db.collection("data_status").doc(this.data._id).update({
        data:{
          stock: parseInt(value)
        }
      })
    if (this.data.detail =="deadline")
      db.collection("data_status").doc(this.data._id).update({
        data: {
          deadline_time: parseInt(value)
        }
      })
  },
  onChangestock_status:function(e){
    console.log(e)
    const db =wx.cloud.database();
    if(this.data.detail=="stock")
    {
      this.setData({
        stock_status: e.detail.value
      })
      if(!e.detail.value)
        db.collection("data_status").doc(this.data._id).update({
          data: {
            stock: 0
          }
        })
    }
    if(this.data.detail=="deadline")
    {
      this.setData({
        deadline_status: e.detail.value
      })
      if (!e.detail.value)
      {
        db.collection("data_status").doc(this.data._id).update({
          data: {
            deadline_time: 0
          }
        })
      }
        
    }
  },
  onclick:function(e){
    console.log(e)
    const id = e.currentTarget.id
    if (this.data.detail == 'unit')
    {
      let arr = this.data.unit;
      if (e.detail.index) {
        arr.splice(id, 1)
        this.setData({
          unit: arr
        })
      }
    }
    else if (this.data.detail == 'discount')
    {
      let arr = this.data.discountoptions;
      if (e.detail.index) {
        arr.splice(id, 1)
        this.setData({
          discountoptions: arr
        })
      }
    }
  },
  onBlur:function(e){
    console.log(e)
    let str = e.currentTarget.id
    if(e.detail.value!="")
    {
      let newunit = e.detail.value;
      let arr = newunit.split(/;|；/g)
      if (this.data.detail =="unit")
      {
        let unit = this.data.unit;
        for (let a = 0; a < arr.length; a++)
          if (arr[a] != ""&&unit.indexOf(arr[a])==-1)
            unit.push(arr[a])
        this.setData({
          unit,
          add_status: false,
          actionRotate:false
        })
      }
      if (this.data.detail == "discount")
      {
        let discount = this.data.discountoptions;
        for (let a = 0; a < arr.length; a++)
          if (arr[a] != ""&& !isNaN(arr[a])&& discount.indexOf(arr[a]+"折")==-1&&arr[a]>0)
            discount.push(arr[a]+"折")
        this.setData({
          discountoptions:discount,
          add_status: false,
          actionRotate: false
        })
      }
    }
  },
  onclickfab:function(e){
    console.log(e)
    const that = this;
    if(this.data.detail=='unit')
    {
      that.setData({
        add_status:e.detail.value,
        label:"新单位",
        type:"单位",
        actionRotate: true
      })
    }
    if (this.data.detail == 'discount') {
      that.setData({
        add_status: e.detail.value,
        label: "新折扣",
        type:"折扣",
        actionRotate: true,
        inputextra:"折"
      })
    }
  },
  onAdd:function(e){
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    const db = wx.cloud.database();
    const detail = this.data.detail;
    const that = this ;
    const id = this.data._id
    if(detail == "unit")
    { db.collection("data_status").doc(id).update({
      data: {
        goodUnit:that.data.unit
      }
      }).then(res=>{
        that.backorderlist();
      })
    }
    if(detail == "discount"){
      db.collection("data_status").doc(id).update({
        data: {
        discountoptions: that.data.discountoptions
        }
      }).then(res => {
        that.backorderlist();
      })
    }
  },
  backorderlist: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
})