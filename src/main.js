import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import '@/styles/global.css'
import { createApp } from 'vue'
import App from '/APP__ROOT--MAIN.vue'

const app = createApp(App)

setupRouter(app)
setupStore(app)

app.mount('#app')
