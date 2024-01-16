import {
  defineComponent,
  ref,
  reactive,
  computed,
  WritableComputedRef,
  Ref,
} from 'vue';
import type { RuleObject } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
import { updatePassword } from '@/server/login';
import { md5Hash } from '@/utils/security';

export default defineComponent({
  name: 'PasswordModal',
  props: {
    modelValue: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const visible = computed<boolean>({
      get: () => props.modelValue,
      set: (val) => {
        context.emit('update:modelValue', val);
      },
    });

    const {
      confirmLoading,
      onSubmit,
      onCancel,
      labelCol,
      wrapperCol,
      modelRef,
      formRef,
      rules,
    } = usePasswordForm(visible);

    return () => (
        <a-modal
          v-model:visible={visible.value}
          confirm-loading={confirmLoading.value}
          title="修改密码"
          okText="确认"
          cancelText="取消"
          onOk={onSubmit}
          onCancel={onCancel}
        >
          <a-form
            ref={formRef}
            model={modelRef}
            rules={rules}
            label-col={labelCol}
            wrapper-col={wrapperCol}
          >
            <a-form-item label="旧密码" name="oldPass">
              <a-input v-model:value={modelRef.oldPass} type="password" autocomplete="off" />
            </a-form-item>
            <a-form-item label="新密码" name="newPass">
              <a-input v-model:value={modelRef.newPass} type="password" autocomplete="off" />
            </a-form-item>
            <a-form-item
              label="确认新密码"
              name="checkNewPass"
              autocomplete="off"
            >
              <a-input
                v-model:value={modelRef.checkNewPass}
                type="password"
                autocomplete="off"
              />
            </a-form-item>
          </a-form>
        </a-modal>
    );
  },
});

function usePasswordForm(visible: WritableComputedRef<boolean>) {
  const formRef = ref();
  const confirmLoading = ref(false);
  const modelRef = reactive({
    oldPass: '',
    newPass: '',
    checkNewPass: '',
  });
  const rules = useValidator(formRef, modelRef);

  const onSubmit = () => {
    formRef.value.validate().then(async () => {
      confirmLoading.value = true;
      try {
        await updatePassword({
          oldPassword: md5Hash(modelRef.oldPass.trim()),
          newPassword: md5Hash(modelRef.newPass.trim()),
        });
        visible.value = false;
        message.success('密码修改成功');
      } catch (error) {
        console.error(error);
      }

      confirmLoading.value = false;
    });
  };

  const onCancel = () => {
    formRef.value.resetFields();
  };

  return {
    formRef,
    rules,
    confirmLoading,
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    onCancel,
    modelRef,
    onSubmit,
  };
}

/**
 * 校验器规则
 * */
function useValidator(formRef: Ref<any>, modelRef:any) {
  return {
    oldPass: [
      {
        required: true,
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入密码');
          } if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
            return Promise.reject('需要8-16个包含大小写字母和数字的字符');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    newPass: [
      {
        required: true,
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入密码');
          } if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
            return Promise.reject('需要8-16个包含大小写字母和数字的字符');
          }
          if (modelRef.checkNewPass) {
            formRef.value.validate('checkNewPass');
          }

          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    checkNewPass: [
      {
        required: true,
        validator: (rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入密码');
          } if (value !== modelRef.newPass) {
            return Promise.reject('两次密码输入不一致');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
  };
}
