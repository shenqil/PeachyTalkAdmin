/* eslint-disable prefer-promise-reject-errors */
import {
  defineComponent, ref, onMounted, reactive, computed,
} from 'vue';
import { UserOutlined, LockOutlined, ExportOutlined } from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import { getCaptchaid, getCaptcha } from '@/server/login';
import { ILoginParams } from '@/server/interface';
import { md5Hash } from '@/utils/security';
import logo from '@/assets/logo.png';
import styles from './index.module.scss';
import { useAuthStore } from '@/store';

export default defineComponent({
  name: 'login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const formRef = ref();
    const loading = ref(false);
    const formState = reactive({
      userName: '',
      password: '',
      captchaId: '',
      captchaCode: '',
    });

    const disabled = computed(
      () => !(formState.userName && formState.password && formState.captchaCode),
    );

    const captcha = useCaptcha(formState);
    const rules = useValidator();

    //  登录函数
    async function handleLogin() {
      loading.value = true;

      try {
        await formRef.value.validate();
      } catch (error) {
        console.error(error);
      }

      try {
        await authStore.loginIn({
          userName: formState.userName.trim(),
          password: md5Hash(formState.password.trim()),
          captchaId: formState.captchaId,
          captchaCode: formState.captchaCode,
        });

        if (typeof route.query.redirect === 'string') {
          window.location.href = decodeURIComponent(route.query.redirect);
        } else {
          router.push({
            name: 'dashboard',
          });
        }
      } catch (error) {
        captcha.refreshCaptcha();
      }

      loading.value = false;
    }

    return () => (
      <div class={`${styles.login} flex flex-col justify-start items-center h-100vh`}>
        <div class="flex flex-row mt-20 items-center">
          <img class="rounded-1/2 mx-3 w-150px" src={logo} alt="" />
          <h1 class="font-bold mx-3 mt-5 text-center text-white text-shadow-xl text-3xl">IM 后台管理系统</h1>
        </div>
        <div class="bg-white rounded-md shadow-md mt-15 p-30px w-420px">
          <a-form
            ref={formRef}
            layout="vertical"
            model={formState}
            rules={rules}
          >
            <a-form-item name="userName" label="用户名称">
              <a-input
                v-model:value={formState.userName}
                size="large"
                placeholder="请输入用户名称"
                prefix={<UserOutlined />}
              />
            </a-form-item>

            <a-form-item name="password" label="密码">
              <a-input-password
                v-model:value={formState.password}
                size="large"
                placeholder="请输入用户密码"
                prefix={<LockOutlined />}
              />
            </a-form-item>

            <a-form-item name="captchaCode" label="验证码">
              <div class="flex flex-row">
                <a-input
                  class="flex flex-1"
                  v-model:value={formState.captchaCode}
                  size="large"
                  placeholder=""
                />
                <a-tooltip title="点击刷新图片" color="#108ee9">
                  <img
                    class="cursor-pointer h-40px ml-10px"
                    src={captcha.captchaUrl?.value || ''}
                    onClick={() => captcha.refreshCaptcha()}
                  />
                </a-tooltip>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block={true}
                disabled={disabled.value}
                loading={loading.value}
                icon={<ExportOutlined />}
                class="my5px"
                onClick={handleLogin}
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    );
  },
});

/**
 * 验证码处理函数
 * */
function useCaptcha(formState:ILoginParams) {
  const captchaUrl = ref('');

  // 刷新二维码
  async function refreshCaptcha() {
    // 获取图片id
    formState.captchaId = await getCaptchaid();
    // 获取图片
    captchaUrl.value = getCaptcha(formState.captchaId);
  }

  onMounted(() => {
    refreshCaptcha();
  });

  return {
    captchaUrl,
    refreshCaptcha,
  };
}

/**
 * 校验器规则
 * */
function useValidator() {
  return {
    userName: {
      required: true,
      validator: (rule: any, value: string) => {
        if (!value) {
          return Promise.reject('请输入用户名');
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    },
    password: {
      required: true,
      validator(rule: any, value: string) {
        if (!value) {
          return Promise.reject('请输入密码');
        } if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
          return Promise.reject('需要8-16个包含大小写字母和数字的字符');
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    },
    captchaCode: {
      required: true,
      validator(rule: any, value: string) {
        if (!value) {
          return Promise.reject('请输入验证码');
        } if (!/^\d{4}$/.test(value)) {
          return Promise.reject('验证码不合法');
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    },
  };
}
