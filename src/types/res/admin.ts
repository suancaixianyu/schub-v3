export interface memberItem {
  id: number
  account: string
  nickname: string
  reg_time: number
  last_login_time: number
  last_login_ip: string
  money: number
  stat: number
  email: string
  role_list: string
}
export interface roleItem {
  id: number
  /** 头衔名称 **/
  name: string
  stat: number
  /** 参考el-tag的color属性 **/
  color: string
  /** 参考el-tag的type属性 **/
  type: string
  /** 参考el-tag的effect属性 **/
  effect: string
}
export interface modItem {
  /** 资源id */
  id: number
  /** 用户uid */
  uid: 4
  /** 资源名称 */
  name: string
  /** 资源简介 */
  description: string
  /** 资源包名 */
  package_id: string
  /** 资源封面 */
  cover_src: string
  /** 发布时间 */
  create_time: number | string
  /** 最后修改时间 */
  last_modify_time: number | string
  /** 浏览量 */
  views: number | string
  /** 资源状态 */
  stat: number
  /** 点赞数 */
  likes: number | string
  /** 下载次数 */
  downloads: number | string
  /** 英文名称 */
  en_name: string
  /** 简称 */
  mini_name: string
  rate: number
  /** 封禁原因 */
  reason: null
  create_time_str: string
  flag_list: string
  flag_list_arr: string[]
  stat_data: {
    /** 状态名称 */
    name: string
    /** 状态类型 */
    type: string
  }
}
export interface bbsItem {
  id: number
  cate_id: number
  uid: number
  title: string
  summary: string
  cover: string
  time: number
  likes: number
  dislikes: number
  comments: number
  views: number
  like: number
  author: {
    nickname: string
    headurl: string
    role: string | null
  }
}
export interface siteConfig {
  id: number
  name: string
  value: string
  comments: string
}
export interface siteSaveConfig {
  id: number
  value: string
}
export interface res {
  code: number
  msg: string
  data: any
  sum: number
}
export interface serverInfo {
  member: number
  bbs: number
  mod: number
}
export interface cateItem {
  id: number
  name: string
  stat: number
  introduce: string
}
export interface versionItem {
  id: number
  name: string
  version: string
  operate: number
  type: number
}
