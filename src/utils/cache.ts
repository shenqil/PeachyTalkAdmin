import type { IToken } from '@/server/interface';

enum ECacheKey {
  TOKEN_KEY = 'ACCESS_TOKEN',
}

/**
 * 获取缓存里面访问令牌
 * */
export function getCacheToken(): IToken {
  const tokenStr = localStorage.getItem(ECacheKey.TOKEN_KEY);
  if (tokenStr) {
    return JSON.parse(tokenStr);
  }
  return {
    accessToken: '',
    tokenType: '',
    expiresAt: 0,
  };
}

/**
 * 保存令牌到缓存
 * */
export function saveTokenToCache(token: IToken | undefined) {
  if (token) {
    localStorage.setItem(ECacheKey.TOKEN_KEY, JSON.stringify(token));
  } else {
    localStorage.removeItem(ECacheKey.TOKEN_KEY);
  }
}
