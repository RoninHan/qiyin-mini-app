// pages/follow/index.ts
const app = getApp<IAppOption>()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: [
      { text: '设备链接', value: 0 },
      { text: '好评排序', value: 1 },
      { text: '销量排序', value: 2 },
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
    songId: 0,

    processedArray: [],
    processedIndex: 0,
    deviceIndex: 0,
    timeElapsed: 0,
    song_name: "旅行的意义",
    shan: 0,
    containerHeight: 0,
    maxScrollTop: 0,
    isover: false,
    currentIndex: 0,
    timer: 0,
    isScroll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.getlyrics(options.id, options.name)
    // const id = JSON.parse(decodeURIComponent(options.id));
    // this.startLyricsScroll();
    wx.onBLECharacteristicValueChange((res) => {
      // console.log('BLE 特征值变化：', res);
      let u8Buf = this.hexStringToUint8Array(this.ab2hex(res.value))
      // 处理蓝牙特征值变化的逻辑
      switch (u8Buf[0]) {
        case 0x11:
          console.log("dev trig"); // 设备按正确组合后发送
          if (that.data.processedArray.length >= that.data.highlightIndex + 1) {
            let newprocessedIndex = that.data.processedIndex;
            const currentLyric = that.data.lyrics[that.data.highlightIndex];
            let currentIndex = 0;
            let includesNum = 0;
            if (that.data.processedArray[that.data.highlightIndex].length === newprocessedIndex) {
              includesNum = that.data.processedArray[that.data.highlightIndex + 1][0][1];
              currentIndex = currentLyric.original.indexOf(that.data.processedArray[that.data.highlightIndex + 1][0])
              that.setData({
                currentTime: that.data.lyrics[that.data.highlightIndex + 1].time,
                shan: includesNum
              }, () => {
                that.updateLyricsHighlight();
              })

            } else {
              includesNum = that.data.processedArray[that.data.highlightIndex][newprocessedIndex][1];
              currentIndex = currentLyric.original.indexOf(that.data.processedArray[that.data.highlightIndex][newprocessedIndex])
            }

            that.setData({
              currentIndex: currentIndex,
              processedIndex: newprocessedIndex + 1,
              includesNum: includesNum
            })
            console.log("send:", includesNum)
            that.send(includesNum);

          }
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
    let pArray = []
    const formatted = this.data.lyrics.map((line) => {
      let formattedLine = [];
      let regex = /[#].{2}|_(\d+)|([^#_]+)/g;
      let matches = line.text.match(regex);
      if (matches) {
        console.log(matches)
        let processedItem = [];
        let index = 0;
        matches.forEach((match) => {
          let num = match.slice(1)[0];


          if (match.startsWith('#')) {
            index += 1
            processedItem.push(match)
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { class: 'superscript' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { class: `hasbgtext bgNum-${num} active-${index}` }, children: [{ type: 'text', text: match.slice(1)[1] }] }
              ]
            });
          } else if (match.startsWith('_')) {
            index += 1
            processedItem.push(match)
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { class: 'superscript' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { class: `notext bgNum-${num} active-${index}` }, children: [{ type: 'text', text: ' ' }] }
              ]
            });
          } else {
            formattedLine.push({ type: 'text', text: match });
          }
        });
        pArray.push(processedItem)
      }
      line.original = line.text;
      line.text = [{ name: 'div', attrs: { style: 'display:flex;margin-top:30px;justify-content: center;flex-wrap: wrap;' }, children: formattedLine }];

      return line
    });
    this.setData({
      processedArray: pArray,
      formattedLyrics: formatted,
    });
  },
  // 开始歌词滚动的定时器
  startLyricsScroll() {
    const that = this;
    const totalDuration = that.data.lyrics[that.data.lyrics.length - 1].time + 6; // 获取歌词总时长
    // console.log(totalDuration)
    clearInterval(this.data.timer)
    this.data.timer = setInterval(() => {
      if (that.data.currentTime >= totalDuration || that.data.isPaused) {
        clearInterval(that.data.timer); // 停止定时器
        that.data.timer = 0;
        // console.log("currentTime: ", that.data.currentTime);
        // console.log("totalDuration: ", totalDuration);
        if (that.data.currentTime >= totalDuration && !that.data.isover) {
          that.setData({ isover: true });
          setTimeout(() => {
            that.over()
          }, 500)

        }
        return;
      }
      console.log("currentTime", that.data.currentTime)
      // 更新当前时间


      // 获取当前歌词行和它的播放时间
      const currentLyric = that.data.lyrics[that.data.highlightIndex];
      console.log("currentLyric", currentLyric)
      // 获取当前行歌词文本，按空格分割成词
      const words = currentLyric.original.split('');
      console.log("countSpecialChars", words)
      // 计算每个词的播放时间，假设每个词的播放时间均匀分配
      const lineDuration = that.data.lyrics[that.data.highlightIndex + 1]?.time - currentLyric.time || totalDuration - currentLyric.time;
      const wordDuration = lineDuration / words.length; // 每个词的播放时间
      that.setData({
        currentTime: that.data.currentTime + wordDuration,
      });
      // 遍历当前行的每个词，判断当前时间是否达到该词的播放时间，并检查是否包含 '#' 或 '_'
      let timeElapsed = that.data.timeElapsed; // 累计时间，表示已播放的时间
      let processedIndex = that.data.processedIndex;

      if (that.data.currentIndex < words.length) {
        // 如果当前时间接近该词的播放时间并且词中包含 '#' 或 '_'
        if ((words[that.data.currentIndex].includes('#') || words[that.data.currentIndex].includes('_'))
          && that.data.processedArray[that.data.highlightIndex].length >= that.data.processedIndex) {
          clearInterval(that.data.timer); // 暂停播放
          that.data.timer = 0
          that.setData({ isPaused: true }, () => {
            let includesNum = 0 //that.data.processedArray[that.data.highlightIndex][that.data.processedIndex][1];
            if (that.data.processedArray[that.data.highlightIndex].length > that.data.processedIndex) {
              includesNum = that.data.processedArray[that.data.highlightIndex][that.data.processedIndex][1]
            } else if (that.data.processedArray[that.data.highlightIndex].length === that.data.processedIndex) {
              includesNum = that.data.processedArray[that.data.highlightIndex][that.data.processedIndex - 1][1]
            }
            if (that.data.highlightIndex === 0 && that.data.processedIndex === 0 || this.data.isScroll) {

              if (this.data.isScroll) {
                const scrollNum = that.data.processedArray[that.data.highlightIndex][that.data.processedIndex - 1][1];

                console.log("Send：", scrollNum)
                that.send(scrollNum);
              }
              console.log("Send：", includesNum)
              that.send(includesNum);
              // that.setData({
              //   deviceIndex : that.data.deviceIndex + 1
              // })
              let nowIndex = processedIndex + 1

              that.setData({
                processedIndex: nowIndex,
                isScroll: false
              })
            }

            // console.log("nowIndex", nowIndex);
            that.setData({
              shan: includesNum
            })
          });
        }

        this.setData({
          timeElapsed,
          currentLyric,
          currentIndex: that.data.currentIndex + 1
        })
      }

      // 更新歌词高亮和滚动位置
      this.updateLyricsHighlight();
    }, 1000);
  },

  // 更新歌词高亮
  updateLyricsHighlight() {
    const currentTime = this.data.currentTime;
    let highlightIndex = this.data.lyrics.findIndex((item) => item.time <= currentTime && (this.data.lyrics[this.data.lyrics.indexOf(item) + 1] ? this.data.lyrics[this.data.lyrics.indexOf(item) + 1].time > currentTime : true));

    if (highlightIndex !== -1 && highlightIndex !== this.data.highlightIndex) {
      this.setData({
        highlightIndex,
        processedIndex: 1,
        currentIndex: 0
      });
      console.log("highlightIndex", highlightIndex)
      const average = Math.round(this.data.maxScrollTop / this.data.lyrics.length)
      // 计算 scrollTop 使高亮歌词居中
      const scrollTop = Math.round(average * highlightIndex)
      console.log(scrollTop)
      this.setData({
        scrollTop, // 设置 scrollTop
      });
    }
  },

  // 切换播放和暂停状态
  togglePlayback() {
    const that = this;

    if (that.data.processedArray.length >= that.data.highlightIndex + 1) {
      let newprocessedIndex = that.data.processedIndex;
      const currentLyric = that.data.lyrics[that.data.highlightIndex];
      let currentIndex = 0;
      let includesNum = 0;
      if (that.data.processedArray[that.data.highlightIndex].length === newprocessedIndex) {
        includesNum = that.data.processedArray[that.data.highlightIndex + 1][0][1];
        currentIndex = currentLyric.original.indexOf(that.data.processedArray[that.data.highlightIndex + 1][0])
        that.setData({
          currentTime: that.data.lyrics[that.data.highlightIndex + 1].time,
          shan: includesNum
        }, () => {
          that.updateLyricsHighlight();
        })

      } else {
        includesNum = that.data.processedArray[that.data.highlightIndex][newprocessedIndex][1];
        currentIndex = currentLyric.original.indexOf(that.data.processedArray[that.data.highlightIndex][newprocessedIndex])
      }

      that.setData({
        currentIndex: currentIndex,
        processedIndex: newprocessedIndex + 1,
        includesNum: includesNum
      })
      console.log("send:", includesNum)
      that.send(includesNum);

    }

    if (this.data.isPaused) {
      this.setData({ isPaused: false });
      this.startLyricsScroll(); // 继续播放
    } else {
      this.setData({ isPaused: true }, () => {
        clearInterval(this.data.timer); // 暂停播放
      });

    }
  },

  //**
  //* 
  //* @param music_id  歌词id
  //* @param hexian_id  和弦id
  //* @param geci 歌词字符串
  //
  send(hexian_id: number, geci?: string) {
    console.log("songId", this.data.songId)
    let device_id = app.globalData.device_id
    let service_id = app.globalData.service_id;
    let char_id = app.globalData.char_id;
    if (!device_id || !service_id || !char_id) {
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
      serviceId: service_id,
      characteristicId: char_id,
      value: sendBuf.buffer,
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

  getlyrics(id, name) {
    wx.request({
      url: 'https://www.axiarz.com/api/lyrics/find_lyrics_by_song_id/' + id,
      method: 'GET',
      success: (res) => {
        this.setData({
          songId: res.data.data.song_id,
          song_name: name
        })
        this.lyricsToArray(res.data.data.lyric);

        setTimeout(() => {
          this.extractTime(); // 提取时间并存储
          this.formatLyrics();
          this.startLyricsScroll();
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
  onLyricTap(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ highlightIndex: index });
  },

  touchstart(event) {
    this.setData({
      isScroll: true,
      isPaused: true
    });
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: 0
      })
    }
  },

  touchend(event) {
    if (this.data.timer !== 0) return;
    this.setData({
      isPaused: false,
      processedIndex: 0,
      currentIndex: 0
    }, () => {
      this.startLyricsScroll();
    })

  },

  onScroll(event) {
    const scrollTop = event.detail.scrollTop;
    console.log("scrollTop", scrollTop)

    const index = Math.round(scrollTop / 70);
    if (index >= 0 && index < this.data.lyrics.length) {

      const time = index == 0 ? 0 : this.data.lyrics[index].time;

      // setTimeout(() => {
      this.setData({
        currentTime: time,
        // highlightIndex: index,
        // processedIndex: 1,
        // isPaused: false,
      })
      // }, 500)

    }
    // const average = this.data.maxScrollTop / this.data.lyrics.length;

    // const index = Math.round(scrollTop / average);
    // if (index >= 0 && index < this.data.lyrics.length) {
    //   const time = index == 0 ? 0 : this.data.lyrics[index].time;
    //   this.setData({
    //     currentTime: time,
    //     highlightIndex: index,
    //     processedIndex: 1,
    //     isPaused: false,
    //     // scrollTop: scrollTo
    //   }, () => {
    //     setTimeout(() => {
    //       this.startLyricsScroll(); // 继续播放
    //     }, 500)
    //   });
    // }
  },

  over() {
    console.log("isover", this.data.isover)
    if (!this.data.isover) {
      let device_id = app.globalData.device_id
      let service_id = app.globalData.service_id;
      let char_id = app.globalData.char_id;
      if (!device_id || !service_id || !char_id) {
        console.error("error:require deviceid");
        return;
      }

      const sendBuf = new Uint8Array(3);
      sendBuf[0] = 0x30;
      sendBuf[1] = 0;
      sendBuf[2] = 0;
      // TODO: 将歌词转换成utf8编码数组， 这个需求20250119不搞

      wx.writeBLECharacteristicValue({
        deviceId: device_id,
        serviceId: service_id,
        characteristicId: char_id,
        value: sendBuf.buffer,
        success(res) {
          console.log("writeBLECharacteristicValue success", res.errMsg);
        },
      });

      this.setData({
        isover: true,
        isPaused: true
      })
      clearInterval(this.data.timer);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.measureScrollViewHeight()
  },

  measureScrollViewHeight() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.lyrics-container') // 选择 class 为 'lyrics-container' 的元素
      .boundingClientRect(rect => {
        // 容器高度
        const containerHeight = rect.height;
        // 內容高度
        const contentHeight = 70 * this.data.lyrics.length;
        console.log("內容高度 ", contentHeight)
        // 计算最大 scrollTop
        const maxScrollTop = Math.max(contentHeight - containerHeight, 0);
        console.log("计算最大scrollTop ", maxScrollTop)
        this.setData({
          containerHeight: containerHeight,
          maxScrollTop: maxScrollTop
        });



      }).exec();
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
    this.over()
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