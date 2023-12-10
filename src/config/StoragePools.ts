import { Pools, cateList, postList } from '../types'
import { toRefs, reactive } from 'vue'

/**
 * 列表存储池
 */
const pools: Pools = toRefs(
  reactive({
    catelist: [] as cateList[],
    postlist: {} as postList,
  })
)

/**
 * 写入存储池
 * @param key 需要写入的数据
 * @param data
 */
const writePools = (key: string, data: any) => {
  pools[key] = data
}
/**
 * 获取板块中帖子列表缓存
 * @param id 获取的板块id
 */
const getPostList = (cateid: string) => {
  if (pools.postlist[cateid]) {
    let copy: any = []
    pools.postlist[cateid].list.forEach((el: any) => {
      copy.push(el)
    })
    if (copy[0].length > 30) {
      let startIndex = copy[0].length - 30
      copy[0].splice(0, startIndex)
    }
    console.log('copy', copy)

    return { list: copy, num: pools.postlist[cateid].num }
  }
  return null
}

/**
 * 修改、设置板块缓存
 * @param id 获取的板块id
 */
const setPostList = (cateid: string, data: object) => {
  pools.postlist[cateid] = data
  return pools.postlist[cateid]
}
/**
 * 添加板块缓存
 * @param id 获取的板块id
 */
const pushPostList = (cateid: string, data: { list: any[]; num?: number }) => {
  console.log('data.list', data.list)

  let copy: any[] = []
  data.list.forEach((el: any) => {
    copy.push(el)
  })
  pools.postlist[cateid].list.push(copy)
  if (data.num) pools.postlist[cateid].num = data.num
}

export { writePools, getPostList, setPostList, pushPostList, pools }
