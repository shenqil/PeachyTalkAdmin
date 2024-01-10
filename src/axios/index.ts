import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { useAuthStore } from '@/store';
import { compose } from '@/utils/common';

const instance = axios.create({
  timeout: 0,
  headers: {
    'X-Custom-Header': 'foobar',
    'ignore-error': false,
  },
});

export enum ContentType {
  from = 'application/x-www-form-urlencoded',
  json = 'application/json',
}

export enum HeaderKeys {
  contentType = 'Content-Type',
  authorization = 'Authorization',
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * header增加token
 * */
function addTokenToHeader(c: AxiosRequestConfig): AxiosRequestConfig {
  const authStore = useAuthStore();
  const skipUrlList = [
    '/api/v1/login',
    '/api/v1/login/captcha',
    '/api/v1/login/captchaid',
    '/api/v1/login/exit',
  ];

  // 跳过token添加，以及鉴权
  if (!skipUrlList.includes(c.url || '')) {
    // 判断token过期直接退出
    if (!authStore.isLogin) {
      authStore.signOut();
      throw new Error('未登录，或者Token已过期');
    }
    if (c.headers) {
      // 合法则添加token
      c.headers[HeaderKeys.authorization] = `${authStore.token.tokenType} ${authStore.token.accessToken}`;
    }
  }

  return c;
}

/**
 * 统一消息提示
 * */
function unifiedErrorPrompt(response: AxiosResponse) {
  const { message: msg } = response?.data?.error || {};

  if (typeof msg === 'string') {
    message.error(msg);
  }
}

/**
 * 请求拦截器
 * */
instance.interceptors.request.use(
  (config) => compose(addTokenToHeader)(config),
  (error) => Promise.reject(error),
);

/**
 * 响应拦截器
 * */
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    unifiedErrorPrompt(error.response);

    return Promise.reject(error);
  },
);

export default instance;
