// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    option: [
      { text: '設備連接', value: 0 },
      { text: '好評排序', value: 1 },
      { text: '銷量排序', value: 2 },
    ],
    value: 0,
    battery: 45, // 电量
    volume: 50, // 音量
    toneArray: ['1', '2', '3', '4'],
    toneValue:0,
    rateArray: ['1', '2', '3', '4'],
    rateValue:0,
    toneShow: false,
    rateShow: false
  },
  onShow(){
    this.getTabBar().setData({ active: 0 })
  },
  
  handleToneShow(){
    this.setData({
      toneShow:true
    })
    this.getTabBar().setData({
      showTabBar:false
    })
  },
  onToneClose(){
    this.setData({
      toneShow:false
    })
    this.getTabBar().setData({
      showTabBar:true
    })
  },

  handleRateShow(){
    this.setData({
      rateShow:true
    })
    this.getTabBar().setData({
      showTabBar:false
    })
  },
  onRateClose(){
    this.setData({
      rateShow:false
    })
    this.getTabBar().setData({
      showTabBar:true
    })
  }

})
