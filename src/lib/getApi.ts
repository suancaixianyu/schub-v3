import axios from 'axios'
import * as Cfg from '../config'
import { ElMessage } from 'element-plus'
import { getHostUrl } from './tools'
import { api } from '../types'
import { api_post } from './postApi'

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
export async function getInformation() {
  let { userInfo } = Cfg

  // 刷新页面重新获取用户信息
  return await api_post('/user/role_list')
    .then((response) => {
      let res = response.data
      if (res.code == 200) {
        userInfo.role_list = res.data // 全局角色列表缓存
        return api_post('/user/info').then((response2) => {
          let res = response2.data
          if (res.code == 200) {
            res.data.headurl = getHostUrl(res.data.headurl)
            userInfo.data = res.data
            userInfo.state.isLogin = true
            userInfo.data.isAdmin = res.data.role.map((x: any) => x == 1)
            userInfo.state.unreadMessage = res.unreadMessage
            return true
          }
          return true
        })
      } else {
        return false
      }
    })
    .catch((err: any) => {
      console.log(err)
      ElMessage({
        type: 'error',
        message: '社区连接失败，请刷新重试',
      })
      return false
    })
}

export function getRoleRes() {
  let { userInfo } = Cfg
  api_post('/mod/global_data_list', {}).then((response) => {
    let roleRes = response.data
    if (roleRes.code == 200) {
      userInfo.global_mod_data_list = roleRes.data //全局标签数据缓存
    }
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
