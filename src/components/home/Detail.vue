<template>
  <div class="back" @click="back"></div>
  <div class="detail">
    <div class="box">
      <div class="body">
        <div class="detailWindow">
          <div class="head">
            <!-- 骨架屏 -->
            <el-skeleton style="width: 240px" v-if="showskeleton">
              <template #template>
                <div style="padding: 14px 0">
                  <div style="display: flex; align-items: center">
                    <el-skeleton-item variant="text" style="width: 28px; height: 28px" />
                    <el-skeleton-item variant="text" style="width: 30%" />
                  </div>
                </div>
              </template>
            </el-skeleton>
            <!-- 骨架屏END -->
            <div class="time" v-else>
              <img
                class="avatar"
                @click.stop="openuser(item.uid)"
                v-if="item.author.headurl"
                :src="item.author.headurl"
                :alt="item.author.nickname"
                :title="item.author.nickname"
              />
              <span class="avatar bj" v-else :title="item.author.nickname">
                <span>{{ item.author.nickname.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] }}</span>
              </span>
              <div class="name">
                <el-text>{{ item.author.nickname }}</el-text>
                <UserRole :role="item.author.role" />
                <br />
                <el-text>{{ item.time }}</el-text>
              </div>
            </div>
          </div>
          <template v-if="showskeleton">
            <el-skeleton :rows="5" animated />
          </template>
          <div class="content" v-else>
            <el-text class="title">{{ item.title }}</el-text>
            <MdPreview class="preview" :theme="setup.currentSkin ? 'dark' : 'light'" :editorId="`editor-${item.id}`" :modelValue="item.summary" />
          </div>
        </div>

        <div class="detailWindow right">
          <div class="msglist">
            <div class="top">
              <el-text>评论：{{ num }}</el-text>
              <div>
                <el-button link>最新</el-button>
                <el-divider direction="vertical" />
                <el-button link>最早</el-button>
              </div>
            </div>
            <!-- 骨架屏 -->
            <el-skeleton style="width: 400px" animated v-if="showmsgskeleton">
              <template #template>
                <div style="padding: 14px 0" v-for="i in 5" :key="i">
                  <div style="display: flex; align-items: center">
                    <el-skeleton-item variant="text" style="width: 28px; height: 28px" />
                    <el-skeleton-item variant="text" style="width: 30%" />
                  </div>
                  <div style="display: flex; align-items: center">
                    <div style="width: 30px"></div>
                    <el-skeleton :rows="1" />
                  </div>
                </div>
              </template>
            </el-skeleton>
            <!-- 骨架屏END -->

            <div style="padding: 14px 0" v-for="item in replylist" :key="item.id">
              <div style="display: flex; align-items: center">
                <div class="time">
                  <img
                    class="avatar"
                    @click.stop="openuser(item.uid)"
                    v-if="item.author.headurl"
                    :src="item.author.headurl"
                    :alt="item.author.nickname"
                    :title="item.author.nickname"
                  />
                  <span class="avatar bj" v-else :title="item.author.nickname">
                    <span>{{ item.author.nickname.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] }}</span>
                  </span>
                  <div class="msg">
                    <div style="margin-bottom: 8px; display: flex; align-items: center">
                      <el-text style="margin: 0 4px; font-size: 16px">{{ item.author.nickname }}</el-text>
                      <UserRole :role="item.author.role" />
                      <el-text style="margin: 0 1rem">{{ item.time }}</el-text>
                    </div>
                    <div class="reply">
                      <MdPreview
                        class="preview"
                        :class="item.children.length ? 'msgbottom' : ''"
                        :theme="setup.currentSkin ? 'dark' : 'light'"
                        :editorId="`editor-reply-${item.id}`"
                        :modelValue="item.content"
                      />

                      <div style="padding: 4px" v-if="item.children.length">
                        <div
                          class="item"
                          v-for="x in item.children"
                          :key="x.id"
                          v-on:mouseover="showtime[x.id] = true"
                          v-on:mouseout="showtime[x.id] = false"
                        >
                          <el-text
                            v-if="showtime[x.id]"
                            style="position: relative; right: 3.5rem; top: 4px; display: flex; height: 0"
                            v-html="x.time"
                          ></el-text>
                          <el-text class="nickname" type="primary" size="large" @click="replycom(item.id, x.author.nickname, x.id)">
                            {{ x.author.nickname }}
                          </el-text>
                          <el-text size="large">{{ x.to_author ? ` 回复 ` : '' }}</el-text>
                          <el-text size="large" class="nickname" type="primary">{{ x.to_author?.nickname }}</el-text>
                          <el-text size="large">: {{ x.content }}</el-text>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex">
                      <div class="buttons">
                        <el-button
                          class="iconfont"
                          :disabled="disabledLike"
                          @click.stop="doreplylike(item.id)"
                          :class="item.like == 0 ? '' : 'activation'"
                          link
                        >
                          &#xe602; {{ item.likes }}
                        </el-button>
                        <el-button class="iconfont" link @click="replycom(item.id, item.author.nickname)">&#xe86f; 回复</el-button>
                        <el-button class="iconfont" link @click="delreply(item.id)" v-if="userInfo.data.isAdmin">删除</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <el-text>{{ msg }}</el-text>
          </div>
          <div class="bottom">
            <el-input v-model="message" autosize type="textarea" :placeholder="placeholder" v-on:keyup.delete="del" @dblclick="openMdEditor" />
            <el-button type="primary" @click="reply" :loading="loadingbutton">发送</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="backbtn">
      <el-button class="btns" type="danger" :icon="CloseBold" circle @click="back" />
      <el-button class="btns" type="success" :icon="Share" circle @click="copyurl" />
      <el-button class="btns" type="warning" :icon="Delete" circle @click="delpost" />
    </div>
  </div>

  <el-dialog v-model="showMdEditor" title="全屏输入" align-center :fullscreen="true">
    <MdEditor editorId="previewOne" :preview="true" v-model="message" @onUploadImg="UploadImage" style="height: 85vh" />
  </el-dialog>
