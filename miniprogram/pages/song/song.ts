// pages/song/song.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前选中的分类和榜单
    selectedFilter: 'ALL',
    selectedTab: 'hot',
    // 歌曲列表数据
    songs: [
      { id: 1, title: '旅行的意义', artist: '陈绮贞', isFavorite: false },
      { id: 2, title: '红色高跟鞋', artist: '蔡健雅', isFavorite: false },
      { id: 3, title: '小宇', artist: '张震岳', isFavorite: false },
      { id: 4, title: 'You belong with me', artist: 'Taylor Swift', isFavorite: false },
      { id: 5, title: '体面', artist: '于文文', isFavorite: false },
    ],
    songTypes: []
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
    this.getTabBar().setData({ active: 1 })
    this.getSongType();
    this.getSongs()
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

  // 切换分类
  onFilterSwitch(e) {
    const selectedFilter = e.currentTarget.dataset.filter;
    this.setData({ selectedFilter });
  },

  // 切换热门榜或最新榜
  onTabSwitch(e) {
    const selectedTab = e.currentTarget.dataset.tab;
    this.setData({ selectedTab });
  },

  // 搜索输入
  onSearchInput(e) {
    const query = e.detail.value;
    console.log(`搜索内容：${query}`);
    // 在此添加搜索逻辑
  },

  // 收藏或取消收藏
  toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const songs = this.data.songs.map((song) => {
      if (song.id === id) {
        song.isFavorite = !song.isFavorite;
      }
      return song;
    });
    this.setData({ songs });
  },

  gotofollow(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/follow/index?id=" + id
    })
  },

  getSongType() {
    wx.request({
      url: "https://www.axiarz.com/api/song_type",
      method: "GET",
      success: (res) => {
        console.log(res)
        this.setData({
          songTypes: res.data.data
        })
      }
    })
  },

  getSongs() {
    wx.request({
      url: "https://www.axiarz.com/api/song",
      method: "GET",
      success: (res) => {
        console.log(res)
        this.setData({
          songs:res.data.data
        })
      }
    })
  }
})