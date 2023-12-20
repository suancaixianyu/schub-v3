import { reactive } from 'vue'
import type { cateIcon, setupType, userInfoType } from '../types'
import { localGet } from '@/lib'

let userInfo: userInfoType = reactive({
  global_mod_data_list: {
    game_version: [],
    api_version: [],
    relate_type: [],
    link_type: [],
    flag_list: [],
    server_version_list: [],
  },
  cate_list: {},
  role_list: [],
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
let setup: setupType
const setupdata = await localGet('setup', {})
console.log(setupdata)
if (setupdata.lang) {
  setup = reactive(setupdata)
} else {
  setup = reactive({
    /** 是否显示导航栏 */
    showNavigation: true,
    /** 是否为暗色主题 */
    currentSkin: false,
    /** 自己视角下是否显示签名 */
    showSignature: true,
    /** 语言 */
    lang: 'zh-CN',
  })
}
export { setup }

/** 设置userInfo */
export const setUserInfo = (data: any) => (userInfo = data)
export { userInfo }
export const config = {
  /** 后端服务器地址 */
  // server: 'https://m.schub.top',
  server: 'http://localhost:28887',
}

export const cateicon: cateIcon = {
  '0': '&#xe8cf;',
  '5': '&#xe613;',
  '6': '&#xe654;',
  '7': '&#xe62e;',
  '8': '&#xe65c;',
  '9': '&#xe601;',
}
