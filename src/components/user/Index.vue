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
      <el-image class="headimage" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
      <span class="headimage bj" v-else :title="userInfo.data.nickname" @click="setHead">
        <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
      </span>

      <div class="nackname">
        <el-text tag="b" style="font-size: 1.2rem">
          {{ userInfo.data.nickname }}
        </el-text>
        <UserRole :role="userInfo.data.role" />
      </div>

      <div class="headbtn hidden-xs-only">
        <el-button round class="iconfont">&#xe8cf;编辑个人信息</el-button>
      </div>
    </div>

    <div class="hr hidden-xs-only"></div>

    <div>信息</div>
  </div>
</template>

<script lang="ts">
import { config } from '@/api'
export default {
  name: 'UserIndex',
  data() {
    return {
      userInfo: config.userInfo,
    }
  },
  methods: {
    setHead() {
      console.log('设置头像')
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