</template>

<script lang="ts">
import { CloseBold, Delete, Share } from '@element-plus/icons-vue'
import { getBbs, config, getBbsReply, replyComment, reply_good, del_reply, UploadImage, copyText, del_bbs } from '@/api'
import { replyOne, viewBbsItem } from '@/types'
import { ElMessage } from 'element-plus'
import UserRole from '@comps/user/UserRole.vue'
import { MdPreview, MdEditor } from 'md-editor-v3'

export default {
  name: 'Detail',
  data() {
    return {
      CloseBold,
      Delete,
      Share,
      item: {} as viewBbsItem,
      replylist: [] as replyOne[],
      setup: config.setup,
      userInfo: config.userInfo,
      showskeleton: true,
      showmsgskeleton: true,
      message: '',
      loadingbutton: false,
      sort: 0, //回复排序，0最新1最早
      page: 1,
      limit: 20,
      num: 0,
      msg: '',
      disabledLike: false,
      bid: 0, // 帖子id
      reply_id: 0, // 回复id
      to_reply_id: 0, // 二级回复id
      placeholder: '发表评论', // 回复框显示的文本
      showMdEditor: false,
      showtime: {} as { [key: string]: boolean }, // 显示二级回复时间
    }
  },
  components: {
    UserRole,
    MdPreview,
    MdEditor,
  },
  async mounted() {
    let id = this.$route.params.bbsid as string
    this.bid = Number(id)
    if (id) {
      this.refresh_reply_list(id)
    }
  },
  methods: {
    /** 删除帖子 */
    async delpost() {
      if (await del_bbs(this.item.id)) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        this.$router.replace(`/cate/${this.$route.params.cateid}`)
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    },
    /** 复制链接 */
    copyurl() {
      copyText(`【SC中文社区】${this.item.title}：${window.location.href}`)
    },
    /** 删除评论 */
    async delreply(id: number) {
      if (await del_reply(id)) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        this.refresh_reply_list(this.bid)
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    },
    /** 全屏输入 */
    openMdEditor() {
      this.showMdEditor = true
    },
    async UploadImage(file: any) {
      let url = await UploadImage(file, false)
      this.message += url
    },
    /** 取消回复 */
    del() {
      if (this.message.length <= 0) {
        this.reply_id = 0
        this.to_reply_id = 0
        this.placeholder = `发表评论`
      }
    },
    /** 设置回复id */
    replycom(id: number, name: string, to_reply_id = 0) {
      this.reply_id = id
      this.to_reply_id = to_reply_id
      this.placeholder = `回复${name}:`
    },

    /** 点赞 */
    async doreplylike(id: number) {
      if (await reply_good(id)) {
        ElMessage({
          type: 'success',
          message: '点赞成功',
        })
        this.refresh_reply_list(this.bid)
      }
    },
    /** 回复 */
    async reply() {
      this.loadingbutton = true

      let body = {
        content: this.message,
      } as { [key: string]: any }

      if (this.reply_id) {
        body.reply_id = this.reply_id
        if (this.to_reply_id) {
          body.to_reply_id = this.to_reply_id
        }
      } else {
        body.bid = this.bid
      }

      if (await replyComment('/bbs/reply', body)) {
        this.message = ''
        ElMessage({
          type: 'success',
          message: '回复成功',
        })
        this.refresh_reply_list(this.bid)
      }
      this.reply_id = 0
      this.to_reply_id = 0
      this.loadingbutton = false
    },
    /** 刷新回复 */
    async refresh_reply_list(id: string | number) {
      id = Number(id)
      let obj = await getBbs(id)
      if (obj) {
        this.item = obj
        this.showskeleton = false
      } else {
        ElMessage({
          type: 'error',
          message: '获取详情失败',
        })
      }
      let { page, limit, sort } = this
      let { list, num } = (await getBbsReply(id, page, limit, sort)) as { list: replyOne[]; num: number }
      if (list && list.length) {
        this.replylist = list
        this.num = num
        this.showmsgskeleton = false
      } else {
        this.msg = '什么也没有~'
        this.showmsgskeleton = false
      }
    },
    /** 打开用户卡片 */
    openuser(uid: number) {
      if (uid) this.$router.push(`/user/${uid}`)
    },
    /** 返回 */
    back() {
      this.$router.back()
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
.nickname {
  cursor: pointer;
}
</style>
