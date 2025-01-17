// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Component({
  data: {
    option: [
      { text: '設備連接', value: 0 },
      { text: '好評排序', value: 1 },
      { text: '銷量排序', value: 2 },
    ],
    value: 0,
    battery: 45, // 电量
    volume: 50, // 音量
  },
  methods: {
    
  },
})
