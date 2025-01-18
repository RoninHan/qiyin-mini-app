// app.ts
App<IAppOption>({
  globalData: {
    device_id: ""
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })

    wx.request({
      url: "https://www.axiarz.com/api/setting",
      method: "GET",
      success: (res) => {
        console.log(res)
        this.globalData.device_id = res.data.data.device_id

        wx.createBLEConnection({
          deviceId:res.data.data.device_id,
          success:(res)=>{
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId:res.data.data.device_id,
              serviceId: "000000ff-0000-1000-8000-00805f9b34fb",
              characteristicId: "0000ff01-0000-1000-8000-00805f9b34fb",
              success(res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
              },
              fail:(e)=>{
                console.log(e)
              }
            })
          }
        })
        
      }
    })
  },


})