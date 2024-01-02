import * as Cfg from '../config'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import moment from 'moment'
const { toClipboard } = useClipboard()
//@ts-ignore
import { Buffer } from 'buffer'

//@ts-ignore
import cryptojs from 'crypto-js/md5'

/**
 * 将资源相对路径转为绝对路径
 * @param e 资源相对路径
 */
export function getHostUrl(e: string): string {
  if (e == null || e == '') return ''
  if (e.indexOf('http://') != -1 || e.indexOf('https://') != -1) return e
  if (e.indexOf('./') == -1) {
    return Cfg.config.server + e
  } else {
    return Cfg.config.server + e.slice(1)
  }
}

/**
 * 将文本复制到剪切板
 * @param txt 需要复制的文本
 */
export async function copyText(txt: string) {
  try {
    await toClipboard(txt)
    ElMessage({
      type: 'success',
      message: '复制成功！',
    })
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: `复制失败：${error.message}`,
    })
  }
}

/**
 * 格式化时间戳 -> xx时间前
 * @param {number} time 时间戳
 */
export function formatBbsTime(time: number) {
  let time2: Date = new Date()
  time = time * 1000
  let msg: string
  const diffMilliseconds = Math.abs(time2.getTime() - time)
  const diffSeconds = Math.floor(diffMilliseconds / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)
  if (diffYears >= 1) {
    msg = `${diffYears}年前`
  } else if (diffMonths >= 1) {
    msg = `${diffMonths}个月前`
  } else if (diffDays >= 1) {
    msg = `${diffDays}天前`
  } else if (diffHours % 24 >= 1) {
    msg = `${diffHours % 24}小时前`
  } else if (diffMinutes % 60 >= 1) {
    msg = `${diffMinutes % 60}分钟前`
  } else {
    msg = `${diffSeconds % 60}秒前`
  }
  return msg
}

/**
 * 资源类型
 * @param {number} type 类型id
 */
export async function getScTypeName(type: number) {
  switch (type) {
    case 1:
      return '世界'
    case 2:
      return '方块材质'
    case 3:
      return '人物皮肤'
    case 4:
      return '家具包'
    default:
      return '未知'
  }
}

/**
 * 获取文件后缀
 * @param {string} name 文件名
 */
export async function getFileName(name: string) {
  let i = name.lastIndexOf('.')
  return name.substring(0, i)
}

/**
 * 格式化文件大小
 * @param size 文件大小
 */
export async function getFileSize(size: number) {
  const nuits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let a = (Math.log2(size) / 10) | 0
  return (size / 1024 ** a).toFixed(1) + nuits[a | 0]
}

/**
 * 格式化数字
 * @param number 数量
 */
export function getNumber(number: number): string {
  if (number / 1000 >= 1) {
    return `${(number / 1000).toFixed(1)}k`
  }
  if (number / 10000 >= 1) {
    return `${(number / 1000).toFixed(1)}w`
  }
  return `${number}`
}

/**
 * 格式化标签id，mod状态
 * @param number id
 */
export async function getStat(number: number): Promise<{ name: string; type: string }> {
  let obj = {
    name: '',
    type: '',
  }
  switch (number) {
    case 0:
      obj = {
        name: '已锁定',
        type: 'danger',
      }
      break
    case 1:
      obj = {
        name: '正常',
        type: 'primary',
      }
      break
    case 2:
      obj = {
        name: '申请发布',
        type: 'info',
      }
      break
    case 3:
      obj = {
        name: '申请发布未通过',
        type: 'warning',
      }
      break
    case 4:
      obj = {
        name: '未发布',
        type: 'info',
      }
      break
  }
  return obj
}

/**
 * 格式化时间到指定格式
 * @param time 时间戳：秒
 * @param format 格式，默认：YYYY-MM-DD HH:mm:ss
 */
export function formatNormalTime(time: number, format = 'YYYY-MM-DD HH:mm:ss') {
  let date = moment(time * 1000)
  return date.format(format)
}

/**
 * 储存信息到本地
 */
