/**
 * 启用状态枚举
 * */
export enum EStatus {
    enabled = 1,
    disabled = 2
}

/**
 * 显示状态枚举
 * */
export enum EShowStatus {
    show = 1,
    hidden = 2
}

/**
 * 分页器结构
 * */
export interface IPagination {
    current: number,
    pageSize: number,
    total: number
}

/**
 * 分页数据
 * */
export interface IPageData<T> {
    list: Array<T>
    pagination: IPagination
}

/**
 * 分页请求参数
 * */
export interface IPageParams {
    current: number
    pageSize: number
}

/**
 * 返回错误信息接口
 * */
export interface IError {
    code: number,
    message: string
}

/**
 * 响应唯一标识
 * */
export interface IIdResult {
    id: string
}

/**
 * 响应状态
 * */
export interface IStatusResult {
    status: string
}