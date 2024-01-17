import {
  defineComponent, computed, ref, toRefs, watch,
} from 'vue';
import type { PropType, Ref } from 'vue';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { IUser } from '@/server/interface';
import userServer from '@/server/user';
import fileServer from '@/server/file';
import { md5Hash } from '@/utils/security';

export default defineComponent({
  name: 'UserDetailsModal',
  props: {
    modelValue: {
      type: Object as PropType<IUser>,
      required: true,
    },
  },
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    submit(_isEdit: boolean) {
      return true;
    },
  },
  setup(props, ctx) {
    const { modelValue: modelRef } = toRefs(props);

    const formRef = ref();
    const visible = ref(false);
    const confirmLoading = ref(false);
    const isEdit = computed<boolean>(() => !!props.modelValue?.id);

    const rules = useValidator(isEdit);

    const { upAvatar, beforeUpload, avatarUpload } = useAvatar();

    watch(modelRef, () => {
      visible.value = true;
    });

    const title = computed<string>(() => (isEdit.value ? '更新用户信息' : '创建用户信息'));
    const showAvatar = computed(
      () => upAvatar.value
        || `${modelRef.value.avatar ? `/avatar/${modelRef.value.avatar}` : ''}`,
    );

    const onSubmit = () => {
      formRef.value.validate().then(async () => {
        confirmLoading.value = true;

        const submitFn = isEdit.value ? userServer.update : userServer.create;

        try {
          await submitFn({
            ...modelRef.value,
            password: modelRef.value.password ? md5Hash(modelRef.value.password) : '',
          });
          await avatarUpload(modelRef.value.userName);

          visible.value = false;
          message.success(isEdit.value ? '用户信息更新成功' : '用户创建成功');
          ctx.emit('submit', isEdit.value);
        } catch (error) {
          // message.error(`${error}`);
          console.log(error);
        }
        confirmLoading.value = false;
      });
    };

    const onCancel = () => {
      formRef.value.resetFields();
    };

    return () => (
      <a-modal
        v-model:visible={visible.value}
        confirm-loading={confirmLoading.value}
        title={title.value}
        okText="确认"
        cancelText="取消"
        onOk={onSubmit}
        onCancel={onCancel}
      >
        <a-form
          ref={formRef}
          model={modelRef.value}
          rules={rules.value}
          label-col={{ span: 8 }}
          wrapper-col={{ span: 16 }}
          autocomplete="off"
        >
          <a-form-item label="账号" name="userName">
            <a-input
              v-model:value={modelRef.value.userName}
              disabled={isEdit.value}
              bordered={!isEdit.value}
            />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input v-model:value={modelRef.value.password} type="password" />
          </a-form-item>

          <a-form-item label="真实名称" name="realName">
            <a-input v-model:value={modelRef.value.realName} />
          </a-form-item>

          <a-form-item label="头像" name="avatar">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              show-upload-list={false}
              beforeUpload={beforeUpload}
            >
              {showAvatar.value ? (
                <img src={showAvatar.value} alt="avatar" />
              ) : (
                <div>
                  <PlusOutlined></PlusOutlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              )}
            </a-upload>
          </a-form-item>

          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value={modelRef.value.gender}>
              <a-radio value={1}>男</a-radio>
              <a-radio value={2}>女</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="出生日期" name="dateOfBirth">
            <a-date-picker
              v-model:value={modelRef.value.dateOfBirth}
              value-format="YYYY-MM-DD"
            />
          </a-form-item>

          <a-form-item label="手机号" name="phone">
            <a-input v-model:value={modelRef.value.phone} />
          </a-form-item>

          <a-form-item label="邮箱" name="email">
            <a-input v-model:value={modelRef.value.email} />
          </a-form-item>
        </a-form>
      </a-modal>
    );
  },
});

/**
 * 校验器规则
 * */
function useValidator(isEdit: Ref<boolean>) {
  return computed(() => ({
    userName: [
      {
        required: !isEdit.value,
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入账号');
          }
          if (!/^[a-zA-Z][a-zA-Z0-9]{4,19}$/.test(value)) {
            return Promise.reject('需要字母开头，并且包含5-19个字母或数字');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],

    realName: [
      {
        required: true,
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入真实姓名');
          }
          if (!/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test(value)) {
            return Promise.reject('输入正确的中英文名称');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],

    password: [
      {
        required: !isEdit.value,
        validator: (rule: RuleObject, value: string) => {
          if (isEdit.value) {
            if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
              return Promise.reject('需要8-16个包含大小写字母和数字的字符');
            }
            return Promise.resolve();
          }

          if (!value) {
            return Promise.reject('请输入密码');
          }
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
            return Promise.reject('需要8-16个包含大小写字母和数字的字符');
          }

          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],

    phone: [
      {
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.resolve();
          }
          if (!/^1[3-9]\d{9}$/.test(value)) {
            return Promise.reject('请输入正确手机号');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],

    email: [
      {
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.resolve();
          }
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return Promise.reject('请输入正确邮箱');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
  }));
}

/**
 * 头像处理
 * */
function useAvatar() {
  const upAvatar = ref<string | undefined>(undefined);
  const avatarFile = ref<File | undefined>(undefined);

  function fileToBase64(file: File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString() || '';
        resolve(base64);
      };

      // 加载失败时
      reader.onerror = () => {
        reject(new Error('Failed to load file'));
      };
    });
  }

  const beforeUpload = async (file: File) => {
    try {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return false;
      }

      avatarFile.value = file;
      upAvatar.value = await fileToBase64(file);
    } catch (error) {
      message.error('图片处理失败');
    }

    return false;
  };

  const avatarUpload = async (userName: string) => {
    if (avatarFile.value) {
      const { id } = await fileServer.upload({
        name: userName,
        size: avatarFile.value.size,
        avatar: true,
        file: avatarFile.value,
      });

      return id;
    }

    return '';
  };

  return {
    upAvatar,
    beforeUpload,
    avatarUpload,
  };
}
