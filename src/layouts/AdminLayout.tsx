import {
  defineComponent, ref, watch, computed,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MenuItem, { IMenuTreeProps } from './components/MenuItem';
import ToUser from './components/ToUser';
import getMenuData from './menuData';
import logo from '@/assets/logo.png';

export default defineComponent({
  setup() {
    const router = useRouter();
    const collapsed = ref(false);
    const { selectedKeys, menuList } = useMenuSelected();

    function gotoHome() {
      router.push({
        path: '/',
      });
    }

    return () => (
      <a-layout >
        {/* 侧边栏 */}
        <a-layout-sider class="h-100vh" v-model:collapsed={collapsed.value} collapsible>
          {/* logo */}
          <div class="cursor-pointer p-2" onClick={gotoHome}>
            <img src={logo} alt="" class="rounded-full overflow-hidden"/>
          </div>

          {/* 菜单 */}
          <a-menu v-model:selectedKeys={selectedKeys.value} theme="dark" mode="inline">
            {
              menuList.map(
                (menuItem) => <MenuItem key={menuItem.id} item={menuItem}/>,
              )
            }
          </a-menu>
        </a-layout-sider>

        {/* 主体 */}
        <a-layout>
          {/* 头部 */}
          <a-layout-header class="bg-white p-0">
            <div class="flex flex-row justify-between">
              {/* 左边 */}
              <div></div>
              {/* 右边 */}
              <div class="px-10">
                <ToUser/>
              </div>
            </div>
          </a-layout-header>

          {/* 内容区 */}
          <a-layout-content >
            <div>
              <router-view />
            </div>
          </a-layout-content>

          {/* 页脚 */}
          <a-layout-footer style="text-align: center">
            shen ©2022 Created by IM-Admin UED
          </a-layout-footer>
        </a-layout>
      </a-layout>
    );
  },
});

/**
 * 处理页面选中的菜单
 * */
function useMenuSelected() {
  const menuList = getMenuData();
  const selectedKeys = ref<string[]>(['dashboard']);
  const router = useRouter();
  const route = useRoute();

  /**
   * 深度优先查找第一个匹配的菜单
   * */
  function findMenuItem(list:IMenuTreeProps[], key:string, value:string)
    :IMenuTreeProps | undefined {
    for (const iterator of list) {
      if ((iterator as any)[key] === value) {
        return iterator;
      } if (iterator.children && iterator.children.length) {
        const item = findMenuItem(iterator.children, key, value);
        if (item) {
          return item;
        }
      }
    }

    return undefined;
  }

  watch(route, () => {
    const menuItem = findMenuItem(menuList, 'routePath', route.path);
    if (menuItem?.id) {
      selectedKeys.value = [menuItem.id];
    }
  });

  const currentRoutePath = computed(() => {
    const selectedValue = selectedKeys.value[0] || '';

    const menuItem = findMenuItem(menuList, 'id', selectedValue);
    if (!menuItem) {
      return '/';
    }

    return menuItem.routePath;
  });

  watch(currentRoutePath, (preV, curV) => {
    if (preV !== curV) {
      router.push({
        path: currentRoutePath.value,
      });
    }
  });

  return {
    menuList,
    selectedKeys,
  };
}
