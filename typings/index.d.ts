/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    device_id:string

  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}