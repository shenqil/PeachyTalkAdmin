import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '@/store'
import {compose} from '@/utils/common'
import type {IToken} from '@/server/interface'
import {message} from 'ant-design-vue'

const instance = axios.create({
    timeout: 0,
    headers: {
        'X-Custom-Header': 'foobar',
        'ignore-error': false
    }
});

export enum contentType {
    from = 'application/x-www-form-urlencoded',
    json = 'application/json'
}

export enum headerKeys {
    ContentType = 'Content-Type',
    Authorization = 'Authorization'
}

export enum methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

/**
 * 获取访问令牌
 * */
 function getToken(): IToken {
    return (store.state as any).auth.token as IToken
}

/**
 * 退出登录
 * */
 function loginOut() {
    store.dispatch('auth/signOut')
}

/**
 * header增加token
 * */
 function addTokenToHeader(c: AxiosRequestConfig): AxiosRequestConfig {
    const token = getToken()
    const skipUrlList = [
        '/api/v1/pub/login',
        '/api/v1/pub/login/captcha',
        '/api/v1/pub/login/captchaid',
        '/api/v1/pub/login/exit'
    ]

    // 跳过token添加，以及鉴权
    if (!skipUrlList.includes(c.url || '')) {
        // 判断token过期直接退出
        if (!store.getters['auth/isLogin']) {
            loginOut()
            throw new Error('The token has expired')
        }
        if(c.headers){
            // 合法则添加token
            c.headers[headerKeys.Authorization] = `${token.tokenType} ${token.accessToken}`
        }
    }


    return c
}

/**
 * 统一消息提示
 * */
 function unifiedErrorPrompt(response: AxiosResponse) {
    const { message: msg } = response?.data?.error || {}

    if (typeof msg === 'string') {
        message.error(msg)
    }
}

/**
 * 设置令牌
 * */
 function setToken(response: AxiosResponse) {
    const urlList = [
        '/api/v1/pub/login',
        '/api​/v1​/pub​/refresh-token'
    ]
    if (urlList.includes(response.config.url || '')) {
        // 存在则保存token
        if (response.data && response.data.accessToken) {
            store.commit('auth/setToken', response.data)
        }
    }
}

/**
 * 请求拦截器
 * */
 instance.interceptors.request.use(
    function (config) {
        return compose(addTokenToHeader)(config)
    },
    function (error) {
        return Promise.reject(error)
    }
)

/**
 * 响应拦截器
 * */
 instance.interceptors.response.use(
    function (response) {

        setToken(response)

        return response.data
    },
    function (error) {
        unifiedErrorPrompt(error.response)

        return Promise.reject(error)
    }
)

export default instance