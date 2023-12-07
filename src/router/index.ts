import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    component: () => import('@comps/Home.vue'),
  },
  {
    path: '/cate/:cateid',
    component: () => import('@comps/home/Plates.vue'),
    meta: { keepAlive: true },
    children: [
      {
        path: ':bbsid',
        component: () => import('@comps/home/Detail.vue'),
        meta: { title: '帖子详情-SC中文社区' },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@comps/user/Index.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title! as string) || 'SC中文社区'
  next()
})

export default router
