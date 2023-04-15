import { createApp } from 'vue'
import '@/styles/global.css'
import App from './App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'

const app = createApp(App)

setupRouter(app)
setupStore(app)

app.mount('#app')
