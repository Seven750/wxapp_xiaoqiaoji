const sicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAKRElEQVR4Xu2df4xUVxXHz7kPt4NMChZa01hkg+sy8+5d1MQgFkIxMYo/qhWBPzRWC5i0qVr/MCKm/iDWlmqMTaz4j2DERlNaxTa1WqWptjY1JjVx5747QDYLpU00QiQYCrPA3GOe2TWb7bz37nsz++btvjPJ/jXnnnvu93zm3HPfm7eDwK9SK4ClXj0vHhiAkkPAADAAJVeg5MvnCsAAlFyBki+/ZxWgXq+v8DxvGxGtQMTriGgpInpp9LXW3m+M+W2aMXPVVin1MAC80SV+Imoj4hkiOo2IJwHgYa31yy5jk2y6BkBKuRMRdwDA2qTJHN7fobU+4GA3502UUqcAYHnWhRDR80S03xjzk6w+wnGZAZBSfhYA7kbEN3cTwPSx1trt3S6oV7HMth8p5Us90u6EtfZbWXXLAsACpdTPAWDrLIi0U2u9fxb8Fs5ltxWgw4IOaK13AgClWWwqAFavXr3IWvsEAGxMM4mrLVcAV6Ui7X6jtf5wGi+pAJBSPoaIH0kzQUpbrgApBZtpTkQ/DYLgM65unAGQUu5BxK+7Os5oxwBkFG5GL/V5Y8yDLq6cAPB9/x1CiL+5OAxtiOgMIh4HgMuuY0I7PgZGqvU6IlqFiEtd9Wy324PNZvOlJHsnAKSUzyHi+iRnAHDv5cuXDx47duyYgy2bpFTA9/1riGiD53l7AWBVwvBHtNbbkqZIBMD3/U1CiNiLM0T0+4mJiR1jY2OvJE3I7/dGASnlfYj4lQRvb9Naj8bZJAKglHoIAD4Z4+RZrfVNvVkWe0mjQFJurLXfNcZ8uSsApJTnEPHqKCetVms5f/LTpK13tsPDw8sGBgbCS8OLIryOa63fkhmAer2+1vO8F6IcENG+IAju7N2S2FNaBXzf3yeEuCNqnLV2hTEmvOzc8RW7BSilPgYAv4oBYFMQBE+lDZrte6eAlPLjiPhoDAAbjDHPZQXgdgD4EZf/3iWs155835dCCB3j91at9c8yASCl3IWI4ZGj46vVai0eGxv7T68Xxf7cFRgZGXkDEf07pkrvCoLgO5kA8H1/txDi3qjBFy5cWDI+Pn7OPdxiWfq+P4CIhxDxh1rrPxQrOrdoBgcHl1Sr1bMxW8BuY0zkhzi2B5jnAHhSyicQcVN4xbLdbn+w2WwecZO9OFYMQLZcCCnl4Rk3tuYkBAxAegBQShmW/S0dhs45CBiAlAAkXT2ba9sBA5ACAKVU+G2j7Q5D5kwlYAAcshmaJF0xm6vbAQPgAICU8vuI+EUH05kmha8EDEBCVpVS3wSAb2RI/tSQQkPAAMRkVil1FwA80EXyp0NwS7PZfLIHvnrqggGIkFMpFXsfI0MWrrTb7Y8WDQIGoEMmfd+/TQgxG08YFQ4CBmAGAL7vfwIRH0LExG87ZagC4ZBCQcAATMtieG8cAMKrfCJjcl2HFQYCBmAyZb7vbxVCHHLIYHjD571RdkT0DCK+x8FPaLJZa33Y0XZWzBgAAJBS3oyI4TeXFiSo/JdWq7WxUqm0YgC4RwhxxFr7FCJeleCv75Wg9ABIKd+PiOHziknJHxVC3Dg6OvqqUiryAUoiuicIgq+NjIzcNBcgKDUAUsqwVP8OEQfiPqlE1BRCrGs0GuEXJ8KnmyOfWLLWftsYc3foby5AUFoApJTrAOAIIlYSyvSJS5curTl+/PiZSTtnAKYgIKLwwZiFDtvB1maz+etZ2ewjnJYSAN/31wghngGA1yd88v8xMTGxZsZzC6kACP3XarV3L1iw4GkHCNrtdntLnhCUDoDwQVVEfBYRqwmftNPW2huNMWMz7FIDUGQISgVAvV5Xnuf9GQAWJyQ/fJppbaPRONrBLhMARYWgVABIKY8j4lsTkn/RWrvRGPPXKLu4U8D0JrDT+Hq9vkEIER4Rk3qP8HH3640x/5zNnqBUANRqtWHP855HxGWdRCWiFhG9L+5JmDSngKjEOfQEufUCpQJgsgxHQXDFWrvJGBM2a3GvzFvAdKcxEOSW/DCe0gHQCQIiskS02RjzmEO57QkAET1BrskvLQDTIQCApUR0qzEm/D8GLq+eATADgoG8j4ClBiBc/MjISM1auz4Igh+7ZH7KppsmsNM8vu+vF0Jcp7WOfJI6TXxpbEu5BaQRqINtTytAl7F0PZwBSC8hAzBNszI+HMoAMABudwPTF5f8R/AWkF5zrgBcAbgCTDHAPcCMCpJ0LyB9wZndEbwFpNeXtwDeAngL4C0gonLwFjBNmHn6T6J4C+AtgLcA3gJ4C/ifAnwM5GNg9DmKe4D0Z8y8R/B1gPSKcxPITSA3gdwEchPITWAnBvhCEF8I+v/Twenbi/xHcBOYXnNuArkJ5CaQm0BuArkJ5CaQLwW/hgE+BfApgE8BUwzwvYD0R4y8R/AxML3ifAzkYyAfA/kYyMdAPgbyMZCPgXwMjOuh+BSQvsPMewSfAvJWvGDzMQAFS0je4TAAeStesPkYgIIlJO9wGIC8FS/YfAxAwRKSdzgMQN6KF2w+BqBgCck7HAYgb8ULNt+8AGBwcLBSrVbXFkzbWQ1Ha/3HXkwwLwCo1+srPM872QtB5ooPa+0KY8ypbuNlALpVsE/jGYBpwnMFyE4hV4Ds2vV1JFcArgDcA0wxwFtA9mLEW0B27fo6kreAafLzdYDsLM6LCpB9+TySASg5AwwAA7CkWq2ejZLBWrvbGLM36v2kfxT5OSHED6IGt1qt5TN+mr3k6ch/+UNDQzdUKpWXo2YmojuDINiXCQCl1GYA+GUMXRsSfqc3f0VKNqOUch0ihr+o3vFlrb0l7hdVYytAvV5f63neCzGa3qe1/mrJNC/UcqWUexFxV1RQV65ceefRo0dfzFQBwuPZokWLziHiQISD09balcaY84VSpSTBDA0NXV2pVMI7iosjlnzx/Pnz15w8ebKVCYBwkJTycUS8OabE7DfG7CyJ5oVaplLqAADcFhPUI1rrbXFBx24B4UCl1KcA4GCcE2vtl4wx3yuUOvM8GKXUXQDwQEJethpjHu0KgEkIXgGANyVo+idEvL3RaByd59r3dXnDw8PLBgYG7geA7QmBnNBar0wKNrECTAJwBwBEHiWmT0JET8d1pUkB8fuvVYCIrkLEVQBQB4Cai0ZE9OkgCGIrd+jHCYDJXuAYIg67TM42/VWAiP4eBMHbXaJwBqBWqw17nvciIlZdHLNN3xQ422q1VrteoHMGIFyO7/sfEEI82bel8cSJClhrU12cSwXAJATvQsTDiHh9YjRskJsCRHTKWvuhZrOp00yaGoDQ+dDQ0LWVSuVBAIg9Y6YJhG2zK0BEBy9evPiF8fHxc2m9ZAJgahLf931E3IOIW9JOzPbdKUBE4dW9Q0KIPY1GYzyrt64AmJp05cqVixcuXLgVAMK/GxDxWgAI//jVOwX+RUSnASBM9i88z3t8dHT01W7d9wSAboPg8f1TgAHon/aFmJkBKEQa+hcEA9A/7QsxMwNQiDT0LwgGoH/aF2JmBqAQaehfEAxA/7QvxMz/BXCNBBcFfPrjAAAAAElFTkSuQmCC";
const picon = "data:image/png;base64,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";
var openid = "";
const buttons = [
  {
    label: '进货',
    icon: picon
  },
  {
    label: '售货',
    icon: sicon
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,
    msg: {
      icon: '../../../images/iconfont-order.png',
      title: '您还没有相关的订单',
      text: '可以点击右方按钮添加新的订单'
    },
    buttons,
    current:["0"],
    localfiles:[],
    inputShowed: false,
    inputVal: "",
    items: [{
      type: 'radio',
      label: '订单类别',
      value: 'orders',
      children: [{
        label: '进货',
        value: 'purchase',
      },{
        label: '售出',
        value: 'sales',
      },{
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
    type:"",
    current:["0"]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    const that = this
    const db = wx.cloud.database();
    db.collection("Order").limit(10).get().then(res => {
      console.log(res)
      if(res.data=="")
        this.setData({
          orders: res.data,
          status:false
        })
      else
      {
        if(res.data[0].Files=="")
          this.setData({
            orders: res.data
          })
        else{
          const picfiles = []
          const files =res.data[0].Files
          for (let i = 0; i < files.length; i++) {
            const pic_src = files[i].fileID
            picfiles.push(pic_src)
          }
          this.setData({
            localfiles: picfiles,
            orders: res.data
          })
        }
      }
    })
  },
  onChangefilter:function(e){
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
        }else if (n.value === 'money') {
          params.sort = n.value
          params.type = n.sort === 1 ? 'moneyasc' : 'moneydesc'
        }
      }
    })
    this.getRepos(params)
  },
  querycate:function(type){
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid,
      category: type
    }).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  querytype:function(type){
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid,
      paymentType: type
    }).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  querytimeandmoney: function (fieldName,order){
    const db = wx.cloud.database();
    db.collection("Order").where({
      _openid: openid
    }).orderBy(fieldName, order).limit(10).get().then(res => {
      this.setData({
        orders: res.data
      })
    })
  },
  getRepos: function (params = {}){
    console.log(params)
    if (params.type == "purchase"){
      this.querycate("进货")
    } else if (params.type =="sales"){
      console.log("00000")
      this.querycate("售出")
    } else if (params.type == "paidorder"){
      this.querytype("现结")
    } else if (params.type == "unpaidorder"){
      this.querytype("赊账")
    } else if (params.type == "complete") {
      this.querytype("已收账")
    } else if (params.type == "allorder"){
      const db = wx.cloud.database();
      db.collection("Order").where({
        _openid: openid
      }).limit(10).get().then(res => {
        this.setData({
          orders: res.data
        })
      })
    } else if (params.type == "timeasc"){
      this.querytimeandmoney("createTime", "desc")
    } else if (params.type == "timedesc") {
      this.querytimeandmoney("createTime", "asc")
    } else if (params.type == "moneyasc") {
      this.querytimeandmoney("total_amount", "desc")
    } else if (params.type == "moneydesc") {
      this.querytimeandmoney("total_amount", "asc")
    }
  },
  onChangeaccordion:function(e){
    console.log(e)
    var current = [];
    current.push(e.detail.key)
    if(e.detail.key!=null&&e.detail.key!="")
    {
      const files = this.data.orders[parseInt(e.detail.key)].Files;
      if(files=="")
      {
        this.setData({
          current: current
        })
        return
      }
      const picfiles = []
      for (let i = 0; i < files.length; i++) {
        const pic_src = files[i].fileID
        picfiles.push(pic_src)
      }
      this.setData({
        localfiles:picfiles,
        current: current
      })
      return
    }else{
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
  confirm:function(e){
    console.log(e)
    const index = e.currentTarget.id;
    const orderid = this.data.orders[index]._id;
    console.log(orderid)
    wx.navigateTo({
      url: '../../pages_order/pages/confirm_order/index?orderid='+orderid,
    })
  },
  fabonChange(e) {
    console.log('onChange', e)
  },
  fabonClick(e) {
    console.log('onClick', e.detail)
    if (e.detail.index == 0)
      wx.navigateTo({
        url: '../../pages_order/pages/AddPurchaseOrders/index',
      })
    else if (e.detail.index == 1)
      wx.navigateTo({
        url: '../../pages_order/pages/AddSalesOrders/index?client='+"none",
      })
    else
      console.log("no page")
  },
})