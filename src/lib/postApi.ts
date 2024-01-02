import axios from 'axios'
import * as Cfg from '../config'
import { ElMessage } from 'element-plus'
import { getHostUrl, formatBbsTime, getNumber, localSet, formatNormalTime, decode } from './tools'
import { api, bbsItem, cateList, getUserInfoType, viewBbsItem } from '@/types'
import { api_get, getInformation } from './getApi'
import { userInfo } from '../config'

//开启cookie携带
axios.defaults.withCredentials = true

/**
 * post方法请求api
 * @param {string} path 请求路径
 * @param {object} data 请求体
 */
export function api_post(path: string, data = {}) {
  return axios.post(`${Cfg.config.server}${path}`, data)
}

/**
 * @param file 文件
 * @param isUploadUrl 是否为上传输入框中的图片
 * @param callback 回调方法
 */
export async function UploadImage(file: any, isUploadUrl: boolean = false) {
  ElMessage('上传中...')
  // 执行图片上传的逻辑
  const formData = new FormData()
  let url = ''
  formData.append('file', file[0], file[0].name)
  return api_post(`/Upload/Upload`, formData)
    .then((response) => {
      let obj = response.data
      if (obj.code == 200) {
        ElMessage({
          type: 'success',
          message: '上传成功',
        })
        if (isUploadUrl) {
          url = getHostUrl(obj.data.src)
        } else {
          url = `![](${getHostUrl(obj.data.src)})`
        }
        return url
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '上传失败',
      })
      return url
    })
}

/**
 * 获取板块中的帖子列表
 * @param id 板块id
 * @param body 查询参数
 */
export async function getBbsList(id: string, body: { limit: number; page: number }) {
  let data = await api_post(`/bbs/list/${id}`, body)
    .then((res) => {
      if (res.data.code != 200) return
      const data = res.data.data as bbsItem[]
      console.log('postdata', res.data)
      let num = Math.ceil(res.data.num / body.limit)

      let list = [] as viewBbsItem[]
      data.forEach((el) => {
        let item: any = el
        item.time = formatBbsTime(el.time)
        item.likes = getNumber(el.likes)
        item.dislikes = getNumber(el.dislikes)
        item.comments = getNumber(el.comments)
        item.views = getNumber(el.views)
        item.like = getNumber(el.like)
        item.author.headurl = getHostUrl(el.author.headurl)
        item.cover = getHostUrl(el.cover)
        list.push(item)
      })
      return { list, num }
    })
    .catch((err) => {
      console.log(err)
      ElMessage({
        type: 'error',
        message: '获取帖子列表出错',
      })
    })
  return { ...data }
}

/**
 * 退出登录
 */
export async function loginOut() {
  api_post('/user/loginOut')
    .then((res: any) => {
      if (res.data.code == 200) {
        ElMessage({
          type: 'success',
          message: res.data.msg,
        })
        userInfo.state.isLogin = false
        userInfo.data = {
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
        }
      }
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message: error,
      })
    })
}

/**
 * 登录和注册
 * @param url 登录或注册地址
 * @param body 请求参数
 * @param remember 是否记住账号
 */
export async function login(url: string, body: any, remember = false) {
  let res = await api_post(url, body)
  let obj = res.data
  if (obj.code == 200) {
    if (url == '/user/login') {
      api_post('/user/info').then((response2: any) => {
        if (response2.data.code == 200) {
          if (remember) {
            localSet('loginInfo', {
              user: body.user,
              pass: body.pass,
              remember: remember,
            })
          }
          userInfo.state.isLogin = true
          response2.data.data.headurl = getHostUrl(response2.data.data.headurl)
          userInfo.data = response2.data.data
          getInformation()
        }
      })
    }
    ElMessage({
      message: obj.msg,
      type: 'success',
    })
    return false
  } else {
    ElMessage({
      message: obj.msg,
      type: 'error',
    })
  }
  return true
}

/**
 * 回复帖子
 * @param url api
 * @param body 请求体
 */
export async function replyComment(url: string, body: object) {
  let res = await api_post(url, body)
  let data = res.data as api
  if (data.code == 200) {
    return true
  }
  return false
}

/**
 * 删除回复（管理员）
 * @param id 回复id
 */
export async function del_reply(id: number) {
  let res = await api_post('/bbs/reply_del', { id })
  let data = res.data as api
  if (data.code == 200) {
    return true
  }
  return false
}

