<template>
  <div class="usersetup">
    <div class="group">
      <div class="item">
        <span>{{ $t('setup[0]') }}</span>
        <span>></span>
      </div>
      <div class="item">
        <span>{{ $t('setup[1]') }}</span>
        <span>></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import i18n from '@/i18n.ts'
export default {
  name: 'Setup',
  data() {
    return {
      $t: i18n.t,
    }
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
