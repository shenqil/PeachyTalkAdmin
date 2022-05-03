import axios from '@/axios'
import {
    IPageData,
    ILoginParams,
    IToken,
    ILoginUserInfo,
    IUpdatePassParams,
    IUpdatePassResult
} from './interface/index'

/**
 * 获取验证码信息
 * */
export async function getCaptchaid(): Promise<string> {
    const res = await axios.get('/api/v1/pub/login/captchaid') as any

    if (!res || typeof res.captchaId !== 'string') {
        throw new Error("数据返回错误");
    }

    return res.captchaId as string
}

/**
 * 响应图形验证码
 * */
export function getCaptcha(id: string): string {
    return `/api/v1/pub/login/captcha?id=${id}`
}



/**
 * 用户登录
 * */
export async function login(params: ILoginParams): Promise<IToken> {
    return await axios.post('/api/v1/pub/login', params) as IToken
}

/**
 * 刷新令牌
 * */
export function refreshToken(): Promise<IToken> {
    return axios.post('/api​/v1​/pub​/refresh-token')
}

/**
 * 用户登出
 * */
export function loginOut() {
    return axios.post('/api/v1/pub/login/exit')
}

/**
 * 获取用户信息
 * */
export async function getUserInfo(): Promise<ILoginUserInfo> {
    return await axios.get('/api/v1/pub/current/user') as ILoginUserInfo
}

/**
 * 更新密码
 * */
export async function updatePassword(params: IUpdatePassParams): Promise<IUpdatePassResult> {
    return await axios.put('/api/v1/pub/current/password', params) as IUpdatePassResult
}