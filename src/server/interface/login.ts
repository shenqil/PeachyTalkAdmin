/**
 * 登录参数
 * */
export interface ILoginParams {
  captchaCode: string,
  captchaId: string,
  password: string,
  userName: string
}

/**
 * token结构
 * */
export interface IToken {
  accessToken: string,
  expiresAt: number,
  tokenType: string
}

/**
 * 登录用户信息
 * */
export interface ILoginUserInfo {
  realName: string,
  userId: string,
  userName: string
}

/**
 * 更新个人密码请求参数
 * */
export interface IUpdatePassParams {
  newPassword: string,
  oldPassword: string
}

/**
 * 更新密码结果
 * */
export interface IUpdatePassResult {
  status: string
}
