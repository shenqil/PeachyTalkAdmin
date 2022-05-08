import { IPageParams } from './base';

export interface IUserRole {
  userId: string,
  roleId: string
}

export interface IUser {
  id: string,
  avatar:string,
  userName: string,
  realName: string,
  password?: string,
  phone?: string,
  email?: string,
  status: number,
  creator?: string,
  createdAt?: string,
  userRoles?: Array<IUserRole>
}

export interface IUserQueryParam extends IPageParams {
  queryValue?: string
  userName?: string
  status?: number
}
