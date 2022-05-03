import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      // enableObjectSlots: true
    }),
    WindiCSS(),
  ],
  resolve:{
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions:['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
