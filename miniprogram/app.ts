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
    // wx.request({
    //   url: "http://www.axiarz.com/api/setting",
    //   method: "GET",
    //   success: (res) => {
    //     console.log(res)
    this.globalData.device_id = "CC:8D:A2:2E:01:9A";
    console.log("connect " + this.globalData.device_id)
    wx.openBluetoothAdapter({
      fail(res) {
        console.error(res);
      },
      success(res) {
        console.log(res);
        wx.startBluetoothDevicesDiscovery({
          success(res) {
            console.log(res)
            wx.onBluetoothDeviceFound(function (res) {
              var devices = res.devices;
              console.log()
              if (devices[0].deviceId == that.globalData.device_id || devices[0].name == 'qiyin') {
                that.globalData.device_id = devices[0].deviceId
                wx.stopBluetoothDevicesDiscovery();
                wx.createBLEConnection({
                  deviceId: devices[0].deviceId,
                  fail: (res) => {
                    console.error(res)
                  },
                  success: (res) => {
                    console.log(res);
                    wx.showToast({
                      title: "链接设备成功",
                      icon: 'success',
                      duration: 2000
                    })
                    wx.notifyBLECharacteristicValueChange({
                      state: true,
                      deviceId: that.globalData.device_id,
                      serviceId: "000000ff-0000-1000-8000-00805f9b34fb",
                      characteristicId: "0000ff01-0000-1000-8000-00805f9b34fb",
                      success(res) {
                        console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                      },
                      fail: (e) => {
                        console.log(e)
                      }
                    })
                  }
                })
              }
            })
          }
        });
        //   }
        // })


      }
    })
  },


})