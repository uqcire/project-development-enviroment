import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { createApp } from 'vue'
import '@/styles/index.css'
import 'virtual:uno.css'
import App from '/App.vue'

const app = createApp(App)

setupRouter(app)
setupStore(app)

app.mount('#app')
