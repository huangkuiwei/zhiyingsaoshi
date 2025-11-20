import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  css:{
    preprocessorOptions:{
      scss:{
        api:"modern"
      }
    }
  },
  transpileDependencies:['@dcloudio/uni-ui'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      // '/api/pdf/ppt': {
      //   target: 'http://129.204.177.129:8089',
      //   changeOrigin: true
      // },
      // '/api/filetransform/transform/ppt': {
      //   target: 'http://129.204.177.129:8089',
      //   changeOrigin: true
      // },
      '/api': {
        target: 'https://tools-api.xiaoohui.com',
        // target: 'http://localhost:5043',
        changeOrigin: true
      },
      '/process_image': {
        target: 'http://124.223.41.167:32768',
        changeOrigin: true
      }
    }
  }
})
