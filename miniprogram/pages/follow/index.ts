// pages/follow/index.ts
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: [
      { text: '設備連接', value: 0 },
      { text: '好評排序', value: 1 },
      { text: '銷量排序', value: 2 },
    ],
    value: 0,
    lyrics: [

      // 继续填写其他歌词...
    ],
    formattedLyrics: [],
    scrollTop: 0, // 控制歌词滚动的位置
    currentTime: 0, // 当前时间（模拟）
    highlightIndex: 0, // 当前高亮歌词的索引
    isPaused: false, // 播放暂停状态
    songId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getlyrics(options.id)
    // const id = JSON.parse(decodeURIComponent(options.id));
    // this.startLyricsScroll();
    wx.onBLECharacteristicValueChange((res) => {
      console.log('BLE 特征值变化：', res);
      let u8Buf = this.hexStringToUint8Array(this.ab2hex(res.value))
      // 处理蓝牙特征值变化的逻辑
      switch (u8Buf[0]) {
        case 0x11:
          console.log("dev trig"); // 设备按正确组合后发送
          this.togglePlayback();
          break;
        default:
          break;
      }
    });
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
  // 提取歌词中的时间戳并为每一行设置 time 属性
  extractTime() {
    const updatedLyrics = this.data.lyrics.map((line) => {
      const timeRegex = /\[(\d{2}):(\d{2}\.\d{2})\]/; // 匹配类似 [00:00.00] 的时间戳
      const match = line.match(timeRegex);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        const totalTime = minutes * 60 + seconds; // 转化为秒数
        const lyricText = line.replace(timeRegex, ''); // 去掉时间戳部分
        return {
          time: totalTime, // 为每一行歌词设置 time
          text: lyricText.trim(), // 保存原始歌词
        };
      }
      return { time: 0, text: line }; // 如果没有时间戳，设置默认值 0
    });

    this.setData({
      lyrics: updatedLyrics, // 更新 data 中的 lyrics
    });
  },

  // 格式化歌词，处理 #9 和 _6，生成格式化后的歌词
  formatLyrics() {
    const formatted = this.data.lyrics.map((line) => {
      let formattedLine = [];
      let regex = /[#].{2}|_(\d+)|([^#_]+)/g;
      let matches = line.text.match(regex);
      if (matches) {
        // console.log(matches)
        matches.forEach((match) => {
          let num = match.slice(1)[0];


          if (match.startsWith('#')) {
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { class: 'superscript' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { class: `hasbgtext bgNum-${num}` }, children: [{ type: 'text', text: match.slice(1)[1] }] }
              ]
            });
          } else if (match.startsWith('_')) {
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { class: 'superscript' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { class: `notext bgNum-${num}` }, children: [{ type: 'text', text: ' ' }] }
              ]
            });
          } else {
            formattedLine.push({ type: 'text', text: match });
          }
        });
      }
      line.original = line.text;
      line.text = [{ name: 'div', attrs: { style: 'display:flex;margin-top:30px;justify-content: center;' }, children: formattedLine }];

      return line
    });
    this.setData({
      formattedLyrics: formatted,
    });
  },

  // 开始歌词滚动的定时器
  startLyricsScroll() {
    const totalDuration = this.data.lyrics[this.data.lyrics.length - 1].time; // 获取歌词总时长
    this.timer = setInterval(() => {
      if (this.data.currentTime >= totalDuration || this.data.isPaused) {
        clearInterval(this.timer); // 停止定时器
        return;
      }

      // 更新当前时间
      this.setData({
        currentTime: this.data.currentTime + 1,
      });

      // 获取当前歌词行和它的播放时间
      const currentLyric = this.data.lyrics[this.data.highlightIndex];
      // console.log(currentLyric)
      // 获取当前行歌词文本，按空格分割成词
      const words = currentLyric.original.split(' ');

      // 计算每个词的播放时间，假设每个词的播放时间均匀分配
      const lineDuration = this.data.lyrics[this.data.highlightIndex + 1]?.time - currentLyric.time || totalDuration - currentLyric.time;
      const wordDuration = lineDuration / words.length; // 每个词的播放时间

      // 遍历当前行的每个词，判断当前时间是否达到该词的播放时间，并检查是否包含 '#' 或 '_'
      let timeElapsed = 0; // 累计时间，表示已播放的时间

      for (let i = 0; i < words.length; i++) {
        timeElapsed += wordDuration; // 当前词的播放时间
        const word = words[i];

        // 如果当前时间接近该词的播放时间并且词中包含 '#' 或 '_'
        if (Math.abs(this.data.currentTime - (currentLyric.time + timeElapsed)) < wordDuration && (word.includes('#') || word.includes('_'))) {
          // 提取 # 或 _ 后面的字
          // 检查是否遇到 '#' 或 '_'
          const hashMatch = word.match(/#(\d)/);  // 匹配 # 后的数字
          const underscoreMatch = word.match(/_(\d)/);  // 匹配 _ 后的数字

          if (hashMatch) {
            // 遇到 # 后暂停，并获取 # 后的数字
            const hashNumber = hashMatch[1];
            console.log(`遇到 # 后面的数字是: ${hashNumber}`);

            // 暂停播放
            // this.setData({
            //   isPaused: true,
            // });

            this.send(hashNumber);
            this.togglePlayback();
            // clearInterval(this.timer); // 清除定时器
            break; // 退出循环
          }

          if (underscoreMatch) {
            // 遇到 _ 且已遇到过 #
            const underscoreNumber = underscoreMatch[1];
            console.log(`遇到 _ 后面的数字是: ${underscoreNumber}`);

            // 执行继续播放逻辑
            // this.setData({
            //   isPaused: true,  // 继续播放
            // });
            this.send(underscoreNumber);
            this.togglePlayback()
            // clearInterval(this.timer); // 清除定时器
            break; // 退出循环
          }

          // this.setData({ isPaused: true }); // 如果遇到包含 '#' 或 '_' 的词，暂停播放
          // clearInterval(this.timer); // 清除定时器
          // console.log(timeElapsed)
          // console.log("暂停播放")
          // break; // 退出循环
        }
      }

      // 更新歌词高亮和滚动位置
      this.updateLyricsHighlight();
    }, 500);
  },
  // 滚动到第一行歌词
  scrollToFirstLine() {
    const lineHeight = 24; // 每行歌词的高度（根据需要调整）
    const containerHeight = 150; // 假设歌词容器的高度为 300（根据需要调整）
    const centerOffset = Math.floor(containerHeight / 2 - lineHeight / 2); // 居中偏移量

    // 设置 scrollTop 使第一行歌词居中
    this.setData({
      scrollTop: centerOffset,
    });
  },
  // 更新歌词高亮
  updateLyricsHighlight() {
    const currentTime = this.data.currentTime;
    let highlightIndex = this.data.lyrics.findIndex((item) => item.time <= currentTime && (this.data.lyrics[this.data.lyrics.indexOf(item) + 1] ? this.data.lyrics[this.data.lyrics.indexOf(item) + 1].time > currentTime : true));

    if (highlightIndex !== -1) {
      this.setData({
        highlightIndex,
      });

      // 计算滚动位置，确保高亮歌词居中
      const lineHeight = 30; // 每行歌词的高度（根据需要调整）
      const containerHeight = 150; // 假设歌词容器的高度为 300（根据需要调整）
      const centerOffset = Math.floor(containerHeight / 2 - lineHeight / 2); // 居中偏移量

      // 计算 scrollTop 使高亮歌词居中
      const scrollTop = Math.max(0, highlightIndex * lineHeight - centerOffset);

      this.setData({
        scrollTop, // 设置 scrollTop
      });
    }
  },

  // 切换播放和暂停状态
  togglePlayback() {
    if (this.data.isPaused) {
      this.setData({ isPaused: false });
      this.startLyricsScroll(); // 继续播放
    } else {
      this.setData({ isPaused: true });
      clearInterval(this.timer); // 暂停播放
    }
  },

  //**
  //* 
  //* @param music_id  歌词id
  //* @param hexian_id  和弦id
  //* @param geci 歌词字符串
  //
  send(hexian_id: number, geci?: string) {
    let device_id = app.globalData.device_id
    if (!device_id) {
      console.error("error:require deviceid");
      return;
    }

    const sendBuf = new Uint8Array(3);
    sendBuf[0] = 0x30;
    sendBuf[1] = this.data.songId;
    sendBuf[2] = hexian_id;
    // TODO: 将歌词转换成utf8编码数组， 这个需求20250119不搞

    wx.writeBLECharacteristicValue({
      deviceId: device_id,
      serviceId: "000000ff-0000-1000-8000-00805f9b34fb",
      characteristicId: "0000ff01-0000-1000-8000-00805f9b34fb",
      value: sendBuf,
      success(res) {
        console.log("writeBLECharacteristicValue success", res.errMsg);
      },
    });
  },



  hexToBuffer(hex: string) {
    const pairs = hex.match(/[\s\S]{1,2}/g) || [];
    const decimalArray = pairs.map((pair) => parseInt(pair, 16));
    const arr = new Uint8Array(decimalArray.length);
    for (let i = 0; i < decimalArray.length; i++) {
      arr[i] = decimalArray[i];
    }
    return arr.buffer;
  },

  ab2hex(buffer: ArrayBuffer) {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join("");
  },

  stringToHex(str: string) {
    return str
      .split("")
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  },

  getlyrics(id) {
    wx.request({
      url: 'https://www.axiarz.com/api/lyrics/find_lyrics_by_song_id/' + id,
      method: 'GET',
      success: (res) => {
        this.setData({
          songId: res.data.data.song_id
        })
        this.lyricsToArray(res.data.data.lyric);

        setTimeout(() => {
          this.extractTime(); // 提取时间并存储
          this.formatLyrics();
          this.startLyricsScroll();

          this.scrollToFirstLine();
        }, 100);

      }
    })
  },
  lyricsToArray(lyrics: string) {
    let lyricsArray = lyrics.split("\n");
    this.setData({
      lyrics: lyricsArray
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})