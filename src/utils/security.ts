import md5 from 'md5';

/**
 * md5加密
 * */
export function md5Hash(value: string): string {
    return md5(value);
}
