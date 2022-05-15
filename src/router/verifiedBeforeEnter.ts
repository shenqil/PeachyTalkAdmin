import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore, useUserStore } from '@/store';
/**
 * 用于校验进入通过验证的页面
 * */
export default async function (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  const useStore = useUserStore();

  function gotoLogin() {
    const redirect = to.fullPath ? encodeURIComponent(to.fullPath) : '';
    next({
      name: 'login',
      query: {
        redirect,
      },
    });
  }

  // 对于需要校验的页面，未登录直接重定向到登录页面
  if (!authStore.isLogin) {
    console.log('未登录,或者登录信息已过期，需要重新登录');
    gotoLogin();
    return;
  }

  authStore.refreshBySingleMode();
  try {
    await useStore.init();
  } catch (error) {
    console.error(error);
    gotoLogin();
    return;
  }

  next();
}
