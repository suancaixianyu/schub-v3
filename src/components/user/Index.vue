<template>
  <div class="headimg">
    <el-image
      fit="cover"
      draggable="false"
      loading="lazy"
      :alt="$t('userindex.0')"
      v-if="uid ? user.background : userInfo.data.background"
      :src="uid ? user.background : userInfo.data.background"
    ></el-image>
    <el-image fit="cover" draggable="false" loading="lazy" :alt="$t('userindex.0')" v-else :src="src"></el-image>
  </div>

  <div class="userindex">
    <div class="head">
      <el-upload
        v-if="uid == ''"
        :action="uploadServer"
        v-model="userInfo.data.headurl"
        :with-credentials="true"
        :show-file-list="false"
        :on-success="uploadCover"
        accept="image/png, image/jpeg"
      >
        <el-image class="headimage" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
        <span class="headimage bj" v-else :title="userInfo.data.nickname">
          <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
        </span>
      </el-upload>
      <el-image v-else-if="user.headurl" class="headimage" :src="user.headurl" />
      <span class="headimage bj" v-else :title="user.nickname">
        <span>{{ user.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] }}</span>
      </span>

      <div class="nackname">
        <el-text tag="b" style="font-size: 1.2rem">
          {{ uid ? user.nickname : userInfo.data.nickname }}
        </el-text>
        <UserRole :role="uid ? user.role : userInfo.data.role" />
      </div>

      <div class="headbtn hidden-xs-only" v-if="uid == ''">
        <el-button round class="iconfont" @click="tosetup">&#xe8cf;{{ $t('userindex.1') }}</el-button>
      </div>
    </div>

    <div class="hr hidden-xs-only"></div>

    <div>
      <MdPreview
        v-if="setup.showSignature"
        class="preview"
        :theme="setup.currentSkin ? 'dark' : 'light'"
        editorId="editor-user"
        :modelValue="uid ? user.signature : userInfo.data.signature"
      />
    </div>

    <div class="view">
      <el-text class="title">我的帖子</el-text>
      <div style="padding-top: 1rem">
        <el-row class="key hidden-xs-only" :gutter="24">
          <el-col class="item" v-for="(x, index) in top" :key="index" :span="tagWidth[index]">
            <el-text>{{ x }}</el-text>
          </el-col>
        </el-row>
        <div class="content">
          <el-row class="key" v-for="(x, index) in content" :key="index">
            <el-col :span="tagWidth[0]" class="item hidden-xs-only">
              <el-text v-html="x.create_time"></el-text>
            </el-col>
            <el-col :span="tagWidth[1]" :xs="10" class="item hidden-xs-only">
              <el-text class="iconfont" v-html="`${cateicon[x.cate_id]} ${cateList[x.cate_id]}`"></el-text>
            </el-col>
            <el-col :span="tagWidth[2]" :xs="12" class="item">
              <el-text class="hidden-sm-and-up iconfont" v-html="cateicon[x.cate_id]"></el-text>
              <el-text> {{ x.title }} </el-text>
            </el-col>
            <el-col :span="tagWidth[3]" :xs="6" class="item">
              <el-text class="hidden-sm-and-up iconfont">&#xe605;</el-text>
              <el-text> {{ x.views }} </el-text>
            </el-col>
            <el-col :span="tagWidth[4]" :xs="4" class="item">
              <el-text class="hidden-sm-and-up iconfont">&#xe8bd;</el-text>
              <el-text> {{ x.comments }} </el-text>
            </el-col>
            <el-col :span="tagWidth[4]" :xs="2" class="item hidden-sm-and-up">
              <el-button class="iconfont" link>&#xe60b;</el-button>
            </el-col>
            <el-col :span="tagWidth[5]" class="item hidden-xs-only">
              <el-button link type="primary">查看</el-button>
              <el-button link type="primary">编辑</el-button>
              <el-button link type="primary">复制链接</el-button>
              <el-button link type="danger">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { config, formatNormalTime, getHostUrl, getMyBbs, getUserInfo, setAvatar } from '@/api'
import { MdPreview } from 'md-editor-v3'
import i18n from '@/i18n.ts'
import { cateicon, setup, userInfo } from '@/config'
import { viewBbsList } from '@/types'
import { ElMessage } from 'element-plus'
export default {
  name: 'UserIndex',
  data() {
    const $t = i18n.t
    return {
      $t,
      src: '../../../public/imgs/{2FB1489E-9572-4803-9114-850E04589091}.png',
      setup,
      userInfo,
      user: {
        background: '',
        headurl: '',
        nickname: '',
        signature: '',
        role: '',
      },
      isLogin: userInfo.state.isLogin,
      uploadServer: `${config.config.server}/Upload/Upload`,
      uid: '',
      top: ['创建时间', '板块', '标题', '浏览', '评论', '操作'],
      content: [] as viewBbsList[],
      limit: 15,
      cateicon,
      cateList: userInfo.cate_list,
      tagWidth: [4, 4, 6, 2, 2, 6],
    }
  },
  components: {
    MdPreview,
  },
  mounted() {
    if (this.$route.params.uid) {
      this.getuserinfo(this.$route.params.uid as string)
    } else {
      this.getBbs(1)
    }
  },
  methods: {
    async getBbs(page = 1) {
      let uid = this.uid == '' ? userInfo.data.id : this.uid
      let data = await getMyBbs(uid, { limit: this.limit, page })
      console.log('data', data)

      if (data) {
        this.content = data.map((x: any) => {
          x.create_time = formatNormalTime(x.create_time, 'YYYY-MM-DD<br/>HH:mm:ss')
          return x
        }) as any[]
      } else {
        ElMessage({
          type: 'error',
          message: '获取帖子列表失败',
        })
      }
    },
    /** 获取用户信息 */
    async getuserinfo(uid: string) {
      if (uid) {
        this.uid = uid
        // 清空页面
        this.user = {
          background: '',
          headurl: '',
          nickname: '加载中',
          signature: '加载中',
          role: '',
        }
        let user = await getUserInfo(uid)
        if (user) {
          this.user = {
            background: user.data.background,
            headurl: user.data.headurl,
            nickname: user.data.nickname,
            signature: user.data.signature ?? '这个人很懒，什么都没写',
            role: user.data.role,
          }
        }
      }
    },
    tosetup() {
      this.$router.push('/user/setup')
    },
    uploadCover(e: any) {
      this.userInfo.data.headurl = getHostUrl(e.data.src)
      setAvatar(e)
    },
  },
  watch: {
    $route: async function () {
      if (this.$route.params.uid) {
        this.getuserinfo(this.$route.params.uid as string)
      } else {
        this.uid = ''
      }
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
.preview {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}
</style>
