<template>
  <Navigation />
  <router-view v-if="load" />
</template>

<script lang="ts">
import { getInformation, getRoleRes } from '@/api'
import Navigation from './navigation/Navigation.vue'
export default {
  name: 'Index',
  components: {
    Navigation,
  },
  data() {
    return {
      load: false,
    }
  },
  async mounted() {
    console.log('index', this.$route.path)
    // if (this.$route.path == '/') this.$router.replace('')
    if (await getInformation()) {
      this.load = true
    }
    getRoleRes()
  },
}
</script>

<style scoped></style>
