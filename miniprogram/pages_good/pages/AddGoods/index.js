import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index'
import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    types: ['个', '斤', '100个','千克', '吨',"打","平方米","米"],
    typeIndex: 3,
    Files: [],
    localfiles: [],
    GoodName:"",
    GoodPrice:"",
    GoodDescription:"",
    GoodReserve:"",
    GoodUnit: "请选择",
    savestatus: false,
    value1: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },
  onchooseUnit() {
    $wuxSelect('#wux-select').open({
      value: this.data.value1,
      options:this.data.types,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value1: value,
            GoodUnit: options[index],
          })
        }
      },
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:4,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片      
        console.log(res)
        const path = res.tempFilePaths[0];
        const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/)
        var json={src:cloudPath,fileID:""}
        that.setData({
          Files:that.data.Files.concat(json),
          localfiles:that.data.localfiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  PreviewImage: function (e) {
    console.log(e.currentTarget.id);
    console.log(this.data.localfiles);
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
            Files: that.data.Files.filter((n) =>n.src!==cloudPath),
            localfiles: that.data.localfiles.filter(function (localfiles){
              return localfiles != e.currentTarget.id;
            } )
          })
        }
      },
    })
  },
  GetGoodName:function(e){
    this.setData({
        GoodName:e.detail.value
    })
  },
  GetGoodPrice:function(e){
    this.setData({
      GoodPrice: e.detail.value
    })
  },
  GetGoodsDescription:function(e){
    this.setData({
      GoodDescription:e.detail.value
    })
  },
  GetGoodReserve:function(e){
    this.setData({
      GoodReserve:e.detail.value
    })
  },
  Open: function (e) {
    var that= this;
    wx.showActionSheet({
      itemList: ['预览',"删除"],
      success: function (res) {
        if (!res.cancel) {
          if(res.tapIndex==0){
            //如果点击预览，则执行下列函数
            that.PreviewImage(e);
          }
          else{
            //否则就是删除按钮
            console.log(e);
            that.Remove(e)
          }
        }
      }
    });
  },
  //添加到数据库当中
  onAdd: function () {
    var that=this;
    if(that.data.GoodName==""||that.data.GoodName==null)
    {
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '请先填写货物信息',
        duration: 2000,
        success() { },
      })
      return;
    }
    if (that.data.GoodPrice == "" || that.data.GoodPrice == null) {
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '请先填写货物单价',
        duration: 2000,
        success() { },
      })
      return;
    }
    if (that.data.GoodUnit == "" || that.data.GoodUnit == "请选择") {
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '请先填写货物单位',
        duration: 2000,
        success() { },
      })
      return;
    }
    const db = wx.cloud.database();
    this.setData({
      savestatus:true
    },()=>{
      wx.showLoading({
        title: '正在保存',
      })
      console.log(that.data.localfiles)
      const length = that.data.localfiles.length;
      if(length==0)
      {
        //如果用户没有上传图片，那么就直接上传货物信息
        console.log(that.data.Files)
        db.collection('Goods').add({
          data: {
            GoodName: that.data.GoodName,
            GoodPrice: that.data.GoodPrice,
            GoodDescription: that.data.GoodPrice,
            GoodReserve: that.data.GoodReserve,
            GoodUnit: that.data.GoodUnit,
            Svolume: "",
            Pvolume: "",
            Files: that.data.Files
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id 可以当作索引
            this.setData({
              counterId: res._id,
              count: 1
            })
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            that.openAlert("新增记录失败")
            that.setData({
              savestatus: true
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
        wx.reLaunch({
          url: '../../../pages/GoodsList/index',
        })
      //下面的for循环就不会执行
      }
      else
      {
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
            complete:result =>{
              filestimes = filestimes + 1;
              console.log("filestimes", filestimes)
              if (filestimes == length) {
                console.log("11111111111", that.data.Files)
                db.collection('Goods').add({
                  data: {
                    GoodName: that.data.GoodName,
                    GoodPrice: that.data.GoodPrice,
                    GoodDescription: that.data.GoodPrice,
                    GoodReserve: that.data.GoodReserve,
                    GoodUnit: that.data.GoodUnit,
                    Svolume: "",
                    Pvolume: "",
                    Files: that.data.Files
                  },
                  success: res => {
                    // 在返回结果中会包含新创建的记录的 _id 可以当作索引
                    this.setData({
                      counterId: res._id,
                      count: 1
                    })
                    wx.showToast({
                      title: '新增记录成功',
                    })
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  },
                  fail: err => {
                    that.openAlert("新增记录失败")
                    that.setData({
                      savestatus: true
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
                wx.reLaunch({
                  url: '../../../pages/GoodsList/index',
                  // success: function (e) {
                  //   const page = getCurrentPages().pop();
                  //   console.log(page)
                  //   if (page == undefined || page == null)
                  //     return;
                  //   page.onLoad()
                  // }
                })
              }
              else
                return
            }
          })
          
        }
      }
        // wx.hideLoading()
        
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
            delta:1
          })
        }
      }
    });
  },
  backgoodlist:function(e){
    wx.navigateBack({
      delta:1
    })
  }

})