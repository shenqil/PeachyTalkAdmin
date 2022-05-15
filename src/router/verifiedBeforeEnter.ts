import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/store';
/**
 * 用于校验进入通过验证的页面
 * */
export default function (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  if (!authStore.isLogin) {
    const redirect = to.fullPath ? encodeURIComponent(to.fullPath) : '';
    next({
      name: 'login',
      query: {
        redirect,
      },
    });
    return;
  }

  authStore.refreshBySingleMode();
  next();
}
