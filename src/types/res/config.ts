import { userInfoType } from './user'
export interface setType {
  /** 是否显示抽屉菜单 */
  menu: boolean
  /** 头像形状 */
  shape: string
  /** 是否为移动端 */
  ismobile: boolean
  /** 是否显示顶部导航栏 */
  showheader: boolean
}

export interface config {
  config: {
    /** 后端服务器地址 */
    server: string
    /** 前端地址 */
    view: string
    /** 后端验证地址 */
    captchaserver: string
  }

  /** 全局样式 */
  webstyle: { [key: string]: { [key: string]: string } }
  /** 用户信息 */
  userInfo: userInfoType
  /** 设置 */
  set: setType

  /** 用户头像大小 */
  headsize: {
    /** 帖子显示大小 */
    post: number
    /** 个人中心显示大小 */
    userindex: number
  }
  container: {
    padding: string
    margin: string
  }
  maincontainer: { [key: string]: string }
  postliststyle: { [key: string]: string }
  /** 网页其他缓存 */
  webpublic: {
    /** 当前编辑的帖子所在的板块id */
    active_cate_id: number
  }
}

/** 板块列表字体图标 */
export interface cateIcon {
  [key: string]: string
}

export interface Pools {
  [key: string]: any
}

/** 帖子列表缓存 */
export interface postList {
  [key: string]: {
    list: any[]
    num: number
  }
}
