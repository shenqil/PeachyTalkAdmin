import axios from '@/axios/index';
import {
  IUser,
  IUserQueryParam,
  IPageData,
  IIdResult,
  IStatusResult,
} from './interface/index';

const CURRENT_URL = '/api/v1/management/users';

/**
 * 查询数据
 * */
async function query(params: IUserQueryParam): Promise<IPageData<IUser>> {
  return axios.get(CURRENT_URL, { params });
}

/**
 * 创建数据
 * */
async function create(item: IUser): Promise<IIdResult> {
  return axios.post(CURRENT_URL, item);
}

/**
 * 查找指定数据数据
 * */
async function get(id: string): Promise<IUser> {
  return axios.get(`${CURRENT_URL}/${id}`);
}

/**
 * 更新数据
 * */
async function update(item: IUser): Promise<IIdResult> {
  return axios.put(`${CURRENT_URL}/${item.id}`, item);
}

/**
 * 删除数据
 * */
async function remove(id: string): Promise<IStatusResult> {
  return axios.delete(`${CURRENT_URL}/${id}`);
}

/**
 * 失能
 * */
async function disable(id: string): Promise<IStatusResult> {
  return axios.patch(`${CURRENT_URL}/${id}/disable`);
}

/**
 * 使能
 * */
async function enable(id: string): Promise<IStatusResult> {
  return axios.patch(`${CURRENT_URL}/${id}/enable`);
}

export default {
  query,
  create,
  get,
  update,
  remove,
  disable,
  enable,
};
