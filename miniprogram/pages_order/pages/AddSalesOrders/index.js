import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index'

var today = "";
var order_good = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodvalue:"",
    title:"选择",
    payvalue:"",
    paymentType: "选择",
    GoodName:"",
    options:"",
    date:"选择日期",
    clientname:"",
    orderID:"",
    payamount:"",
    total_amount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    const db = wx.cloud.database()
    db.collection('Goods').field({
      GoodName: true,
      GoodUnit: true,
      GoodReserve: true,
      GoodPrice:true
    })
      .get()
      .then((res)=>{
        console.log(res)
        //新建一个数组来将构建列表
        const options=[];
        const length_goods = res.data.length;
        for(let i =0;i<length_goods;i++)
        {
          const newob = res.data[i]
          newob.value = ''+i+'';
          newob.title = res.data[i].GoodName
          options.push(newob)
        }
        that.setData({
          options:options
        })
      })
      .catch(console.error)
      db.collection('data_status').field({
        pur_ord_num:true
      }).get().then((res)=>{
        console.log(res)
        if(res.data=="")
          that.setData({
            orderID:"00000001"
          })
        else
        {
          const idstring =res.data[0].pur_ord_num;
          const id =parseInt(idstring) +1 ;
          that.setData({
            orderID :id+""
          })
        }
      })
     today = this.curentTime("date")
  },
  onchangegood() {
    const that = this;
    $wuxSelect('#selectgood').open({
      value: this.data.goodvalue,
      multiple: true,
      toolbar: {
        title: '选择货物',
        confirmText: '确定',
      },
      options: this.data.options,
      // //选项中显示
      onChange: (value,index, options) => {
        console.log('onptions',value,index,options)
        this.setData({
          goodvalue: value,
          title: "已选"+value.length+"个货物",
        })
      },
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        const obj = [];
        for (let i = 0; i < value.length; i++) {
          const json = options[parseInt(value[i])];
          json.amount = 0;
          obj.push(json)
        }
        this.setData({
          goodvalue: value,
          GoodName: index.map((n) => options[n].GoodName),
        })
        order_good=obj;
      },
    })
  },
  onpaymentType() {
    $wuxSelect('#selectpaymentType').open({
      value: this.data.payvalue,
      options: [
        '现结',
        '赊账',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            payvalue:value,
            paymentType: options[index]
          })
        }
      },
    })
    
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  getpayAmount:function(e){
    this.setData({
      payamount: e.detail.value
    })
  },
   curentTime:function(e)
    {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = year + "-";
    if(month < 10)
            clock += "0";
    clock += month + "-";
    if(day < 10)
            clock += "0";
    clock += day ;
    if(e=="date")
      return (clock);
    else{
      if (hh < 10)
        clock += "0";
      clock += " " + hh + ":";
      if (mm < 10) clock += '0';
      clock += mm;
      return (clock);
    }
    
  },
  GetorderID: function (e) {
    $wuxToptips().show({
      icon: 'cancel',
      hidden: false,
      text: '不建议修改，否则下次订单号将从此重新计算',
      duration: 2000,
      success() { },
    })
    if (/^\d+$/.test(e.detail.value))
      this.setData({
        orderID: e.detail.value
      })
    else{
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '订单号需为纯数字',
        duration: 1000,
        success() { },
      })
    }
  },
  Getclientname: function (e) {
    this.setData({
      clientname: e.detail.value
    })
  },
  backorderlist: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  getPrice:function(e){
    console.log(e)
    const index = e.currentTarget.id;
    const num = e.detail.value;
    var total_amount= 0
    order_good[index].value = num;
    order_good[index].amount = num*order_good[index].GoodPrice
    for(let i= 0;i<order_good.length;i++)
      total_amount +=order_good[i].amount
    this.setData({
      total_amount
    })
  },
  onAdd:function(e){
    //保存订单的时候要注意库存
    console.log(order_good)
  }
})