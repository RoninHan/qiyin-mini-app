Component({
	data: {
		active: 0,
		list: [
			{
        icon: '/public/tabbar/guitar.svg',
        action_icon:"/public/tabbar/guitar-active.svg",
				url: '/pages/index/index'
			},
			{
        icon: '/public/tabbar/personal.svg',
        action_icon:"/public/tabbar/music-active.svg",
				url: '/pages/song/song'
      },
      {
        icon: '/public/tabbar/music.svg',
        action_icon:"/public/tabbar/personal-active.svg",
				url: '/pages/ai/ai'
      },
      {
        icon: '/public/tabbar/music.svg',
        action_icon:"/public/tabbar/personal-active.svg",
				url: '/pages/me/me'
      }
      
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
