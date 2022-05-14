import { defineStore } from 'pinia';
import type { IToken, ILoginParams } from '@/server/interface';
import { refreshToken, loginOut, login } from '@/server/login';
import { saveTokenToCache, getCacheToken } from '@/utils/cache';
import router from '@/router';

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
    refreshBySingleMode() {
      TokenManage.getInstance()
        .updateRefreshTask(this.token.expiresAt, async () => {
          try {
            this.token = await refreshToken();
            this.refreshBySingleMode();
          } catch (error) {
            console.error(error);
            this.signOut();
          }
        });
    },
    async signOut() {
      await loginOut();
      // 清空token
      this.token.expiresAt = 0;
      saveTokenToCache(undefined);

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

class TokenManage {
  private refreshHandle: any;

  private advanceTime = 10 * 1000; // 提前10秒刷新token

  private static instance:TokenManage;

  // 单例模式，保证token刷新任务只有一个
  static getInstance():TokenManage {
    if (!TokenManage.instance) {
      TokenManage.instance = new TokenManage();
    }

    return TokenManage.instance;
  }

  /**
     * 更新token刷新任务
     * */
  updateRefreshTask(expiresAt:number, refreshTask:Function) {
    // 任务存在，不用创建任务
    if (this.refreshHandle) {
      return;
    }

    // Token已失效,不用更新
    const remainingMillisecond = expiresAt * 1000 - Date.now();
    if (remainingMillisecond <= 0) {
      return;
    }

    // 注册一个提前10秒更新token的任务
    const taskTime = remainingMillisecond > this.advanceTime
      ? remainingMillisecond - this.advanceTime : 0;
    console.log(`${taskTime / 1000}s后刷新Token`);

    this.refreshHandle = setTimeout(() => {
      this.refreshHandle = undefined;
      refreshTask();
      console.log('token已刷新');
    }, taskTime);
  }
}
