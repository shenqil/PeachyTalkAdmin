import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia';
import App from './App';
import router from './router';
import 'ant-design-vue/dist/antd.css';
import '@/assets/font/iconfont.css';
import 'virtual:windi.css';

createApp(App)
  .use(Antd)
  .use(router)
  .use(createPinia())
  .mount('#app');
