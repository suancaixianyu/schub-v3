<template>
  <Navigation />
  <router-view />
</template>

<script lang="ts">
import { getInformation } from '@/api'
import Navigation from './navigation/Navigation.vue'
export default {
  name: 'Index',
  components: {
    Navigation,
  },
  mounted() {
    console.log('index', this.$route.path)

    getInformation()
    // if (this.$route.path == '/') this.$router.replace('')
  },
}
</script>

<style scoped></style>
