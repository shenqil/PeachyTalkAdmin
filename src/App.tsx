import { defineComponent } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <a-config-provider locale={zhCN}>
        <div>
          <router-view />
        </div>
      </a-config-provider>
    );
  },
});
