import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index'

var today = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    depositnum:0,
    up_pic_status: false,
    paymentType:"已收账",
    Files: [],
    localfiles: [],
    orderDescription:"",
    payamount:"",
    removal: "不抹零",
    removalvalue: "",
    removaloptions: ["不抹零", "抹小数", "抹个位", "抹十位", "抹百位", "抹千位"],
    discount: "无折扣",
    discountvalue: "",
    discountoptions: [],
    payvalue: "",
    after_disc_total: 0,
    after_disc_rem_total: 0,
  },
  onLoad: function (options) {
    const that = this;
    const db = wx.cloud.database();
    var discountoptions =[];
    db.collection("data_status").field({
      discountoptions:true
    }).get().then(res => discountoptions=res.data[0].discountoptions)
    db.collection('Order').doc(options.orderid).get().then((res)=>{
      console.log(res.data)
      if(res.data.Files!="")
      {
        const pic = res.data.Files;
        const picfiles = []
        for (let i = 0; i < pic.length; i++) {
          const pic_src = pic[i].fileID
          picfiles.push(pic_src)
        }
        that.setData({
          up_pic_status:true,
          localfiles: picfiles,
          Files: res.data.Files,
        })
      }
      that.setData({
        orderDescription: res.data.orderDescription,
        after_disc_total:res.data.after_disc_rem_total,
        after_disc_rem_total: res.data.after_disc_rem_total,
        discountoptions: discountoptions,
        depositnum: res.data.depositnum,
        _id:options.orderid
      })
    })
  },
  GetOrderDescription: function (e) {
    this.setData({
      orderDescription: e.detail.value
    })
  },
  onChangepic_status(e) {
    this.setData({
      Files: [],
      localfiles: [],
      up_pic_status: e.detail.value
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
  PreviewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.localfiles // 需要预览的图片http链接列表
    })
  },
  ondiscountType() {
    const that = this;
    console.log()
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
        console.log(arr)
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
  getpayAmount: function (e) {
    this.setData({
      payamount: e.detail.value
    })
  },
  onAdd: function () {
    var that = this;
    if (that.data.payamount == "" && that.data.paymentType == "现结") {
      that.tipsmessage("请先填写付款金额")
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
        //如果用户没有上传图片，那么就直接上传货物信息
        db.collection('Order').doc(that.data._id).update({
          data: {
            category: that.data.category,
            paymentType: "已收账",
            orderDescription: that.data.orderDescription,
            removal: that.data.removal,
            discount: that.data.discount,
            after_disc_rem_total: that.data.after_disc_rem_total,
            payamount: parseInt(that.data.payamount),
            Files: that.data.Files,
            confirmTime: order_time
          },
          success: res => {
            wx.showToast({
              title: '收账记录成功',
            })
            console.log('[数据库] [更新记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            that.openAlert("收账记录失败")
            that.setData({
              savestatus: true
            })
            console.error('[数据库] [更新记录] 失败：', err)
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
                db.collection('Order').doc(that.data._id).update({
                  data: {
                    category: that.data.category,
                    paymentType: that.data.paymentType,
                    orderDescription: that.data.orderDescription,
                    removal: that.data.removal,
                    discount: that.data.discount,
                    after_disc_rem_total: that.data.after_disc_rem_total,
                    payamount:parseInt(that.data.payamount),
                    Files: that.data.Files,
                    confirmTime: order_time
                  },
                  success: res => {
                    wx.showToast({
                      title: '收账记录成功',
                    })
                    console.log('[数据库] [更新记录] 成功，记录 _id: ', res._id)
                  },
                  fail: err => {
                    that.openAlert("收账记录失败")
                    that.setData({
                      savestatus: true
                    })
                    console.error('[数据库] [更新记录] 失败：', err)
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
  backorderlist: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  curentTime: function () {
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
    if (hh < 10)
      clock += "0";
    clock += " " + hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
  },
})