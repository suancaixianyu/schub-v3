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
        class="preview"
        :theme="setup.currentSkin ? 'dark' : 'light'"
        editorId="editor-user"
        :modelValue="uid ? user.signature : userInfo.data.signature"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { config, getHostUrl, getUserInfo, setAvatar } from '@/api'
import { MdPreview } from 'md-editor-v3'
import i18n from '@/i18n.ts'
export default {
  name: 'UserIndex',
  data() {
    const $t = i18n.t
    return {
      $t,
      src: '../../../public/imgs/{2FB1489E-9572-4803-9114-850E04589091}.png',
      setup: config.setup,
      userInfo: config.userInfo,
      user: {
        background: '',
        headurl: '',
        nickname: '',
        signature: '',
        role: '',
      },
      isLogin: config.userInfo.state.isLogin,
      uploadServer: `${config.config.server}/Upload/Upload`,
      uid: '',
    }
  },
  components: {
    MdPreview,
  },
  mounted() {
    if (this.$route.params.uid) {
      this.getuserinfo(this.$route.params.uid as string)
    }
  },
  methods: {
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
