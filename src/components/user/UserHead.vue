<template>
  <img class="avatar" v-if="src" :src="src" :alt="alt" :title="alt" />
  <span class="awatar bj" v-else :title="alt">
    <span>{{ alt?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] }}</span>
  </span>
</template>
<script lang="ts">
import { getHostUrl } from '@/api'
export default {
  name: 'UserHead',
  props: ['src', 'alt'],
  methods: {
    getUrl(v: string) {
      return getHostUrl(v)
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
