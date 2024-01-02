<template>
  <div class="usersetup" v-if="userInfo.state.isLogin">
    <div class="group">
      <!-- 设置签名 -->
      <div class="item" @click="window.signature = true">
        <span>{{ $t('setup.0') }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <!-- 设置昵称 -->
      <div class="item" @click="window.nickname = true">
        <span>{{ $t('setup.1') }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <!-- 设置头像 -->
      <div class="item" @click="window.avatar = true">
        <span>{{ $t('setup.2') }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>

    <div class="group">
      <!-- 设置是否显示签名 -->
      <div class="item" @click="setShowSignature">
        <span>自己视角下显示签名</span>
        <span>{{ setup.showSignature ? '显示' : '关闭' }}</span>
      </div>
      <div class="item">
        <div
          style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between"
          @click="setTheme"
        >
          <span class="iconfont" v-if="setup.currentSkin" style="margin-left: 4px"> &#xe614; {{ $t('usercard.2') }}</span>
          <span class="iconfont" v-else style="margin-left: 4px"> &#xe615; {{ $t('usercard.2') }}</span>
          <el-switch
            style="margin-left: auto"
            @click="setTheme"
            v-model="setup.currentSkin"
            inline-prompt
            :active-text="$t('usercard.13')"
            :inactive-text="$t('usercard.14')"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="usersetup" v-else>
    <h2>请先登录</h2>
  </div>

  <!-- 表单 -->

  <!-- 设置头像 -->
  <el-dialog v-model="window.avatar" title="设置头像" :fullscreen="true">
    <el-form :model="userconfig">
      <el-form-item>
        <el-input v-model="QQ" placeholder="输入QQ号或图片链接"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="window.avatar = false">返回</el-button>
        <el-button type="primary" @click="set('avatar')"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 设置签名 -->
  <el-dialog v-model="window.signature" title="设置签名" :fullscreen="true">
    <el-form :model="userconfig">
      <el-form-item>
        <MdEditor
          :language="lang"
          editorId="editorSignature"
          :preview="true"
          v-model="userconfig.signature"
          @onUploadImg="UploadImage"
          style="height: 85vh"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="window.signature = false">返回</el-button>
        <el-button type="primary" @click="set('signature')"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 设置昵称 -->
  <el-dialog v-model="window.nickname" title="设置昵称" :fullscreen="true">
    <el-form :rules="rules" :model="userconfig" class="form" label-position="top" status-icon>
      <el-form-item label="设置昵称" prop="nickname">
        <el-input v-model="userconfig.nickname" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="window.nickname = false">返回</el-button>
        <el-button type="primary" @click="set('nickname')"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { UploadImage, getInformation, localSet, setSignature } from '@/api'
import { themes } from '@style/themes.ts'
import { userInfo, setup } from '@/config'
import i18n from '@/i18n.ts'
import { ElMessage } from 'element-plus'
import { MdEditor } from 'md-editor-v3'

export default {
  name: 'Setup',
  data() {
    const $t = i18n.t
    return {
      $t,
      userInfo,
      setup,
      lang: setup.lang,
      themeObj: {} as any, // 主题
      QQ: '',
      /** 设置窗口 */
      window: {
        signature: false,
        nickname: false,
        avatar: false,
      } as { [key: string]: boolean },
      userconfig: {
        signature: userInfo.data.signature,
        nickname: userInfo.data.nickname,
        avatar: userInfo.data.headurl,
      },

      rules: {
        nickname: [
          {
            required: true,
            message: $t('login.prompt.6'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: $t('login.prompt.7'),
            trigger: 'blur',
          },
          {
            validator: (_rule: any, value: any, callback: any) => {
              if (value && !/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
                callback(new Error($t('login.prompt.8')))
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  components: {
    MdEditor,
  },
  methods: {
    setTheme() {
      setup.currentSkin = !setup.currentSkin
      this.switchTheme()
    },
    setShowSignature() {
      setup.showSignature = !setup.showSignature
      localSet('setup', setup)
    },
    async set(type: string) {
      if (!this.QQ && type == 'avatar')
        return ElMessage({
          type: 'error',
          message: '内容不能为空',
        })
      this.userconfig.avatar = /\d+/.test(this.QQ) ? `http://q.qlogo.cn/headimg_dl?dst_uin=${this.QQ}&spec=100` : this.QQ

      if (await setSignature(this.userconfig)) {
        ElMessage({
          type: 'success',
          message: '设置成功',
        })
        getInformation()
      } else {
        ElMessage({
          type: 'error',
          message: '设置失败',
        })
      }
      this.window[type] = false
    },
    async UploadImage(file: any) {
      let url = await UploadImage(file, false)
      this.userconfig.signature += url
    },
    /** 根据不同的主题类型，获取不同主题数据 */
    switchTheme() {
      // themes 对象包含 defaultTheme、darkTheme 两个属性即默认主题与深色主题
      let currentSkinName = setup.currentSkin ? 'darkTheme' : 'defaultTheme'
      this.themeObj = themes[currentSkinName]
      // 设置css 变量
      Object.keys(this.themeObj).map((item) => {
        document.documentElement.style.setProperty(item, this.themeObj[item])
      })
      localSet('setup', setup)
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
