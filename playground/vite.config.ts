import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import un19n from '../src/_unplugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    un19n.vite({
      platform: 'baidu',
      from: 'en',
      to: ['de'],
      baidu: {
        appid: '',
        secret: ''
      }
    })
  ]
})