/**
 * 删除指定帖子（管理员可用）
 * @param id 帖子id
 */
export async function del_bbs(id: number) {
  let res
  if (userInfo.data.isAdmin) {
    res = await api_post('/admin/lock_item', { type: 2, stat: 0, id })
  } else {
    res = await api_post('/bbs/del', { id })
  }
  let data = res.data as api
  if (data.code == 200) {
    return true
  }
  return false
}

/**
 * 设置用户头像
 * @param e 请求结果
 */
export async function setAvatar(e: any) {
  api_post('/user/edit', { avatar: e.data.src })
    .then((res) => {
      let obj = res.data as api
      if (obj.code == 200) {
        ElMessage({
          type: 'success',
          message: obj.msg,
        })
        getInformation()
      } else {
        ElMessage({
          type: 'error',
          message: obj.msg,
        })
      }
    })
    .catch((err) => {
      ElMessage({
        type: 'error',
        message: '请求错误：' + err.message,
      })
    })
}

/**
 * 获取板块列表
 */
export async function getcate() {
  let { userInfo } = Cfg
  return await api_post('/cate/list')
    .then((response) => {
      let res: api = response.data
      if (res.code == 200) {
        for (const x of res.data) {
          userInfo.cate_list[x.id] = x.name
        }
        return res.data as cateList[]
      } else {
        ElMessage({
          type: 'error',
          message: res.msg,
        })
        return null
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '获取板块列表出错',
      })
      return null
    })
}

/**
 * 获取帖子详情
 * @param id 帖子id
 */
export async function getBbs(id: number) {
  return await api_post(`/bbs/item/${id}`).then((res) => {
    let obj = res.data as api
    if (obj.code == 200) {
      let item: viewBbsItem = obj.data
      item.time = formatNormalTime(obj.data.time)
      item.likes = getNumber(obj.data.likes)
      item.dislikes = getNumber(obj.data.dislikes)
      item.comments = getNumber(obj.data.comments)
      item.views = getNumber(obj.data.views)
      item.like = getNumber(obj.data.like)
      item.author.headurl = getHostUrl(obj.data.author.headurl)
      item.cover = getHostUrl(obj.data.cover)
      return item
    } else {
      return false
    }
  })
}

/**
 * 获取帖子中的回复
 * @param id 帖子id
 * @param page 页数
 * @param limit 条目数
 * @param sort 排序方式
 */
export async function getBbsReply(id: number, page: number, limit: number, sort: number) {
  return await api_post(`/bbs/reply_list/${id}`, { page, limit, sort }).then((res) => {
    let obj = res.data as api
    let list: any[] = []
    if (obj.code == 200) {
      obj.data.forEach((el: any) => {
        el.time = formatBbsTime(el.time)
        el.author.headurl = getHostUrl(el.author.headurl)
        if (el.children) {
          el.children = el.children.map((x: any) => {
            x.time = formatNormalTime(x.time, 'M-D HH:mm').replace(/ /, '<br/>')
            return x
          })
        }
        list.push(el)
      })
      //移除id相同的内容
      const uniqueArray = list.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
      return { list: uniqueArray, num: obj.sum?.total }
    }
    return false
  })
}

/**
 * 获取指定用户信息
 * @param id 用户id
 */
export async function getUserInfo(uid: string | number) {
  let res = await api_post('/user/info', { uid: uid })
  if (res && res.data.code == 200) {
    return res.data as { code: number; msg: string; data: getUserInfoType }
  } else {
    return false
  }
}

export async function setSignature(config: object) {
  return await api_post('/user/edit', config)
    .then((res) => {
      if (res.data.code == 200) {
        return true
      } else {
        return false
      }
    })
    .catch(() => {
      return false
    })
}

export async function getMyBbs(uid: number | string, config: object): Promise<false | any[]> {
  return await api_post(`/user/my_bbs_list/${uid}`, config)
    .then((res) => {
      if (res.data.code == 200) {
        return res.data.data as any[]
      } else {
        return false
      }
    })
    .catch(() => {
      return false
    })
}

export async function getCaptcha(): Promise<false | { y: string; imgUrl: string[] }> {
  return await api_get(`/captcha`)
    .then(async (res) => {
      if (res.data.code == 200) {
        let data = JSON.parse(decode(res.data.data))
        return data as any as { y: string; imgUrl: string[] }
      } else {
        return false
      }
    })
    .catch(() => {
      return false
    })
}
