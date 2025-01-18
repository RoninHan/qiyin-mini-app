// pages/me/me.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '喵喵喵',
    description: '纯粹热爱音乐！',
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
    this.getTabBar().setData({ active: 3 })
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

  // 跳转到对应功能页面
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url: url });
  },

  // 跳转到设置选项
  onSettingOption(e) {
    const option = e.currentTarget.dataset.option;
    switch (option) {
      case 'download':
        wx.navigateTo({ url: '/pages/download/download' });
        break;
      case 'update':
        wx.navigateTo({ url: '/pages/update/update' });
        break;
      case 'clear':
        wx.showToast({ title: '缓存已清理', icon: 'success' });
        break;
      case 'tutorial':
        wx.navigateTo({ url: '/pages/tutorial/tutorial' });
        break;
    }
  }
})