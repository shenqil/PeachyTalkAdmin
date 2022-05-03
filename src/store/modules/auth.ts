import { Module, ActionTree, MutationTree, GetterTree } from 'vuex'
import type {IToken} from '@/server/interface'
import { refreshToken, loginOut, getUserInfo } from '@/server/login'
import {saveTokenToCache,getCacheToken} from '@/utils/cache'
import router from '@/router'

class TokenManage {

    refreshTimeout: any;
    advanceTime = 10 * 1000 // 提前10秒刷新token

    /**
     * 更新token刷新任务
     * */
    updateRefreshTask(expiresAt: number) {

        const lastAccessTime = expiresAt * 1000 - this.advanceTime - Date.now()
        if (lastAccessTime <= 0) {
            return
        }

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout)
        }

        console.log(lastAccessTime / 60 * 60 * 1000, '时间后刷新token')
        this.refreshTimeout = setTimeout(() => {
            this.refreshTask()
            console.log("token已刷新")
        }, lastAccessTime)
    }

    refreshTask() {
        refreshToken()
    }
}

const tokenManage = new TokenManage()

export interface IAuthState {
    token: IToken,
}
const state: IAuthState = {
    token: getCacheToken()
}

const mutations: MutationTree<IAuthState> = {
    setToken(state, token: IToken) {
        state.token = {
            ...state.token,
            ...token
        }
        saveTokenToCache(state.token)
        tokenManage.updateRefreshTask(token.expiresAt)
    },
}

const actions: ActionTree<IAuthState, any> = {
    signOut({commit}){
        loginOut()
        // 清空token
        commit('setToken', {
            accessToken: '',
            tokenType: '',
            expiresAt: 0
        })

        // 重定向到登录页 
        if (window.location.pathname !== '/login') {
            router.replace({
                path: '/login',
                query: {
                    redirect: encodeURIComponent(window.location.href),
                }
            });
        }
    }
}

const getters: GetterTree<IAuthState, any> = {
    isLogin(state){
        if (!state.token || typeof state.token.expiresAt !== 'number' || state.token.expiresAt * 1000 - Date.now() <= 0) {
            return false
        }

        return true
    }
}

const stroe: Module<IAuthState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default stroe