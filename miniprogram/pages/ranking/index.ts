// pages/ranking/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 89, // Percentage for progress circle
    friendRank: 4, // Friend ranking
    globalRank: 33599, // Global ranking
    rankings: [
      { name: "小月", avatar: "https://example.com/avatar1.jpg", score: "99.99W" },
      { name: "走过海榭暮", avatar: "https://example.com/avatar2.jpg", score: "31.56W" },
      { name: "这是你的名字", avatar: "https://example.com/avatar3.jpg", score: "10.50W" },
    ],
    footerInfo: "距离上一名50名", // Footer info message
    activeTab: 'friend', 
    option: [
      { text: '設備連接', value: 0 },
      { text: '好評排序', value: 1 },
      { text: '銷量排序', value: 2 },
    ],
    value: 0,
  },

  toggleTab(event) {
    const type = event.currentTarget.dataset.type;
    this.setData({
      activeTab: type,
    });
    // Add logic to change rankings based on the active tab
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  }
})