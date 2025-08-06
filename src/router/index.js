import { createRouter, createWebHistory } from 'vue-router'

// Routes configuration
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PAGE__HOME--DEFAULT.vue'),
    meta: {
      title: 'Homepage',
      preload: true, // Preload critical routes
      transition: 'fade',
      keepAlive: true, // Cache component
      layout: '' // Different layout
    },
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | ***`
  next()
})

export function setupRouter(app) {
  app.use(router)
}
