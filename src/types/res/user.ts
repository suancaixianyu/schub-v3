/** 全局 */
export interface userInfoType {
  /** mod列表 */
  global_mod_data_list: {
    /** 版本列表 */
    game_version: any
    /** api列表 */
    api_version: any
    /** 关系列表 */
    relate_type: any
    /** 链接类型列表 */
    link_type: any
    /** 标签列表 */
    flag_list: any
    /** 服务器版本列表 */
    server_version_list: any
  }
  /** 全局角色列表 */
  role_list: any[]
  /** 板块列表 */
  cate_list: {
    /** 板块id */
    id: number
    /** 板块名称 */
    name: string
    /** 帖子数 */
    stat: number
    /** 板块介绍 */
    introduce: string
  }[]
  /** 用户ID */
  id?: string
  /** 状态 */
  state: {
    /** 未读消息数 */
    unreadMessage: number
    /** 是否已登录 */
    isLogin: boolean
  }
  /** 用户信息 */
  data: {
    /** uid */
    id: number
    /** 昵称 */
    nickname: string
    /** 邮箱 */
    account: string
    /** 头像链接 */
    headurl: string
    /** 注册时间 */
    reg_time: number
    /** 最后登录时间 */
    last_login_time: number
    /** 签名 */
    signature: string
    /** 头衔 */
    role: any
    /** 是否为管理员 */
    isAdmin: boolean
    /** 背景图 */
    background: string
  }
}

export interface getUserInfoType {
  /** uid */
  id: number
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  account: string
  /** 头像链接 */
  headurl: string
  /** 注册时间 */
  reg_time: number
  /** 最后登录时间 */
  last_login_time: number
  /** 签名 */
  signature: string
  /** 头衔 */
  role: any
  /** 背景图 */
  background: string
}

/** 板块类型 */
export interface cateList {
  /** 板块id */
  id: number
  /** 板块名称 */
  name: string
  /** 发表数量 */
  interaction: number
  /** 板块介绍 */
  introduce: string
  /** 帖子数量 */
  postnum: number
  /** 板块状态 */
  stat: number
}

/** api返回标准 */
export interface api {
  /** 状态码 */
  code: number
  /** 返回消息 */
  msg: string
  /** 返回数据 */
  data: any
  /** 数量 */
  sum?: {
    total: number
  }
}
