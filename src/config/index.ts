import { reactive } from 'vue'
import type { cateIcon, userInfoType } from '../types'

let userInfo: userInfoType = reactive({
  global_mod_data_list: {
    game_version: [],
    api_version: [],
    relate_type: [],
    link_type: [],
    flag_list: [],
    server_version_list: [],
  },
  role_list: [],
  cate_list: [],
  state: {
    unreadMessage: 0,
    isLogin: false,
  },
  data: {
    id: 0,
    nickname: '尚未登录',
    account: '',
    headurl: '',
    reg_time: 0,
    last_login_time: 0,
    signature: '',
    role: '',
    isAdmin: false,
    background: '',
  },
})

/** 页面中各种状态 */
export const setup = reactive({
  /** 是否显示导航栏 */
  showNavigation: true,
  /** 是否为暗色主题 */
  currentSkin: false,
})

/** 设置userInfo */
export const setUserInfo = (data: any) => (userInfo = data)
export { userInfo }
export const config = {
  /** 后端服务器地址 */
  server: 'https://m.schub.top',
  lang: 'zh-CN',
}

export const cateicon: cateIcon = {
  '0': '&#xe8cf;',
  '5': '&#xe613;',
  '6': '&#xe654;',
  '7': '&#xe62e;',
  '8': '&#xe65c;',
  '9': '&#xe601;',
}
