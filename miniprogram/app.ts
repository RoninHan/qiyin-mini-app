// app.ts
App<IAppOption>({
  globalData: {
    device_id: ""
  },
  onLaunch() {
    let that = this;
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
    function hexStringToUint8Array(hexString: string): Uint8Array {
      // 去除可能存在的空格和换行符
      hexString = hexString.replace(/\s+/g, '');
  
      // 检查字符串长度是否为偶数
      if (hexString.length % 2 !== 0) {
        throw new Error('Invalid hex string length');
      }
  
      // 创建 Uint8Array
      const uint8Array = new Uint8Array(hexString.length / 2);
  
      // 遍历字符串，每两个字符转换为一个字节
      for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
      }
  
      return uint8Array;
    }
    function ab2hex(buffer) {
      let hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
          return ('00' + bit.toString(16)).slice(-2)
        }
      )
      return hexArr.join('');
    }
    wx.request({
      url: "https://www.axiarz.com/api/setting",
      method: "GET",
      success: (res) => {
        console.log(res)
        this.globalData.device_id = res.data.data.device_id
        wx.openBluetoothAdapter({
          fail (res) {
              console.error(res);
          },
          success () {
            wx.createBLEConnection({
              deviceId: res.data.data.device_id,
              success: (res) => {
                // wx.onBLECharacteristicValueChange(function (res) {
                //   let u8Buf = hexStringToUint8Array(ab2hex(res.value))
                //   switch (u8Buf[0]) {
                //     case 0x00:
                //       console.log("bat" + u8Buf[1])
                //       break;
                //     case 0x10:
                //       console.log(
                //         "vol" + u8Buf[1] + "," +
                //         "yindao" + u8Buf[2] + "," +
                //         "play_speed" + u8Buf[3] + "," +
                //         "guji_style" + u8Buf[4] + "," +
                //         "bo1_style" + u8Buf[5] + "," +
                //         "bo2_style" + u8Buf[6] + "," +
                //         "rgb_mode" + u8Buf[7]
                //       )
                //       break;
                //     default:
                //       break;
                //   }
                // })
              }
            })
          }
        })
        

      }
    })
  },
  

})