import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      // enableObjectSlots: true
    }),
    WindiCSS(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve:{
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions:['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },
      '/files': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },
    }
  },
  css: {
    modules:{
      generateScopedName:"[path][name]__[local]--[hash:base64:5]"
    },
    preprocessorOptions: {
      scss: {
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        additionalData: '@import "./src/assets/scss/global.scss";',
      },
    },
  },
})
