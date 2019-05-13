//引入全局对象
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    stock_text:"暂无",
    deadline_text:"暂无",
    stock_status:false,
    deadline_status:false,
    stock:0,
    deadline_time:0,
    _id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now = new Date();
    let year = [];
    year.push(now.getFullYear());
    const that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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
    const db =wx.cloud.database();
    db.collection("data_status").get().then(res=>{
      if(res.data=="")
      {
        let year = now.getFullYear();
        console.log(year)
        let client = [];
        db.collection("data_status").add({
          data:{
            goodUnit: ['个','斤','100个','千克','吨',"打","平方米","米"],
            orderID:0,
            discountoptions: ["无折扣", "9折", "8折"],
            client:client,
            stock:0,
            deadline_time:0,
            use_year:year
          },
          success:res=>{
            console.log(res)
          }
        })
      }else
      {
        db.collection('data_status').where({
          use_year:db.command.in([2019])
        }).field({
          use_year:true
        }).get({
          success:res=>{
            if(res.data==[])
            {
              db.collection("data_status").field({
                _id:true
              }).get().then(res => {
                db.collection("data_status").doc(res.data[0]._id).update({
                  data:{
                    use_year:db.command.unshift(year)
                  }
                })
              })
            }
          }
        })
      }
        
    })
    
  },
  onPullDownRefresh: function () {

  },
  onShow(){
    const that = this
    const db = wx.cloud.database();
    db.collection('data_status').field({
      stock:true,
      deadline_time:true
    }).get().then(res=>{
      if(res.data=="")
        return;
      if(res.data[0].stock!=0)
      {
        const stock = res.data[0].stock;
        db.collection("Goods").where({
          GoodReserve: db.command.lte(stock)
        }).get().then(res => {
          if (res.data != "")
            this.setData({
              stock_status:true,
              stock_text:"新警示"
            })
        })
      }else{
        this.setData({
          stock_status: false,
          stock_text: "暂无"
        })
      }
      if(res.data[0].deadline_time!=0)
      {
        const deadline_time = res.data[0].deadline_time;
        const date = that.deadlin_date(that.curentTime(""),deadline_time)
        db.collection("Order").where({
          paymentType:"赊账",
          repaymentdate: db.command.lte(date)
        }).get().then(res => {
          if (res.data != "")
            this.setData({
              deadline_status:true,
              deadline_text:"近期有账单哦"
            })
        })
      } else {
        this.setData({
          deadline_status: false,
          deadline_text: "暂无"
        })
      }
    })
  },
  deadlin_date:function(today,deadline_time){
    var deadlin_date;
    let sDate1 = Date.parse(today);
    deadlin_date = sDate1 + deadline_time * (24 * 3600 * 1000)
    return this.curentTime(deadlin_date)
  },
  curentTime: function (e) {
    if(e=="")
      var now = new Date();
    else
      var now = new Date(e);
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var clock = year + "-";
    if (month < 10)
      clock += "0";
    clock += month + "-";
    if (day < 10)
      clock += "0";
    clock += day;
    return (clock);
  }
})
