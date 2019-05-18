import F2 from '../../../dist/f2-canvas/lib/f2';
import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index';
import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
var chart1 =null

Page({
  data: {
    opts:{
    },
    status:false,
    yearvalue: "",
    index: 0,
    year_options: [],
    title: "",
    data_year :[
      { name: '售出', 月份: '1月.', 总量: 0 },
      { name: '售出', 月份: '2月.', 总量: 0 },
      { name: '售出', 月份: '3月.', 总量: 0 },
      { name: '售出', 月份: '4月.', 总量: 0 },
      { name: '售出', 月份: '5月.', 总量: 0 },
      { name: '售出', 月份: '6月.', 总量: 0 },
      { name: '售出', 月份: '7月.', 总量: 0 },
      { name: '售出', 月份: '8月.', 总量: 0 },
      { name: '售出', 月份: '9月.', 总量: 0 },
      { name: '售出', 月份: '10月.', 总量: 0 },
      { name: '售出', 月份: '11月.', 总量: 0 },
      { name: '售出', 月份: '12月.', 总量: 0 },
      { name: '支出', 月份: '1月.', 总量: 0 },
      { name: '支出', 月份: '2月.', 总量: 0 },
      { name: '支出', 月份: '3月.', 总量: 0 },
      { name: '支出', 月份: '4月.', 总量: 0 },
      { name: '支出', 月份: '5月.', 总量: 0 },
      { name: '支出', 月份: '6月.', 总量: 0 },
      { name: '支出', 月份: '7月.', 总量: 0 },
      { name: '支出', 月份: '8月.', 总量: 0 },
      { name: '支出', 月份: '9月.', 总量: 0 },
      { name: '支出', 月份: '10月.', 总量: 0 },
      { name: '支出', 月份: '11月.', 总量: 0 },
      { name: '支出', 月份: '12月.', 总量: 0 },
      { name: '利润', 月份: '1月.', 总量: 0 },
      { name: '利润', 月份: '2月.', 总量: 0 },
      { name: '利润', 月份: '3月.', 总量: 0 },
      { name: '利润', 月份: '4月.', 总量: 0 },
      { name: '利润', 月份: '5月.', 总量: 0 },
      { name: '利润', 月份: '6月.', 总量: 0 },
      { name: '利润', 月份: '7月.', 总量: 0 },
      { name: '利润', 月份: '8月.', 总量: 0 },
      { name: '利润', 月份: '9月.', 总量: 0 },
      { name: '利润', 月份: '10月.', 总量: 0 },
      { name: '利润', 月份: '11月.', 总量: 0 },
      { name: '利润', 月份: '12月.', 总量: 0 },
    ]
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.tipsmessage("正在加载...")
    const data_year = this.data.data_year
    var sold_total=0;
      for (let i = 0; i < 12; i++)
        sold_total += parseInt(data_year[i].总量)
    var pay_total = 0;
    for (let i = 12; i < 24; i++)
      pay_total += parseInt(data_year[i].总量)
    var profit_total = 0
    for (let i = 24; i < 36; i++)
      profit_total += parseInt(data_year[i].总量)
    this.tipsmessage("总售出:"+sold_total+"元、总支出:"+pay_total+"元、总利润:"+profit_total+"元")
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onLoad:function(options){
    const that = this
    wx.showLoading({
      title: '正在加载',
    })
    this.requestdata()
    that.ecComponent = that.selectComponent(' #dodge-dom');
    setTimeout(function () {
      that.setData({
        opts: {
          onInit: that.initChart
        }
      }, () => {
        that.ecComponent.init(that.initChart);
        that.tipsmessage("下拉显示全年总数据哦")
      })
      wx.hideLoading()
    }, 1500)
  },
  onShow:function(){
    const that = this;
    
    
  },
  initChart:function(canvas, width, height) {
    const that = this;
      let chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(this.data.data_year);
      chart.coord({
        transposed: true
      });
      chart.tooltip({
        custom: true, // 自定义 tooltip 内容框
        onChange(obj) {
          const legend = chart.get('legendController').legends.top[0];
          const tooltipItems = obj.items;
          const legendItems = legend.items;
          const map = {};
          legendItems.map(item => {
            map[item.name] = Object.assign({}, item);
          });
          tooltipItems.map(item => {
            const { name, value } = item;
            if (map[name]) {
              map[name].value = value+" 元";
            }
          });
          legend.setItems(Object.values(map));
        },
        onHide() {
          const legend = chart.get('legendController').legends.top[0];
          legend.setItems(chart.getLegendItems().country);
        }
      });
      chart.axis('label', {
        line: F2.Global._defaultAxis.line,
        grid: null
      });
      chart.axis('value', {
        line: null,
        grid: F2.Global._defaultAxis.grid,
        label: function label(text, index, total) {
          var textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.guide().text({
        position: ['min', 'max'],
        content: '单位(元)',
        style: {
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetX: -40,
        offsetY: 25
      });
      chart.interval().position('月份*总量').color('name').adjust({
        type: 'dodge',
        marginRatio: 1 / 32
      });
      chart.render();
      return chart;
  },
  requestdata: function (){
    const that = this
    const db = wx.cloud.database();
    db.collection("data_status").field({
      use_year: true
    }).get().then(res => {
      console.log(res)
      that.setData({
        year_options: res.data[0].use_year,
        yearvalue: res.data[0].use_year[0],
        title: res.data[0].use_year[0]
      }, () => {
        that.get_allyear_data(res.data[0].use_year[0])
      })
    })
  },
  get_allyear_data: function (year){
    var data_year = this.data.data_year
    const that = this;
    const db = wx.cloud.database();
    return db.collection("Order").count({
      success:res=>{
        const total = res.total;
        const times = parseInt(total/20) +1;
        db.collection("Order").where({
          order_time:db.command.gte(year+"-01-01 00:00").and(db.command.lte(year+"-12-31 13:59"))
        }).field({
          category:true,
          total_amount:true,
          profit:true,
          order_time:true
        }).get().then(res=>{
          data_year = that.setchartdata(res.data, data_year)
          for(let m = 1;m<times;m++)
          {
            db.collection("Order").where({
              order_time: db.command.gte(year + "-01-01 00:00").and(db.command.lte(year + "-12-31 13:59"))
            }).field({
              category: true,
              total_amount: true,
              profit: true,
              order_time: true
            }).skip(times * 20).get().then(res => {
              data_year = that.setchartdata(res.data, data_year)
              that.setData({
                data_year: data_year,
                status:true
              })
              return data_year
            })
          }
          if(times ==1)
          {
            that.setData({
              data_year:data_year,
              status: true
            })
            return data_year
          }
        })
      }
    })
  },
  setchartdata: function (data, data_year){
    console.log("setchartdata",data_year)
    for (let i = 0; i < data.length; i++) {
      if (data[i].category == "进货") {
        const order_month = parseInt(data[i].order_time.slice(5, 7))
        data_year[order_month + 11].总量 += data[i].total_amount;
        continue;
      }
      if (data[i].category == "售出") {
        const order_month = parseInt(data[i].order_time.slice(5, 7))
        data_year[order_month - 1].总量 += data[i].total_amount;
        if (data[i].profit != null)
          data_year[order_month + 23].总量 += data[i].profit;
        continue;
      }
    }
    return data_year
  },
  onchangeyear:function(e){
    const that = this;
    $wuxSelect('#selectyear').open({
      value: this.data.yearvalue,
      options: this.data.year_options,
      toolbar: {
        title: '选择年份',
        confirmText: '确定',
        cancelText:"取消"
      },
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        wx.showLoading({
          title: '正在加载',
        })
        that.get_allyear_data(value)
        that.setData({
          title:value,
          yearvalue:value,
          index: index,
        },()=>{
          that.ecComponent = that.selectComponent(' #dodge-dom');
          setTimeout(function () {
            that.setData({
              opts: {
                onInit: that.initChart
              }
            }, () => {
              that.ecComponent.init(that.initChart);
            })
            wx.hideLoading()
          }, 1000)
        })
      },
      onCancel: (e) => {
        $wuxSelect('#selectyear').close()
      }
    })
  },
  tipsmessage: function (text) {
    $wuxToptips().success({
      hidden: false,
      text: text,
      duration: 2000,
      success() { },
    })
  },
});
