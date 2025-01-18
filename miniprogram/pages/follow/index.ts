// pages/follow/index.ts
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
    // lyrics: [
    //   { time: 0, text: '总有些惊奇的际遇', highlight: false },
    //   { time: 15.6, text: '比方说当我遇见你', highlight: false },
    //   { time: 20.8, text: '你那双温柔剔透的眼睛', highlight: false },
    //   { time: 28.6, text: '出现在我梦里', highlight: false },
    //   { time: 31.2, text: '我的爱就像一片云', highlight: false },
    //   { time: 36.4, text: '在你的天空无处停', highlight: false },
    //   { time: 41.6, text: '多渴望化成阵阵的小雨', highlight: false },
    //   { time: 48.1, text: '滋润你心中的土地', highlight: false },
    //   { time: 53.3, text: '不管未来会怎么样', highlight: false },
    //   { time: 58.5, text: '至少我们现在很开心', highlight: false },
    //   { time: 63.7, text: '不管结局会怎么样', highlight: false },
    //   { time: 68.9, text: '至少想念的人是你', highlight: false },
    //   // 继续填写其他歌词...
    // ],
    lyrics: [
      '[00:00.00]总有些#9惊奇的_6际遇',
      '[00:15.60]比方说#9当我遇_6见你',
      '[00:20.80]你那双#9温柔剔_6透的_2眼睛_5',
      '[00:28.60]出现在_9我梦里',
      '[00:31.20]我的爱#9就像一_6片云',
      '[00:36.40]在你的#9天空无_6处停',
      '[00:41.60]多渴望#9化成阵_6阵的_2小雨',
      '[00:48.10]滋润#9你心中的_6土地_1',
      '[00:53.30]不管_1未来_7会怎_2么样',
      '[00:58.50]至少_9我们现在_6很开心_1',
      '[01:03.70]不管_1结局_7会怎_2么样',
      '[01:08.90]至少_9想念的人_9是你_6',
      // 继续填写其他歌词...
    ],
    formattedLyrics: [],
    scrollTop: 0, // 控制歌词滚动的位置
    currentTime: 0, // 当前时间（模拟）
    highlightIndex: 0, // 当前高亮歌词的索引
    isPaused: false, // 播放暂停状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // const id = JSON.parse(decodeURIComponent(options.id));
    // this.startLyricsScroll();
    this.extractTime(); // 提取时间并存储
    this.formatLyrics();
    this.startLyricsScroll();

    this.scrollToFirstLine();
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
          if (match.startsWith('#')) {
            console.log(match.slice(1)[0])
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { style: 'position: absolute;bottom:30px;width:30px;height:30px;text-align: center;' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { style: 'width:30px;height:30px;background:#FFBD5A;border-radius:4px;color:#fff;display:flex;align-items: center;justify-content: center;' }, children: [{ type: 'text', text: match.slice(1)[1] }] }
              ]
            });
          } else if (match.startsWith('_')) {
            formattedLine.push({
              name: 'div', attrs: { style: 'position: relative;margin-left:3px;margin-right:3px;' }, children: [
                { name: 'div', attrs: { style: 'position: absolute;bottom:30px;width:30px;height:30px;text-align: center;' }, children: [{ type: 'text', text: match.slice(1)[0] }] },
                { name: 'div', attrs: { style: 'width:30px;height:30px;background:#FFBD5A;border-radius:4px;color:#fff;display:flex;align-items: center;justify-content: center;' }, children: [{ type: 'text', text: ' ' }] }
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
    console.log(formatted)
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
          this.setData({ isPaused: true }); // 如果遇到包含 '#' 或 '_' 的词，暂停播放
          clearInterval(this.timer); // 清除定时器
          console.log(timeElapsed)
          console.log("暂停播放")
          break; // 退出循环
        }
      }

      // 更新歌词高亮和滚动位置
      this.updateLyricsHighlight();
    }, 1000);
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