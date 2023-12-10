import axios from 'axios'
import * as Cfg from '../config'
import { ElMessage } from 'element-plus'
import { formatBbsTime, formatNormalTime, getHostUrl, getNumber } from './tools'
import { api, cateList, viewBbsItem } from '../types'

//开启cookie携带
axios.defaults.withCredentials = true
/**
 * get方法请求api
 * @param {string} path 请求路径
 */
export function api_get(path: string) {
  return axios.get(`${Cfg.config.server}${path}`)
}

/**
 * 刷新页面重新获取用户信息
 */
export function getInformation(callback: any = null) {
  let { userInfo } = Cfg
  //刷新页面重新获取用户信息
  api_get('/user/role_list')
    .then((response) => {
      let roleRes = response.data
      if (roleRes.code == 200) {
        userInfo.role_list = roleRes.data //全局角色列表缓存
      }
    })
    .catch((err: any) => {
      console.log(err)
      ElMessage({
        type: 'error',
        message: '社区连接失败，请刷新重试',
      })
      // window.open(`${Cfg.config.captchaserver}?url=${Cfg.config.view}`, '_self')
    })
  api_get('/mod/global_data_list').then((response) => {
    let roleRes = response.data
    if (roleRes.code == 200) {
      userInfo.global_mod_data_list = roleRes.data //全局标签数据缓存
    }
    api_get('/user/info').then((response2) => {
      let res = response2.data
      if (res.code == 200) {
        res.data.headurl = getHostUrl(res.data.headurl)
        userInfo.data = res.data
        userInfo.state.isLogin = true
        userInfo.data.isAdmin = /1/g.test(res.data.role)
        userInfo.state.unreadMessage = res.unreadMessage
      }
      if (callback != null) callback()
    })
  })
}

/**
 * 获取板块列表
 */
export async function getcate() {
  return await api_get('/cate/list')
    .then((response) => {
      let res: api = response.data
      if (res.code == 200) {
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

export async function likepost(id: number) {
  return await api_get(`/bbs/good/${id}`)
    .then((res: any) => {
      if (res.data.code == 200) {
        return true
      }
      return false
    })
    .catch(() => {
      return false
    })
}

/**
 * 获取帖子详情
 * @param id 帖子id
 */
export async function getBbs(id: number) {
  return await api_get(`/bbs/item/${id}`).then((res) => {
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
  return await api_get(`/bbs/reply_list/${id}?page=${page}&limit=${limit}&sort=${sort}`).then((res) => {
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
 * 回复点赞
 * @param id 回复id
 */
export async function reply_good(id: number | string) {
  let res = await api_get(`/bbs/reply_good/${id}`)
  let data = res.data as api
  if (data.code == 200) {
    ElMessage({
      type: 'success',
      message: data.msg,
    })
    return true
  }
  return false
}
