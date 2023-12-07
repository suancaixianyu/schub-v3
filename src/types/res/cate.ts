/**
 * 发帖者信息
 */
export interface Author {
  headurl: string //头像地址
  nickname: string //昵称
  role: string //角色列表
}
/**
 * 帖子列表单项
 */
export interface BbsItem {
  id: number //帖子id
  title: string //帖子标题
  summary: string //全部帖子内容
  author: Author //用户信息
  cover: string //帖子封面
  time: number //发帖时间戳
  likes: number //点赞数
  comments: number //评论数
}

/** 帖子详情 */
export interface viewBbsItem {
  id: number
  cate_id: number
  uid: number
  title: string
  summary: string
  cover: string
  time: string
  likes: string
  dislikes: string
  comments: string
  views: string
  like: string
  author: {
    nickname: string
    headurl: string
    role: string | null
  }
}

/** 帖子详情 */
export interface replyOne {
  id: number
  uid: number
  likes: string
  dislikes: string
  time: string
  content: string
  total: number
  children: replyTwo[]
  like: number
  author: {
    nickname: string
    headurl: string
    role: string | null
  }
}

export interface replyTwo {
  id: number
  uid: number
  time: string
  content: string
  to_author: {
    nickname: string
    headurl: string
    role: string | null
  } | null
  children: any[]
  author: {
    nickname: string
    headurl: string
    role: string | null
  }
}
