<template>
  <div class="usersetup" v-if="userInfo.state.isLogin">
    <div class="group">
      <div class="item" @click="window.signature = true">
        <span>{{ $t('setup.0') }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="item" @click="window.nickname = true">
        <span>{{ $t('setup.1') }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
  <div class="usersetup" v-else>
    <h2>请先登录</h2>
  </div>

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
import { UploadImage, setSignature } from '@/api'
import { userInfo, config } from '@/config'
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
      lang: config.lang,
      window: {
        signature: false,
        nickname: false,
      } as { [key: string]: boolean },
      userconfig: {
        signature: userInfo.data.signature,
        nickname: userInfo.data.nickname,
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
    async set(type: string) {
      if (await setSignature(this.userconfig)) {
        ElMessage({
          type: 'success',
          message: '设置成功',
        })
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
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
