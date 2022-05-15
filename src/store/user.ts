import { defineStore } from 'pinia';
import type { ILoginUserInfo } from '@/server/interface';
import { getCurUserInfo } from '@/server/login';

export interface IUserState {
  userInfo: ILoginUserInfo | undefined // 登录人信息
}

export const useUserStore = defineStore('user', {
  state: ():IUserState => ({
    userInfo: undefined,
  }),
  getters: {

  },
  actions: {
    async init() {
      if (!this.userInfo) {
        await this.fetchCurUserInfo();
      }
    },
    async fetchCurUserInfo() {
      const userInfo = await getCurUserInfo();
      this.userInfo = userInfo;
    },
  },
});
