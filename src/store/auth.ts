import { defineStore } from 'pinia';
import type { IToken, ILoginParams } from '@/server/interface';
import { refreshToken, loginOut, login } from '@/server/login';
import { saveTokenToCache, getCacheToken } from '@/utils/cache';
import router from '@/router';

class TokenManage {
  refreshTimeout: any;

  advanceTime = 10 * 1000; // 提前10秒刷新token

  /**
     * 更新token刷新任务
     * */
  updateTask(expiresAt:number, refreshTask:Function) {
    // 先清空上一次任务
    this.clearTask();

    const remainingMillisecond = expiresAt * 1000 - this.advanceTime - Date.now();
    if (remainingMillisecond <= 0) {
      return;
    }

    console.log(`${remainingMillisecond / 1000}s后刷新Token`);
    this.refreshTimeout = setTimeout(() => {
      refreshTask();
      console.log('token已刷新');
    }, remainingMillisecond);
  }

  clearTask() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }
}

const tokenManage = new TokenManage();

export interface IAuthState {
  token: IToken,
}

export const useAuthStore = defineStore('auth', {
  state: ():IAuthState => ({
    token: getCacheToken(),
  }),
  getters: {
    isLogin: (state) => {
      if (state.token.expiresAt * 1000 - Date.now() <= 0) {
        return false;
      }
      return true;
    },
  },
  actions: {
    async loginIn(params:ILoginParams) {
      // 请求接口并且保存token
      this.token = await login(params);
      saveTokenToCache(this.token);
      tokenManage.updateTask(this.token.expiresAt, this.refresh);

      // 存在重定向，跳转到重定向
      const { redirect } = router.currentRoute.value.query;
      if (typeof redirect === 'string') {
        window.location.href = decodeURIComponent(redirect);
      } else {
        router.push({
          name: 'dashboard',
        });
      }
    },
    async refresh() {
      this.token = await refreshToken();
    },
    async signOut() {
      await loginOut();
      // 清空token
      this.token.expiresAt = 0;
      saveTokenToCache(undefined);
      tokenManage.clearTask();

      // 重定向到登录页
      if (window.location.pathname !== '/login') {
        router.replace({
          path: '/login',
          query: {
            redirect: encodeURIComponent(window.location.href),
          },
        });
      }
    },
  },
});
