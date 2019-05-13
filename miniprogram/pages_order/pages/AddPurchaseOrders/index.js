import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index'

var today = "";
var order_good = [];
Page({

  /**
   * 用户数据记录的数据库id
   * 页面的初始数据
   * 订单id
   * 订单类别
   * 客户名字
   * 订单描述
   * 预支款金额
   * 整个订单的金额
   * 支付方式
   * 付款金额
   * 上传图片的文件列表
   * 文件地址
   * 订单中货物的名数组
   * 选择货物的详细信息
   * 选择货物的下标值
   * 选择货物的默认title
   * 折扣
   * 折扣下标值
   * 折扣选项
   * 抹零
   * 抹零下标值
   * 抹零选项
   * 支付方式的下标值
   * 上传图片的状态
   * 预付金的状态
   * 预付金是否大于的订单总金额的状态
   * 保存按钮是否disable
   * 结款日期
   * 折扣后
   * 最后总金额
   * 出售量大于库存量的货物
   */
  data: {
    data_status_id: "",
    orderID: "",
    category: "进货",
    orderDescription: "",
    depositnum: 0,
    total_amount: 0,
    paymentType: "选择",
    payamount: "",
    Files: [],
    localfiles: [],
    GoodName: "",
    options: "",
    goodvalue: "",
    title: "选择",
    discount: "无折扣",
    discountvalue: "",
    discountoptions: [],
    removal: "不抹零",
    removalvalue: "",
    removaloptions: ["不抹零", "抹小数", "抹个位", "抹十位", "抹百位", "抹千位"],
    payvalue: "",
    up_pic_status: false,
    deposit_status: false,
    depositnum_errstatus: false,
    savestatus: false,
    repaymentdate: "选择日期",
    after_disc_total: 0,
    after_disc_rem_total: 0,
    worrygood: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    const db = wx.cloud.database()
    db.collection("data_status").field({
      discountoptions: true,
      orderID: true
    }).get().then(res => {
      console.log(res.data)
      let i = "00000000";
      let orderid = res.data[0].orderID + 1
      while (orderid > 0) {
        i = i.slice(0, -1)
        orderid = parseInt(orderid / 10)
      }
      that.setData({
        discountoptions: res.data[0].discountoptions,
        orderID: i + (res.data[0].orderID + 1),
        data_status_id: res.data[0]._id
      })
    })
    db.collection('Goods').field({
      GoodName: true,
      GoodUnit: true,
      GoodPrice_pur: true
    })
      .get()
      .then((res) => {
        console.log(res)
        //新建一个数组来将构建列表
        const options = [];
        const length_goods = res.data.length;
        for (let i = 0; i < length_goods; i++) {
          const newob = res.data[i]
          newob.value = '' + i + '';
          newob.title = res.data[i].GoodName
          options.push(newob)
        }
        that.setData({
          options: options
        })
      })
      .catch(console.error)
    today = this.curentTime("date")
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    console.log(4444)
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片      
        console.log(res)
        const path = res.tempFilePaths[0];
        const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/)
        var json = { src: cloudPath, fileID: "" }
        that.setData({
          Files: that.data.Files.concat(json),
          localfiles: that.data.localfiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  PreviewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.localfiles // 需要预览的图片http链接列表
    })
  },
  Remove(e) {
    var that = this;
    const path = e.currentTarget.id;
    const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/);
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            //类似于java中的lambda表达式
            Files: that.data.Files.filter((n) => n.src !== cloudPath),
            localfiles: that.data.localfiles.filter(function (localfiles) {
              return localfiles != e.currentTarget.id;
            })
          })
        }
      },
    })
  },
  Open: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['预览', "删除"],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            //如果点击预览，则执行下列函数
            that.PreviewImage(e);
          }
          else {
            //否则就是删除按钮
            console.log(e);
            that.Remove(e)
          }
        }
      }
    });
  },
  onchangegood() {
    const that = this;
    $wuxSelect('#selectgood').open({
      value: this.data.goodvalue,
      multiple: true,
      toolbar: {
        title: '选择货物',
        confirmText: '确定',
        cancelText: "取消",
      },
      options: this.data.options,
      // //选项中显示
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (value != "")
          if (order_good == "") {
            const obj = [];
            for (let i = 0; i < value.length; i++) {
              const json = options[parseInt(value[i])];
              json.amount = 0;
              obj.push(json)
            }
            order_good = obj;
          }
          else {
            var newobj = [];
            for (let i = 0; i < value.length; i++) 
            {
              const neworder_good = order_good.filter(function(cell){
                return (cell.value == value[i])
              })
              if (neworder_good != "")
                newobj.push(neworder_good[0])
              else {
                const json = options[parseInt(value[i])];
                json.amount = 0;
                newobj.push(json);
              }
            }
            order_good = newobj;
          }
        else
          order_good = [];
        this.setData({
          goodvalue: value,
          GoodName: index.map((n) => {
            let arr = {}
            arr.GoodName = options[n].GoodName
            arr.Unit = options[n].GoodUnit
            return arr
          }),
          title: "已选" + value.length + "个货物",
        }, () => console.log(that.data.GoodName))
        var total_amount = 0
        for (let i = 0; i < order_good.length; i++)
          total_amount += order_good[i].amount
        this.setData({
          total_amount,
          after_disc_total: total_amount,
          after_disc_rem_total: total_amount
        })
      },
      onCancel: (e) => {
        $wuxSelect('#selectgood').close()
      }
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
            payvalue: value,
            paymentType: options[index]
          })
        }
      },
    })
  },
  ondiscountType() {
    const that = this;
    $wuxSelect('#selectdiscount').open({
      value: this.data.discountvalue,
      options: this.data.discountoptions,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index == 0 && that.data.discount != "无折扣") {
          this.setData({
            after_disc_total: that.data.total_amount - that.data.depositnum,
            after_disc_rem_total: that.data.total_amount - that.data.depositnum,
            discountvalue: value,
            discount: options[index]
          })
        }
        if (index !== -1 && index !== 0) {
          let disc = parseInt(options[index].replace("折", "")) / 10
          let total_amount = (parseInt(that.data.total_amount) * disc);
          this.setData({
            after_disc_total: total_amount - that.data.depositnum,
            after_disc_rem_total: total_amount - that.data.depositnum,
            discountvalue: value,
            discount: options[index]
          })
        }
      },
    })
  },
  onremoval() {
    const that = this;
    $wuxSelect('#selectremoval').open({
      value: this.data.removalvalue,
      options: this.data.removaloptions,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        let total = that.data.after_disc_rem_total + ""
        let arr = total.split(".")
        if (index !== -1) {
          switch (index) {
            case 0: this.setData({
              after_disc_rem_total: that.data.after_disc_total,
              removalvalue: value,
              removal: options[index]
            }); break;
            case 1: this.setData({
              after_disc_rem_total: arr[0],
              removalvalue: value,
              removal: options[index]
            }); break;
            case 2:
              if (arr[0].length > 0) {
                var str = arr[0].slice(0, -1);
                console.log(str)
                if (str.length > 0)
                  str = str + "0"
                else str = "0"
                console.log(str)
                this.setData({
                  after_disc_rem_total: str,
                  removalvalue: value,
                  removal: options[index]
                });
              } else {
                this.errremoval();
              }
              break;
            case 3: if (arr[0].length > 1) {
              let str = arr[0].slice(0, -2);
              console.log(str)
              if (str.length > 0)
                str = str + "00"
              else str = "0"
              console.log(str)
              this.setData({
                after_disc_rem_total: str,
                removalvalue: value,
                removal: options[index]
              });
            } else {
              this.errremoval();
            }
              break;
            case 4: if (arr[0].length > 2) {
              let str = arr[0].slice(0, -3);
              if (str.length > 0)
                str = str + "000"
              else str = "0"
              this.setData({
                after_disc_rem_total: str,
                removalvalue: value,
                removal: options[index]
              });
            } else {
              this.errremoval();
            }
              break;
            case 5: if (arr[0].length > 3) {
              let str = arr[0].slice(0, -4);
              if (str.length > 0)
                str = str + "0000"
              else str = "0"
              this.setData({
                after_disc_rem_total: str,
                removalvalue: value,
                removal: options[index]
              });
            } else {
              this.errremoval();
            }
              break;
          }
        }
      },
    })
  },
  errremoval: function () {
    this.setData({
      removalvalue: "0",
      removal: "无折扣"
    });
    $wuxToptips().show({
      icon: 'cancel',
      hidden: false,
      text: '折扣力度大于总金额',
      duration: 1500,
      success() { },
    })
  },
  bindDateChange: function (e) {
    this.setData({
      repaymentdate: e.detail.value
    })
  },
  getpayAmount: function (e) {
    this.setData({
      payamount: e.detail.value
    })
  },
  onChangepic_status(e) {
    this.setData({
      Files: [],
      localfiles: [],
      up_pic_status: e.detail.value
    })
  },
  onChangedep_status(e) {
    this.setData({
      depositnum: 0,
      deposit_status: e.detail.value
    })
  },
  curentTime: function (e) {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = year + "-";
    if (month < 10)
      clock += "0";
    clock += month + "-";
    if (day < 10)
      clock += "0";
    clock += day;
    if (e == "date")
      return (clock);
    else {
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
    else {
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '订单号需为纯数字',
        duration: 1000,
        success() { },
      })
    }
  },
  GetOrderDescription: function (e) {
    this.setData({
      orderDescription: e.detail.value
    })
  },
  Getdepositnum: function (e) {
    var depositnum = e.detail.value;
    if (depositnum == "") depositnum = 0;
    var total_amount = 0
    if (this.data.depositnum == 0)
      total_amount = parseInt(this.data.after_disc_rem_total) - parseInt(depositnum)
    else
      total_amount = parseInt(this.data.after_disc_rem_total) + parseInt(this.data.depositnum) - parseInt(depositnum)
    if (total_amount < 0) {
      $wuxToptips().show({
        hidden: false,
        text: '预付金额大于总订单需支付金额',
        duration: 2000,
        success() { },
      })
      this.setData({
        depositnum_errstatus: true
      })
      return;
    }
    this.setData({
      depositnum_errstatus: false,
      depositnum: parseInt(depositnum),
      after_disc_rem_total: total_amount
    })
  },
  getPrice: function (e) {
    const that = this;
    const id = e.currentTarget.id;
    var value = 0
    if (e.detail.value != "")
      value = parseInt(e.detail.value);
    order_good[id].valueunit = value;
    //货物此次进了多少单位的货
    order_good[id].amount = value * order_good[id].GoodPrice_pur;
    var total_amount = 0
    for (let i = 0; i < order_good.length; i++)
      total_amount += order_good[i].amount
    this.setData({
      total_amount,
      after_disc_rem_total: total_amount,
      after_disc_total: total_amount
    })
  },
  tipsmessage: function (text) {
    $wuxToptips().show({
      icon: 'cancel',
      hidden: false,
      text: text,
      duration: 2000,
      success() { },
    })
  },
  onAdd: function () {
    var that = this;
    if (that.data.orderID == "" || that.data.orderID == null||isNaN(this.data.orderID)) {
      that.tipsmessage("请先填写订单号(纯数字)")
      return;
    }
    if (that.data.payvalue == "" || that.data.paymentType == "选择") {
      that.tipsmessage("请先选择结账方式")
      return;
    }
    if (that.data.worrygood != "") {
      let text = that.data.worrygood.GoodName + '已超出目前' + that.data.worrygood.GoodReserve + that.data.worrygood.GoodUnit + "的库存量"
      that.tipsmessage(text)
      return;
    }
    if (that.data.payamount == "" && that.data.paymentType == "现结") {
      that.tipsmessage("请先填写付款金额")
      return;
    }
    if (that.data.repaymentdate == "选择日期" && that.data.paymentType == "赊账") {
      that.tipsmessage("请先选择结款日期")
      return;
    }
    if (order_good != "") {
      var status = 0;
      for (let t = 0; t < order_good.length; t++) {
        if (order_good[t].valueunit > order_good[t].GoodReserve) {
          status++;
          $wuxToptips().show({
            icon: 'cancel',
            hidden: false,
            text: order_good[t].GoodName + '已超出目前' + order_good[t].GoodReserve + order_good[t].GoodUnit + "的库存量",
            duration: 2000,
            success() { },
          })
          break;
        }
      }
      console.log(status)
      if (status != 0)
        return;
    } else {
      that.tipsmessage("请先填写货物")
      return;
    }
    if (that.data.deposit_status == true && that.data.depositnum == 0) {
      that.tipsmessage("请先填写预付金额")
      return;
    }
    const db = wx.cloud.database();
    this.setData({
      savestatus: true
    }, () => {
      wx.showLoading({
        title: '正在保存',
        mask: true
      })
      const order_time = this.curentTime()
      const length = that.data.localfiles.length;
      if (length == 0) {
        //先更新货物当中的库存信息
        for (let m = 0; m < order_good.length; m++) {
          db.collection("Goods").doc(order_good[m]._id).update({
            data: {
              GoodReserve: db.command.inc(parseInt(order_good[m].valueunit))
            },
            fail: () => {
              that.openAlert("更新货物库存失败")
              console.error
            }
          })
        }
        //如果用户没有上传图片，那么就直接上传货物信息
        db.collection('Order').add({
          data: {
            orderID: that.data.orderID,
            category: that.data.category,
            order_goodname: that.data.GoodName,
            order_good: order_good,
            order_time: order_time,
            paymentType: that.data.paymentType,
            orderDescription: that.data.orderDescription,
            depositnum: that.data.depositnum,
            removal: that.data.removal,
            total_amount: that.data.total_amount,
            discount: that.data.discount,
            after_disc_rem_total: that.data.after_disc_rem_total,
            payamount: that.data.payamount,
            Files: that.data.Files,
            repaymentdate: that.data.repaymentdate,
            createTime: db.serverDate()
          },
          success: res => {
            db.collection("data_status").doc(this.data.data_status_id).update({
              data: {
                orderID: parseInt(that.data.orderID)
              }
            })
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            that.openAlert("新增订单失败, 请检查网络")
            that.setData({
              savestatus: true
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
        wx.reLaunch({
          url: '../../../pages/OrderList/index',
        })
        //下面的for循环就不会执行
      }
      else {
        //记录循环已经执行了的次数
        let filestimes = 0
        for (let j = 0; j < length; j++) {
          //上传的文件大小不同，会异步处理上传，文件越大的上传越慢，但是在大文件的上传同时，小文件已经上传完毕了
          const cloudPath = that.data.Files[j].src;
          const filePath = that.data.localfiles[j];
          //作为一个变量，需要拼接字符串来完成
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传第' + j + '文件] 成功：', res);
              const fID = 'Files[' + j + '].fileID'
              console.log("fID", fID)
              that.setData({
                [fID]: res.fileID
              })
              // wx.navigateTo({
              //   url: '../GoodsList/index'
              // })
            },
            fail: e => {
              //需要删除之前上传过的文件
              console.error('[上传第' + j + '文件] 失败：', e)
              that.openAlert('[上传第' + j + '文件] 失败')
            },
            complete: result => {
              filestimes = filestimes + 1;
              console.log("filestimes", filestimes)
              if (filestimes == length) {
                db.collection('Order').add({
                  data: {
                    orderID: that.data.orderID,
                    category: that.data.category,
                    order_goodname: that.data.GoodName,
                    order_good: order_good,
                    order_time: order_time,
                    paymentType: that.data.paymentType,
                    orderDescription: that.data.orderDescription,
                    depositnum: that.data.depositnum,
                    removal: that.data.removal,
                    total_amount: that.data.total_amount,
                    discount: that.data.discount,
                    after_disc_rem_total: that.data.after_disc_rem_total,
                    payamount: that.data.payamount,
                    Files: that.data.Files,
                    repaymentdate: that.data.repaymentdate,
                    createTime: db.serverDate()
                  },
                  success: res => {
                    db.collection("data_status").doc(this.data.data_status_id).update({
                      data: {
                        orderID: parseInt(that.data.orderID)
                      }
                    })
                    wx.showToast({
                      title: '新增订单成功',
                    })
                  },
                  fail: err => {
                    that.openAlert("新增订单失败,请检查网络")
                    that.setData({
                      savestatus: true
                    })
                  }
                })
                wx.reLaunch({
                  url: '../../../pages/OrderList/index',
                })
              }
              else
                return
            }
          })
        }
      }
    })
  },
  openAlert: function (message) {
    const msg = message;
    wx.showModal({
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.navigateBack({
            delta: 1
          })
        }
      }
    });
  },
  removeAaary: function (_arr, _obj) {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
      if (_arr[i] == _obj) {
        if (i == 0) {
          _arr.shift(); //删除并返回数组的第一个元素
          return _arr;
        }
        else if (i == length - 1) {
          _arr.pop();  //删除并返回数组的最后一个元素
          return _arr;
        }
        else {
          _arr.splice(i, 1); //删除下标为i的元素
          return _arr;
        }
      }
    }
  },
  backorderlist: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
})