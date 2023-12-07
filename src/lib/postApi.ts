import axios from 'axios'
import * as Cfg from '../config'
import { ElMessage } from 'element-plus'
import { getHostUrl, formatBbsTime, getNumber, localSet } from './tools'
import { api, bbsItem, viewBbsItem } from '@/types'
import { api_get, getInformation } from './getApi'
import { userInfo } from '../config'

//开启cookie携带
axios.defaults.withCredentials = true

/**
 * post方法请求api
 * @param {string} path 请求路径
 * @param {object} data 请求体
 */
export function api_post(path: string, data: object) {
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
      let num = Math.ceil(res.data.sum.total / body.limit)

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
  api_get('/user/loginOut')
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
      api_get('/user/info').then((response2: any) => {
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

export async function del_reply(id: number) {
  let res = await api_post('/bbs/reply_del', { id })
  let data = res.data as api
  if (data.code == 200) {
    return true
  }
  return false
}

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