export async function localSet(key: string, obj: object | string) {
  if (typeof obj === 'string') {
    localStorage.setItem(key, obj)
  } else {
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

/**
 * 读取本地信息
 */
export async function localGet(key: string, defaultValue: object) {
  let v
  if ((v = localStorage.getItem(key)) == null) return defaultValue
  else return JSON.parse(v)
}

/**
 * 解码角色列表
 * @param roleStr
 */
export async function decodeRoleList(roleStr: [] | null) {
  let {
    userInfo: { role_list },
  } = Cfg
  let result = [] as any
  console.log('roleStr', roleStr, 'role_list', role_list)

  if (roleStr == null) return result

  for (const x of roleStr) {
    let f = role_list.find((xx: any) => {
      return xx.id == x
    })
    if (f != null) {
      result.push(await copyObject(f))
    }
  }

  return result
}
/**
 * 解码flag_list
 * @param flag_list_str
 */
export async function decodeFlagList(flag_list_str: string) {
  if (flag_list_str == null) return []
  let {
    userInfo: {
      global_mod_data_list: { flag_list },
    },
  } = Cfg
  let arr = flag_list_str.split(',')
  let result = [] as any
  if (arr.length > 0) {
    arr.forEach((x: any) => {
      let f = flag_list.find((xx: any) => {
        return xx.id == x
      })
      if (f != null) {
        result.push(copyObject(f))
      }
    })
  }
  return result
}

/**
 * 解码link_list
 * @param linkStr
 */
export async function decodeLinkList(linkStr: string) {
  let {
    userInfo: {
      global_mod_data_list: { link_type },
    },
  } = Cfg
  let result = [] as any
  if (linkStr == null) return result
  let arr = linkStr.split('|')
  arr.forEach((x: string) => {
    let arr2 = x.split(',')
    let f = link_type.find((xx: any) => {
      return xx.id == arr2[0]
    })
    if (f != null) {
      arr2[1] = /^(http|https):\/\//.test(arr2[1]) ? arr2[1] : 'http://' + arr2[1]
      result.push({ id: f.id, type: f.id, name: f.name, src: arr2[1] })
    }
  })
  return result
}
/**
 * 解码api_version_list
 * @param linkStr
 */
export async function decodeApiVersionList(linkStr: string) {
  let {
    userInfo: {
      global_mod_data_list: { api_version },
    },
  } = Cfg
  let result = [] as any
  if (linkStr == null) return result
  let arr = linkStr.split(',')
  arr.forEach((x: string) => {
    let f = api_version.find((xx: any) => {
      return xx.id == x
    })
    if (f != null) {
      result.push(copyObject(f))
    }
  })
  return result
}
/**
 * 解码game_version_list
 * @param linkStr
 */
export async function decodeGameVersionList(linkStr: string) {
  let {
    userInfo: {
      global_mod_data_list: { game_version },
    },
  } = Cfg
  let result = [] as any
  if (linkStr == null) return result
  let arr = linkStr.split(',')
  arr.forEach((x: string) => {
    let f = game_version.find((xx: any) => {
      return xx.id == x
    })
    if (f != null) {
      result.push(copyObject(f))
    }
  })
  return result
}
/**
 * 解码relation_list
 * @param relationList
 */
export async function decodeRelationList(relationList: any) {
  let {
    userInfo: {
      global_mod_data_list: { relate_type },
    },
  } = Cfg
  let result = [] as any
  relationList.forEach((linkStr: any) => {
    let item = { condition: linkStr.condition_value, list: [] as any }
    if (linkStr.relation != null) {
      let arr = linkStr.relation.split('|')
      arr.forEach((x: string) => {
        let arr2 = x.split(',')
        let f = relate_type.find((xx: any) => {
          return xx.id == arr2[0]
        })
        if (f != null) {
          item.list.push({
            type: f.id,
            type_name: f.name,
            package_name: arr2[1],
            package_id: arr2[2],
          })
        }
      })
    }
    result.push(item)
  })
  return result
}

/**
 * 复制对象数据
 * @param obj
 */
export async function copyObject(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 加密密码
 * @param {*} string 密码
 */
export function encode(string: string, key = 'schub'): string {
  return logic(string, 'E', key)
}

/**
 * 解密密码
 * @param {*} string 密码
 */
export function decode(string: string, key = 'schub'): string {
  return logic(string, 'D', key)
}

function md5(str: string) {
  return cryptojs(str).toString()
}

function logic(string: string, operation: string, key: string) {
  // const src = ['/', '+', '=']
  // const dist = ['_a', '_b', '_c']
  if (operation === 'D') {
    string = string.replace(/_a/g, '/').replace(/_b/g, '+').replace(/_c/g, '=')
  }
  key = md5(key)
  const key_length = key.length
  let k = md5(string + key)
  string = operation === 'D' ? Buffer.from(string, 'base64').toString('binary') : k.slice(0, 8) + string
  const string_length = string.length
  let rndkey = []
  let box = []
  let result = ''

  for (let i = 0; i <= 255; i++) {
    rndkey[i] = key.charCodeAt(i % key_length)
    box[i] = i
  }

  for (let j = 0, i = 0; i < 256; i++) {
    j = (j + box[i] + rndkey[i]) % 256
    ;[box[i], box[j]] = [box[j], box[i]]
  }

  for (let a = 0, j = 0, i = 0; i < string_length; i++) {
    a = (a + 1) % 256
    j = (j + box[a]) % 256
    ;[box[a], box[j]] = [box[j], box[a]]
    result += String.fromCharCode(string.charCodeAt(i) ^ box[(box[a] + box[j]) % 256])
  }

  if (operation === 'D') {
    let k = md5(result.slice(8) + key)
    if (result.slice(0, 8) === k.slice(0, 8)) {
      return result.slice(8)
    } else {
      return ''
    }
  } else {
    const rdata = Buffer.from(result, 'binary').toString('base64').replace(/=+$/, '')
    return rdata.replace(/\//g, '_a').replace(/\+/g, '_b').replace(/=/g, '_c')
  }
}
