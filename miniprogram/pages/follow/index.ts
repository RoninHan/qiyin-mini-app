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
    lyrics: [
      { time: 0, text: '总有些惊奇的际遇' },
      { time: 15.6, text: '比方说当我遇见你' },
      { time: 20.8, text: '你那双温柔剔透的眼睛' },
      { time: 28.6, text: '出现在我梦里' },
      { time: 31.2, text: '我的爱就像一片云' },
      { time: 36.4, text: '在你的天空无处停' },
      { time: 41.6, text: '多渴望化成阵阵的小雨' },
      { time: 48.1, text: '滋润你心中的土地' },
      { time: 53.3, text: '不管未来会怎么样' },
      { time: 58.5, text: '至少我们现在很开心' },
      { time: 63.7, text: '不管结局会怎么样' },
      { time: 68.9, text: '至少想念的人是你' },
      // 继续填写其他歌词...
    ],
    scrollTop: 0, // 控制歌词滚动的位置
    currentTime: 0, // 当前时间（模拟）
    highlightIndex: 0, // 当前高亮歌词的索引

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = JSON.parse(decodeURIComponent(options.id));
    this.startLyricsScroll();
  },

  startLyricsScroll() {
    // 每秒更新一次当前时间
    setInterval(() => {
      this.setData({
        currentTime: this.data.currentTime + 1,
      });
      console.log(this.data.currentTime)
      this.updateLyricsHighlight();
    }, 1000);
  },

  // 更新歌词高亮和滚动位置
  updateLyricsHighlight() {
    const currentTime = this.data.currentTime;
    let highlightIndex = this.data.lyrics.findIndex((item) => item.time <= currentTime && (this.data.lyrics[this.data.lyrics.indexOf(item) + 1] ? this.data.lyrics[this.data.lyrics.indexOf(item) + 1].time > currentTime : true));

    if (highlightIndex !== -1) {
      const scrollTop = highlightIndex * 30; // 每行歌词的高度为30px（可根据需要调整）
      this.setData({
        highlightIndex,
        scrollTop,
      });
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