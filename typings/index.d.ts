/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    device_id:string,
    service_id:string,
    char_id:string,
    is_android:boolean
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}