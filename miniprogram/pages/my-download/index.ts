// pages/my-download/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [
      { name: '歌曲1' },
      { name: '歌曲2' },
      { name: '歌曲3' },
      { name: '歌曲4' },
      { name: '歌曲5' },
      { name: '歌曲6' },
    ],
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

  },

  // 删除歌曲逻辑
  deleteSong(e) {
    const index = e.currentTarget.dataset.index; // 获取当前点击的歌曲索引
    const updatedSongs = this.data.songs.filter((_, i) => i !== index); // 过滤掉删除的歌曲
    this.setData({
      songs: updatedSongs, // 更新数据
    });
    wx.showToast({
      title: '删除成功',
      icon: 'success',
    });
  },
})