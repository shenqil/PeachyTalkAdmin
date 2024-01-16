import axios, { ContentType, HeaderKeys } from '@/axios/index';
import { IIdResult, IUploadFile } from './interface';

const CURRENT_URL = '/api/v1/file';

/**
 * 上传文件
 * */
async function upload({
  name, size, avatar, file,
}: IUploadFile) : Promise<IIdResult> {
  const formData = new FormData();
  if (name) {
    formData.append('name', name);
  }
  if (size) {
    formData.append('size', `${file.size}`);
  }
  formData.append('avatar', `${!!avatar}`);
  formData.append('file', file);

  return axios.post(CURRENT_URL, formData, {
    headers: {
      [HeaderKeys.contentType]: ContentType.from,
    },
  });
}

export default {
  upload,
};
