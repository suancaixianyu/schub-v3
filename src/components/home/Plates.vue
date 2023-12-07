<template>
  <div class="homeplates">
    <div class="hidden-xs-only">
      <ul class="cate" v-if="showSkeleton">
        <li class="item selected" v-for="(_x, i) in 6" :key="i">
          <div class="skeleton"></div>
        </li>
      </ul>

      <ul class="cate" v-else>
        <router-link :to="`/cate/${x.id}`" @click="isActive(x.id)" v-for="x in list" :key="x.id">
          <li class="item selected" :class="active == x.id ? 'activation' : ''">
            <span class="title iconfont" v-html="`${cateicon[x.id]} ${x.name}`"> </span>
          </li>
        </router-link>
      </ul>
    </div>

    <div class="listbody">
      <div class="hr hidden-xs-only"></div>
      <div class="window">
        <PostList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { pools, config } from '@/api'
import { cateList } from '@/types'
import PostList from './PostList.vue'

export default {
  name: 'Plates',
  data() {
    return {
      list: [] as cateList[],
      active: 0,
      cateicon: config.cateicon,
      showSkeleton: true,
    }
  },
  components: {
    PostList,
  },
  mounted() {
    // console.log('Plates path', this.$route.path)
    this.isActive(`${this.$route.params.cateid}`)
    let a = setInterval(() => {
      if (pools.catelist.length) {
        this.list = pools.catelist
        this.showSkeleton = false
        clearTimeout(a)
      }
    }, 500)
  },
  watch: {
    $route: async function (to) {
      this.isActive(`${to.params.cateid}`)
    },
  },
  methods: {
    isActive(id: string | number = 0) {
      this.active = Number(id)
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
