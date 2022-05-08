import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import 'virtual:windi.css';

createApp(App)
  .use(Antd)
  .use(router)
  .use(store)
  .mount('#app');
