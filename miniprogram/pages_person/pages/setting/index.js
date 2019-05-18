// miniprogram/pages_person/pages/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      _openid:options._openid
    })
  },
  delete_persosn_message:function(){
    const that =this;
    wx.showModal({
      title: '特别提醒',
      content: '  为保护用户隐私，用户数据未做任何备份，若删除则无法挽回数据，任何责任将由用户承担。',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          wx.showLoading({
            title: '正在删除数据',
          })
          const db = wx.cloud.database();
          let amount_Goods = 0;
          let amount_Order = 0;
          db.collection("Goods").where({
            Files: db.command.neq([])
          }).count().then(res=>
          {
            amount_Goods = res.total
            db.collection("Goods").where({
              Files: db.command.neq([])
            }).field({Files:true}).get().then(res=>{
              let files_Goods = [];
              for(let i=0;i<res.data.length;i++){
                for(let j=0;j<res.data[i].Files.length;j++){
                  files_Goods.push(res.data[i].Files[j].fileID)
                }
              }
              wx.cloud.deleteFile({
                fileList: files_Goods
              }).then(res => console.log).catch(console.error)
              if (amount_Goods > 20) {
                let files_Goods = [];
                const times = parseInt(amount_Goods / 20) + 1
                for (let t = 1; t < times; t++) {
                  db.collection("Goods").where({
                    Files: db.command.neq([])
                  }).field({ Files: true }).skip(t * 20).get().then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                      for (let j = 0; j < res.data[i].Files.length; j++) {
                        files_Goods.push(res.data[i].Files[j].fileID)
                      }
                    }
                  })
                  wx.cloud.deleteFile({
                    fileList: files_Goods
                  }).then(res => console.log).catch(console.error)
                }
                wx.cloud.callFunction({
                  name: "delete_person_message",
                  data: { database: "Goods" },
                }).then(res => wx.hideLoading()).catch(console.error)
              }
              else{
                wx.cloud.callFunction({
                  name: "delete_person_message",
                  data: { database: "Goods" },
                }).then(res => wx.hideLoading()).catch(console.error)
              }
            })
          })
          db.collection("Order").where({
            Files: db.command.neq([])
          }).count().then(res => {
            amount_Order = res.total
            db.collection("Order").where({
              Files: db.command.neq([])
            }).field({ Files: true }).get().then(res => {
              let files_Order = [];
              for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < res.data[i].Files.length; j++) {
                  files_Order.push(res.data[i].Files[j].fileID)
                }
              }
              wx.cloud.deleteFile({
                fileList:files_Order
              }).then(res=>console.log).catch(console.error)
              if (amount_Order > 20) {
                let files_Order=[]
                const times = parseInt(amount_Order / 20) + 1
                for (let t = 1; t < times; t++) {
                  db.collection("Order").where({
                    Files: db.command.neq([])
                  }).field({ Files: true }).skip(t * 20).get().then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                      for (let j = 0; j < res.data[i].Files.length; j++) {
                        files_Order.push(res.data[i].Files[j].fileID)
                      }
                    }
                  })
                  wx.cloud.deleteFile({
                    fileList: files_Order
                  }).then(res => console.log).catch(console.error)
                }
                wx.cloud.callFunction({
                  name: "delete_person_message",
                  data: { database: "Order" },
                }).then(res => {
                  wx.showToast({
                  title: '清空数据成功',
                })
                  wx.reLaunch({
                    url:"../../../pages/Person/index"
                  })
                }).catch(console.error)
              }else{
                wx.cloud.callFunction({
                  name: "delete_person_message",
                  data: { database: "Order" },
                }).then(res => {
                  wx.showToast({
                  title: '清空数据成功',
                })
                  wx.reLaunch({
                    url: "../../../pages/Person/index"
                  })
                }).catch(console.error)
              }
            })
          })
          wx.cloud.callFunction({
            name: "delete_person_message",
            data: { database: "data_status" },
          }).then(res => console.log).catch(console.error)
        }
      }
    })
  }
})