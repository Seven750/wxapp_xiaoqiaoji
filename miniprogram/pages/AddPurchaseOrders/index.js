import { $wuxSelect } from '../../miniprogram_npm/wux-weapp/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onchangegood() {
    $wuxSelect('#selectgood').open({
      value: this.data.value,
      multiple: true,
      toolbar: {
        title: 'Please choose',
        confirmText: 'ok',
      },
      options: [{
        title: '画画',
        value: '1',
      },
      {
        title: '打球',
        value: '2',
      },
      {
        title: '唱歌',
        value: '3',
      },
      {
        title: '游泳',
        value: '4',
      },
      {
        title: '健身',
        value: '5',
      },
      {
        title: '睡觉',
        value: '6',
      },
      {
        title: '睡觉',
        value: '7',
      },
      {
        title: '睡觉',
        value: '8',
      },
      {
        title: '睡觉',
        value: '9',
      },
      {
        title: '睡觉',
        value: '10',
      },
      {
        title: '睡觉',
        value: '11',
      },
      {
        title: '睡觉',
        value: '12',
      },
      {
        title: '睡觉',
        value: '13',
      },

      ],
      onChange: (value, index, options) => {
        console.log('onChange', value, index, options)
        this.setData({
          value: value,
          title: index.map((n) => options[n].title),
        })
      },
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        this.setData({
          value: value,
          title: index.map((n) => options[n].title),
        })
      },
    })
  },
})