import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/stage-profile-maker/',
  optimizeDeps: {
    include: ['vuetify', '@vuetify/labs'],
    exclude: ['vuetify/labs'],
  }
})
