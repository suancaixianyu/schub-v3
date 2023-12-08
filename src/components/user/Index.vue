<template>
  <div class="headimg">
    <el-image
      fit="cover"
      draggable="false"
      loading="lazy"
      alt="主页背景图"
      :src="userInfo.data.background ? userInfo.data.background : '../../../public/imgs/b432c72abcc127e589f71160dcec7b12.jpg'"
    ></el-image>
  </div>

  <div class="userindex">
    <div class="head">
      <el-upload
        :action="uploadServer"
        v-model="userInfo.data.headurl"
        :with-credentials="true"
        :show-file-list="false"
        :on-success="uploadCover"
        accept="image/png, image/jpeg"
      >
        <el-image class="headimage" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
        <span class="headimage bj" v-else :title="userInfo.data.nickname" @click="setHead">
          <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
        </span>
      </el-upload>

      <div class="nackname">
        <el-text tag="b" style="font-size: 1.2rem">
          {{ userInfo.data.nickname }}
        </el-text>
        <UserRole :role="userInfo.data.role" />
      </div>

      <div class="headbtn hidden-xs-only" v-if="userInfo.state.isLogin && !uid">
        <el-button round class="iconfont">&#xe8cf;编辑个人信息</el-button>
      </div>
    </div>

    <div class="hr hidden-xs-only"></div>

    <div>
      <MdPreview class="preview" :theme="setup.currentSkin ? 'dark' : 'light'" editorId="editor-user" :modelValue="userInfo.data.signature" />
    </div>
  </div>
</template>

<script lang="ts">
import { config, getHostUrl, setAvatar } from '@/api'
import { MdPreview } from 'md-editor-v3'
export default {
  name: 'UserIndex',
  data() {
    return {
      setup: config.setup,
      userInfo: config.userInfo,
      uploadServer: `${config.config.server}/Upload/Upload`,
      uid: '',
    }
  },
  components: {
    MdPreview,
  },
  mounted() {
    let uid = this.$route.params.uid as string
    this.uid = uid
  },
  methods: {
    uploadCover(e: any) {
      this.userInfo.data.headurl = getHostUrl(e.data.src)
      setAvatar(e)
    },
    setHead() {
      console.log('设置头像')
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
