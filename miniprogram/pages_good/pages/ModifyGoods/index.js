import { $wuxSelect } from '../../../miniprogram_npm/wux-weapp/index'
import { $wuxToptips } from '../../../miniprogram_npm/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   * 是否修改状态
   * 用户的ID
   * 单位选择
   * 图片文件，从云端读取
   * 文件的云端路基
   * 货物名字
   * 货物销售单价
   * 货物进货单价
   * 货物描述
   * 货物库存
   * 货物单位
   * 保存和删除按钮的状态
   * 货物ID
   * 用户可以从相册中勾选的照片数量
   * 新上传的图片路径
   * 删除的图片路径
   * 
   */
  data: {
    status:true,
    openid: "",
    types: "",
    Files: [],
    localfiles: [],
    GoodName: "",
    GoodPrice: "",
    GoodPrice_pur:"",
    GoodDescription: "",
    GoodReserve: "",
    GoodUnit: "千克",
    savestatus: false,
    goodid:"",
    ruploadfiles:0,
    newfiles:[],
    deletefiles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsinformation(options.GoodName)
    const that = this
    wx.getStorage({
      key: 'persondata',
      success(res) {
        that.setData({
          types: res.data.goodUnit
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onchooseUnit() {
    $wuxSelect('#wux-select').open({
      value: this.data.GoodUnit,
      options: this.data.types,
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            GoodUnit: options[index],
          })
        }
      },
    })
  },
  pickerChange(e) {
    const { value } = e.detail
    const { model } = e.currentTarget.dataset
    const unit = this.data.types[value]
    this.setData({
      [model]: value,
      GoodUnit: unit
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: that.data.ruploadfiles,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片      
        let newfiles = []
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          let path = res.tempFilePaths[i];
          let cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/);
          let json = { src: cloudPath, fileID: "" }
          newfiles = newfiles.concat(json)
        }
        that.setData({
          newfiles: newfiles,
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
    //如果存在cloud字符串，则说明是云端的图片
    if(path.indexOf("cloud")!=-1)
    {
      const cloudPath = path.replace(/cloud:\/\/seven1.7365-seven1-1257698411\//, "")
      this.setData({
            //类似于java中的lambda表达式
            Files: that.data.Files.filter((n) => n.src !== cloudPath),
            deletefiles:that.data.deletefiles.concat(cloudPath),
            localfiles: that.data.localfiles.filter(function (localfiles) {
              return localfiles != e.currentTarget.id;
            }),
            ruploadfiles: that.data.ruploadfiles + 1
      })
    }
    else
    {
      //否则是本地的图片，正常处理
      const cloudPath = 'my-image' + path.replace(/[^0-9]/ig, "") + path.match(/\.[^.]+?$/);
      wx.showModal({
        content: '确定删除？',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              //类似于java中的lambda表达式
              newfiles: that.data.newfiles.filter((n) => n.src !== cloudPath),
              localfiles: that.data.localfiles.filter(function (localfiles) {
                return localfiles != e.currentTarget.id;
              })
            })
          }
        },
      })
    }
      
    
  },
  GetGoodName: function (e) {
    this.setData({
      GoodName: e.detail.value
    })
  },
  GetGoodSalPrice: function (e) {
    this.setData({
      GoodPrice: e.detail.value
    })
  },
  GetGoodPurPrice: function (e) {
    this.setData({
      GoodPrice_pur: e.detail.value
    })
  },
  GetGoodsDescription: function (e) {
    this.setData({
      GoodDescription: e.detail.value
    })
  },
  GetGoodReserve: function (e) {
    this.setData({
      GoodReserve: e.detail.value
    })
  },
  Open: function (e) {
    var that = this;
    if(that.data.status==false)
    {
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
              that.Remove(e)
            }
          }
        }
      });
    }
    else{
      //就是在用户未点击修改的时候
      wx.showActionSheet({
        itemList: ['预览'],
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              //如果点击预览，则执行下列函数
              that.PreviewImage(e);
            }
          }
        }
      });
    }
  },
  //修改到数据库当中
  onchangegood: function () {
    var that = this;
    const db = wx.cloud.database();
    this.setData({
      savestatus: true
    }, () => {
      if(that.data.deletefiles.length!=0)
      {
        wx.cloud.deleteFile({
        fileList: that.data.deletefiles,
          success: res => {
            console.log(res)
          },
          fail: err => {
            console.error(err)
          },
        })
      }
      const length_new = that.data.newfiles.length;
      if (length_new == 0) {
        //如果用户没有上传图片，那么就直接上传货物信息
        db.collection('Goods').doc(that.data.goodid).set({
          data: {
            GoodName: that.data.GoodName,
            GoodPrice:parseInt(that.data.GoodPrice),
            GoodPrice_pur: parseInt(that.data.GoodPrice_pur),
            GoodDescription: that.data.GoodDescription,
            GoodReserve: parseInt(that.data.GoodReserve),
            GoodUnit: that.data.GoodUnit,
            Svolume: 0,
            Files: that.data.Files
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id 可以当作索引
            this.setData({
              counterId: res._id,
              count: 1
            })
            wx.showToast({
              title: '修改信息成功',
            })
            console.log('[数据库] [修改记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '修改信息失败'
            })
            that.setData({
              savestatus: true
            })
            console.error('[数据库] [修改记录] 失败：', err)
          }
        })
        wx.reLaunch({
          url: '../../../pages/GoodsList/index',
        })
        //下面的for循环就不会执行
      }
      else{
        wx.showLoading({
          title: '正在上传图片',
        })
        //记录循环已经执行了的次数
        let filestimes = 0
        for (let j = 0; j < length_new; j++) {
          
          const localfileslength = that.data.localfiles.length
          const cloudPath = that.data.newfiles[j].src;
          const filePath = that.data.localfiles[4 - that.data.ruploadfiles+j];
          //作为一个变量，需要拼接字符串来完成
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              const fID = 'newfiles[' + j + '].fileID'
              that.setData({
                [fID]: res.fileID
              })
              // wx.navigateTo({
              //   url: '../GoodsList/index'
              // })
            },
            fail: e => {
              console.error('[上传第' + j + '文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '图片上传失败',
              })
            },
            complete: result => {
              filestimes = filestimes + 1;
              //如果文件上传完毕
              if (filestimes == length_new) {
                wx.showLoading({
                  title: '正在保存',
                })
                //说明所有文件都上传完毕了
                const newFiles = that.data.Files;
                for (let i = 0; i < that.data.newfiles.length; i++) {
                  newFiles.push(that.data.newfiles[i])
                }
                
                db.collection('Goods').doc(that.data.goodid).set({
                  data: {
                    GoodName: that.data.GoodName,
                    GoodPrice: parseInt(that.data.GoodPrice),
                    GoodPrice_pur: parseInt(that.data.GoodPrice_pur),
                    GoodDescription: that.data.GoodDescription,
                    GoodReserve: parseInt(that.data.GoodReserve),
                    GoodUnit: that.data.GoodUnit,
                    Svolume: 0,
                    Files: newFiles
                  },
                  success: res => {
                    // 在返回结果中会包含新创建的记录的 _id 可以当作索引
                    this.setData({
                      counterId: res._id,
                      count: 1
                    })
                    wx.showToast({
                      title: '修改信息成功',
                    })
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '修改信息失败'
                    })
                    that.setData({
                      savestatus: true
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
                wx.navigateBack({
                  delta: 1
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
  deleteGood:function(e){
    const that =this;
    const db = wx.cloud.database();
    that.setData({
      savestatus:true
    },()=>{
      if (that.data.goodid != "" || that.data.goodid != null) {
        db.collection("Goods").doc(that.data.goodid).remove().then(function (result) {
          if(that.data.localfiles!="")
          {
            wx.cloud.deleteFile({
              fileList: that.data.localfiles,
              success: res => {
                console.log(res)
              },
              fail: err => {
                console.error(err)
              }
            })
          }
          if (result.stats.removed == 1) {
            wx.showToast({
              title: '删除成功',
            })
            wx.reLaunch({
              url: '../../../pages/GoodsList/index',
            })
          }
          else {
            wx.showToast({
              title: '删除失败',
            })
            wx.reLaunch({
              url: '../../../pages/GoodsList/index',
            })
          }
        })
      } else {
        wx.showToast({
          title: '无货物信息删除',
        })
        wx.reLaunch({
          url: '../../../pages/GoodsList/index',
        })
      }
    })
  },

  onModify:function(){
    this.setData({
      status:!this.data.status
    })
  },
  getGoodsinformation: function (name) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    const db = wx.cloud.database();
    db.collection("Goods").where({
      GoodName: name
    }).get().then(res => {
      const pic = res.data[0].Files;
      const picfiles = []
      for (let i = 0; i < pic.length; i++) {
        const pic_src = pic[i].fileID
        picfiles.push(pic_src)
      }
      if (res.data[0].GoodDescription == "")
        var des = "无"
      else
        var des = res.data[0].GoodDescription
      for(let i=0;i<that.data.types.length;i++)
        if (res.data[0].GoodUnit==that.data.types[i])
          that.setData({
            typeIndex:i
          })
      that.setData({
        GoodName: res.data[0].GoodName,
        GoodPrice: res.data[0].GoodPrice,
        GoodPrice_pur:res.data[0].GoodPrice_pur,
        GoodDescription: des,
        GoodReserve: res.data[0].GoodReserve,
        GoodUnit: res.data[0].GoodUnit,
        Svolume: res.data[0].Svolume,
        localfiles: picfiles,
        Files: res.data[0].Files,
        goodid: res.data[0]._id,
        ruploadfiles:4-pic.length
      }, () =>{
        wx.hideLoading()
      })

    }).catch(err=>{
      console.error(err)
    })
  },

})