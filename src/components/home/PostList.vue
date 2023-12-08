<template>
  <div class="platelist">
    <Waterfall
      :breakpoints="{
        1800: { rowPerView: 3 },
        1200: { rowPerView: 3 },
        800: { rowPerView: 2 },
        500: { rowPerView: 2 },
      }"
      backgroundColor="var(--el-bg-color)"
      :list="list"
      style="width: 100%"
      v-infinite-scroll="next"
      :infinite-scroll-disabled="disabled"
      :infinite-scroll-distance="80"
    >
      <template #item="{ item }">
        <el-card class="item" shadow="hover" animated :body-style="{ padding: '0px' }">
          <!-- 骨架屏 -->
          <el-skeleton animated v-if="item.id == 0" style="width: 260px; transition: all 0.3s ease">
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 100px; margin: 16px" />
              <div style="padding: 14px">
                <el-skeleton-item variant="p" style="width: 50%" />
                <div style="display: flex; align-items: center; justify-items: space-between">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </div>
              <div style="padding: 14px">
                <div style="display: flex; align-items: center; justify-items: space-between">
                  <el-skeleton-item variant="text" style="width: 10%" />
                  <el-skeleton-item variant="text" style="margin-left: 16px" />
                </div>
              </div>
            </template>
            <!-- 骨架屏END -->
          </el-skeleton>
          <LazyImg @click.stop="opencard(item.id)" :url="item.cover" v-if="item.id != 0 && item.cover" />
          <!-- 备选，效果较差 -->
          <!-- <el-image loading="lazy" class="image" v-if="item.cover" :src="item.cover" fit="cover" /> -->
          <!-- <img v-if="item.cover" :src="item.cover" alt="帖子封面" loading="lazy" class="image" /> -->
          <div style="padding: 14px" @click.stop="opencard(item.id)" v-if="item.id">
            <span>{{ item.title }}</span>
            <div class="bottom">
              <div class="time" @click.stop="openuser(item.uid)">
                <img class="avatar" v-if="item.author.headurl" :src="item.author.headurl" :alt="item.author.nickname" :title="item.author.nickname" />
                <span class="bj" v-else :title="item.author.nickname">
                  <span>{{ item.author.nickname.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] }}</span>
                </span>
                <span>{{ item.time }}</span>
              </div>

              <div class="buttons">
                <el-button class="iconfont">&#xe605; {{ item.views }}</el-button>
                <el-button class="iconfont" :disabled="disabledLike" @click.stop="dolike(item.id)" :class="item.like == '0' ? '' : 'activation'"
                  >&#xe602; {{ item.likes }}</el-button
                >
                <el-button class="iconfont">&#xe86f; {{ item.comments }}</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </template>
    </Waterfall>
    <el-divider>{{ text }}</el-divider>
  </div>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<script lang="ts">
import { getPostList, getBbsList, likepost } from '@/api'

import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'

import _ from 'lodash'
import { ElMessage } from 'element-plus'
export default {
  name: 'PostList',
  data() {
    return {
      /** 帖子列表 */
      list: [] as any[],
      /** 是否禁用加载 */
      disabled: true,
      /** 当前页面 */
      pageid: 1,
      /** 每次加载的条数 */
      limit: 30,
      /** 页面总数 */
      pagenum: 1,
      /** 页面是否到底 */
      isbottom: false,
      /** 是否正在加载更多 */
      load: false,
      /** 当前加载的缓存页 */
      loadpage: 0,
      /** 底部提示词 */
      text: '',
      /** 是否禁用点赞 */
      disabledLike: false,
      /** 加载中图片与加载失败图片 */
      // loadProps: {
      //   loading: '',
      //   error: '',
      // },
    }
  },
  components: {
    LazyImg,
    Waterfall,
  },

  async mounted() {
    for (let i = 0; i < 12; i++) {
      this.list.push({
        id: 0,
      })
    }
    this.loading()
  },

  methods: {
    /** 点赞 */
    async dolike(id: number) {
      let item = this.list.find((el) => el.id == id)
      this.disabledLike = true
      if (item && (await likepost(item.id))) {
        this.list.forEach((el, index) => {
          if (el.id == item.id) {
            this.list[index].like = 1
            this.list[index].likes = Number(this.list[index].likes) + 1
            return
          }
        })

        ElMessage({
          type: 'success',
          message: '点赞成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '点赞失败',
        })
      }
      this.disabledLike = false
    },
    /** 访问用户主页 */
    openuser(uid: number) {
      this.$router.push(`/user/${uid}`)
    },
    /**
     * 加载页面
     */
    async loading() {
      let cateid = this.$route.params.cateid as string
      if (cateid) {
        this.loadpage = 0
        this.pageid = 1
        this.load = true
        this.text = '加载中~'
        let data: any = await getBbsList(`${cateid}`, { page: this.pageid, limit: this.limit })
        if (data.list) {
          this.list = data.list
          this.pagenum = data.num
          setTimeout(() => {
            this.disabled = false
            this.load = false
            this.text = '下滑加载更多~'
          }, 1500)
        }
        // }
      }
    },
    /**
     * 加载更多
     */
    async next() {
      if (this.load) return
      if (this.pageid >= this.pagenum) {
        // console.log('加载到底')
        this.isbottom = true
        this.text = '到底了~'
      } else {
        this.load = true
        this.pageid += 1
        this.loadpage += 1
        this.text = '加载中~'
        let cateid = this.$route.params.cateid as string

        // 缓存中存在此页
        let postList = getPostList(cateid)
        if (this.loadpage < this.pagenum && postList && postList.list[this.loadpage]) {
          // console.log('加载缓存页')
          // 拷贝this.list
          this.list.push(...postList.list[this.loadpage])
        } else {
          // console.log('加载更多新页')
          let data: any = await getBbsList(cateid, { page: this.pageid, limit: this.limit })
          if (data.list) {
            this.list.push(...data.list)
          }
        }
        this.load = false
        this.text = '下滑加载更多~'
      }
    },

    deepCopy(data: any) {
      return _.cloneDeep(data)
    },
    opencard(id: number) {
      let cateid = this.$route.params.cateid as string
      if (cateid && id) this.$router.push(`${cateid}/${id}`)
    },
  },

  watch: {
    $route: async function () {
      this.disabled = true
      this.loading()
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
