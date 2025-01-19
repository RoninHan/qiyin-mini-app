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
    toneValue: 0,
    rateArray: ['1', '2', '3', '4'],
    rateValue: 0,
    toneShow: false,
    rateShow: false
  },
  onShow() {
    let that = this;
    this.getTabBar().setData({ active: 0 })

    wx.onBLECharacteristicValueChange(function (res) {
      let u8Buf = that.hexStringToUint8Array(that.ab2hex(res.value))
      switch (u8Buf[0]) {
        case 0x00:
          console.log("bat" + u8Buf[1])
          that.setData({
            battery:u8Buf[1]
          })
          break;
        case 0x10:
          console.log(
            "vol" + u8Buf[1] + "," +
            "yindao" + u8Buf[2] + "," +
            "play_speed" + u8Buf[3] + "," +
            "guji_style" + u8Buf[4] + "," +
            "bo1_style" + u8Buf[5] + "," +
            "bo2_style" + u8Buf[6] + "," +
            "rgb_mode" + u8Buf[7]
          )
          that.setData({
            volume:u8Buf[1]
          })
          break;
        default:
          break;
      }
    })
  },

  handleToneShow() {
    this.setData({
      toneShow: true
    })
    this.getTabBar().setData({
      showTabBar: false
    })
  },
  onToneClose() {
    this.setData({
      toneShow: false
    })
    this.getTabBar().setData({
      showTabBar: true
    })
  },

  handleRateShow() {
    this.setData({
      rateShow: true
    })
    this.getTabBar().setData({
      showTabBar: false
    })
  },
  onRateClose() {
    this.setData({
      rateShow: false
    })
    this.getTabBar().setData({
      showTabBar: true
    })
  },
   hexStringToUint8Array(hexString: string): Uint8Array {
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
  },
   ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }

})
