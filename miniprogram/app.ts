// app.ts
App<IAppOption>({
  globalData: {
    device_id: "CC:8D:A2:2E:01:9A",
    is_android: true,
    isConnected: false,
    service_id: "",
    char_id: ""
  },
  onLaunch() {
    let that = this;
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 獲取系統信息
    // wx.getSystemInfo({
    //   success: (res) => {
    //     if (res.platform == 'android') {
    //       that.globalData.is_android = true
    //     } else if (res.platform == 'ios') {
    //       that.globalData.is_android = false
    //     }
    //   }
    // })

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
    //   url: "https://www.axiarz.com/api/setting",
    //   method: "GET",
    //   success: (res) => {
    //     console.log(res)
    // this.globalData.device_id = "CC:8D:A2:2E:01:9A";
    console.log("connect " + this.globalData.device_id)
    // wx.openBluetoothAdapter({
    //   fail(res) {
    //     console.error(res);
    //   },
    //   success(res) {
    //     console.log(res);
    //     wx.startBluetoothDevicesDiscovery({
    //       success(res) {
    //         console.log(res)
    //         wx.onBluetoothDeviceFound(function (res) {
    //           var devices = res.devices;
    //           if (devices[0].deviceId == that.globalData.device_id || devices[0].name == 'qiyin') {
    //             that.globalData.device_id = devices[0].deviceId
    //             wx.stopBluetoothDevicesDiscovery();
    //             wx.createBLEConnection({
    //               deviceId: devices[0].deviceId,
    //               fail: (res) => {
    //                 console.error(res)
    //               },
    //               success: (res) => {
    //                 console.log(res);
    //                 console.log("device_id2", that.globalData.device_id)
    //                 wx.getBLEDeviceServices({
    //                   deviceId: that.globalData.device_id,
    //                   success(res) {
    //                     console.log('device services:', res.services)
    //                     for (let ser of res.services) {
    //                       if (ser.uuid.includes("00FF") || ser.uuid.includes("00ff")) {
    //                         that.globalData.service_id = ser.uuid;
    //                         wx.getBLEDeviceCharacteristics({
    //                           deviceId: that.globalData.device_id,
    //                           serviceId: ser.uuid,
    //                           success(res) {
    //                             for (let char of res.characteristics) {
    //                               if (char.uuid.includes("FF01") || char.uuid.includes("ff01")) {
    //                                 that.globalData.char_id = char.uuid;
    //                                 wx.notifyBLECharacteristicValueChange({
    //                                   state: true,
    //                                   deviceId: that.globalData.device_id,
    //                                   serviceId: ser.uuid,
    //                                   characteristicId: char.uuid,
    //                                   success(res) {
    //                                     console.log('notifyBLECharacteristicValueChange success', res.errMsg)
    //                                     wx.showToast({
    //                                       title: "链接设备成功",
    //                                       icon: 'success',
    //                                       duration: 2000
    //                                     })
    //                                   },
    //                                   fail: (e) => {
    //                                     console.log('notifyBLECharacteristicValueChange fail', e)
    //                                   }
    //                                 })
    //                               }
    //                               break;
    //                             }
    //                           }
    //                         });
    //                         break;
    //                       }
    //                     }
    //                   },
    //                 });
    //               }
    //             })
    //           }
    //         })
    //       }
    //     });
    //     //   }
    //     // })


    //   }
    // })
    this.initBluetooth();
  },
  // 初始化蓝牙适配器
  initBluetooth() {
    const targetDeviceId = this.globalData.device_id;
    // console.log(`开始连接指定设备：${targetDeviceId}`);

    // 打开蓝牙适配器
    wx.openBluetoothAdapter({
      fail: (err) => {
        // console.error("蓝牙初始化失败:", err);
        this.showError("请打开手机蓝牙");
        setTimeout(() => this.initBluetooth(), 3000); // 3秒后重试
      },
      success: () => {
        console.log("蓝牙适配器已就绪");
        this.setupConnectionMonitor();
        this.startConnectProcess();
      }
    });
  },
  // 建立连接状态监听
  setupConnectionMonitor() {
    wx.onBLEConnectionStateChange(res => {
      console.log(`连接状态变更：${res.connected ? "已连接" : "已断开"}`);
      this.globalData.isConnected = res.connected;

      if (!res.connected) {
        this.showError("设备已断开，正在重连...");
        this.startConnectProcess();
      }
    });
  },

  // 启动连接流程
  startConnectProcess() {
    if (this.globalData.isConnected) return;

    this.stopDiscovery(() => {
      this.startDiscovery();
    });
  },
  // 停止设备发现
  stopDiscovery(callback: Function) {
    wx.stopBluetoothDevicesDiscovery({
      complete: () => callback()
    });
  },
  // 开始设备发现
  startDiscovery() {
    let that = this;
    wx.startBluetoothDevicesDiscovery({
      success: () => {
        console.log("正在扫描设备...");
        that.listenDeviceFound();
      },
      fail: (err) => {
        console.error("扫描启动失败:", err);
        setTimeout(() => that.startConnectProcess(), 2000);
      }
    });
  },
  // 设备发现监听
  listenDeviceFound() {
    let that = this;
    wx.onBluetoothDeviceFound(res => {
      var devices = res.devices;
      if (devices[0].deviceId == that.globalData.device_id || devices[0].name == 'qiyin') {
        that.globalData.device_id = devices[0].deviceId
        console.log("发现目标设备，停止扫描");
        wx.stopBluetoothDevicesDiscovery();
        that.connectDevice(devices[0].deviceId)
      }
    });
  },

  // 连接设备
  connectDevice(deviceId: any) {
    let that = this;
    console.log(`尝试连接设备：${deviceId}`);

    wx.createBLEConnection({
      deviceId,
      success: () => {
        console.log("设备连接成功");
        that.setupServiceDiscovery();
      },
      fail: (err) => {
        console.error("连接失败:", err);
        that.startConnectProcess();
      }
    });
  },

  // 发现服务
  setupServiceDiscovery() {
    let that = this;
    wx.getBLEDeviceServices({
      deviceId: that.globalData.device_id,
      success: (res) => {
        const service = res.services.find(s => s.uuid.toLowerCase().includes("00ff"));
        if (service) {
          that.globalData.service_id = service.uuid;
          that.discoverCharacteristics();
        } else {
          that.handleServiceError();
        }
      },
      fail: (err) => that.handleServiceError()
    });
  },

  // 发现特征值
  discoverCharacteristics() {
    let that = this;
    console.log("开始发现特征值");
    console.log("serviceId:", that.globalData.service_id);
    console.log("device_id:", that.globalData.device_id);
    wx.getBLEDeviceCharacteristics({
      deviceId: that.globalData.device_id,
      serviceId: that.globalData.service_id,
      success: (res) => {
        const characteristic = res.characteristics.find(c => c.uuid.toLowerCase().includes("ff01"));
        if (characteristic) {
          that.globalData.char_id = characteristic.uuid;
          that.enableNotifications();
        } else {
          that.handleCharacteristicError();
        }
      },
      fail: (err) => that.handleCharacteristicError()
    });
  },

  // 启用通知
  enableNotifications() {
    let that = this;
    wx.notifyBLECharacteristicValueChange({
      deviceId: that.globalData.device_id,
      serviceId: that.globalData.service_id,
      characteristicId: that.globalData.char_id,
      state: true,
      success: () => {
        console.log("通知已启用");
        that.globalData.isConnected = true;
        wx.showToast({ title: "连接成功", icon: "success" });
      },
      fail: (err) => {
        console.error("通知启用失败:", err);
        that.startConnectProcess();
      }
    });
  },

  // 错误处理
  showError(msg: string) {
    wx.showToast({ title: msg, icon: "none" });
  },

  handleServiceError() {
    this.showError("服务发现失败");
    this.startConnectProcess();
  },

  handleCharacteristicError() {
    this.showError("特征值发现失败");
    this.startConnectProcess();
  }
})