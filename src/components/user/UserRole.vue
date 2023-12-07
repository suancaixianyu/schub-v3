<template>
  <el-tag v-for="x in role_list" :key="x" size="small" :color="x.color" :type="x.type" :effect="x.effect">{{ x.name }}</el-tag>
</template>

<script lang="ts">
import { decodeRoleList } from '@/api'
import { watch } from 'vue'
import { roleItem } from '@/types'

export default {
  name: 'UserRole',
  props: ['role'],
  data() {
    return {
      role_list: <roleItem[]>[],
    }
  },

  async created() {
    this.role_list = (await decodeRoleList(this.role)) as any as roleItem[]
    watch(
      () => this.role,
      () => {
        this.role_list = decodeRoleList(this.role) as any as roleItem[]
      }
    )
  },
}
</script>

<style scoped></style>
